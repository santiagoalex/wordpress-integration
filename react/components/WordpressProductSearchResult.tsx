/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/camelcase */
import { Container } from 'vtex.store-components'
import React, {
  ChangeEvent,
  Fragment,
  useState,
  useEffect,
  useRef,
} from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useQuery } from 'react-apollo'
import { Spinner, Pagination } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime'

import WordpressTeaser from './WordpressTeaser'
import withSearchContext from './withSearchContext'
import SearchPosts from '../graphql/SearchPosts.graphql'
import Settings from '../graphql/Settings.graphql'

interface Props {
  searchQuery: any
  customDomain: string
  customDomainSlug: string
  subcategoryUrls: boolean
  mediaSize: MediaSize
  postsPerPage: number
}

const CSS_HANDLES = [
  'listTitle',
  'searchListTitle',
  'listContainer',
  'searchListContainer',
  'listFlex',
  'searchListFlex',
  'listFlexItem',
  'searchListFlexItem',
  'paginationComponent',
] as const

const WordpressSearchResult: StorefrontFunctionComponent<Props> = ({
  searchQuery,
  customDomain,
  customDomainSlug,
  subcategoryUrls,
  mediaSize,
  postsPerPage,
}) => {
  const {
    route: { params },
    query,
  } = useRuntime()
  const intl = useIntl()
  const initialPage = params.page ?? query?.page ?? '1'
  const [page, setPage] = useState(parseInt(initialPage, 10))
  const [perPage, setPerPage] = useState(postsPerPage)
  const [selectedOption, setSelectedOption] = useState(postsPerPage)
  const handles = useCssHandles(CSS_HANDLES)
  const { data: dataS } = useQuery(Settings)
  const [
    {
      categories: [category],
    },
  ] = searchQuery?.data?.productSearch.products ?? null
  const terms = params?.term ?? category?.replaceAll('/', ' ').trim()
  const variables = {
    terms,
    wp_page: 1,
    wp_per_page: perPage,
    customDomain,
  }
  const { loading, error, data, fetchMore } = useQuery(SearchPosts, {
    skip: !searchQuery,
    variables,
  })
  useEffect(() => {
    console.log('terms::', terms)
  }, [terms])

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

  const paginationComponent = (
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
      totalItems={data?.wpPostsSearch?.total_count ?? 0}
      onRowsChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(+value)
        setPage(1)
        setPerPage(+value)
        fetchMore({
          variables: {
            wp_page: 1,
            wp_per_page: +value,
            terms,
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
        setPage(page - 1)
        fetchMore({
          variables: {
            wp_page: prevPage,
            wp_per_page: perPage,
            terms,
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
        setPage(page + 1)
        fetchMore({
          variables: {
            wp_page: nextPage,
            wp_per_page: perPage,
            terms,
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
  return searchQuery?.data?.searchMetadata?.titleTag ? (
    <Fragment>
      <h2
        className={`${handles.listTitle} ${handles.searchListTitle} t-heading-2 tc`}
      >
        Article search results for &quot;
        {searchQuery?.data?.searchMetadata?.titleTag}
        &quot;
      </h2>

      <Container
        className={`${handles.listContainer} ${handles.searchListContainer} pt2 pb8`}
        style={{ maxWidth: '90%' }}
        ref={containerRef}
      >
        <div className={`${handles.paginationComponent} ph3`}>
          {paginationComponent}
        </div>
        {loading && (
          <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
            <Spinner />
          </div>
        )}
        {error && (
          <div className="ph5" style={{ minHeight: 800 }}>
            Error: {error.message}
          </div>
        )}
        {data?.wpPostsSearch ? (
          <Fragment>
            <div
              className={`${handles.listFlex} ${handles.searchListFlex} mv4 flex flex-row flex-wrap`}
            >
              {data.wpPostsSearch.posts
                .filter((post: PostData) => post.featured_media)
                .map((post: PostData, index: number) => (
                  <div
                    key={index}
                    className={`${handles.listFlexItem} ${handles.searchListFlexItem} mv3 w-100-s w-50-l ph4`}
                  >
                    <WordpressTeaser
                      title={post.title.rendered}
                      author={post.author.name}
                      categories={post.categories}
                      subcategoryUrls={subcategoryUrls}
                      customDomainSlug={customDomainSlug}
                      excerpt={post.excerpt.rendered}
                      date={post.date}
                      id={post.id}
                      slug={post.slug}
                      link={post.link}
                      featuredMedia={post.featured_media}
                      mediaSize={mediaSize}
                      showAuthor={false}
                      showCategory
                      showDate
                      showExcerpt
                      useTextOverlay={false}
                      absoluteLinks={false}
                      ampLinks={false}
                      ampEnabled={post.amp_enabled}
                    />
                  </div>
                ))}
            </div>
            <div className={`${handles.paginationComponent} ph3`}>
              {paginationComponent}
            </div>
          </Fragment>
        ) : (
          <div>
            <h2>No posts found.</h2>
          </div>
        )}
      </Container>
    </Fragment>
  ) : null
}

const messages = defineMessages({
  postsPerPage: {
    defaultMessage: 'posts per page',
    id: 'store/wordpress-integration.wordpressPagination.postsPerPage',
  },
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSearchResult.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSearchResult.description',
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

WordpressSearchResult.defaultProps = {
  customDomain: undefined,
  customDomainSlug: undefined,
  subcategoryUrls: false,
  mediaSize: undefined,
  postsPerPage: 10,
}

WordpressSearchResult.schema = {
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

export default withSearchContext(WordpressSearchResult)
