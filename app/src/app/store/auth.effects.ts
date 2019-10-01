import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {ActionsSubject, Store} from '@ngrx/store';
import * as JWT from 'jwt-decode';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AppState} from '.';
import {environment} from '../../environments/environment';
import {AuthenticationService} from '../login/authentication.service';
import * as PublicAuthActions from './auth.actions';
import * as AuthActions from './auth.actions';
import {
  AUTH_SUCCESS,
  LOG_BACK_AS_ADMIN,
  LOGOUT_USER,
  REGISTER_USER,
  RegisterUser,
  SetIsLoggedInAlsoAsAdmin,
  UPDATE_USER,
  UpdateUser
} from './auth.actions';

export const parseJwt = token => {
  try {
    return JWT(token);
  } catch (e) {
    return '';
  }
};

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface Claims {
  sub: string;
  roles: Set<string>;
}

@Injectable()
export class AuthEffects {

  @Effect({dispatch: false})
  login = this.actions$
    .pipe(
      ofType(AuthActions.LOGIN_USER),
      tap(() => this.store$.dispatch(new AuthActions.SetIsAuthPending(true))),
      switchMap((action: AuthActions.LoginUser) =>
        this.http
          .post<Tokens>(`${environment.authUrl}/login`, action.payload)
          .pipe(
            catchError((res: HttpErrorResponse) => {
              switch (res.error.error.code) {
                case 'NewPasswordRequiredException':
                  this.store$.dispatch(new AuthActions.NewPasswordRequired(action.payload.email));
                  break;
                default:
                  this.store$.dispatch(new AuthActions.AuthFailed(res.error.error.message));
                  break;
              }

              this.store$.dispatch(new AuthActions.SetIsAuthPending(false));
              return Observable.create(() => null);
            }),
            tap((tokens: Tokens) => {
              this.authService.setAccessToken(tokens.accessToken);
              this.authService.setRefreshToken(tokens.refreshToken);
            }),
            tap(() => this.store$.dispatch(new AuthActions.SetIsAuthPending(false))),
            map(tokens => parseJwt(tokens.accessToken)),
            tap(claims => this.store$.dispatch(new AuthActions.FetchUser(claims))),
          )
      ),
    );

  @Effect({dispatch: false})
  fetchUser = this.actions$
    .pipe(
      ofType(AuthActions.FETCH_USER),
      map((action: AuthActions.FetchUser) => action.payload),
      map(claims => ({...claims, roles: new Set(claims.roles)})),
      switchMap(claims => this.http
        .get<any>(`${environment.backUrl}/data_user/${claims.sub}`).pipe(
          switchMap(user => this.http.get<any>(`${environment.backUrl}/data_company/${user.f_data_company_id}`)
            .pipe(
              tap(company => this.store$.dispatch(new AuthActions.SetUser({
                ...user,
                name: user.l,
                company: company,
              }))),
              tap(() => this.store$.dispatch(new AuthActions.AuthSuccess(claims))),
            )),
        )),
    );

  @Effect({dispatch: false})
  logout = this.actions$.pipe(
    ofType(LOGOUT_USER),
    map(() => this.authService.getRefreshToken()),
    switchMap(token => this.http
      .post(`${environment.authUrl}/logout`, {refreshToken: token}).pipe(
        catchError(err => of(err))
      )),
    tap(() => this.authService.truncateCredentials()),
  );

  @Effect({dispatch: false})
  register = this.actions$.pipe(
    ofType(REGISTER_USER),
    switchMap((action: RegisterUser) => this.http
      .post(`${environment.authUrl}/register`, action.payload).pipe(
        catchError(err => of(err))
      )),
    tap((res) => this.store$.dispatch(new AuthActions.AuthSuccess(res))),
  );

  @Effect({dispatch: false})
  logBackAsAdmin = this.actions$
    .pipe(
      ofType(LOG_BACK_AS_ADMIN),
      tap(() => this.store$.dispatch(new AuthActions.SetIsAuthPending(true))),
      tap(() => this.authService.logBackToAdmin()),
      switchMap(() => this.http
        .post<Tokens>(`${environment.authUrl}/refresh`,
          {refreshToken: this.authService.getRefreshToken()}
        )
        .pipe(
          tap((tokens: Tokens) => {
            this.authService.setAccessToken(tokens.accessToken);
            this.store$.dispatch(new SetIsLoggedInAlsoAsAdmin(false));
          })
        )),
      map(tokens => parseJwt(tokens.accessToken)),
      tap(claims => this.store$.dispatch(new PublicAuthActions.FetchUser(claims))),
      switchMap(() => this.actionsSubject.pipe(ofType(AUTH_SUCCESS))),
      tap(() => this.store$.dispatch(new AuthActions.SetIsAuthPending(false))),
      tap(() => this.router.navigate(['/admin'])),
    );

  @Effect({dispatch: false})
  updateUser = this.actions$.pipe(
    ofType(UPDATE_USER),
    switchMap((action: UpdateUser) => this.http
      .put(`${environment.authUrl}/users/${action.payload.id}`, action.payload)
      .pipe(catchError(() => of({})))
    ),
    tap(asd => console.log(asd)),
    tap((res: any) => this.store$.dispatch(new PublicAuthActions.FetchUser({
      sub: res.id
    })))
  );

  constructor(private actions$: Actions,
              private store$: Store<AppState>,
              private http: HttpClient,
              private authService: AuthenticationService,
              private actionsSubject: ActionsSubject,
              private router: Router) {
  }
}
