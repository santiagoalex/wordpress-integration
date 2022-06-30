import React from 'react'
import type { QueryResult } from 'react-apollo'

interface WPPostContainerContextInterface {
  query: QueryResult<
    any,
    {
      slug: any
      customDomain: any
    }
  > | null
}

export const WPPostContainerContext = React.createContext<
  WPPostContainerContextInterface
>({
  query: null,
})
