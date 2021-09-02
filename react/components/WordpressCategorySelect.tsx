import React from 'react'
import { Dropdown } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'


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

  const categoryOptions = [
    {
      value: "all",
      label: "All categories"
    },
    ...categories.map((cat: any) => (
      { value: cat.name, label: cat.name }
    ))
  ]

  return (
    <Dropdown
      placeholder={
        <FormattedMessage
          id={'store/wordpress-integration.wordpressCategorySelect.filterByCategory'}
          defaultMessage={'Filter by category'}
        />
      }
      options={categoryOptions}
      value={selectedCategory}
      onChange={(_: any, v: any) => setSelectedCategory(v)}
    />
  )
}


export default WordpressCategorySelect
