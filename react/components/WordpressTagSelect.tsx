import React, { useEffect } from 'react'
import { Dropdown } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'


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

  const tagOptions = [
    {
      value: "all", label: "All tags"
    },
    ...tags.map((tag: any) => (
      { value: tag["id"].toString(), label: tag["__typename"] }
    ))
  ]

  useEffect(() => {
    console.log("tagOptions:", tagOptions);
  }, [tags])

  return (
    <Dropdown
      placeholder={
        <FormattedMessage
          id={'store/wordpress-integration.WordpressTagSelect.filterByTag'}
          defaultMessage={'Filter by tag'}
        />
      }
      options={tagOptions}
      value={selectedTag}
      onChange={(_: any, l: any) => setSelectedTag(l)}
    />
  )
}


export default WordpressTagSelect
