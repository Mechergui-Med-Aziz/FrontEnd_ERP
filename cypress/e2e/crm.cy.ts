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
  
    it('saveChanges(company)', () => {
      // Ouvre le modal d’ajout
      cy.get('[data-cy="add-company-button"]').click();
  
      // Remplit le formulaire
      cy.get('input[formControlName="name"]').type('company E2E4');
     
    
      cy.get('input[formControlName="precise"]').type('E2E');
      cy.get('input[formControlName="filiales"]').type('E2E');
      
      cy.get('input[formControlName="address"]').type('E2E');
      
      cy.get('input[formControlName="email"]').type('E2E@gmail.com');
      cy.get('input[formControlName="phone"]').type('12345678');
      
      cy.get('[data-cy="status-dropdown"]').click();
      cy.get('mat-option').contains('Client').click();
      cy.get('[data-cy="sector-dropdown"]').click();
      cy.get('mat-option').contains('Assurance').click();
      cy.get('[data-cy="provenance-dropdown"]').click();
      cy.get('mat-option').contains('Client').click();
      cy.get('[data-cy="agency-dropdown"]').click();
      cy.get('mat-option').contains('BU-Conseil-France').click();
      

      // Valide
      cy.get('[data-cy="save-company-button"]').click();
  
      // Vérifie qu’il apparaît dans la liste
      cy.contains('company E2E').should('be.visible');
    });

    context('Contact', () => {
        beforeEach(() => {
          // après la gestion des besoins, on navigue vers les types d’actions
          cy.visit(`${baseUrl}/contact`);
          cy.url().should('include', '/contact');
        });

        it('saveChanges(contact)', () => {
            // Ouvre le modal d’ajout
            cy.get('[data-cy="add-contact-button"]').click();
        
            // Remplit le formulaire
            cy.get('select[name="companyname"]').select(1);

            cy.get('[data-cy="create-contact-button"]').click();
           
          
            cy.get('input[formControlName="lastname"]').type('contact E2E');
            cy.get('input[formControlName="firstname"]').type('E2E');
            
            cy.get('input[formControlName="address"]').type('E2E');
            
            cy.get('input[formControlName="email"]').type('E2E@gmail.com');
            cy.get('input[formControlName="phone"]').type('12345678');
            
            cy.get('[data-cy="service-dropdown"]').click();
            cy.get('mat-option').contains('Direction').click();
            cy.get('[data-cy="type-dropdown"]').click();
            cy.get('mat-option').contains('Acheteur').click();
            cy.get('[data-cy="provenance-dropdown"]').click();
            cy.get('mat-option').contains('Client').click();
            cy.get('[data-cy="agency-dropdown"]').click();
            cy.get('mat-option').contains('BU expertise France').click();
            cy.get('[data-cy="civility-dropdown"]').click();
            cy.get('mat-option').contains('Monsieur').click();
           
            
            // Click to open the dropdown (it's appended to body)
cy.get('p-multiSelect[formControlName="domains"]').click();

// Select options - adjust selector based on your actual options
cy.get('.p-multiselect-panel .p-multiselect-items li')
  .contains('maintenance') // Replace with actual option text
  .click();

// Select another option
cy.get('.p-multiselect-panel .p-multiselect-items li')
  .contains('webdesign')
  .click();

// Close the dropdown
cy.get('body').click(0, 0);


cy.get('p-multiSelect[formControlName="tools"]').click();

// Select options - adjust selector based on your actual options
cy.get('.p-multiselect-panel .p-multiselect-items li')
  .contains('CSS') // Replace with actual option text
  .click();

// Select another option
cy.get('.p-multiselect-panel .p-multiselect-items li')
  .contains('HTML')
  .click();

// Close the dropdown
cy.get('body').click(0, 0);
      
            // Valide
            cy.get('[data-cy="save-contact-button"]').click();
        
            // Vérifie qu’il apparaît dans la liste
            cy.contains('contact E2E').should('be.visible');
          });
          
    
        
      });
      
    
      context('Types d’actions', () => {
        beforeEach(() => {
          // après la gestion des besoins, on navigue vers les types d’actions
          cy.visit(`${baseUrl}/type-actions`);
          cy.url().should('include', '/type-actions');
        });
    
        it('addActionType(actionType)', () => {
          cy.get('[data-cy="open-add-type-action"]').click();
          cy.get('input[formControlName="typeActionName"]').type('TestAction');
          cy.get('select[formControlName="typeActionbelongTo"]').select('CRM');
          cy.get('[data-cy="confirm-add-type-action"]').click();
         
        });
    
        it('deleteActionType(id)', () => {
          // Repère la ligne du type qu’on vient d’ajouter
          cy.contains('TestAction').parents('tr').as('ligneType');
          // Clique sur le bouton supprimer
          cy.get('@ligneType').find('[data-cy="delete-type-action"]').click();
          // Confirme
          cy.get('[data-cy="confirm-delete-type-action"]').click();
        });
      });

    
  
  

  });