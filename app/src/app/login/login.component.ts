import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {ofType} from '@ngrx/effects';
import {ActionsSubject, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AppState} from '../store';
import {AUTH_SUCCESS, AuthSuccess, LoginUser} from '../store/auth.actions';
import {ForgotPasswordDialogComponent} from './forgot-password-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public router: Router,
              private $store: Store<AppState>,
              private actionsSubject: ActionsSubject,
              private dialog: MatDialog) {
  }

  form: FormGroup;

  subs: Subscription[] = [];

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
    });

    const sub1 = this.actionsSubject
      .pipe(ofType(AUTH_SUCCESS), tap((action: AuthSuccess) => {
        if (action.payload.roles.has('admin')) {
          this.router.navigate(['/admin']);
          return;
        }
        this.router.navigate(['/']);
      }))
      .subscribe();

    this.subs.push(sub1);
  }

  forgotPassword() {
    this.dialog.open(ForgotPasswordDialogComponent)
  }

  onSubmit() {
    this.$store.dispatch(new LoginUser(this.form.value));
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
