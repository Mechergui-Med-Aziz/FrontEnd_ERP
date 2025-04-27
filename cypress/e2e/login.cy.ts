describe('Authentification et Gestion des Utilisateurs', () => {

    it(' login', () => {
      cy.visit('http://localhost:4200/login'); // adapte si l'URL est différente
  
      cy.get('input[formControlName="username"]').type('ahmed');
      cy.get('input[formControlName="password"]').type('123');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('not.include', '/login'); // vérifie qu'on a bien été redirigé
    });
  
    it(' findAllUsers', () => {
      cy.visit('http://localhost:4200/login');
  
      cy.get('input[formControlName="username"]').type('ahmed');
      cy.get('input[formControlName="password"]').type('123');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('not.include', '/login');
  
      // Navigue vers la page où les utilisateurs sont affichés (adapte l'URL si besoin)
      cy.visit('http://localhost:4200/users-accounts');
  
      // Vérifie qu’il y a au moins un utilisateur affiché
      cy.get('tbody tr') // chaque ligne du tableau = 1 utilisateur
 // adapte ce sélecteur à ta structure HTML
        .should('have.length.greaterThan', 0);
    });
  
    it('updateUser', () => {
      cy.visit('http://localhost:4200/login');
  
      cy.get('input[formControlName="username"]').type('aziz');
      cy.get('input[formControlName="password"]').type('123');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('not.include', '/login');
  
      // Navigue vers la page d’édition utilisateur (modifie l’URL ou le bouton selon ton app)
      cy.visit('http://localhost:4200/profile');
  
      // Modifie les champs nécessaires
    // Vérifie que l'input email est bien visible et modifie sa valeur
    cy.get('input[formControlName="email"]').should('be.visible').clear().type('test@email.com');

    // Clique sur le bouton de sauvegarde
    cy.get('button.btn-sauvegarder').click();

  
      // Clique sur le bouton de mise à jour
      
  
    });
  
  });
  