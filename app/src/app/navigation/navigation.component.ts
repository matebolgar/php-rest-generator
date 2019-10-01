import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AuthenticationService} from '../login/authentication.service';
import {AppState} from '../store';
import {LogBackAsAdmin, LogoutUser} from '../store/auth.actions';

@Component({
  selector: 'app-navigation',
  templateUrl: 'navigation.component.html',
})

export class NavigationComponent {

  user$ = this.store$.pipe(select(store => store.auth.user));

  constructor(private router: Router,
              private store$: Store<AppState>,
              private authService: AuthenticationService) {
  }

  onLogout() {
    this.store$.dispatch(new LogoutUser());
    this.router.navigate(['/login']);
  }

  isLoggedInAsAdmin$ = this.authService.isLoggedInAsAdmin();

  backToAdmin() {
    this.store$.dispatch(new LogBackAsAdmin());
  }


}
