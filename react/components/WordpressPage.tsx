/* eslint-disable @typescript-eslint/naming-convention */
import { Container } from 'vtex.store-components'
import type { FunctionComponent } from 'react'
import React, { useMemo } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import insane from 'insane'
import { useCssHandles } from 'vtex.css-handles'

import SinglePageBySlug from '../graphql/SinglePageBySlug.graphql'
import Settings from '../graphql/Settings.graphql'
import WordpressHeader from './WordpressHeader'

interface PageProps {
  customDomains: string
}

const allowClass = ['class']
const sanitizerConfig = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'b',
    'i',
    'strong',
    'section',
    'em',
    'strike',
    'code',
    'hr',
    'br',
    'div',
    'span',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
    'img',
    'iframe',
    'figure',
    'source',
    'video',
  ],
  allowedAttributes: {
    h1: allowClass,
    h2: allowClass,
    h3: allowClass,
    h4: allowClass,
    h5: allowClass,
    h6: allowClass,
    blockquote: allowClass,
    p: allowClass,
    a: ['class', 'href', 'name', 'target', 'rel'],
    ul: allowClass,
    ol: allowClass,
    nl: allowClass,
    li: allowClass,
    b: allowClass,
    i: allowClass,
    strong: allowClass,
    section: allowClass,
    em: allowClass,
    strike: allowClass,
    code: allowClass,
    hr: allowClass,
    br: allowClass,
    div: ['class', 'style'],
    table: allowClass,
    thead: allowClass,
    caption: allowClass,
    tbody: allowClass,
    tr: allowClass,
    th: allowClass,
    td: allowClass,
    pre: allowClass,
    img: ['class', 'src', 'alt'],
    iframe: [
      'class',
      'src',
      'scrolling',
      'frameborder',
      'width',
      'height',
      'id',
    ],
    figure: allowClass,
    video: ['class', 'id', 'width', 'height', 'preload', 'controls'],
    source: ['type', 'src'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
}

const sanitizerConfigStripAll = {
  allowedAttributes: false,
  allowedTags: false,
  allowedSchemes: [],
}

const classRegex = /(class=")([^"]*)(")/g

const CSS_HANDLES = [
  'postFlex',
  'postContainer',
  'postTitle',
  'postMeta',
  'postMetaDate',
  'postMetaAuthor',
  'postFeaturedImage',
  'postFeaturedImageContainer',
  'postBody',
  'postChildrenContainer',
] as const

const WordpressPageInner: FunctionComponent<{ pageData: any }> = (props) => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    culture: { locale },
  } = useRuntime()

  const { loading: loadingS, data: dataS } = useQuery(Settings)

  if (!props.pageData) {
    return (
      <div className={`${handles.postContainer} ph3`}>
        <h2>No page found.</h2>
      </div>
    )
  }

  const { date, title, content, author, featured_media } = props.pageData

  const dateObj = new Date(date)
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  const formattedDate = dateObj.toLocaleDateString(locale, dateOptions)

  const titleHtml = useMemo(() => {
    return insane(title.rendered, sanitizerConfig)
  }, [title.rendered, sanitizerConfig])

  const captionHtml = useMemo(() => {
    return featured_media?.caption?.rendered
      ? insane(featured_media.caption.rendered, sanitizerConfigStripAll)
      : null
  }, [featured_media?.caption?.rendered, sanitizerConfigStripAll])

  const bodyHtml = useMemo(() => {
    let html = insane(content.rendered, sanitizerConfig)

    // eslint-disable-next-line max-params
    html = html.replace(classRegex, (_, $1, $2, $3) => {
      const classArray = $2.split(' ')
      const newClasses = classArray.map(
        (item: string) => `vtex-wordpress-integration-2-x-${item}`
      )

      return `${$1}${newClasses.join(' ')}${$3}`
    })

    return html
  }, [content.rendered, sanitizerConfig])

  if (loadingS) {
    return (
      <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
        <Spinner />
      </div>
    )
  }

  return (
    <Container className={`${handles.postFlex} pt6 pb8 ph3`}>
      <WordpressHeader postData={props.pageData} dataS={dataS} />
      <div className={`${handles.postContainer} ph3`}>
        <h1
          className={`${handles.postTitle} t-heading-1`}
          dangerouslySetInnerHTML={{ __html: titleHtml }}
        />
        <p className={`${handles.postMeta} t-small mw9 c-muted-1`}>
          <span className={`${handles.postMetaDate}`}>
            <FormattedMessage
              id="store/wordpress-integration.wordpressPage.posted"
              defaultMessage="Posted {formattedDate} "
              values={{
                formattedDate,
              }}
            />
          </span>
          {author && (
            <span className={`${handles.postMetaAuthor}`}>
              <FormattedMessage
                id="store/wordpress-integration.wordpressPage.byAuthor"
                defaultMessage=" by {name}"
                values={{
                  name: author.name,
                }}
              />
            </span>
          )}
        </p>
        {featured_media && featured_media.media_type === 'image' && (
          <div className={`${handles.postFeaturedImageContainer} mw9 pb8`}>
            <img
              className={`${handles.postFeaturedImage}`}
              src={featured_media.source_url}
              alt={featured_media.alt_text}
            />
            {captionHtml && (
              <span dangerouslySetInnerHTML={{ __html: captionHtml }} />
            )}
          </div>
        )}
        <div
          className={`${handles.postBody}`}
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </div>
    </Container>
  )
}

const WordpressPage: StorefrontFunctionComponent<PageProps> = ({
  customDomains,
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

  const { loading, error, data } = useQuery(SinglePageBySlug, {
    variables: { slug: params.slug || params.slug_id, customDomain },
    skip: !params?.slug && !params?.slug_id,
  })

  if (loading) {
    return (
      <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="ph5" style={{ minHeight: 800 }}>
        Error! {error.message}
      </div>
    )
  }

  if (!data?.wpPages?.pages) {
    return (
      <div>
        <h2>No page found.</h2>
      </div>
    )
  }

  return <WordpressPageInner pageData={data.wpPages.pages[0]} />
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPage.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPage.description',
  },
  customDomainsTitle: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomains.title',
  },
  customDomainsDescription: {
    defaultMessage: '',
    id: 'admin/editor.wordpressCustomDomains.description',
  },
})

WordpressPage.defaultProps = {
  customDomains: undefined,
}

WordpressPage.schema = {
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
  },
}

export default WordpressPage
