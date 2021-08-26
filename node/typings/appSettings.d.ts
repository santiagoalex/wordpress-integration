interface Settings {
  bindingId?: string
  endpoint?: string
  apiPath?: string
  titleTag?: string
  blogPath?: string
  displayShowRowsText?: boolean
  ignoreRobotsMetaTag?: boolean
  initializeSitemap?: boolean
}

interface AppSettings extends Settings {
  bindingBounded?: boolean
  settings?: Settings[]
}
