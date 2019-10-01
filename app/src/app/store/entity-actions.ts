import {Action} from '@ngrx/store';
import {Filter} from './entity-reducers';


export const SET_SINGLE_ENTITY = 'SET_SINGLE_ENTITY';
export const SET_ALL_ENTITIES = 'SET_ALL_ENTITIES';
export const GET_SINGLE_ENTITY = 'GET_SINGLE_ENTITY';
export const FETCH_SINGLE_ENTITY_BY_ID = 'FETCH_SINGLE_ENTITY_BY_ID';
export const FETCH_ALL_ENTITIES = 'FETCH_ALL_ENTITIES';
export const SET_EDITED_ID_ON_ENTITY_LEVEL = 'SET_EDITED_ID_ON_ENTITY_LEVEL';
export const UPDATE_ENTITY = 'UPDATE_ENTITY';
export const UPDATE_ENTITY_SUCCESS = 'UPDATE_ENTITY_SUCCESS';
export const UPDATE_ENTITY_FAILED = 'UPDATE_ENTITY_FAILED';
export const CREATE_ENTITY = 'CREATE_ENTITY';
export const CREATE_ENTITY_SUCCESS = 'CREATE_ENTITY_SUCCESS';
export const CREATE_ENTITY_FAILED = 'CREATE_ENTITY_FAILED';
export const DELETE_ENTITY = 'DELETE_ENTITY';
export const SET_ENTITY_CREATE_PENDING = 'SET_ENTITY_CREATE_PENDING';
export const SET_ENTITY_UPDATE_PENDING = 'SET_ENTITY_UPDATE_PENDING';
export const RESET_EDITED_IDS_ON_ENTITY_LEVEL = 'RESET_EDITED_IDS_ON_ENTITY_LEVEL';
export const SET_EDITED_ID_ON_TOP_LEVEL = 'SET_EDITED_ID_ON_TOP_LEVEL';
export const ADD_FILTER = 'ADD_FILTER';
export const CONFIRM_ENTITY_DELETION = 'CONFIRM_ENTITY_DELETION';
export const SET_ENTITY_DELETE_PENDING = 'SET_ENTITY_DELETE_PENDING';
export const SET_ENTITY_FETCH_PENDING = 'SET_ENTITY_FETCH_PENDING';
export const DELETE_ENTITY_SUCCESS = 'DELETE_ENTITY_SUCCESS';
export const DELETE_ENTITY_FAILED = 'DELETE_ENTITY_FAILED';
export const SET_ENTITY_CREATE_MODE = 'SET_ENTITY_CREATE_MODE';


export class FetchSingleEntityById implements Action {

  readonly type = FETCH_SINGLE_ENTITY_BY_ID;

  constructor(public payload: { tag: string, id: string, url }) {
  }
}

export class SetEditedIdOnEntityLevel implements Action {

  readonly type = SET_EDITED_ID_ON_ENTITY_LEVEL;

  constructor(public payload: { tag: string, id: string }) {
  }
}

export class SetSingleEntity implements Action {

  readonly type = SET_SINGLE_ENTITY;

  constructor(public payload: { tag: string, entity }) {
  }
}

export class FetchAllEntities implements Action {

  readonly type = FETCH_ALL_ENTITIES;

  constructor(public payload: { tag: string, query, url }) {
  }
}

export class SetAllEntities implements Action {

  readonly type = SET_ALL_ENTITIES;

  constructor(public payload: { tag: string, entities }) {
  }
}

export class GetSingleEntity implements Action {

  readonly type = GET_SINGLE_ENTITY;

  constructor(public payload: number) {
  }
}

export class UpdateEntity implements Action {

  readonly type = UPDATE_ENTITY;

  constructor(public payload: { tag: string, entity }) {
  }
}

export class UpdateEntitySuccess implements Action {

  readonly type = UPDATE_ENTITY_SUCCESS;

  constructor(public payload) {
  }
}

export class SetEntityCreatePending implements Action {

  readonly type = SET_ENTITY_CREATE_PENDING;

  constructor(public payload: { tag: string, isPending: boolean }) {
  }
}

export class SetEntityUpdatePending implements Action {

  readonly type = SET_ENTITY_UPDATE_PENDING;

  constructor(public payload: { tag: string, isPending: boolean }) {
  }
}

export class UpdateEntityFailed implements Action {

  readonly type = UPDATE_ENTITY_FAILED;

  constructor() {
  }
}

export class CreateEntity implements Action {

  readonly type = CREATE_ENTITY;

  constructor(public payload: { tag: string, entity, url }) {
  }
}

export class CreateEntitySuccess implements Action {

  readonly type = CREATE_ENTITY_SUCCESS;

  constructor(public payload: { tag: string, entity }) {
  }
}

export class CreateEntityFailed implements Action {

  readonly type = CREATE_ENTITY_FAILED;

  constructor() {
  }
}

export class SetEntityCreateMode implements Action {

  readonly type = SET_ENTITY_CREATE_MODE;

  constructor(public payload: { tag: string, isActive: boolean }) {
  }
}

export class AddFilter implements Action {

  readonly type = ADD_FILTER;

  constructor(public payload: { tag: string, filter: Filter }) {
  }
}

export class ResetEditedIdsOnEntityLevel implements Action {

  readonly type = RESET_EDITED_IDS_ON_ENTITY_LEVEL;

  constructor() {
  }
}

export class SetEditedIdOnTopLevel implements Action {

  readonly type = SET_EDITED_ID_ON_TOP_LEVEL;

  constructor(public payload: { tag: string, id }) {
  }
}

export class DeleteEntity implements Action {

  readonly type = DELETE_ENTITY;

  constructor(public payload: { tag: string, id: number }) {
  }
}

export class SetEntityDeletePending implements Action {

  readonly type = SET_ENTITY_DELETE_PENDING;

  constructor(public payload: { tag: string, isPending: boolean }) {
  }
}

export class SetEntityFetchPending implements Action {

  readonly type = SET_ENTITY_FETCH_PENDING;

  constructor(public payload: { tag: string, isPending: boolean }) {
  }
}

export class ConfirmEntityDeletion implements Action {

  readonly type = CONFIRM_ENTITY_DELETION;

  constructor(public payload: { tag: string, id: number }) {
  }
}

export class DeleteEntitySuccess implements Action {

  readonly type = DELETE_ENTITY_SUCCESS;

  constructor(public payload: { tag: string }) {
  }
}

export class DeleteEntityFailed implements Action {

  readonly type = DELETE_ENTITY_FAILED;

  constructor(public payload: { tag: string }) {
  }
}

export type EntityActions = SetSingleEntity
  | FetchSingleEntityById
  | GetSingleEntity
  | FetchAllEntities
  | SetEditedIdOnEntityLevel
  | UpdateEntity
  | UpdateEntitySuccess
  | UpdateEntityFailed
  | CreateEntity
  | CreateEntityFailed
  | SetEntityCreatePending
  | CreateEntitySuccess
  | SetEntityUpdatePending
  | AddFilter
  | ResetEditedIdsOnEntityLevel
  | SetEditedIdOnTopLevel
  | DeleteEntity
  | SetEntityDeletePending
  | ConfirmEntityDeletion
  | DeleteEntitySuccess
  | DeleteEntityFailed
  | SetEntityCreateMode
  | SetEntityFetchPending
  | SetAllEntities;
