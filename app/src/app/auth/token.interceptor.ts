import {HttpClient, HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {AuthenticationService} from '../login/authentication.service';
import {Tokens} from '../store/auth.effects';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  isLogin = url => url.search(/login/gi) !== -1;
  refreshToken = (request: HttpRequest<any>, next: HttpHandler) => {
    return this.http.post<Tokens>(
      `${environment.authUrl}/refresh`,
      {
        refreshToken: this.authService.getRefreshToken(),
      }
    )
      .pipe(
        switchMap((tokens: Tokens) => {
          this.authService.setAccessToken(tokens.accessToken);
          // this.authService.setRefreshToken(tokens.refreshToken);
          return next.handle(this.withTokenAddedToHeader(request, tokens.accessToken));
        }),
        catchError(err => {
          this.router.navigate(['/']);
          return throwError(err);
        }),
      );
  };
  withTokenAddedToHeader = (request: HttpRequest<any>, token: string): HttpRequest<any> => {
    return request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
  };

  constructor(private authService: AuthenticationService, private router: Router, private http: HttpClient) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    if (this.isLogin(request.url)) {
      return next.handle(request);
    }

    return next.handle(this.withTokenAddedToHeader(request, this.authService.getAccessToken()))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>err).status) {
              case 401:
                return this.refreshToken(request, next);
              default:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        }));
  }
}
