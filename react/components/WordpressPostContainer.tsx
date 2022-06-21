import React from 'react'
import type { HTMLProps } from 'react'
import { defineMessages } from 'react-intl'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'

import { WPPostContainerContext } from '../contexts/WordpressPostContainer'
import SinglePostBySlug from '../graphql/SinglePostBySlug.graphql'

interface PostProps extends HTMLProps<any> {
  customDomains: string
}

const WordpressPostContainer: StorefrontFunctionComponent<PostProps> = ({
  customDomains,
  children,
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

  const customDomain: string =
    params.customdomainslug && parsedCustomDomains
      ? parsedCustomDomains[params.customdomainslug]
      : undefined

  const query = useQuery(SinglePostBySlug, {
    variables: { slug: params.slug || params.slug_id, customDomain },
    skip: !params?.slug && !params?.slug_id,
  })

  return (
    <WPPostContainerContext.Provider value={{ query }}>
      <div>{children}</div>
    </WPPostContainerContext.Provider>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostContainer.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.wordpressPostContainer.description',
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

WordpressPostContainer.defaultProps = {
  customDomains: undefined,
}

WordpressPostContainer.schema = {
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

export default WordpressPostContainer
