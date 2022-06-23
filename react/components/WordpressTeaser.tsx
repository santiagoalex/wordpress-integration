import type { FunctionComponent } from 'react'
import React, { Fragment, useMemo } from 'react'
import { Card, Button } from 'vtex.styleguide'
import { Link, useRuntime } from 'vtex.render-runtime'
import insane from 'insane'
import { useCssHandles } from 'vtex.css-handles'
import { defineMessages, useIntl } from 'react-intl'

import linkParams from '../utils/categoryLinkParams'

interface TeaserProps {
  title: string
  author: string
  excerpt: string
  categories?: WPCategory[]
  subcategoryUrls?: boolean
  customDomainSlug?: string
  date: string
  id: number
  slug: string
  link: string
  featuredMedia: WPMedia
  mediaSize?: MediaSize
  showCategory: boolean
  showAuthor: boolean
  showDate: boolean
  showExcerpt: boolean
  absoluteLinks: boolean
  useTextOverlay: boolean
  showPostButton?: boolean
  ampLinks?: boolean
  ampUrlFormat?: string
}

const sanitizerConfigStripAll = {
  allowedAttributes: false,
  allowedTags: ['p', 'div', 'span'],
  allowedSchemes: [],
}

const CSS_HANDLES = [
  'teaserContainer',
  'teaserImageContainer',
  'teaserImage',
  'teaserTextOverlay',
  'teaserTextOverlayTitle',
  'teaserTextOverlayMeta',
  'teaserGradientOverlay',
  'teaserHeader',
  'teaserTitle',
  'teaserTitleLink',
  'teaserBody',
  'teaserCategoryLink',
  'teaserAuthor',
  'teaserDate',
  'teaserSeparator',
  'titleAndExcerptContainer',
  'teaserShowPostButton',
] as const

const messages = defineMessages({
  showPostButton: {
    defaultMessage: 'Show post',
    id: 'store/wordpress-integration.WordpressTeaser.showPostButton',
  },
})

