import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store';
import {RegisterUser, SetIsLoggedInAlsoAsAdmin, UpdateUser} from '../store/auth.actions';

@Injectable()
export class AuthenticationService {
  private accessTokenKey = 'marktumfrageAccessToken';
  private refreshTokenKey = 'marktumfrageRefreshToken';


  isAuthenticated = () => Boolean(this.getAccessToken());
  getAccessToken = () => localStorage.getItem(this.accessTokenKey);
  setAccessToken = token => localStorage.setItem(this.accessTokenKey, token);
  getRefreshToken = () => localStorage.getItem(this.refreshTokenKey);
  setRefreshToken = token => localStorage.setItem(this.refreshTokenKey, token);
  truncateCredentials = () => {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.copiedRefreshTokenKey);
    this.store$.dispatch(new SetIsLoggedInAlsoAsAdmin(false));
  };

  private copiedRefreshTokenKey = 'marktumfrageRefreshTokenCopied';

  loginAsSubscriber = () => {
    localStorage.setItem(this.copiedRefreshTokenKey, this.getRefreshToken());
    this.store$.dispatch(new SetIsLoggedInAlsoAsAdmin(true));
  };


  logBackToAdmin() {
    this.setRefreshToken(this.getCopiedRefreshToken());
    localStorage.removeItem(this.copiedRefreshTokenKey);
    localStorage.removeItem(this.accessTokenKey);
  }

  checkIfIsLoggedInAsAdmin = () => {
    if (this.getCopiedRefreshToken()) {
      this.store$.dispatch(new SetIsLoggedInAlsoAsAdmin(true));
    }
  };

  getCopiedRefreshToken = () => localStorage.getItem(this.copiedRefreshTokenKey);

  isLoggedInAsAdmin = () => this.store$.pipe(select(state => state.auth.isLoggedInAsAdmin));

  isAuthPending = () => this.store$.pipe(select(state => state.auth.isLoginPending));

  constructor(private store$: Store<AppState>, private http: HttpClient) {
  }

  getAuth = () => this.store$.pipe(select(store => store.auth));

  getUser = () => this.store$.pipe(select(store => store.auth.user));

  registerUser = user => this.store$.dispatch(new RegisterUser(user));

  updateUser = user => this.store$.dispatch(new UpdateUser(user))

}
