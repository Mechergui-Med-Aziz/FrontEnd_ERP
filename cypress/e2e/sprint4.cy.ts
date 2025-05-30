describe('Gestion des CRM (E2E)', () => {
    const baseUrl = 'http://localhost:4200';
    const username = 'ahmed';
    const password = '123';
  
    beforeEach(() => {
      // 1) Connexion
      cy.visit(`${baseUrl}/login`);
      cy.get('input[formControlName="username"]').type(username);
      cy.get('input[formControlName="password"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/login');
  
      // 2) Aller sur la page des besoins
      cy.visit(`${baseUrl}/company`);
      cy.url().should('include', '/company');
    });
  
    it('filter(companyName)', () => {
      // Ouvre le modal d’ajout
      cy.get('[data-cy="filter-company-button"]').click();
  cy.get('select[data-cy="filter-company-select"]').select('Nom du société');  
      // Remplit le formulaire
      cy.get('input[formControlName="company"]').type('talys');
     
      // Valide
      cy.get('[data-cy="confirm-filter-company-button"').click();
  
      // Vérifie qu’il apparaît dans la liste
      cy.contains('talys').should('be.visible');
    });


     it('filter(dateprecise)', () => {
            // Ouvre le modal d’ajout
            cy.get('[data-cy="filter-company-button"]').click();
  cy.get('select[data-cy="filter-company-select"]').select('Date précise');  
      // Remplit le formulaire avec format YYYY-MM-DD qui est accepté par les champs de type date
      cy.get('input[formControlName="dateExact"]').type('2025-04-16');
     
      // Valide
      cy.get('[data-cy="confirm-filter-company-button"').click();
  
      // Vérifie qu’il apparaît dans la liste
      cy.contains('talys').should('be.visible');
          });

   
  
  
    
     

    

  });