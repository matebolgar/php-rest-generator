import {Schema} from './template';

export const transformSchema = (schema: Schema) => ({
  ...schema,
  entities: schema.entities.map(entity => ({
    ...entity,
    operations: Object
      .entries(entity.operations)
      .reduce((acc, [name, op]) =>
        ({...acc, [name]: {name: name, ...op}}), {})
  }))
});
