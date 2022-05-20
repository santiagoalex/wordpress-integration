interface Settings {
  bindingId?: string
  endpoint?: string
  apiPath?: string
  titleTag?: string
  displayShowRowsText?: boolean
  ignoreRobotsMetaTag?: boolean
  initializeSitemap?: boolean
  filterByCategories?: boolean
  filterByTags?: boolean
  filterByDate?: boolean
}

interface AppSettings extends Settings {
  bindingBounded?: boolean
  settings?: Settings[]
}
