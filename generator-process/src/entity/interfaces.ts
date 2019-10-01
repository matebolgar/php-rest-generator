import {Entity, firstToUpper, OutputFile} from '../template';

export const byId = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/ById/ById.php`,
  content: `<?php
    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\ById;
    
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
    
    interface ById
    {
        function byId(string $id): ${firstToUpper(entity.name)};
    }
    `
});

export const deleter = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Delete/Deleter.php`,
  content: `<?php
    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Delete;
    
    interface Deleter
    {
        function delete(string $id): string;
    }
    `
});


export const lister = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Listing/Lister.php`,
  content: `<?php
      namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Listing;
      
      use ${namespaceRoot}\\Generated\\Listing\\Query;
      
      interface Lister
      {
          function list(Query $query): Counted${firstToUpper(entity.pluralName)};
      }
    `
});

export const updater = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Update/Updater.php`,
  content: `<?php
    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Update;
    
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
    
    interface Updater
    {
        function update(string $id, Updated${firstToUpper(entity.name)} $${entity.name}): ${firstToUpper(entity.name)};
    }
    `
});

export const patcher = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `out/${firstToUpper(entity.name)}/Patch/Patcher.php`,
  content: `<?php
    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Patch;
    
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
    
    interface Patcher
    {
        function patch(string $id, Patched${firstToUpper(entity.name)} $${entity.name}): ${firstToUpper(entity.name)};
    }
    `
});
