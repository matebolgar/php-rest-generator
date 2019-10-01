import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material';
import {ScNotificationDialogComponent} from './sc-notification-dialog.component';

@NgModule({
  imports: [
    MatButtonModule,
  ],
  declarations: [
    ScNotificationDialogComponent
  ],
  exports: [
    ScNotificationDialogComponent
  ]
})

export class ScNotificationModule {

}