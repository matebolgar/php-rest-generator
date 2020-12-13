import {typeMap} from '../repository/sqlister';
import {Entity, Field, firstToUpper, OutputFile, sum} from '../template';

interface EntityStruct {
  readonly namespace: string;
  readonly name: string;
  readonly fields: Field[]
}

export const updateObject = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${firstToUpper(entity.name)}/Update/Updated${firstToUpper(entity.name)}.php`,
  content: entityObject(
    {
      namespace: `${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Update`,
      name: `Updated${firstToUpper(entity.name)}`,
      fields: entity.fields.filter(field => !field.isReadonly)
    }
  )
});

export const patchObject = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${firstToUpper(entity.name)}/Patch/Patched${firstToUpper(entity.name)}.php`,
  content: entityObject(
    {
      namespace: `${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Patch`,
      name: `Patched${firstToUpper(entity.name)}`,
      fields: entity.fields.filter(field => !field.isReadonly)
    }
  )
});

export const saveObject = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${firstToUpper(entity.name)}/Save/New${firstToUpper(entity.name)}.php`,
  content: entityObject(
    {
      namespace: `${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Save`,
      name: `New${firstToUpper(entity.name)}`,
      fields: entity.fields.filter(field => field.name !== 'id')
    }
  )
});

export const listObject = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${entity.name}/${firstToUpper(entity.name)}.php`,
  content: entityObject(
    {
      namespace: `${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}`,
      name: firstToUpper(entity.name),
      fields: entity.fields
    }
  )
});

const entityObject = (struct: EntityStruct) => `<?php

namespace ${struct.namespace};

use JsonSerializable;

class ${struct.name} implements JsonSerializable
{
    ${properties(struct.fields)}

    ${construct(struct.fields)}
    
    ${getters(struct.fields)}
    
    public function jsonSerialize()
    {
        return [
           ${struct.fields
  .map(field => field.type === 'json' ?
    ` '${field.name}' => json_decode($this->${field.name}),\n`
    : ` '${field.name}' => $this->${field.name},\n`)
  .reduce(sum, '')
  }
        ];
    }
}
`;

const getters = fields => fields.map(field => `public function get${firstToUpper(field.name)}(): ?${typeMap[field.type]}
    {
        return $this->${field.name};
    }
    `).reduce(sum, '');

const construct = fields => `
public function __construct(${fields.map(field => `$${field.name}`).join(', ')})
{
        ${fields.map(field => `$this->${field.name} = $${field.name};\n`).reduce(sum, '')}
}`;

const properties = fields => fields.map(field => `private $${field.name};\n`).reduce(sum, '');