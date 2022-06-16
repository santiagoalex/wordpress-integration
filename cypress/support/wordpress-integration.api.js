import { updateRetry } from './common/support'
import { sitemapAPI, blogPostAPI, blogPostCategoriesAPI } from './product.api'

export function verifySitemap() {
  it('verify the sitemap', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then(vtex => {
      cy.log(vtex.baseUrl)
      cy.getAPI(sitemapAPI(vtex.baseUrl)).then(response => {
        expect(response.status).to.equal(200)
      })
    })
  })
}

export function verifySitemapBlogpost() {
  it('verify the sitemap blogpost', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then(vtex => {
      cy.getAPI(blogPostAPI(vtex.baseUrl)).then(response => {
        expect(response.status).to.equal(200)
      })
    })
  })
}

export function verifySitemapBlogCategories() {
  it('verify the sitemap blogpost categories', updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then(vtex => {
      cy.getAPI(blogPostCategoriesAPI(vtex.baseUrl)).then(response => {
        expect(response.status).to.equal(200)
      })
    })
  })
}
