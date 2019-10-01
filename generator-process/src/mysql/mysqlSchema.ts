import {Entity, Field, OutputFile, Schema} from '../template';

export const mysqlSchema = (schema: Schema): OutputFile => ({
  filename: `out/schema.sql`,
  content: `
  ${schema.entities.map(toSchema).join('')}
  
  CREATE TABLE \`users\` (
  \`id\` int(11) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`password\` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE \`users\` ADD PRIMARY KEY (\`id\`);

ALTER TABLE \`users\` MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT;
  
  `
});

const toSchema = (entity: Entity) => `
CREATE TABLE \`${entity.pluralName}\` (
    ${entity.fields.map(toColumn).join(',')}
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

${entity.fields.find(field => field.name === 'id')
  ? idMySQL(entity)
  : ''}

`;

const idMySQL = entity => `
  ALTER TABLE \`${entity.pluralName}\` ADD PRIMARY KEY (\`id\`);
  
  ALTER TABLE \`${entity.pluralName}\`
  MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
`;

const typeMap = {
  'string': 'text',
  'int': 'int(11)',
  'bool': 'tinyint(1)'
};

const isRequired = predicate => predicate ? 'NOT NULL' : '';

const toColumn = (field: Field) => `\`${field.name}\` ${typeMap[field.type]} ${isRequired(field.isRequired)}`;
