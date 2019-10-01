import {ActionReducerMap} from '@ngrx/store';
import * as fromAuth from './auth.reducers';
import * as fromEntity from './entity-reducers';

export interface AppState {
  entity
  auth
}

export const reducers: ActionReducerMap<AppState> = {
  entity: fromEntity.entityReducer,
  auth: fromAuth.authReducers,
};
