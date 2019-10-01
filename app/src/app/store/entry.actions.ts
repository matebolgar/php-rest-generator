import {Action} from '@ngrx/store';

export const FETCH_ENTIRES_BY_STATISTIC_ID = 'FETCH_ENTIRES_BY_STATISTIC_ID';
export const ADD_ENTRIES = 'ADD_ENTRIES';

export class FetchEntriesByStatisticId implements Action {
  type = FETCH_ENTIRES_BY_STATISTIC_ID;

  constructor(public payload) {

  }
}

export class AddEntries implements Action {
  type = ADD_ENTRIES;

  constructor(public payload) {

  }
}

export type EntryActions = FetchEntriesByStatisticId | AddEntries;
