import {typeMap} from '../repository/sqlister';
import {Entity, firstToUpper, OutputFile} from '../template';

const nullTypes = {
  string: '\'\'',
  json: '\'\'',
  int: 0,
  bool: false
};

export const byIdController = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${firstToUpper(entity.name)}/ById/ByIdController.php`,
  content: `<?php
    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\ById;
    
    use Exception;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\Error;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\OperationError;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};

    
    class ByIdController
    {
        /**
         * @var ById
         */
        private $byId;
    
        /**
         * @var OperationError
         */
        private $operationError;
    
        public function __construct(ById $byId, OperationError $operationError)
        {
            $this->byId = $byId;
            $this->operationError = $operationError;
        }
    
        public function byId(string $id): ${firstToUpper(entity.name)}
        {
            try {
                return $this->byId->byId($id);
            } catch (Exception $err) {
                $this->operationError->addField(Error::getOperationError());
                throw $this->operationError;
            }
        }
    }

  `
});

export const deleteController = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${firstToUpper(entity.name)}/Delete/DeleteController.php`,
  content: `<?php
    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Delete;
    
    use Exception;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\Error;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\OperationError;
    
    class DeleteController
    {
        private $operationError;
    
        private $deleter;
    
        public function __construct(OperationError $operationError, Deleter $deleter)
        {
            $this->operationError = $operationError;
            $this->deleter = $deleter;
        }
    
        public function delete(string $id)
        {
            try {
                return $this->deleter->delete($id);
            } catch (Exception $err) {
                $this->operationError->addField(Error::getOperationError());
                throw $this->operationError;
            }
        }
    }

  `
});

export const listController = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${firstToUpper(entity.name)}/Listing/ListController.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Listing;

use ${namespaceRoot}\\Generated\\Listing\\Clause;
use ${namespaceRoot}\\Generated\\Listing\\Filter;
use ${namespaceRoot}\\Generated\\Listing\\OrderBy;
use ${namespaceRoot}\\Generated\\Listing\\Query;
use ${namespaceRoot}\\Generated\\Listing\\Pager;
use ${namespaceRoot}\\Generated\\Listing\\Links;
use ${namespaceRoot}\\Generated\\Listing\\Paging;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\Error;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\OperationError;

use Exception;

class ListController
{
    /**
     * @var OperationError
     */
    private $operationError;

    /**
     * @var Lister
     */
    private $lister;

    /**
     * @var Pager
     */
    private $pager;

    public function __construct(OperationError $operationError, Lister $lister, Pager $pager)
    {
        $this->operationError = $operationError;
        $this->lister = $lister;
        $this->pager = $pager;
    }

    public function list(array $rawQuery): Response
    {
        try {
            $query = new Query(
                $rawQuery['limit'],
                $rawQuery['from'],
                !empty($rawQuery['filters']) ? $this->getFilters($rawQuery['filters']): null,
                new OrderBy($rawQuery['orderBy']['key'] ?? '', $rawQuery['orderBy']['value'] ?? '')
            );

            $countedList = $this->lister->list($query);
            $paging = $this->pager->getPaging($query->getLimit(), $query->getOffset(), '', $countedList->getCount());

            return new Response(
                new Paging(
                    new Links(
                        $paging["links"]['first'] ?? '',
                        $paging["links"]['prev'] ?? '',
                        $paging["links"]['next'] ?? '',
                        $paging["links"]['current'] ?? '',
                        $paging["links"]['last'] ?? ''
                    ),
                    $paging['count'],
                    $countedList->getCount()
                ),
                $countedList->getEntities()
            );
        } catch (Exception $err) {
            $error = $this->operationError;
            $error->addField(Error::getOperationError());
            throw $error;
        }
    }

