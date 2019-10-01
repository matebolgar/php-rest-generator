import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {CreateEntitySuccess} from './entity-actions';
import * as EntityActions from './entity-actions';
import {AppState} from './index';

const isEmptyObject = obj => Object.entries(obj).length === 0 && obj.constructor === Object;

@Injectable()
export class EntityEffects {

  @Effect({dispatch: false})
  fetchById = this.actions$
    .pipe(
      ofType(EntityActions.FETCH_SINGLE_ENTITY_BY_ID),
      mergeMap((action: EntityActions.FetchSingleEntityById) =>
        this.http
          .get<any>(`${environment.backUrl}/${action.payload.url ? action.payload.url : action.payload.tag}/${action.payload.id}`)
          .pipe(
            map(res => ({tag: action.payload.tag, entity: res})),
            // catchError(() => of({}))
          )
      ),
      tap(entity => this.store$.dispatch(new EntityActions.SetSingleEntity(entity)))
    );

  @Effect({dispatch: false})
  fetch = this.actions$
    .pipe(
      ofType(EntityActions.FETCH_ALL_ENTITIES),
      tap((action: EntityActions.FetchAllEntities) =>
        this.store$.dispatch(new EntityActions.SetEntityFetchPending({
          tag: action.payload.tag,
          isPending: true
        }))),
      mergeMap((action: EntityActions.FetchAllEntities) =>
        this.http
          .get<any>(
            `${environment.backUrl}/${action.payload.url ? action.payload.url : action.payload.tag}${
              !isEmptyObject(action.payload.query) ?
                `?filters=${JSON.stringify(action.payload.query)}` :
                ''
              }`
          )
          .pipe(
            map(res => ({tag: action.payload.tag, entities: res})),
            tap(() =>
              this.store$.dispatch(new EntityActions.SetEntityFetchPending({
                tag: action.payload.tag,
                isPending: false
              }))),
            // catchError(() => of([]))
          )
      ),
      tap(res => {
        this.store$.dispatch(new EntityActions.SetAllEntities({
          tag: res.tag,
          entities: res.entities,
        }));
      })
    );

  @Effect({dispatch: false})
  update = this.actions$
    .pipe(
      ofType(EntityActions.UPDATE_ENTITY),
      tap((action: EntityActions.UpdateEntity) =>
        this.store$.dispatch(new EntityActions.SetEntityUpdatePending({
          tag: action.payload.tag,
          isPending: true
        }))),
      mergeMap((action: EntityActions.UpdateEntity) => this.http
        .put<any>(
          `${environment.backUrl}/${action.payload.tag}/${action.payload.entity.id}`,
          action.payload.entity
        )
        .pipe(
          catchError((err) => {
            this.store$.dispatch(new EntityActions.UpdateEntityFailed());
            return Observable.create(() => null);
          }),
          tap(res => this.store$.dispatch(new EntityActions.UpdateEntitySuccess(res))),
          tap(() => this.store$.dispatch(new EntityActions.SetEntityUpdatePending({
            tag: action.payload.tag,
            isPending: false
          }))),
        ))
    );

  @Effect({dispatch: false})
  create = this.actions$
    .pipe(
      ofType(EntityActions.CREATE_ENTITY),
      tap((action: EntityActions.CreateEntity) =>
        this.store$.dispatch(new EntityActions.SetEntityCreatePending({
          tag: action.payload.tag,
          isPending: true
        }))),
      mergeMap((action: EntityActions.CreateEntity) => {
        return this.http
          .post<any>(`${environment.backUrl}/${action.payload.url}`,
            action.payload.entity
          )
          .pipe(
            catchError((err) => {
              this.store$.dispatch(new EntityActions.CreateEntityFailed());
              return Observable.create(() => null);
            }),
            tap(() => this.store$.dispatch(new EntityActions.SetEntityCreatePending({
              tag: action.payload.tag,
              isPending: false
            }))),
            tap(res => this.store$.dispatch(new CreateEntitySuccess({
              tag: action.payload.tag,
              entity: res
            }))),
          );
      }),
    );

  @Effect({dispatch: false})
  delete = this.actions$
    .pipe(
      ofType(EntityActions.DELETE_ENTITY),
      tap((action: EntityActions.DeleteEntity) =>
        this.store$.dispatch(new EntityActions.SetEntityDeletePending({
          tag: action.payload.tag,
          isPending: true
        }))),
      mergeMap((action: EntityActions.DeleteEntity) => this.http
        .delete<any>(
          `${environment.backUrl}/${action.payload.tag}/${action.payload.id}`
        )
        .pipe(
          catchError((err) => {
            this.store$.dispatch(new EntityActions.DeleteEntityFailed({
              tag: action.payload.tag
            }));
            return of(null);
          }),
          tap(res => this.store$.dispatch(new EntityActions.DeleteEntitySuccess({
            tag: action.payload.tag,
          }))),
          tap(() => this.store$.dispatch(new EntityActions.SetEntityDeletePending({
            tag: action.payload.tag,
            isPending: false
          }))),
        ))
    );


  constructor(private actions$: Actions,
              private store$: Store<AppState>,
              private http: HttpClient) {
  }
}

