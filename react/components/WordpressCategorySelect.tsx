import React from 'react'
import { Dropdown } from 'vtex.styleguide'


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
    { value: "all", label: "All" },
    ...categories.map((cat: any) => (
      { value: cat.name, label: cat.name }
    ))
  ]

  return (
    <Dropdown
      placeholder="Filter by category"
      options={categoryOptions}
      value={selectedCategory}
      onChange={(_: any, v: any) => setSelectedCategory(v)}
    />
  )

  
}


export default WordpressCategorySelect
