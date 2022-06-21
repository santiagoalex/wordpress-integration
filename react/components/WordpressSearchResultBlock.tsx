import React, { Fragment } from 'react'
import { useQuery } from 'react-apollo'
import { Spinner, Button } from 'vtex.styleguide'
import { defineMessages } from 'react-intl'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import withSearchContext from './withSearchContext'
import SearchPosts from '../graphql/SearchPosts.graphql'

const CSS_HANDLES = [
  'searchResultBlockContainer',
  'searchResultBlockTitle',
  'searchResultBlockFlex',
  'searchResultBlockFlexItem',
  'searchResultBlockLink',
] as const

const WordpressSearchResultBlock: StorefrontFunctionComponent<WPSearchResultBlockProps> = ({
  searchQuery,
  useTextOverlays,
  showCategories,
  showDates,
  showAuthors,
  showExcerpts,
  subcategoryUrls,
  absoluteLinks,
  numberOfPosts,
  mediaSize,
  customDomain,
  customDomainSlug,
  ampLinks,
  ampUrlFormat,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { loading, error, data } = useQuery(SearchPosts, {
    variables: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      wp_per_page: numberOfPosts,
      terms: searchQuery?.data?.searchMetadata?.titleTag ?? null,
      customDomain,
    },
  })

  return (
    <div className={`${handles.searchResultBlockContainer} pv4 pb9`}>
      {loading && <Spinner />}
      {error && <span>Error: {error.message}</span>}
      {searchQuery?.data && data?.wpPosts ? (
        <Fragment>
          <h4 className={`${handles.searchResultBlockTitle} tc t-heading-2`}>
            {data.wpPosts.total_count} articles found for &quot;
            {searchQuery?.data.searchMetadata.titleTag}&quot;:
          </h4>
          <div
            className={`${handles.searchResultBlockFlex} mv4 flex flex-row flex-wrap justify-between`}
          >
            {data.wpPosts.posts.map((post: PostData, index: number) => (
              <div
                key={index}
                className={`${handles.searchResultBlockFlexItem} mv3 w-33-l ph2 w-100-s`}
              >
                <WordpressTeaser
                  title={post.title.rendered}
                  date={post.date}
                  id={post.id}
                  slug={post.slug}
                  link={post.link}
                  customDomainSlug={customDomainSlug}
                  author={post.author?.name ?? ''}
                  excerpt={post.excerpt.rendered}
                  categories={post.categories}
                  subcategoryUrls={subcategoryUrls}
                  featuredMedia={post.featured_media}
                  mediaSize={mediaSize}
                  showCategory={showCategories}
                  showDate={showDates}
                  showAuthor={showAuthors}
                  showExcerpt={showExcerpts}
                  absoluteLinks={absoluteLinks}
                  useTextOverlay={useTextOverlays}
                  ampLinks={ampLinks && post.amp_enabled}
                  ampUrlFormat={ampUrlFormat}
                />
              </div>
            ))}
          </div>
          <Link
            page="store.blog-search-result"
            params={{
              term: searchQuery.data.searchMetadata.titleTag,
              term_id: searchQuery.data.searchMetadata.titleTag,
              page: '1',
              customdomainslug: customDomainSlug,
            }}
            className={`${handles.searchResultBlockLink}`}
          >
            <Button variation="secondary" block>
              View all article results for &quot;
              {searchQuery.data.searchMetadata.titleTag}
              &quot; &gt;
            </Button>
          </Link>
        </Fragment>
      ) : (
        !loading && !error && <Fragment />
      )}
    </div>
  )
}

interface WPSearchResultBlockProps {
  numberOfPosts: number
  useTextOverlays: boolean
  showCategories: boolean
  showDates: boolean
  showAuthors: boolean
  showExcerpts: boolean
  subcategoryUrls: boolean
  absoluteLinks: boolean
  searchQuery: any
  mediaSize: MediaSize
  customDomain: string
  customDomainSlug: string
  ampLinks?: boolean
  ampUrlFormat?: string
}

WordpressSearchResultBlock.defaultProps = {
  numberOfPosts: 3,
  useTextOverlays: false,
  showCategories: true,
  showDates: true,
  showAuthors: false,
  showExcerpts: false,
  subcategoryUrls: false,
  absoluteLinks: false,
  mediaSize: undefined,
  customDomain: undefined,
  customDomainSlug: undefined,
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSearchResultBlock.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressSearchResultBlock.description',
  },
  numberOfPostsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressNumberOfPosts.title',
  },
  numberOfPostsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressNumberOfPosts.description',
  },
  useTextOverlaysTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressOverlays.title',
  },
  useTextOverlaysDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressOverlays.description',
  },
  showCategoriesTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategories.title',
  },
  showCategoriesDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCategories.description',
  },
  showDatesTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressDates.title',
  },
  showDatesDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressDates.description',
  },
  showAuthorsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAuthors.title',
  },
  showAuthorsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressAuthors.description',
  },
  showExcerptsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressExcerpts.title',
  },
  showExcerptsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressExcerpts.description',
  },
  absoluteLinksTitle: {
    defaultMessage: '',
    id: 'admin/editor.absoluteLinks.title',
  },
  absoluteLinksDescription: {
    defaultMessage: '',
    id: 'admin/editor.absoluteLinks.description',
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

WordpressSearchResultBlock.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    numberOfPosts: {
      title: messages.numberOfPostsTitle.id,
      description: messages.numberOfPostsDescription.id,
      type: 'number',
      isLayout: false,
      default: 3,
    },
    useTextOverlays: {
      title: messages.useTextOverlaysTitle.id,
      description: messages.useTextOverlaysDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
    },
    showCategories: {
      title: messages.showCategoriesTitle.id,
      description: messages.showCategoriesDescription.id,
      type: 'boolean',
      isLayout: false,
      default: true,
    },
    showDates: {
      title: messages.showDatesTitle.id,
      description: messages.showDatesDescription.id,
      type: 'boolean',
      isLayout: false,
      default: true,
    },
    showAuthors: {
      title: messages.showAuthorsTitle.id,
      description: messages.showAuthorsDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
    },
    showExcerpts: {
      title: messages.showExcerptsTitle.id,
      description: messages.showExcerptsDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
    },
    absoluteLinks: {
      title: messages.absoluteLinksTitle.id,
      description: messages.absoluteLinksDescription.id,
      type: 'boolean',
      isLayout: false,
      default: false,
    },
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

export default withSearchContext(WordpressSearchResultBlock)
