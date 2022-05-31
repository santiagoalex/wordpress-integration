/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { defineMessages } from 'react-intl'

import WordpressPosts from './WordpressPosts'

interface AllPostsProps {
  customDomain: string
  customDomainSlug: string
  subcategoryUrls: boolean
  mediaSize: MediaSize
  postsPerPage: number
  ampLinks?: boolean
  ampUrlFormat?: string
}

const WordpressAllPosts: StorefrontFunctionComponent<AllPostsProps> = ({
  customDomain,
  customDomainSlug,
  subcategoryUrls,
  mediaSize,
  postsPerPage,
  ampLinks,
  ampUrlFormat,
}) => {
  return (
    <WordpressPosts
      customDomain={customDomain}
      customDomainSlug={customDomainSlug}
      subcategoryUrls={subcategoryUrls}
      mediaSize={mediaSize}
      postsPerPage={postsPerPage}
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

export default WordpressAllPosts
