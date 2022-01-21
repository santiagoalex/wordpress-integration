import { Container } from 'vtex.store-components'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import Settings from '../graphql/Settings.graphql'
import AllPosts from '../graphql/AllPosts.graphql'
import SearchPosts from '../graphql/SearchPosts.graphql'
import WordpressTeaser from './WordpressTeaser'
import WordpressCategorySelect from './WordpressCategorySelect'
import WordpressTagSelect from './WordpressTagSelect'
import PaginationComponent from './PaginationComponent'

const CSS_HANDLES = [
  'listTitle',
  'listContainer',
  'listFlex',
  'listFlexItem',
  'paginationComponent',
  'filtersContainer',
  'categorySelectContainer',
  'tagSelectContainer',
  'searchListTitle',
  'searchListContainer',
  'searchListFlex',
  'searchListFlexItem',
] as const

interface PostsProps {
  customDomain: string
  subcategoryUrls: boolean
  mediaSize: MediaSize
  postsPerPage: number
  customDomainSlug: string
  categoryVariable: any
}

const WordpressPosts: StorefrontFunctionComponent<PostsProps> = ({
  customDomain,
  subcategoryUrls,
  mediaSize,
  postsPerPage,
  customDomainSlug,
  categoryVariable,
}) => {
  const {
    route: { params },
    query,
  } = useRuntime() as any

  const initialPage = params.page ?? query?.page ?? '1'
  const [page, setPage] = useState(parseInt(initialPage, 10))
  const [perPage, setPerPage] = useState(postsPerPage)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [selectedTag, setSelectedTag] = useState('')
  const [tags, setTags] = useState([])
  const handles = useCssHandles(CSS_HANDLES)

  const variables = {
    wp_page: page,
    wp_per_page: 10,
    customDomain,
    terms: params.term || params.term_id,
  }
  const querySelected = variables.terms ? SearchPosts : AllPosts

  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, error, data, fetchMore } = useQuery(querySelected, {
    skip: !params,
    variables,
  })
  const containerRef = useRef<null | HTMLElement>(null)
  const initialPageLoad = useRef(true)
  const [loadingPage, setLoadingPage] = useState(true)
  const { terms: term } = variables
  const isSearchPosts = !!term
  const posts = isSearchPosts
    ? data?.wpPostsSearch?.posts
    : data?.wpPosts?.posts

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const pageParam = queryParams.get('page')
    pageParam && setPage(parseInt(pageParam, 10))
  }, [])

  useEffect(() => {
    setLoadingPage(true)

    if (initialPageLoad.current) {
      initialPageLoad.current = false
      return
    }
    if (containerRef.current) {
      window.scrollTo({
        top:
          containerRef.current.getBoundingClientRect().top +
          window.pageYOffset -
          100,
        behavior: 'smooth',
      })
    }
  }, [page])

  useEffect(() => {
    posts && setLoadingPage(false)
    posts &&
      setCategories(
        posts
          .reduce((acc: any, el: any) => [...acc, ...el.categories], [])
          .reduce((acc: any, current: any) => {
            const x = acc.find((item: any) => item.id === current.id)
            return !x ? acc.concat([current]) : acc
          }, [])
      )
    posts &&
      setTags(
        posts
          .reduce((acc: any, el: any) => [...acc, ...el.tags], [])
          .reduce((acc: any, el: any) => {
            const x = acc.find((item: any) => item.id === el.id)
            return !x ? acc.concat([el]) : acc
          }, [])
      )
  }, [posts])

  const HelmetComponent = () => {
    return dataS?.appSettings?.titleTag ? (
      <Helmet>
        {isSearchPosts ? (
          <title>
            {`Article search results for ${decodeURIComponent(term)} | ${
              dataS.appSettings.titleTag
            }`}
          </title>
        ) : (
          <title>{dataS.appSettings.titleTag || ''}</title>
        )}
      </Helmet>
    ) : null
  }

  return (
    <Fragment>
      <HelmetComponent />
      {isSearchPosts && (
        <h2
          className={`${handles.listTitle} ${handles.searchListTitle} t-heading-2 tc`}
        >
          Article search results for &quot;{decodeURIComponent(term)}
          &quot;
        </h2>
      )}

      <Container
        style={{ maxWidth: '90%' }}
        className={`${handles.listContainer} ${
          isSearchPosts ? handles.searchListContainer : ''
        }
        ${isSearchPosts ? 'pt2' : 'pt6'} pb8`}
        ref={containerRef}
      >
        <div className={`${handles.paginationComponent} ph3`}>
          <PaginationComponent
            postsPerPage={postsPerPage}
            page={page}
            perPage={perPage}
            dataS={dataS}
            data={data}
            setPage={setPage}
            setPerPage={setPerPage}
            fetchMore={fetchMore}
            customDomain={customDomain}
            categoryVariable={categoryVariable}
          />
        </div>
        <div
          className={`${handles.filtersContainer} flex flex-row justify-between mt3 ph3`}
        >
          {dataS?.appSettings?.filterByCategories && (
            <div className={`${handles.categorySelectContainer} w-40`}>
              <WordpressCategorySelect
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>
          )}
          {dataS?.appSettings?.filterByTags && (
            <div className={`${handles.tagSelectContainer} w-40`}>
              <WordpressTagSelect
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                tags={tags}
              />
            </div>
          )}
        </div>
        {(loading || loadingS || loadingPage) && (
          <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
            <Spinner />
          </div>
        )}
        {error && (
          <div className="ph5" style={{ minHeight: 800 }}>
            Error: {error.message}
          </div>
        )}
        {posts ? (
          <Fragment>
            <div
              className={`${handles.listFlex} ${
                isSearchPosts ? handles.searchListFlex : ''
              } mv4 flex flex-row flex-wrap`}
            >
              {posts
                .filter(
                  (post: PostData) =>
                    (selectedCategory && selectedCategory !== 'all'
                      ? post.categories.find(
                          (category: any) => category.name === selectedCategory
                        )
                      : post) &&
                    (selectedTag && selectedTag !== 'all'
                      ? post.tags.find((tag: any) => tag.name === selectedTag)
                      : post)
                )
                .map((post: PostData, index: number) => (
                  <div
                    key={index}
                    className={`${handles.listFlexItem} ${
                      isSearchPosts ? handles.searchListFlexItem : ''
                    } mv3 w-100-s w-50-l ph4`}
                  >
                    <WordpressTeaser
                      title={post.title.rendered}
                      author={post.author ? post.author.name : ''}
                      categories={post.categories}
                      subcategoryUrls={subcategoryUrls}
                      excerpt={post.excerpt.rendered}
                      date={post.date}
                      id={post.id}
                      slug={post.slug}
                      link={post.link}
                      customDomainSlug={
                        isSearchPosts
                          ? params.customdomainslug
                          : customDomainSlug
                      }
                      featuredMedia={post.featured_media}
                      mediaSize={mediaSize}
                      showAuthor={false}
                      showCategory
                      showDate
                      showExcerpt
                      useTextOverlay={false}
                      absoluteLinks={false}
                    />
                  </div>
                ))}
            </div>
            <div className={`${handles.paginationComponent} ph3`}>
              <PaginationComponent
                postsPerPage={postsPerPage}
                page={page}
                perPage={perPage}
                dataS={dataS}
                data={data}
                setPage={setPage}
                setPerPage={setPerPage}
                fetchMore={fetchMore}
                customDomain={customDomain}
                categoryVariable={categoryVariable}
              />
            </div>
          </Fragment>
        ) : (
          !loading &&
          !error && (
            <div>
              <h2>No posts found.</h2>
            </div>
          )
        )}
      </Container>
    </Fragment>
  )
}

export default WordpressPosts
