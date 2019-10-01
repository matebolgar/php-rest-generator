import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {merge, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';

type NavLinks = { [key: string]: NavLink };

type NavLink = {
  label: string;
  url: string;
  isActive: boolean;
};

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: ['.border-bottom-white {border-bottom-color: white !important;}']
})
export class MainComponent {
  key = url => {
    if (new RegExp('\\/.+\\/data-entry$').test(url)) {
      return '/';
    }

    if (new RegExp('\\/.+\\/evaluation$').test(url)) {
      return '/';
    }
    return url;
  };

  init = {
    '/': {
      label: 'Dashboard',
      url: '/',
      isActive: false
    },
    // '/settings': {
    //   label: 'Settings',
    //   url: '/',
    //   isActive: false,
    // },
  };

  firstActive = of(Object.entries(this.init)
    .map(([k, v]) => k === this.key(this.router.url) ? {...v, isActive: true} : v));

  fromRouter = this.router
    .events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) =>
        Object.values(this.toActivated(this.init)(this.key(event.url))))
    );

  navLinks = merge(this.firstActive, this.fromRouter);

  toActivated = (links: NavLinks) => url => ({
    ...links,
    [url]: {...links[url], isActive: true}
  });

  constructor(private router: Router) {
  }
}
