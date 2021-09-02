import React from 'react'
import { Dropdown } from 'vtex.styleguide'
import { defineMessages, useIntl } from 'react-intl'


interface WordpressCategorySelectProps {
  categories: any,
  selectedCategory: any,
  setSelectedCategory: any
}

const WordpressCategorySelect: StorefrontFunctionComponent<WordpressCategorySelectProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory
}) => {

  const intl = useIntl()

  const categoryOptions = [
    {
      value: "all",
      label: intl.formatMessage(messages.allCategories) 
    },
    ...categories.map((cat: any) => (
      { value: cat.name, label: cat.name }
    ))
  ]

  return (
    <Dropdown
      placeholder={ intl.formatMessage(messages.filterByCategory) }
      options={categoryOptions}
      value={selectedCategory}
      onChange={(_: any, v: any) => setSelectedCategory(v)}
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
  }
})

export default WordpressCategorySelect
