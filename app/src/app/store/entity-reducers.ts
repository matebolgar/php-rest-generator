import {select, Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {AppState} from '.';
import * as Actions from './entity-actions';
import {buildTree, objectValue} from './utils';

export interface Filter {
  key: string
  operator: 'eq' | 'neq' | 'like'
  value: any
}

const empty = {
  all: [],
  single: {},
  editedId: '',
  isCreateModeActive: false,
  isCreatePending: false,
  isUpdatePending: false,
  isFetchPending: false,
  filters: {},
  filtered: [],
};

export class EntityHandler {

  operatorMap = {
    'eq': (key, value) => item => item[key] === value,
    'neq': (key, value) => item => item[key] !== value,
    'like': (key, value) => item => item[key].includes(value)
  };
  relationMap = {
    'and': (left, right) => left && right,
    'or': (left, right) => left || right,
  };

  constructor(public tag: string, private store$: Store<AppState>) {
  }

  setSingle(oneEntity) {
    this.store$.dispatch(new Actions.SetSingleEntity({tag: this.tag, entity: oneEntity}));
  }

  setAll(entities) {
    this.store$.dispatch(new Actions.SetAllEntities({tag: this.tag, entities: entities}));

  }

  fetchAll(query = {}, url = this.tag) {
    this.store$.dispatch(new Actions.FetchAllEntities({
      tag: this.tag,
      url: url,
      query,
    }));
  }

  fetchSingle(id, url = this.tag) {
    this.store$.dispatch(new Actions.FetchSingleEntityById({tag: this.tag, id: id, url: url}));
  }

  relationFilter = relation =>
    (operation, operation2) =>
      val =>
        relation(operation(val), operation2(val));


  and = (left, right) => ({relation: 'and', left, right});

  or = (left, right) => ({relation: 'or', left, right});

  clause = (key, operator, value) => ({key, operator, value});

  getAll(filter ?: any) {
    const all = this.store$.pipe(
      select(store => objectValue([
        'entity',
        this.tag,
        'filtered',
      ], store, [])),
    );

    return !filter ?
      all :
      all.pipe(
        map(items => {

          if (filter.relation) {
            const left = this.operatorMap[filter.left.operator](filter.left.key, filter.left.value);
            const right = this.operatorMap[filter.right.operator](filter.right.key, filter.right.value);
            const relationFilter = this.relationFilter(this.relationMap[filter.relation])(left, right);

            return items.filter(relationFilter);

          } else {
            return items.filter(this.operatorMap[filter.operator](filter.key, filter.value));
          }
        }),
      );
  }

  getAllAsTree(tag) {
    return this.getAll().pipe(map(buildTree('id', 'f_' + tag + '_id')));
  }

  addFilter(filter: Filter) {
    this.store$.dispatch(new Actions.AddFilter({tag: this.tag, filter: filter}));
  }

  getEditedId() {
    return this.store$.pipe(select(store => objectValue([
      'entity',
      this.tag,
      'editedId',
    ], store, 0)));
  }

  setEditedId(id) {
    this.resetAllEditedIds();
    this.store$.dispatch(new Actions.SetEditedIdOnEntityLevel({tag: this.tag, id: id}));
  }

  enableCreateMode() {
    this.store$.dispatch(new Actions.SetEntityCreateMode({tag: this.tag, isActive: true}));
  }

  disableCreateMode() {
    this.store$.dispatch(new Actions.SetEntityCreateMode({tag: this.tag, isActive: false}));
  }

  resetAllEditedIds() {
    this.store$.dispatch(new Actions.ResetEditedIdsOnEntityLevel());
  }

  setEditedEntityOnTopLevel(id, tag = '') {
    tag ?
      this.store$.dispatch(new Actions.SetEditedIdOnTopLevel({tag: tag, id: id})) :
      this.store$.dispatch(new Actions.SetEditedIdOnTopLevel({tag: this.tag, id: id}));
  }

  getEditedEntityOnTopLevel() {
    return this.store$.pipe(select(store => objectValue([
      'entity', 'edited'
    ], store, -1)));
  }

  getEditedEntityIdOnTopLevel() {
    return this.store$.pipe(select(store => objectValue([
      'entity', 'edited', 'id'
    ], store, null)));
  }


  resetEditedEntityOnTopLevel() {
    this.store$.dispatch(new Actions.SetEditedIdOnTopLevel({tag: '', id: ''}));
  }

  getSingle(tag = '') {
    return this.store$.pipe(select(store => objectValue([
      'entity',
      tag ? tag : this.tag,
      'single',
    ], store, {})));
  }

  update(entity) {
    this.store$.dispatch(new Actions.UpdateEntity({tag: this.tag, entity: entity}));
  }

  create(entity, url = this.tag) {

    this.store$.dispatch(new Actions.CreateEntity({
      tag: this.tag,
      entity: entity,
      url: url
    }));
  }

  delete(id) {
    this.store$.dispatch(new Actions.DeleteEntity({tag: this.tag, id: id}));
  }

  isCreatePending() {
    return this.store$.pipe(select(store => objectValue([
      'entity',
      this.tag,
      'isCreatePending',
    ], store, false)));
  }

  isUpdatePending() {
    return this.store$.pipe(select(store => objectValue([
      'entity',
      this.tag,
      'isUpdatePending',
    ], store, false)));
  }

  isFetchPending() {
    return this.store$.pipe(select(store => objectValue([
      'entity',
      this.tag,
      'isFetchPending',
    ], store, false)));
  }

  isCreateModeActive() {
    return this.store$.pipe(select(store => objectValue([
      'entity',
      this.tag,
      'isCreateModeActive',
    ], store, false)));
  }

}

const operatorMap = {
  'eq': (key, value) => item => item[key] === value,
  'neq': (key, value) => item => item[key] !== value,
  'like': (key, value) => item => item[key].toLowerCase().includes(value.toLowerCase()),
};

const initialState = {
  edited: {tag: '', id: ''}
};

export function entityReducer(state = initialState, action: Actions.EntityActions) {

  switch (action.type) {
    case Actions.SET_SINGLE_ENTITY:
      return state[action.payload.tag] ?
        {
          ...state,
          [action.payload.tag]: {
            ...state[action.payload.tag],
            single: action.payload.entity
          }
        } :
        {
          ...state,
          [action.payload.tag]: {
            ...empty,
            single: action.payload.entity
          }
        };

    case Actions.SET_ALL_ENTITIES:
      return state[action.payload.tag] ?
        {
          ...state,
          [action.payload.tag]: {
            ...state[action.payload.tag],
            all: [...action.payload.entities],
            filtered: [...action.payload.entities],
          }
        } :
        {
          ...state,
          [action.payload.tag]: {
            ...empty,
            all: [...action.payload.entities],
            filtered: [...action.payload.entities],
          }
        };

    case Actions.SET_EDITED_ID_ON_ENTITY_LEVEL:
      return state[action.payload.tag] ? {
          ...state,
          [action.payload.tag]: {
            ...state[action.payload.tag],
            editedId: action.payload.id
          }
        } :
        {
          ...state,
          [action.payload.tag]: {
            ...empty,
            editedId: 0
          }
        };

    case Actions.SET_ENTITY_CREATE_PENDING:
      return {
        ...state,
        [action.payload.tag]: {
          ...state[action.payload.tag],
          isCreatePending: action.payload.isPending
        }
      };

    case Actions.SET_ENTITY_UPDATE_PENDING:
      return {
        ...state,
        [action.payload.tag]: {
          ...state[action.payload.tag],
          isUpdatePending: action.payload.isPending
        }
      };

    case Actions.SET_ENTITY_DELETE_PENDING:
      return {
        ...state,
        [action.payload.tag]: {
          ...state[action.payload.tag],
          isDeletePending: action.payload.isPending
        }
      };

    case Actions.SET_ENTITY_FETCH_PENDING:
      return {
        ...state,
        [action.payload.tag]: {
          ...state[action.payload.tag],
          isFetchPending: action.payload.isPending
        }
      };

    case Actions.ADD_FILTER:
      return {
        ...state,
        [action.payload.tag]: {
          ...state[action.payload.tag],
          filters: {
            ...state[action.payload.tag].filters,
            [action.payload.filter.operator]: action.payload.filter
          },
          filtered: state[action.payload.tag].all
            .filter(item =>
              Object.values({
                ...state[action.payload.tag].filters,
                [action.payload.filter.operator]: action.payload.filter
              })
                .every((filter: Filter) =>
                  operatorMap[filter.operator](filter.key, filter.value)(item))
            )
        }
      };

    case Actions.SET_ENTITY_CREATE_MODE:
      return {
        ...state,
        [action.payload.tag]: {
          ...state[action.payload.tag],
          isCreateModeActive: action.payload.isActive
        }
      };
    case Actions.RESET_EDITED_IDS_ON_ENTITY_LEVEL:
      return Object
        .entries(state)
        .reduce((st, [tag, v]) =>
          ({
            ...st,
            [tag]: Object
              .entries(v)
              .reduce((acc, [ek, ev]) => ({...acc, [ek]: ev, editedId: ''}), {})
          }), {});
    case Actions.SET_EDITED_ID_ON_TOP_LEVEL:
      return {
        ...state,
        edited: {
          tag: action.payload.tag,
          id: action.payload.id,
        }
      };
    default:
      return state;
  }


}
