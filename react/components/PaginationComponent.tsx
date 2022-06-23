import type { ChangeEvent, FunctionComponent } from 'react'
import React, { useState } from 'react'
import { Pagination } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { defineMessages, useIntl } from 'react-intl'

interface PaginationComponentProps {
  postsPerPage: number
  page: number
  perPage: number
  dataS: any
  data: any
  setPage: any
  setPerPage: any
  fetchMore: any
  customDomain: any
  categoryVariable: any
}
const messages = defineMessages({
  postsPerPage: {
    defaultMessage: 'posts per page',
    id: 'store/wordpress-integration.wordpressPagination.postsPerPage',
  },
})

const PaginationComponent: FunctionComponent<PaginationComponentProps> = ({
  postsPerPage,
  page,
  setPage,
  perPage,
  dataS,
  data,
  setPerPage,
}): JSX.Element => {
  const intl = useIntl()
  const {
    route: { id, params },
    pages,
    setQuery,
    navigate,
  } = useRuntime()

  const [selectedOption, setSelectedOption] = useState(postsPerPage)
  const totalItems =
    data?.wpPosts?.total_count ||
    data?.wpPostsSearch?.total_count ||
    data?.wpCategories?.categories[0]?.wpPosts?.total_count ||
    0

  return (
    <Pagination
      rowsOptions={[
        postsPerPage,
        postsPerPage * 2,
        postsPerPage * 3,
        postsPerPage * 4,
      ]}
      selectedOption={selectedOption}
      currentItemFrom={(page - 1) * perPage + 1}
      currentItemTo={page * perPage}
      textOf="of"
      textShowRows={
        dataS?.appSettings?.displayShowRowsText === false
          ? null
          : // eslint-disable-next-line @typescript-eslint/no-use-before-define
            intl.formatMessage(messages.postsPerPage)
      }
      totalItems={totalItems}
      onRowsChange={({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setPage(1)
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = '1'
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: '1' })
        }

        setSelectedOption(+value)
        setPerPage(+value)
      }}
      onPrevClick={() => {
        if (page <= 1) return
        const prevPage = page - 1

        setPage(prevPage)
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = prevPage.toString()
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: prevPage.toString() })
        }
      }}
      onNextClick={() => {
        const nextPage = page + 1

        setPage(nextPage)
        if (pages[id].path.indexOf(':page') > 0) {
          params.page = nextPage.toString()
          navigate({
            page: id,
            params,
            scrollOptions: false,
          })
        } else {
          setQuery({ page: nextPage.toString() })
        }
      }}
    />
  )
}

export default PaginationComponent
