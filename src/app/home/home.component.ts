import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';


import { C } from '@angular/cdk/keycodes';
import { SharedService } from '../shared.service';
import { fuseAnimations } from '../../@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '../../@fuse/components/alert';
import { Base64Service } from '../base64.service';

@Component({
  selector: 'app-home',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
 
    
  imports: [RouterLink, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule, FuseAlertComponent],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
  constructor(
      private _activatedRoute: ActivatedRoute,
      private _authService: AuthService,
      private _formBuilder: UntypedFormBuilder,
      private _router: Router,
      private base64Service: Base64Service

  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
      // Create the form
      this.signInForm = this._formBuilder.group({
          email: ['erp@talys.digital', [Validators.required, Validators.email]],
          password: ['admin', Validators.required],
          rememberMe: [''],
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signIn(): void {
      // Return if the form is invalid
      if (this.signInForm.invalid) {
          return;
      }

      // Disable the form
      this.signInForm.disable();

      // Hide the alert
      this.showAlert = false;
      const loginRequest = new LoginRequest();
      console.log(this.signInNgForm);
      loginRequest.password = this.signInForm.value.password;
      loginRequest.email = this.signInForm.value.email;

      // Sign in
      this._authService.signIn(loginRequest)
          .subscribe(
              (res) => {


                  // Set the redirect url.
                  // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                  // to the correct page after a successful sign in. This way, that url can be set via
                  // routing file and we don't have to touch here.
                  let redirectURL = '';

                  console.log('this._activatedRoute.snapshot.queryParamMap',res.user.lastLogin);
                  if (res.user.lastLogin && res.user.lastLogin != null) {
                      console.log('already')
                      redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                      this._router.navigateByUrl(redirectURL);
                  } else {
                      this._authService.signOut();
               
                      redirectURL =  '/reset-password';
                      console.log('first',res.user.id)
                      this._router.navigateByUrl(redirectURL+'?id='+this.base64Service.encode(res.user.id)+'&encryptOld='+this.base64Service.encode(res.user.password));
                  }



                  // Navigate to the redirect url
                  

              },
              (response) => {
                  // Re-enable the form

                  this.signInForm.enable();

                  // Reset the form
                  this.signInNgForm.resetForm();

                  // Set the alert
                  this.alert = {
                      type: 'error',
                      message: 'Wrong email or password',
                  };

                  // Show the alert
                  this.showAlert = true;
              },
          );
  }
}