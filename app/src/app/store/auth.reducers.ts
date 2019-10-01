import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as Actions from './auth.actions';

export interface State {
  isLoginPending: boolean;
  isPasswordChangePending: boolean;
  user: { id: number, name: string, company: '' },
  isLoggedInAsAdmin: boolean
}

const initialState: State = {
  isLoginPending: false,
  isPasswordChangePending: false,
  user: {id: -1, name: '', company: ''},
  isLoggedInAsAdmin: false
};

export function authReducers(state = initialState, action: Actions.AuthActions) {
  switch (action.type) {
    case (Actions.SET_IS_LOGIN_PENDING):
      return {
        ...state,
        isLoginPending: action.payload
      };
    case (Actions.SET_IS_PASSWORD_CHANGE_PENDING):
      return {
        ...state,
        isPasswordChangePending: action.payload
      };
    case (Actions.SET_USER):
      return {
        ...state,
        user: action.payload
      };

    case (Actions.SET_IS_LOGGED_IN_AS_ADMIN):
      return {
        ...state,
        isLoggedInAsAdmin: action.payload
      };
    default:
      return state;
  }
}

export const selectAuth = createFeatureSelector<State>('auth');

export const isLoginPending = createSelector(
  selectAuth,
  (state: State) => state.isLoginPending
);

export const isPasswordChangePending = createSelector(
  selectAuth,
  (state: State) => state.isPasswordChangePending
);
