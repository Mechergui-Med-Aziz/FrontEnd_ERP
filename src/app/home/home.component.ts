import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  messageError = '';
  errorMessage = 'Password or login incorrect';
  token: any;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  loginn(): void {
    if (this.loginForm.invalid) {
      this.messageError = 'Please fill in all fields correctly.';
      return;
    }

    this.sharedService.login(this.loginForm.value)
      .subscribe(
        res => {
          this.token = res;
          const userId = this.token?.payload?._id;
          const userRole = this.token?.payload?.role;
          const userToken = this.token?.mytoken;

          if (userId) {
            localStorage.setItem('id', userId);
          }

          if (userRole === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/accueil']);
          }

          if (userToken) {
            localStorage.setItem('token', userToken);
          }

          this.loginForm.reset();
        },
        err => {
          console.error(err);
          this.messageError = this.errorMessage;
        }
      );
  }
}