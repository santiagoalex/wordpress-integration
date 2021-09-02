import React, {useEffect} from 'react'
import { Dropdown } from 'vtex.styleguide'


interface WordpressTagSelectProps {
  tags: any,
  selectedTag: any,
  setSelectedTag: any
}

const WordpressCategorySelect: StorefrontFunctionComponent<WordpressTagSelectProps> = ({
  tags,
  selectedTag,
  setSelectedTag
}) => {

  



  // const tagOptions = [
  //   { value: 'all', label: 'All' },
  //   { value: 'mastercard', label: 'Mastercard' },
  //   { value: 'elo', label: 'Elo' },
  //   { value: 'diners', label: 'Diners' },
  //   { value: 'giftcard', label: 'Gift Card' },
  //   { value: 'amex', label: 'American Express' },
  // ]

  const tagOptions = [
    { value: "all", label: "All tags" },
    ...tags.map((tag: any) => (
      { value: tag["id"].toString(), label: tag["id"] }
    ))
  ]

  useEffect(() => {
   console.log("tagOptions:", tagOptions);
   
  }, [tags])

  return (
    <Dropdown
      placeholder="Filter by tag"
      options={tagOptions}
      value={selectedTag}
      onChange={(_: any, l: any) => setSelectedTag(l)}
    />
  )

  
}


export default WordpressCategorySelect
