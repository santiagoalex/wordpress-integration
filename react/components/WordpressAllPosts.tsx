/* eslint-disable @typescript-eslint/camelcase */
import { Container } from 'vtex.store-components'
import React, {
  ChangeEvent,
  Fragment,
  useState,
  useEffect,
  useRef,
} from 'react'
import { Helmet } from 'react-helmet'
import { defineMessages, useIntl } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner, Pagination } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import Settings from '../graphql/Settings.graphql'
import AllPosts from '../graphql/AllPosts.graphql'
import WordpressCategorySelect from './WordpressCategorySelect'

const CSS_HANDLES = [
  'listTitle',
  'listContainer',
  'listFlex',
  'listFlexItem',
  'paginationComponent',
  'categorySelect'
] as const

interface AllPostsProps {
  customDomain: string
  customDomainSlug: string
  subcategoryUrls: boolean
  mediaSize?: MediaSize
  postsPerPage: number
}

const WordpressAllPosts: StorefrontFunctionComponent<AllPostsProps> = ({
  customDomain,
  customDomainSlug,
  subcategoryUrls,
  mediaSize,
  postsPerPage,
}) => {
  const intl = useIntl()
  const {
    route: { id, params },
    pages,
    query,
    setQuery,
    navigate,
  } = useRuntime() as any
  const initialPage = params.page ?? query?.page ?? '1'
  const [page, setPage] = useState(parseInt(initialPage, 10))
  const [perPage, setPerPage] = useState(postsPerPage)
  const [selectedOption, setSelectedOption] = useState(postsPerPage)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const handles = useCssHandles(CSS_HANDLES)
  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, error, data, fetchMore } = useQuery(AllPosts, {
    variables: {
      wp_page: 1,
      wp_per_page: perPage,
      customDomain,
    },
  })

  const containerRef = useRef<null | HTMLElement>(null)
  const initialPageLoad = useRef(true)

  useEffect(() => {
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
    setCategories(data.wpPosts.posts
      .reduce((acc: any, el: any) => [...acc, ...el.categories], [])
      .reduce((acc: any, current: any) => {
        const x = acc.find((item: any) => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []))
  }, [data])

  const PaginationComponent = (
    <Pagination
      rowsOptions={[
        postsPerPage,
        postsPerPage * 2,
        postsPerPage * 3,
        postsPerPage * 4,
      ]}
      selectedOption={selectedOption}
      currentItemFrom={(page - 1) * perPage + 1}
      currentItemTo={page * perPage}
      textOf="of"
      textShowRows={
        dataS?.appSettings?.displayShowRowsText === false
          ? null
          : // eslint-disable-next-line @typescript-eslint/no-use-before-define
          intl.formatMessage(messages.postsPerPage)
      }
      totalItems={data?.wpPosts?.total_count ?? 0}
      onRowsChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setPage(1)
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = '1'
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: '1' })
        }
        setSelectedOption(+value)
        setPerPage(+value)
        fetchMore({
          variables: {
            wp_page: 1,
            wp_per_page: +value,
            customDomain,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            return fetchMoreResult
          },
        })
      }}
      onPrevClick={() => {
        if (page <= 1) return
        const prevPage = page - 1
        setPage(prevPage)
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = prevPage.toString()
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: prevPage.toString() })
        }
        fetchMore({
          variables: {
            wp_page: prevPage,
            wp_per_page: perPage,
            customDomain,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            return fetchMoreResult
          },
        })
      }}
      onNextClick={() => {
        const nextPage = page + 1
        setPage(nextPage)
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = nextPage.toString()
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: nextPage.toString() })
        }
        fetchMore({
          variables: {
            wp_page: nextPage,
            wp_per_page: perPage,
            customDomain,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            return fetchMoreResult
          },
        })
      }}
    />
  )

  return (
    <Container
      className={`${handles.listContainer} pt6 pb8`}
      style={{ maxWidth: '90%' }}
      ref={containerRef}
    >
      {dataS?.appSettings?.titleTag && (
        <Helmet>
          <title>{dataS.appSettings.titleTag}</title>
        </Helmet>
      )}
      <div className={`${handles.paginationComponent} ph3`}>
        {PaginationComponent}
      </div>
      <div className={`${handles.categorySelect} mt3 ph3`}>
        <WordpressCategorySelect
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
      {(loading || loadingS) && (
        <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
          <Spinner />
        </div>
      )}
      {error && (
        <div className="ph5" style={{ minHeight: 800 }}>
          Error: {error.message}
        </div>
      )}
      {data?.wpPosts ? (
        <Fragment>
          <div className={`${handles.listFlex} mv4 flex flex-row flex-wrap`}>
            {(selectedCategory && selectedCategory !== "all") ?
              data.wpPosts.posts
                .filter((post: any) => post.categories.find((category: any) => category.name === selectedCategory))
                .map((post: PostData, index: number) => (
                  <div
                    key={index}
                    className={`${handles.listFlexItem} mv3 w-100-s w-50-l ph4`}
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
                      customDomainSlug={customDomainSlug}
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
                ))
              :
              data.wpPosts.posts
                .map((post: PostData, index: number) => (
                  <div
                    key={index}
                    className={`${handles.listFlexItem} mv3 w-100-s w-50-l ph4`}
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
                      customDomainSlug={customDomainSlug}
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
                ))
            }
          </div>
          <div className={`${handles.paginationComponent} ph3 mb7`}>
            {PaginationComponent}
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
  )
}

const messages = defineMessages({
  postsPerPage: {
    defaultMessage: 'posts per page',
    id: 'store/wordpress-integration.wordpressPagination.postsPerPage',
  },
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAllPosts.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAllPosts.description',
  },
  customDomainTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.title',
  },
  customDomainDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.description',
  },
  customDomainSlugTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomainSlug.title',
  },
  customDomainSlugDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomainSlug.description',
  },
  subcategoryUrlsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSubcategoryUrls.title',
  },
  subcategoryUrlsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSubcategoryUrls.description',
  },
  mediaSizeTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressMediaSize.title',
  },
  mediaSizeDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressMediaSize.description',
  },
})

WordpressAllPosts.defaultProps = {
  customDomain: undefined,
  customDomainSlug: undefined,
  subcategoryUrls: false,
  mediaSize: undefined,
  postsPerPage: 10,
}

WordpressAllPosts.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    customDomain: {
      title: messages.customDomainTitle.id,
      description: messages.customDomainDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    customDomainSlug: {
      title: messages.customDomainSlugTitle.id,
      description: messages.customDomainSlugDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
    subcategoryUrls: {
      title: messages.subcategoryUrlsTitle.id,
      description: messages.subcategoryUrlsDescription.id,
      type: 'boolean',
      isLayout: false,
      default: '',
    },
    mediaSize: {
      title: messages.mediaSizeTitle.id,
      description: messages.mediaSizeDescription.id,
      type: 'string',
      enum: ['thumbnail', 'medium', 'medium_large', 'large', 'full'],
      enumNames: ['Thumbnail', 'Medium', 'Medium Large', 'Large', 'Full'],
      isLayout: false,
      default: '',
    },
  },
}

export default WordpressAllPosts
