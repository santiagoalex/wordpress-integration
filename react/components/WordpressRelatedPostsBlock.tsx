import React, { Fragment, useContext } from 'react'
import { useQuery } from 'react-apollo'
import { ProductContext } from 'vtex.product-context'
import { defineMessages } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import WordpressTeaser from './WordpressTeaser'
import TagPosts from '../graphql/TagPosts.graphql'

const CSS_HANDLES = [
  'relatedPostsBlockContainer',
  'relatedPostsBlockTitle',
  'relatedPostsBlockFlex',
  'relatedPostsBlockFlexItem',
] as const

const WordpressRelatedPostsBlock: StorefrontFunctionComponent<WPRelatedPostsBlockProps> = ({
  title,
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
}) => {
  const { product } = useContext(ProductContext) as any
  const { loading, error, data } = useQuery(TagPosts, {
    skip: !product?.productReference,
    variables: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      wp_per_page: numberOfPosts,
      tag: `prod-${product?.productReference}`,
      customDomain,
    },
  })
  const handles = useCssHandles(CSS_HANDLES)
  return product?.productReference ? (
    <div className={`${handles.relatedPostsBlockContainer} pv4 pb9`}>
      {loading && <Spinner />}
      {error && <Fragment />}
      {data?.wpTags?.tags[0]?.wpPosts &&
      `prod-${product.productReference}` === data.wpTags.tags[0].name ? (
        <Fragment>
          <h2 className={`${handles.relatedPostsBlockTitle} tc t-heading-2`}>
            {title}
          </h2>
          <div
            className={`${handles.relatedPostsBlockFlex} mv4 flex flex-row flex-wrap justify-between`}
          >
            {data.wpTags.tags[0].wpPosts.posts.map(
              (post: PostData, index: number) => (
                <div
                  key={index}
                  className={`${handles.relatedPostsBlockFlexItem} mv3 w-33-l ph2 w-100-s`}
                >
                  <WordpressTeaser
                    title={post.title.rendered}
                    date={post.date}
                    id={post.id}
                    slug={post.slug}
                    link={post.link}
                    author={post.author ? post.author.name : ''}
                    excerpt={post.excerpt.rendered}
                    categories={post.categories}
                    subcategoryUrls={subcategoryUrls}
                    customDomainSlug={customDomainSlug}
                    featuredMedia={post.featured_media}
                    mediaSize={mediaSize}
                    showCategory={showCategories}
                    showDate={showDates}
                    showAuthor={showAuthors}
                    showExcerpt={showExcerpts}
                    absoluteLinks={absoluteLinks}
                    useTextOverlay={useTextOverlays}
                    ampLinks={ampLinks}
                    ampEnabled={post.amp_enabled}
                  />
                </div>
              )
            )}
          </div>
        </Fragment>
      ) : (
        <Fragment />
      )}
    </div>
  ) : null
}

interface WPRelatedPostsBlockProps {
  title: string
  numberOfPosts: number
  useTextOverlays: boolean
  showCategories: boolean
  showDates: boolean
  showAuthors: boolean
  showExcerpts: boolean
  subcategoryUrls: boolean
  absoluteLinks: boolean
  productQuery: ProductQuery
  mediaSize: MediaSize
  customDomain: string
  customDomainSlug: string
  ampLinks: boolean
}

interface ProductProperties {
  name: string
  values: [string]
}

interface ProductImage {
  imageId: string
  imageLabel: string
  imageTag: string
  imageUrl: string
  imageText: string
}

interface ProductOffer {
  Installments: [ProductInstallment]
  Price: number
  ListPrice: number
  AvailableQuantity: number
}

interface ProductInstallment {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  Name: string
}

interface ProductSeller {
  sellerId: string
  commertialOffer: ProductOffer
}

interface ProductItem {
  itemId: string
  name: string
  images: [ProductImage]
  sellers: [ProductSeller]
}

interface ProductShape {
  productId: string
  productName: string
  description: string
  properties: [ProductProperties]
  productReference: string
  brand: string
  items: [ProductItem]
  sellers: [ProductSeller]
}

interface ProductQuery {
  product: ProductShape
  loading: boolean
}

WordpressRelatedPostsBlock.defaultProps = {
  title: 'Related Articles',
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
    id: 'admin/editor.wordpressRelatedPosts.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedPosts.description',
  },
  titleTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedPostsTitle.title',
  },
  titleDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressRelatedPostsTitle.description',
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
})

WordpressRelatedPostsBlock.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    title: {
      title: messages.titleTitle.id,
      description: messages.titleDescription.id,
      type: 'string',
      isLayout: false,
      default: '',
    },
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
  },
}

export default WordpressRelatedPostsBlock
