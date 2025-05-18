// cypress/e2e/besoins.spec.js
describe('Gestion des besoins (E2E)', () => {
    const baseUrl = 'http://localhost:4200';
    const username = 'aziz';
    const password = '123';
  
    beforeEach(() => {
      // 1) Connexion
      cy.visit(`${baseUrl}/login`);
      cy.get('input[formControlName="username"]').type(username);
      cy.get('input[formControlName="password"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/login');
  
      // 2) Aller sur la page des besoins
      cy.visit(`${baseUrl}/besoins`);
      cy.url().should('include', '/besoins');
    });
  
    it('addBesoin(besoin)', () => {
      // Ouvre le modal d’ajout
      cy.get('[data-cy="open-add-besoin"]').click();
  
      // Remplit le formulaire
      cy.get('input[formControlName="title"]').type('Besoin E2E');
      cy.get('textarea[formControlName="description"]').type('Description E2E');
      cy.get('select[formControlName="contact"]').select(0);        // valeur du contact
      cy.get('select[formControlName="priority"]').select('HAUTE');  // priorité
  
      // Valide
      cy.get('[data-cy="confirm-add-besoin"]').click();
  
      // Vérifie qu’il apparaît dans la liste
      cy.contains('Besoin E2E').should('be.visible');
    });
  
    it('saveChanges(besoin)', () => {
      // Repère la ligne du besoin
      cy.contains('Besoin E2E').parents('tr').as('ligneBesoin');
  
      // Cliquez sur “Modifier”
      cy.get('@ligneBesoin')
        .find('[data-cy="edit-besoin"]')
        .click();
  
      // Change titre & priorité
      cy.get('input[formControlName="title"]')
        .clear()
        .type('Besoin E2E Modifié');
      cy.get('select[formControlName="priority"]')
        .select('MOYENNE');
  
      // Sauvegarde
      cy.get('[data-cy="confirm-save-changes"]').click();
  
      // Vérifie la mise à jour
      cy.contains('Besoin E2E Modifié').should('be.visible');
    });
  
    it('addAction(action)', () => {
      // Sélectionne la ligne du besoin modifié

      cy.contains('Besoin E2E').parents('tr').as('ligneBesoin');
  
      // Cliquez sur “Modifier”
      cy.get('@ligneBesoin')
        .find('[data-cy="edit-besoin"]')
        .click();
  
      // Ouvre le modal d’action
      cy.get('[data-cy="open-add-action"]').click();
  
      // Remplit l’action
      cy.get('input[formControlName="description"]').type('Action E2E');
      cy.get('select[formControlName="typeAction"]').select(1);
  
      // Valide
      cy.get('[data-cy="confirm-add-action"]').click();
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
          cy.get('select[formControlName="typeActionbelongTo"]').select('Besoin');
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