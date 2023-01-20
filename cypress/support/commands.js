// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import "cypress-ag-grid";

/**
 * @memberof cy
 * @method getFolderRow
 * @param {string} rowIndex
 * @param {*} [args]
 * @returns Chainable
 */
Cypress.Commands.add('getFolderRow', (rowIndex) => {
  return cy
    .get(`div[row-index="${rowIndex}"] div.ag-cell-value`,{
      timeout: 10000
    })
    .first()
    .find(`.data-wrapper`)
    .find(`a`)
})

/**
 * @memberof cy
 * @method getFileRow
 * @param {string} rowIndex
 * @param {*} [args]
 * @returns Chainable
 */
Cypress.Commands.add('getFileRow', (rowIndex) => {
  return cy
    .get(`div[row-index="${rowIndex}"] div.ag-cell-value`)
    .first()
    .find(`.data-wrapper`)
    .find(`span`)
})

/**
 * @memberof cy
 * @method goBack
 * @param {*} [args]
 * @returns Chainable
 */
Cypress.Commands.add('goBack', () => {
  return cy
    .get(`div.ag-cell[col-id="tiedosto"] > * .fa-arrow-left`)
    .first()
    .click()
})