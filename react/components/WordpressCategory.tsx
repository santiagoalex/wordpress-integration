/* eslint-disable @typescript-eslint/naming-convention */
import { Container } from 'vtex.store-components'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import Helmet from 'react-helmet'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import PaginationComponent from './PaginationComponent'
import CategoryPostsBySlug from '../graphql/CategoryPostsBySlug.graphql'
import Settings from '../graphql/Settings.graphql'

interface CategoryProps {
  customDomains: string
  postsPerPage: number
  mediaSize: MediaSize
  ampLinks?: boolean
  ampUrlFormat?: string
}

const CSS_HANDLES = [
  'listTitle',
  'listContainer',
  'listFlex',
  'listFlexItem',
  'paginationComponent',
] as const

const WordpressCategory: StorefrontFunctionComponent<CategoryProps> = ({
  customDomains,
  postsPerPage,
  mediaSize,
  ampLinks,
  ampUrlFormat,
}) => {
  const {
    route: { params },

    query,
  } = useRuntime()

  let parsedCustomDomains = null

  try {
    parsedCustomDomains = customDomains ? JSON.parse(customDomains) : null
  } catch (e) {
    console.error(`${e.name}: ${e.message}`)
  }

  const customDomain =
    params.customdomainslug && parsedCustomDomains
      ? parsedCustomDomains[params.customdomainslug]
      : undefined

  const initialPage = params.page ?? query?.page ?? '1'
  const [page, setPage] = useState(parseInt(initialPage, 10))
  const [perPage, setPerPage] = useState(postsPerPage)
  const categoryVariable = {
    categorySlug:
      params.subcategoryslug_id ||
      params.categoryslug ||
      params.categoryslug_id,
  }

  const handles = useCssHandles(CSS_HANDLES)
  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, error, data, fetchMore } = useQuery(CategoryPostsBySlug, {
    variables: {
      ...categoryVariable,
      wp_page: page,
      wp_per_page: perPage,
      customDomain,
    },
    skip: !categoryVariable.categorySlug,
  })

  const containerRef = useRef<null | HTMLElement>(null)
  const initialPageLoad = useRef(true)

  useEffect(() => {
    query?.page && setPage(parseInt(query.page, 10))
  }, [])

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

  return (
    <Fragment>
      {dataS && data?.wpCategories?.categories?.length > 0 && (
        <Fragment>
          <Helmet>
            <title>
              {dataS?.appSettings?.titleTag
                ? `${data.wpCategories.categories[0].name} | ${dataS.appSettings.titleTag}`
                : data.wpCategories.categories[0].name}
            </title>
          </Helmet>
          <h2 className={`${handles.listTitle} t-heading-2 tc`}>
            {data.wpCategories.categories[0].name}
          </h2>
        </Fragment>
      )}
      <Container
        className={`${handles.listContainer} pt2 pb8`}
        style={{ maxWidth: '90%' }}
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
        {data?.wpCategories?.categories?.length ? (
          <Fragment>
            <div className={`${handles.listFlex} mv4 flex flex-row flex-wrap`}>
              {data.wpCategories.categories[0].wpPosts.posts.map(
                (post: PostData, index: number) => (
                  <div
                    key={index}
                    className={`${handles.listFlexItem} mv3 w-100-s w-50-l ph4`}
                  >
                    <WordpressTeaser
                      title={post.title.rendered}
                      author={post.author?.name}
                      excerpt={post.excerpt.rendered}
                      date={post.date}
                      id={post.id}
                      slug={post.slug}
                      link={post.link}
                      customDomainSlug={params.customdomainslug}
                      featuredMedia={post.featured_media}
                      mediaSize={mediaSize}
                      showAuthor={false}
                      showCategory={false}
                      showDate
                      showExcerpt
                      useTextOverlay={false}
                      absoluteLinks={false}
                      ampLinks={ampLinks && post.amp_enabled}
                      ampUrlFormat={ampUrlFormat}
                    />
                  </div>
                )
              )}
            </div>
            <div className={`${handles.paginationComponent} ph3 mb7`}>
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
          !loadingS &&
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

const messages = defineMessages({
  postsPerPage: {
    defaultMessage: 'posts per page',
    id: 'store/wordpress-integration.wordpressPagination.postsPerPage',
  },
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategory.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategory.description',
  },
  customDomainsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.title',
  },
  customDomainsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomain.description',
  },
  mediaSizeTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressMediaSize.title',
  },
  mediaSizeDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressMediaSize.description',
  },
  ampLinksTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAmpLinks.title',
  },
  ampLinksDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAmpLinks.description',
  },
  ampUrlFormatTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAmpUrlFormat.title',
  },
  ampUrlFormatDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAmpUrlFormat.description',
  },
  ampPathSuffix: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAmpPathSuffix',
  },
  ampQuery: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAmpQuery',
  },
  ampQueryValue: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAmpQueryValue',
  },
})

WordpressCategory.defaultProps = {
  customDomains: undefined,
  postsPerPage: 10,
  mediaSize: undefined,
}

WordpressCategory.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    customDomains: {
      title: messages.customDomainsTitle.id,
      description: messages.customDomainsDescription.id,
      type: 'string',
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
    ampLinks: {
      title: messages.ampLinksTitle.id,
      description: messages.ampLinksDescription.id,
      type: 'boolean',
      isLayout: false,
      default: '',
    },
  },
  dependencies: {
    ampLinks: {
      oneOf: [
        {
          properties: {
            ampLinks: {
              enum: [true],
            },
            ampUrlFormat: {
              title: messages.ampUrlFormatTitle.id,
              description: messages.ampUrlFormatDescription.id,
              type: 'string',
              enum: ['ampPathSuffix', 'ampQuery', 'ampQueryValue'],
              enumNames: [
                messages.ampPathSuffix.id,
                messages.ampQuery.id,
                messages.ampQueryValue.id,
              ],
              isLayout: false,
              default: 'ampPathSuffix',
            },
          },
        },
      ],
    },
  },
}

export default WordpressCategory
