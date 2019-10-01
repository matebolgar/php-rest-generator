import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material';
import {of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {ScNotificationDialogComponent} from '../sc-notification-dialog/sc-notification-dialog.component';

@Component({
  selector: 'app-forgot-password-dialog',
  template: `
    <div mat-dialog-title>
      <div class="row">
        <div class="col-12">
          Please give your email address
        </div>
        <hr>
      </div>
    </div>
    <mat-dialog-content>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-3">
        <div class="form-group">
          <input
              formControlName="email"
              email
              matInput
              placeholder="'Email'"
              class="form-control border border-secondary"
          >
        </div>
        <button
            mat-flat-button
            color="primary"
            type="submit"
            [disabled]="!form.valid"
        >
          <i class="fa fa-save"></i> Send
        </button>
        <!--<ng-container *ngIf="isPending$ | async">-->
        <!--<mat-spinner [diameter]="30" class="float-right"></mat-spinner>-->
        <!--</ng-container>-->
      </form>
    </mat-dialog-content>
  `
})

export class ForgotPasswordDialogComponent {

  constructor(public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
              private http: HttpClient,
              private dialog: MatDialog) {

  }

  form = new FormGroup({email: new FormControl('', Validators.required)});

  onSubmit() {
    this.http.post(`${environment.authUrl}/forgot-password`, this.form.value)
      .pipe(
        map(() => this.dialog.open(ScNotificationDialogComponent, {
          data: {
            buttonText: 'OK',
            title: 'Success',
            content: 'A verification message has been sent, please check your email'
          }
        })
          .afterClosed()),
        tap(() => {
          this.dialogRef.close()
        }),
        catchError(() => this.dialog.open(ScNotificationDialogComponent, {
          data: {
            buttonText: 'OK',
            title: 'Error',
            content: 'Invalid email'
          },
          width: '250px'
        })
          .afterClosed()),
      )
      .subscribe()

  }
}
