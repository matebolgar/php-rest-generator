import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../login/authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  canActivate(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.auth.isAuthenticated()) {
        resolve(true);
      } else {
        this.router.navigate(['/login']);
        resolve(false);
      }
    });
  }
}
