import {Action} from '@ngrx/store';
import {Claims} from './auth.effects';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const REGISTER_USER = 'REGISTER_USER';
export const SET_IS_LOGIN_PENDING = 'SET_IS_LOGIN_PENDING';
export const SET_IS_PASSWORD_CHANGE_PENDING = 'SET_IS_PASSWORD_CHANGE_PENDING';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILED = 'AUTH_FAILED';
export const AUTH_NEW_PASSWORD_REQUIRED = 'AUTH_NEW_PASSWORD_REQUIRED';
export const AUTH_UPDATE_PASSWORD = 'AUTH_UPDATE_PASSWORD';
export const SET_USER = 'SET_USER';
export const FETCH_USER = 'FETCH_USER';
export const SET_IS_LOGGED_IN_AS_ADMIN = 'SET_IS_LOGGED_IN_AS_ADMIN';
export const LOG_BACK_AS_ADMIN = 'LOG_BACK_AS_ADMIN';
export const UPDATE_USER = 'UPDATE_USER';

export interface Credentials {
  email: string;
  password: string;
}

export class LoginUser implements Action {
  readonly type = LOGIN_USER;

  constructor(public payload: Credentials) {
  }

}

export class SetIsAuthPending implements Action {
  readonly type = SET_IS_LOGIN_PENDING;

  constructor(public payload: boolean) {
  }
}

export class SetIsPasswordChangePending implements Action {
  readonly type = SET_IS_PASSWORD_CHANGE_PENDING;

  constructor(public payload: boolean) {
  }
}

export class AuthSuccess implements Action {
  readonly type = AUTH_SUCCESS;

  constructor(public payload?: Claims) {
  }

}

export class AuthFailed implements Action {
  readonly type = AUTH_FAILED;

  constructor(public payload: string) {
  }

}

export class NewPasswordRequired implements Action {
  readonly type = AUTH_NEW_PASSWORD_REQUIRED;

  constructor(public payload: string) {
  }

}

export interface ChangePasswordCredentials {
  email: string;
  password: string;
  newPassword: string;
}

export class UpdatePassword implements Action {
  readonly type = AUTH_UPDATE_PASSWORD;

  constructor(public payload: ChangePasswordCredentials) {
  }

}

export class SetUser implements Action {
  readonly type = SET_USER;

  constructor(public payload) {
  }

}

export class FetchUser implements Action {
  readonly type = FETCH_USER;

  constructor(public payload) {
  }

}

export class LogoutUser implements Action {
  readonly type = LOGOUT_USER;

  constructor() {
  }

}

export class RegisterUser implements Action {
  readonly type = REGISTER_USER;

  constructor(public payload) {
  }

}

export class SetIsLoggedInAlsoAsAdmin implements Action {
  readonly type = SET_IS_LOGGED_IN_AS_ADMIN;

  constructor(public payload: boolean) {
  }

}

export class LogBackAsAdmin implements Action {
  readonly type = LOG_BACK_AS_ADMIN;

  constructor() {
  }

}

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;

  constructor(public payload) {
  }

}

export type AuthActions = LoginUser |
  SetIsAuthPending |
  AuthSuccess |
  NewPasswordRequired |
  UpdatePassword |
  SetIsPasswordChangePending |
  SetUser |
  LogoutUser |
  FetchUser |
  RegisterUser |
  SetIsLoggedInAlsoAsAdmin |
  LogBackAsAdmin |
  UpdateUser |
  AuthFailed
