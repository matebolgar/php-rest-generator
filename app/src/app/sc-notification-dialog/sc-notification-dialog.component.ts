import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-login-failed-dialog',
  templateUrl: 'sc-notification-dialog.component.html'
})

export class ScNotificationDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title, buttonText, content },
    public dialogRef: MatDialogRef<ScNotificationDialogComponent>,
  ) {

  }

}
