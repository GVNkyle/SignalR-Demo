import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { User } from '../_core/models/user';
import { CustomNgSnotifyService } from '../_core/services/snotify.service';
import { UserService } from '../_core/services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: FormGroup;
  user: User = {
    account: '',
    email: '',
    password: ''
  };
  constructor(private fb: FormBuilder, public service: UserService, private snotify: CustomNgSnotifyService, private router: Router) {
    this.model = this.fb.group({
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.minLength(4), Validators.required]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(4)]]
    }, {
      validator: this.comparePassword('Password', 'ConfirmPassword')
    });
  }

  ngOnInit() { }

  register() {
    this.user.account = this.model.controls.UserName?.value;
    this.user.email = this.model.controls.Email?.value;
    this.user.password = this.model.controls.Password?.value;
    this.service.register(this.user).subscribe(e => {
      if (e.success) {
        this.snotify.success('register successfully', 'Success!');
        this.router.navigate(['/login']);
      } else {
        this.snotify.error(e.caption, 'Error');
      }
    })
  }

  comparePassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}
