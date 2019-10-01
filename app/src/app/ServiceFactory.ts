import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from './store';
import {EntityHandler} from './store/entity-reducers';

@Injectable()
export class ServiceFactory {

  constructor(private store$: Store<AppState>) {
  }

  createHandler(tag): EntityHandler {
    return new EntityHandler(tag, this.store$);
  }

}

export const serviceFactory = store => ({
  createHandler: (tag) => {
    return new EntityHandler(tag, store);
  }
});


