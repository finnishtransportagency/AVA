describe('ava/Hanketiedot/Paikkatieto', () => {
  it('Navigation works to ava/Hanketiedot/Paikkatieto and back to /ava  ', () => {
    cy.visit('/')

    let waitTimeout = 500;

    let rowIndex = `0`;
    cy.getFolderRow(rowIndex).click()
    cy.wait(waitTimeout)
    cy.getFolderRow(rowIndex).click()

    cy.wait(waitTimeout)
    cy
      .getFileRow(rowIndex)
      .should('exist')

    cy.goBack()

    cy.goBack()
    cy.wait(waitTimeout)
    cy.get("#result")
      .getAgGridData()
      .then((actualTableData) => {
        cy.wrap(actualTableData).should('have.length.above',1)
      });
  })
})