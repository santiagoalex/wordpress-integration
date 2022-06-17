import selectors from './common/selectors'

Cypress.Commands.add('openStoreFront', (login = false) => {
    cy.intercept('**/rc.vtex.com.br/api/events').as('events')
    cy.visit('/')
    cy.wait('@events')
    // Page loads heart icon only on scroll
    // So, scroll first then look for selectors
    cy.scrollTo(0, 800)
    cy.wait(1000)
    cy.scrollTo(0, -200)
    if (login === true) {
      cy.get(selectors.ProfileLabel, { timeout: 20000 })
        .should('be.visible')
        .should('have.contain', `Hello,`)
    }
  })
