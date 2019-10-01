import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTabsModule, MatTooltipModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects';
import {Store, StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {AngularFontAwesomeModule} from 'angular-font-awesome';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ContainerComponent} from './container/container.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthenticationService} from './login/authentication.service';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {NavigationComponent} from './navigation/navigation.component';
import {ScAlignMiddleModule} from './sc-align-middle/sc-align-middle.module';
import {SchemaCreateComponent} from './schema/schema-create.component';
import {SchemaEditComponent} from './schema/schema-edit.component';
import {SchemaListComponent} from './schema/schema-list.component';
import {serviceFactory, ServiceFactory} from './ServiceFactory';
import {reducers} from './store';
import {AuthEffects} from './store/auth.effects';
import {EntityEffects} from './store/entity-effects';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ScAlignMiddleModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    HttpClientModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([
      AuthEffects,
      EntityEffects,
    ]),
    StoreDevtoolsModule.instrument(),
    MatTabsModule,
    AngularFontAwesomeModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    NavigationComponent,
    ContainerComponent,
    DashboardComponent,
    SchemaCreateComponent,
    SchemaListComponent,
    SchemaEditComponent
  ],
  providers: [
    AuthenticationService,
    {
      provide: ServiceFactory,
      useFactory: serviceFactory,
      deps: [Store]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