const WordpressTeaser: FunctionComponent<TeaserProps> = ({
  title,
  author,
  excerpt,
  categories,
  subcategoryUrls,
  customDomainSlug,
  date,
  slug,
  link,
  featuredMedia,
  mediaSize,
  showCategory,
  showAuthor,
  showDate,
  showExcerpt,
  absoluteLinks,
  useTextOverlay,
  showPostButton,
  ampLinks = false,
  ampUrlFormat = 'ampPathSuffix',
}) => {
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const {
    culture: { locale },
  } = useRuntime()

  const dateObj = new Date(date)
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  const formattedDate = dateObj.toLocaleDateString(locale, dateOptions)
  const sanitizedTitle = useMemo(() => {
    return insane(title, sanitizerConfigStripAll)
  }, [title, sanitizerConfigStripAll])

  const sanitizedExcerpt = useMemo(() => {
    return insane(excerpt, sanitizerConfigStripAll)
  }, [excerpt, sanitizerConfigStripAll])

  const {
    media_type: mediaType,
    alt_text: altText,
    media_details: mediaDetail,
  } = featuredMedia || {}

  const mediaSourceURL =
    (mediaSize && mediaDetail?.sizes[mediaSize]?.source_url) ||
    featuredMedia?.source_url

  const category = categories?.length && categories?.find((c) => c.parent === 0)
  const subcategory =
    subcategoryUrls && category
      ? categories?.find((sub) => sub.parent === category.id)
      : undefined

  let ampLink

  switch (ampUrlFormat) {
    case 'ampPathSuffix':
      ampLink = `${link}amp/`
      break

    case 'ampQuery':
      ampLink = `${link.replace(/\/$/, '')}?amp`
      break

    case 'ampQueryValue':
      ampLink = `${link.replace(/\/$/, '')}?amp=1`
      break

    default:
      break
  }

  return (
    <div className={`${handles.teaserContainer}`}>
      <Card noPadding>
        {(showCategory || showDate || showAuthor) &&
          (!useTextOverlay || mediaType !== 'image') && (
            <h5 className={`${handles.teaserHeader} mv1 ph6 pt6 pb4`}>
              {showCategory && category && (
                <Fragment>
                  <Link
                    page={
                      subcategory
                        ? 'store.blog-category#subcategory'
                        : 'store.blog-category'
                    }
                    params={linkParams(customDomainSlug, category, subcategory)}
                    className={`${handles.teaserCategoryLink}`}
                  >
                    {subcategory ? subcategory.name : category.name}
                  </Link>
                </Fragment>
              )}
              {((showCategory && showDate) || (showCategory && showAuthor)) && (
                <span className={`${handles.teaserSeparator}`}> - </span>
              )}
              {showDate && (
                <span className={`${handles.teaserDate}`}>{formattedDate}</span>
              )}
              {showDate && showAuthor && (
                <span className={`${handles.teaserSeparator}`}> - </span>
              )}
              {showAuthor && (
                <span className={`${handles.teaserAuthor}`}>{author}</span>
              )}
            </h5>
          )}
        {mediaType === 'image' && (
          <Fragment>
            {useTextOverlay ? (
              <div className="tc-m db relative">
                <img
                  className={`${handles.teaserImage} w-100`}
                  src={mediaSourceURL}
                  alt={altText}
                ></img>
                <div
                  className={`${handles.teaserGradientOverlay} absolute absolute--fill`}
                  style={{
                    background: `linear-gradient(to bottom,rgba(0,0,0,0) 0,rgba(0,0,0,0) 50%,rgba(0,0,0,.6) 100%)`,
                  }}
                >
                  <div
                    className={`${handles.teaserTextOverlay} absolute tl`}
                    style={{
                      bottom: `15%`,
                      left: `5%`,
                    }}
                  >
                    <div
                      className={`${handles.teaserTextOverlayTitle} t-heading-5 white fw5 mb3`}
                    >
                      {ampLinks && (
                        <Link
                          to={`${ampLink}`}
                          target="_blank"
                          className="white no-underline"
                        >
                          {title}
                        </Link>
                      )}

                      {!ampLinks && absoluteLinks && (
                        <Link
                          to={link}
                          target="_blank"
                          className="white no-underline"
                        >
                          {title}
                        </Link>
                      )}

                      {!ampLinks && !absoluteLinks && (
                        <Link
                          page="store.blog-post"
                          params={{
                            slug,
                            slug_id: slug,
                            customdomainslug: customDomainSlug,
                          }}
                          className="white no-underline"
                        >
                          {title}
                        </Link>
                      )}
                    </div>
                    {(showCategory || showDate || showAuthor) && (
                      <div
                        className={`${handles.teaserTextOverlayMeta} white t-mini`}
                      >
                        {showCategory && category && (
                          <Fragment>
                            <Link
                              page={
                                subcategoryUrls
                                  ? 'store.blog-category#subcategory'
                                  : 'store.blog-category'
                              }
                              params={linkParams(
                                customDomainSlug,
                                category,
                                subcategory
                              )}
                              className={`${handles.teaserCategoryLink} white`}
                            >
                              {subcategory ? subcategory.name : category.name}
                            </Link>
                          </Fragment>
                        )}
                        {((showCategory && showDate) ||
                          (showCategory && showAuthor)) && (
                          <span className={`${handles.teaserSeparator}`}>
                            {' '}
                            -{' '}
                          </span>
                        )}
                        {showDate && (
                          <span className={`${handles.teaserDate}`}>
                            {formattedDate}
                          </span>
                        )}
                        {showDate && showAuthor && (
                          <span className={`${handles.teaserSeparator}`}>
                            {' '}
                            -{' '}
                          </span>
                        )}
                        {showAuthor && (
                          <span className={`${handles.teaserAuthor}`}>
                            {author}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Fragment>
                {ampLinks && (
                  <Link
                    to={`${ampLink}`}
                    target="_blank"
                    className={`${handles.teaserImageContainer} tc-m db`}
                  >
                    <img
                      className={`${handles.teaserImage}`}
                      src={mediaSourceURL}
                      alt={altText}
                    ></img>
                  </Link>
                )}

                {!ampLinks && absoluteLinks && (
                  <Link
                    to={link}
                    target="_blank"
                    className={`${handles.teaserImageContainer} tc-m db`}
                  >
                    <img
                      className={`${handles.teaserImage}`}
                      src={mediaSourceURL}
                      alt={altText}
                    ></img>
                  </Link>
                )}

                {!ampLinks && !absoluteLinks && (
                  <Link
                    page="store.blog-post"
                    params={{
                      slug,
                      slug_id: slug,
                      customdomainslug: customDomainSlug,
                    }}
                    className={`${handles.teaserImageContainer} tc-m db`}
                  >
                    <img
                      className={`${handles.teaserImage}`}
                      src={mediaSourceURL}
                      alt={altText}
                    ></img>
                  </Link>
                )}
              </Fragment>
            )}
          </Fragment>
        )}

        <div className={`${handles.titleAndExcerptContainer} flex-column`}>
          {mediaType !== 'image' ||
            (mediaType === 'image' && !useTextOverlay && (
              <h3
                className={`${handles.teaserTitle} t-heading-3 mv0 pt4 pb6 ph6`}
              >
                {ampLinks && (
                  <Link
                    className={`${handles.teaserTitleLink}`}
                    to={`${ampLink}`}
                    target="_blank"
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
                    />
                  </Link>
                )}

                {!ampLinks && absoluteLinks && (
                  <Link
                    className={`${handles.teaserTitleLink}`}
                    to={link}
                    target="_blank"
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
                    />
                  </Link>
                )}

                {!ampLinks && !absoluteLinks && (
                  <Link
                    className={`${handles.teaserTitleLink}`}
                    page="store.blog-post"
                    params={{
                      slug,
                      slug_id: slug,
                      customdomainslug: customDomainSlug,
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
                    />
                  </Link>
                )}
              </h3>
            ))}
          {showExcerpt && (
            <div
              className={`${handles.teaserBody} ph6 pb6`}
              dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}
            />
          )}
          {showPostButton && (
            <>
              {ampLinks && (
                <Link
                  className={`${handles.teaserShowPostButton}`}
                  to={`${ampLink}`}
                  target="_blank"
                >
                  <Button>{intl.formatMessage(messages.showPostButton)}</Button>
                </Link>
              )}

              {!ampLinks && absoluteLinks && (
                <Link
                  className={`${handles.teaserShowPostButton}`}
                  to={link}
                  target="_blank"
                >
                  <Button>{intl.formatMessage(messages.showPostButton)}</Button>
                </Link>
              )}

              {!ampLinks && !absoluteLinks && (
                <Link
                  className={`${handles.teaserShowPostButton}`}
                  page="store.blog-post"
                  params={{
                    slug,
                    slug_id: slug,
                    customdomainslug: customDomainSlug,
                  }}
                >
                  <Button>{intl.formatMessage(messages.showPostButton)}</Button>
                </Link>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

export default WordpressTeaser
