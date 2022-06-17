/* eslint-disable */
import { VTEX_AUTH_HEADER, FAIL_ON_STATUS_CODE } from './common/constants'
import { updateRetry } from './common/support'

const config = Cypress.env()
const version = '2.19.2'
const app = 'vtex.wordpress-integration'
export function configureTargetWorkspace(
  endpoint,
  titleTag,
  {
    bindingBounded = false,
    displayShowRowsText = false,
    ignoreRobotsMetaTag = false,
    initializeSitemap = false,
    filterByCategories = false,
    filterByTags = false,
    filterByDate = false,
  } = {}
) {
  it(`Configuring target workspace in ${app}`, updateRetry(2), () => {
    cy.getVtexItems().then(vtex => {
      // Define constants
      const APP_NAME = 'vtex.apps-graphql'
      const APP_VERSION = '3.x'
      const APP = `${APP_NAME}@${APP_VERSION}`
      const CUSTOM_URL = `${vtex.baseUrl}/_v/private/admin-graphql-ide/v0/${APP}`
      const GRAPHQL_MUTATION =
        'mutation' +
        '($app:String,$version:String,$settings:String)' +
        '{saveAppSettings(app:$app,version:$version,settings:$settings){message}}'
      const QUERY_VARIABLES = {
        app,
        version,
        settings: `{\"bindingBounded\":${bindingBounded},\"displayShowRowsText\":${displayShowRowsText},\"ignoreRobotsMetaTag\":${ignoreRobotsMetaTag},\"initializeSitemap\":${initializeSitemap},\"filterByCategories\":${filterByCategories},\"filterByTags\":${filterByTags},\"filterByDate\":${filterByDate},\"endpoint\": "${endpoint}\",\"titleTag\":"${titleTag}"}`,
      }
      // Mutating it to the new workspace
      cy.request({
        method: 'POST',
        url: CUSTOM_URL,
        ...FAIL_ON_STATUS_CODE,
        body: {
          query: GRAPHQL_MUTATION,
          variables: QUERY_VARIABLES,
        },
      }).its('body.data.saveAppSettings.message', { timeout: 10000 })
    })
  })
}
