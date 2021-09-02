import React from 'react'
import { Dropdown } from 'vtex.styleguide'
import { defineMessages, useIntl } from 'react-intl'

interface WordpressTagSelectProps {
  tags: any,
  selectedTag: any,
  setSelectedTag: any
}

const WordpressTagSelect: StorefrontFunctionComponent<WordpressTagSelectProps> = ({
  tags,
  selectedTag,
  setSelectedTag
}) => {
  const intl = useIntl()
  const tagOptions = [
    {
      value: "all", label: intl.formatMessage(messages.allTags) 
    },
    ...tags.map((tag: any) => (
      { value: tag.id, label: tag.__typename }
    ))
  ]

  return (
    <Dropdown
      placeholder={ intl.formatMessage(messages.filterByTag) }
      options={tagOptions}
      value={selectedTag}
      onChange={(_: any, l: any) => setSelectedTag(l)}
    />
  )
}

const messages = defineMessages({
  allTags: {
    defaultMessage: 'All tags',
    id: "store/wordpress-integration.WordpressTagSelect.allTags"
  },
  filterByTag: {
    defaultMessage: 'Filter by tag',
    id: "store/wordpress-integration.WordpressTagSelect.filterByTag"
  }
})


export default WordpressTagSelect
