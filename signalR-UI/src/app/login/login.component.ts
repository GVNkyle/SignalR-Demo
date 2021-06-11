import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../_core/models/user';
import { AuthService } from '../_core/services/auth.service';
import { CustomNgSnotifyService } from '../_core/services/snotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formModel = {
    UserName: '',
    Password: ''
  }
  constructor(private service: AuthService, private router: Router, private snotify: CustomNgSnotifyService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.service.loggedIn ? this.router.navigate(['/employees']) : ''
  }

  login(form: NgForm) {
    this.spinner.show()
    let user: User = {
      account: form.value.UserName,
      password: form.value.Password,
      email: ''
    };
    this.service.login(user).subscribe(() => {
      this.snotify.success('Login Success!!', '');
      this.router.navigate(['/employees']).then(() => {
        window.location.reload();
      });
      this.spinner.hide();
    }, err => {
      console.log(err);
      this.snotify.error('Login Failed', "");
      this.spinner.hide();
    })

  }
}
