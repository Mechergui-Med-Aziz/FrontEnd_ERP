import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  messageErro = '';
  message = 'password or login incorrect';

  constructor(
    private fb: FormBuilder,
    private _SharedService: SharedService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  token: any;
  loginn() {
    if (this.loginForm.invalid) {
      this.messageErro = 'Please fill in all fields correctly.';
      return;
    }

    this._SharedService.login(this.loginForm.value)
      .subscribe(
        res => {
          console.log(res);
          this.token = res;
          console.log(this.token.payload._id);
          localStorage.setItem('id', this.token.payload._id);

          if (this.token.payload.role == 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/accueil']);
          }
          localStorage.setItem('token', this.token.mytoken);
          this.loginForm.reset();
        },
        err => {
          console.log(err);
          this.messageErro = this.message;
        }
      );
  }
}