    /**
     * @param array $query
     * @return Clause|Filter
     */
    private function getFilters(array $query)
    {
        if (isset($query['operator'])) {
            return new Clause($query['operator'], $query['key'], $query['value']);
        }
        return new Filter(
            $query['relation'] ?? [],
            $query['left']['relation'] ?? []
                ? $this->getFilters($query['left'])
                : new Clause($query['left']['operator'], $query['left']['key'], $query['left']['value']),
            $query['right']['relation'] ?? []
                ? $this->getFilters($query['right'])
                : new Clause($query['right']['operator'], $query['right']['key'], $query['right']['value'])

        );
    }
}
  `
});


// TODO validate readonly, validate nullable

export const updateController = (namespaceRoot, entity: Entity): OutputFile => (
  {
    filename: `Generated/${firstToUpper(entity.name)}/Update/UpdateController.php`,
    content: `<?php

    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Update;

    use Exception;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\Error;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\OperationError;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\ValidationError;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Update\\Updater;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
    
    class UpdateController
    {
        /**
         * @var Updater
         */
        private $updater;
    
        /**
         * @var OperationError
         */
        private $operationError;
    
        /**
         * @var ValidationError
         */
        private $requiredError;
    
        public function __construct(Updater $updater, OperationError $operationError, ValidationError $requiredError)
        {
            $this->updater = $updater;
            $this->operationError = $operationError;
            $this->requiredError = $requiredError;
        }
    
        public function update(array $entity, string $id): ${firstToUpper(entity.name)}
        {    
            try {
                $toUpdate = new Updated${firstToUpper(entity.name)}(${entity.fields
                                            .filter(field => !field.isReadonly)
                                            .map(field => `$entity['${field.name}'] ?? ${nullTypes[field.type]}`)
                                            .join(', ')});
               
                return $this->updater->update($id, $toUpdate);
            } catch (Exception $err) {
                $this->operationError->addField(Error::getOperationError());
                throw $this->operationError;
            }
        }
    
    }

  `
  }
);

export const patchController = (namespaceRoot, entity: Entity): OutputFile => (
  {
    filename: `Generated/${firstToUpper(entity.name)}/Patch/PatchController.php`,
    content: `<?php

    namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Patch;

    use Exception;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\Error;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\OperationError;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Error\\ValidationError;
    use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};
      
    class PatchController
    {
        /**
         * @var Patcher
         */
        private $patcher;
    
        /**
         * @var OperationError
         */
        private $operationError;
    
        /**
         * @var ValidationError
         */
        private $requiredError;
    
        public function __construct(Patcher $updater, OperationError $operationError, ValidationError $requiredError)
        {
            $this->patcher = $updater;
            $this->operationError = $operationError;
            $this->requiredError = $requiredError;
        }
    
        public function patch(array $entity, string $id): ${firstToUpper(entity.name)}
        {
            try {
                @$toPatch = new Patched${firstToUpper(entity.name)}(${entity.fields
      .filter(field => !field.isReadonly)
      .map(field => field.type === 'bool' ? `(bool)$entity['${field.name}'] ?? null` : `$entity['${field.name}'] ?? null`)
      .join(', ')});
                return $this->patcher->patch($id, $toPatch);
            } catch (Exception $err) {
                $this->operationError->addField(Error::getOperationError());
                throw $this->operationError;
            }
        }
    }

  `
  }
);

export const countedEntities = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${firstToUpper(entity.name)}/Listing/Counted${firstToUpper(entity.pluralName)}.php`,
  content: `<?php

  namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Listing;

  use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};

  class Counted${firstToUpper(entity.pluralName)}
  {
      /**
      * @var ${firstToUpper(entity.name)}[]
      */
      private $entities;
 
      private $count;
  
      public function __construct(array $entities, int $count)
      {
          $this->entities = $entities;
          $this->count = $count;
      }

      public function getEntities(): array
      {
          return $this->entities;
      }
  
      public function getCount(): int
      {
          return $this->count;
      }
  }

  `
});




export const response = (namespaceRoot, entity: Entity): OutputFile => ({
  filename: `Generated/${firstToUpper(entity.name)}/Listing/Response.php`,
  content: `<?php

namespace ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\Listing;

use JsonSerializable;
use ${namespaceRoot}\\Generated\\Listing\\Paging;
use ${namespaceRoot}\\Generated\\${firstToUpper(entity.name)}\\${firstToUpper(entity.name)};

class Response implements JsonSerializable
{
    private $paging;

    /**
     * @var ${firstToUpper(entity.name)}[]
     */
    private $results;
    
    public function __construct(Paging $paging, array $results)
    {
        $this->paging = $paging;
        $this->results = $results;
    }


    public function getPaging(): Paging
    {
        return $this->paging;
    }

    public function getResults(): array
    {
        return $this->results;
    }

    public function jsonSerialize()
    {
        return [
            'paging' => $this->paging,
            'results' => $this->results,
        ];
    }
}
  `
});
