import { SearchPageContext } from 'vtex.search-page-context/SearchPageContext'
import type { ComponentType } from 'react'
import React from 'react'

function withSearchContext(WrappedComponent: ComponentType<any>) {
  return (props: any) => {
    return (
      <SearchPageContext.Consumer>
        {({ searchQuery }: { searchQuery: any }) => (
          <WrappedComponent {...props} searchQuery={searchQuery} />
        )}
      </SearchPageContext.Consumer>
    )
  }
}

export default withSearchContext
