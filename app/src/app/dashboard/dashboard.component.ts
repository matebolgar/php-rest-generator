import {Component, OnDestroy, OnInit} from '@angular/core';
import {filter, tap} from 'rxjs/operators';
import {ServiceFactory} from '../ServiceFactory';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})

export class DashboardComponent implements OnInit, OnDestroy {
  service = this.serviceFactory.createHandler('schema');

  editedSchema$ = this.service.getSingle()
    .pipe(filter(item => Object.keys(item).length > 0));

  isEdited$ = this.service.getEditedId();

  sub;

  constructor(public serviceFactory: ServiceFactory) {
  }

  ngOnInit() {
    this.sub = this.service.getEditedId()
      .pipe(
        filter(Boolean),
        tap(id => this.service.fetchSingle(id)),
      )
      .subscribe();
  }

  back = () => {
    this.service.disableCreateMode();
  };
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
