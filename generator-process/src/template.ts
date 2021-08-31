import {auth} from './auth/auth';
import {
  byIdController,
  countedEntities,
  deleteController,
  listController,
  patchController,
  response,
  updateController
} from './entity/controllers';
import {listObject, patchObject, saveObject, updateObject} from './entity/entities';
import {error, operationError, validationError} from './entity/errors';
import {byId, deleter, lister, patcher, updater} from './entity/interfaces';
import {saveController, saver, slugifier} from './entity/save/controller';
import {mysqlSchema} from './mysql/mysqlSchema';
import {sqlById} from './repository/sqlbyid';
import {sqlDeleter} from './repository/sqldeleter';
import {sqlLister} from './repository/sqlister';
import {sqlPatcher} from './repository/sqlpatcher';
import {sqlSaver} from './repository/sqlsaver';
import {sqlUpdater} from './repository/sqlupdater';
import {request, rootIndex} from './root';
import {rootOperationError, rootRequiredError, routeError} from './root/errors';
import {clause, links, listFilter, orderBy, pager, paging, query} from './root/listing';
import {rootPager} from './root/pager';
import {rootSlugifier} from './root/slugifier';
import {routeById} from './router/byId';
import {routeDeleter} from './router/delete';
import {routeLister} from './router/list';
import {routePatcher} from './router/patch';
import {routerFn} from './router/routerfn';
import {routeSaver} from './router/save';
import {routeUpdater} from './router/update';

export interface Schema {
  readonly namespaceRoot: string;
  readonly persistance: { dbName: string };
  readonly entities: ReadonlyArray<Entity>;
}

export interface Operation {
  name: 'create' | 'read' | 'update' | 'patch' | 'byId' | 'list' | 'delete';
  isGenerated: boolean;
  isAuthActive?: boolean;
  isActive: boolean;
}

export interface Entity {
  readonly name: string;
  readonly pluralName: string;
  readonly operations: { [key: string]: Operation };
  readonly fields: Field[];
}

export interface Field {
  readonly name: string;
  readonly type: 'int' | 'bool' | 'string' | 'json';
  readonly isRequired: boolean;
  readonly isReadonly: boolean;
  readonly isUnique: boolean;
  readonly default: unknown;
  readonly valueTransformer: 'currentTimestamp' | 'slug';
}

export interface OutputFile {
  readonly filename: string;
  readonly content: string;
}

export const firstToUpper = str => str.charAt(0).toUpperCase() + str.slice(1);

export const flatten = <T>(arrays: Array<T>): T => [].concat.apply([], arrays);

export const sum = (acc, cr) => acc + cr;

export const toFiles = async (schema: Schema): Promise<OutputFile[]> =>
  [
    ...flatten(schema.entities.map(entity => forEntity.map(fn => fn(schema.namespaceRoot, entity)))),
    ...forRoot.map(fn => fn((schema))),
    ...await auth(schema),
    mysqlSchema(schema),
  ];

type forEntityFn = (namespaceRoot: string, entity: Entity) => OutputFile;

const forEntity: forEntityFn[] = [
  saveController,
  byIdController,
  updateController,
  patchController,
  deleteController,
  listController,
  response,
  countedEntities,
  validationError,
  operationError,
  error,
  listObject,
  saveObject,
  updateObject,
  patchObject,
  byId,
  deleter,
  saver,
  slugifier,
  lister,
  updater,
  patcher,
  sqlSaver,
  sqlLister,
  sqlById,
  sqlUpdater,
  sqlPatcher,
  sqlDeleter,
  routeById,
  routeSaver,
  routeLister,
  routeDeleter,
  routeUpdater,
  routePatcher,
  routerFn,
];

type forRootFn = (schema: Schema) => OutputFile;

const forRoot: forRootFn[] = [
  rootOperationError,
  rootRequiredError,
  rootPager,
  rootIndex,
  request,
  routeError,
  rootSlugifier,
  listFilter,
  clause,
  links,
  paging,
  query,
  orderBy,
  pager,
];






