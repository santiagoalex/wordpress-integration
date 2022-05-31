/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { defineMessages } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import WordpressPosts from './WordpressPosts'

interface SearchProps {
  customDomains: string
  subcategoryUrls: boolean
  mediaSize: MediaSize
  postsPerPage: number
  ampLinks?: boolean
  ampUrlFormat?: string
}

const WordpressSearchResult: StorefrontFunctionComponent<SearchProps> = ({
  customDomains,
  subcategoryUrls,
  mediaSize,
  postsPerPage,
  ampLinks,
  ampUrlFormat,
}) => {
  const {
    route: { params },
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

  return (
    <WordpressPosts
      customDomain={customDomain}
      subcategoryUrls={subcategoryUrls}
      mediaSize={mediaSize}
      postsPerPage={postsPerPage}
      customDomainSlug={params.customDomainSlug}
      categoryVariable={null}
      ampLinks={ampLinks}
      ampUrlFormat={ampUrlFormat}
    />
  )
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
  customDomainsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomains.title',
  },
  customDomainsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomains.description',
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

WordpressSearchResult.defaultProps = {
  customDomains: undefined,
  subcategoryUrls: false,
  mediaSize: undefined,
  postsPerPage: 10,
}

WordpressSearchResult.schema = {
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

export default WordpressSearchResult
