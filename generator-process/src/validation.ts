import {Entity, Field, flatten, Schema} from './template';

interface Error {
  field: string;
  message: string;
}

const typeMap = {
  'int': 'number',
  'bool': 'boolean',
  'string': 'string',
  'json': 'string',
};

const doesFieldTypeMatch = field => typeof field.default === typeMap[field.type] && !field.valueTransformer;


type errorPair = [(Field: Field) => Boolean, string]

const initError = curry((field: Field, pairs: errorPair[]) =>
  pairs
    .filter(pair => pair[0](field))
    .map(pair => ({field: field.name, message: pair[1]})));

const fieldToError = (field: Field): Error[] => {
  const addError = initError(field);

  return addError([
    [
      field => field.default && !doesFieldTypeMatch(field),
      'default value\'s type must match with the field type'
    ],
    [
      field => Boolean(field.isRequired) && (Boolean(field.default)),
      'required field can\'t have default value',
    ],
    [
      field => Boolean(field.default) && Boolean(field.valueTransformer),
      'can\'t have both default or valueTransformer value'
    ],
    [
      field => Boolean(field.valueTransformer)
        && field.valueTransformer === 'currentTimestamp'
        && field.type !== 'int',
      'type of currentTimestamp must be int'
    ],
    [
      field => Boolean(field.valueTransformer)
        && field.valueTransformer === 'slug'
        && field.type !== 'string',
      'type of slug must be string'
    ],
  ]);

};

function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}

const map = curry((fn, f) => f.map(fn));

const entityToErrors = (entity: Entity): Error[][] => entity.fields.map(fieldToError);

const toMessage = (errors: Error[]) => errors.map(error => `field: ${error.field} \n message: ${error.message} \n\n`);

const compose = (...fns) =>
  fns.reduceRight((prevFn, nextFn) =>
      (...args) => nextFn(prevFn(...args)),
    value => value
  );

export const validateJson = (json: Schema): Promise<any> => new Promise((resolve, reject) => {
  const arr = compose(toMessage, flatten, flatten, map(entityToErrors))(json.entities);
  if (arr.length) {
    return reject(arr.reduce((acc, cr) => acc + cr, 'Errors: \n'));
  }

  return resolve(json);
});