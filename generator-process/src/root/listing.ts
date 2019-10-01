import {OutputFile, Schema} from '../template';

export const paging = (schema: Schema): OutputFile => ({
  filename: `out/Listing/Paging.php`,
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated\\Listing;

use JsonSerializable;

class Paging implements JsonSerializable
{
    private $links;
    private $count;
    private $total;

    public function __construct(Links $links, int $count, int $total)
    {
        $this->links = $links;
        $this->count = $count;
        $this->total = $total;
    }

    public function getLinks(): Links
    {
        return $this->links;
    }

    public function getCount(): int
    {
        return $this->count;
    }

    public function getTotal(): int
    {
        return $this->total;
    }

    public function jsonSerialize()
    {
        return [
            'count' => $this->count,
            'links' => $this->links,
            'total' => $this->total,
        ];
    }
}

  `
});

export const query = (schema: Schema): OutputFile => ({
  filename: `out/Listing/Query.php`,
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated\\Listing;

class Query
{
    private $limit;
    private $offset;
    private $filter;
    private $orderBy;
    private $columns;

    /**
     * Query constructor.
     * @param int $limit
     * @param int $offset
     * @param $filter Clause | Filter
     * @param OrderBy $orderBy
     * @param $columns
     */
    public function __construct(int $limit, int $offset, $filter, OrderBy $orderBy, $columns = [])
    {
        $this->limit = $limit;
        $this->offset = $offset;
        $this->filter = $filter;
        $this->orderBy = $orderBy;
        $this->columns = $columns;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getOffset(): int
    {
        return $this->offset;
    }

    /**
     * @return Clause | Filter
     */
    public function getFilter()
    {
        return $this->filter;
    }

    public function getOrderBy(): OrderBy
    {
        return $this->orderBy;
    }
    
    public function getColumns(): array
    {
        return $this->columns ?? [];
    }
}

  `
});


export const listFilter = (schema: Schema): OutputFile => ({
  filename: `out/Listing/Filter.php`,
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated\\Listing;

class Filter
{
    const RELATIONS = ['and', 'or'];

    /**
     * @var string
     */
    private $relation;
    /**
     * @var Clause | Filter
     */
    private $left;

    /**
     * @var Clause | Filter
     */
    private $right;

    /**
     * Filter constructor.
     * @param string $relation
     * @param Filter|Clause $left
     * @param Filter|Clause $right
     */
    public function __construct($relation, $left, $right)
    {
        $this->left = $left;
        $this->right = $right;
        $this->relation = in_array($relation, self::RELATIONS) ? $relation : 'and';
    }

    /**
     * @return string
     */
    public function getRelation(): string
    {
        return $this->relation;
    }

    /**
     * @return Clause|Filter
     */
    public function getLeft()
    {
        return $this->left;
    }

    /**
     * @return Clause|Filter
     */
    public function getRight()
    {
        return $this->right;
    }
}

  `
});

export const clause = (schema: Schema): OutputFile => ({
  filename: `out/Listing/Clause.php`,
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated\\Listing;

class Clause
{
    const OPERATORS = ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in', 'nin', 'like'];
    private $operator;
    private $key;
    private $value;

    public function __construct($operator, $key, $value)
    {
        $this->key = $key;
        $this->value = $value;
        $this->operator = in_array($operator, self::OPERATORS) ? $operator : '';
    }

    public function getOperator(): string
    {
        return $this->operator;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function getKey(): string
    {
        return $this->key;
    }
}

  `
});

export const orderBy = (schema: Schema): OutputFile => ({
  filename: `out/Listing/OrderBy.php`,
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated\\Listing;

class OrderBy
{
    const VALUES = ['asc', 'desc'];

    private $key;
    private $value;

    public function __construct(string $key, string $value)
    {
        $this->key = $key;

        if (!in_array($value, self::VALUES)) {
            $this->value = '';
            return;
        }
        $this->value = $value;
    }

    public function getKey(): string
    {
        return $this->key;
    }
    public function getValue(): string
    {
        return $this->value;
    }
}

  `
});


export const links = (schema: Schema): OutputFile => ({
  filename: `out/Listing/Links.php`,
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated\\Listing;

use JsonSerializable;

class Links implements JsonSerializable
{
    private $first;
    private $prev;
    private $next;
    private $current;
    private $last;

    public function __construct(string $first, string $prev, string $next, string $current, string $last)
    {
        $this->first = $first;
        $this->prev = $prev;
        $this->next = $next;
        $this->current = $current;
        $this->last = $last;
    }

    public function getFirst(): string
    {
        return $this->first;
    }

    public function getPrev(): string
    {
        return $this->prev;
    }

    public function getNext(): string
    {
        return $this->next;
    }

    public function getCurrent(): string
    {
        return $this->current;
    }

    public function getLast(): string
    {
        return $this->last;
    }

    public function jsonSerialize()
    {

        return [
            'first' => $this->first,
            'prev' => $this->prev,
            'next' => $this->next,
            'current' => $this->current,
            'last' => $this->last,
        ];
    }
}

  `
});

export const pager = (schema: Schema): OutputFile => ({
  filename: `out/Listing/Pager.php`,
  content: `<?php

namespace ${schema.namespaceRoot}\\Generated\\Listing;

interface Pager
{
    public function getPaging(int $limit, int $offset, string $path, int $total): array;
}

  `
});
