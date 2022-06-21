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
  ampLinks: boolean
}

const WordpressSearchResult: StorefrontFunctionComponent<SearchProps> = ({
  customDomains,
  subcategoryUrls,
  mediaSize,
  postsPerPage,
  ampLinks,
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
  },
}

export default WordpressSearchResult
