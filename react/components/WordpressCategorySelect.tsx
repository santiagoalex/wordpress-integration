import React from 'react'
import { Dropdown } from 'vtex.styleguide'
import { defineMessages, useIntl } from 'react-intl'

interface WordpressCategorySelectProps {
  categories: any
  selectedCategory: any
  setSelectedCategory: any
  setSelectedCategoryId: any
}

const WordpressCategorySelect: StorefrontFunctionComponent<WordpressCategorySelectProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  setSelectedCategoryId,
}) => {
  const intl = useIntl()

  const categoryOptions = [
    {
      value: 'all',
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      label: intl.formatMessage(messages.allCategories),
      id: undefined,
    },
    ...categories.map((cat: any) => ({
      value: cat.name,
      label: cat.name,
      id: cat.id,
    })),
  ]

  return (
    <Dropdown
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      placeholder={intl.formatMessage(messages.filterByCategory)}
      options={categoryOptions}
      value={selectedCategory}
      onChange={(_: any, v: any) => {
        setSelectedCategory(v)
        const selectedOption = categoryOptions.find(
          (option) => option.value === v
        )

        setSelectedCategoryId(selectedOption.id)
      }}
    />
  )
}

const messages = defineMessages({
  allCategories: {
    defaultMessage: 'All categories',
    id: 'store/wordpress-integration.wordpressCategorySelect.allCategories',
  },
  filterByCategory: {
    defaultMessage: 'Filter by category',
    id: 'store/wordpress-integration.wordpressCategorySelect.filterByCategory',
  },
})

export default WordpressCategorySelect
