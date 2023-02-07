describe('avatest', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays väylävirasto logo', () => {
    cy.get('img').should('have.attr', 'src','/static/media/vayla_sivussa_fi_sv_rgb.a989d5a2b7ac93ab1d33.png')
  })

  it('changes language, then checks h1 content', () => {
    // Suomi, Svenska, English
    cy.get('[class^="lang-buttons"]').find('[class^="lang-btn"]').contains('Suomi').click()
    cy.contains('h1#content', 'Väylävirasto - Aineiston välitysalusta')
    cy.get('[class^="lang-buttons"]').find('[class^="lang-btn"]').contains('Svenska').click()
    cy.contains('h1#content', 'Trafikledsverket - Förmedlingstjänst för öppna data')
    cy.get('[class^="lang-buttons"]').find('[class^="lang-btn"]').contains('English').click()
    cy.contains('h1#content', 'Finnish Transport Infrastructure Agency - Forwarding service for open data')
  })
  
  it('displays correct logo according to selected language', () => {
    // Suomi & Svenska are the same. English has own logo.
    cy.get('[class^="lang-buttons"]').find('[class^="lang-btn"]').contains('Suomi').click()
    cy.get('img').should('have.attr', 'src','/static/media/vayla_sivussa_fi_sv_rgb.a989d5a2b7ac93ab1d33.png')
    cy.get('[class^="lang-buttons"]').find('[class^="lang-btn"]').contains('Svenska').click()
    cy.get('img').should('have.attr', 'src','/static/media/vayla_sivussa_fi_sv_rgb.a989d5a2b7ac93ab1d33.png')
    cy.get('[class^="lang-buttons"]').find('[class^="lang-btn"]').contains('English').click()
    cy.get('img').should('have.attr', 'src','/static/media/logo_en.a70d9a107b1b2071b3b7.png')
  })

  it('browses directory tree', () => {
    cy.get('[title^="ava/Hanketiedot"]', {timeout:15000}).click()
  })


})