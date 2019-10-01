export const buildTree = (key, parentKey) => treeData => {

  const lookup = treeData
    .reduce((acc, cr) => ({...acc, [cr[key]]: {...cr, children: []}}), {});

  const data = {...lookup};

  const ret = Object.entries(data)
    .reduce((acc, [id, v]) => {

      if (!lookup[data[id][parentKey]]) {
        return data;
      }

      data[lookup[id][parentKey]].children = [...data[lookup[id][parentKey]].children, v];

      return data;
    }, {});

  return Object.values(ret)
    .filter(item => !Boolean(item[parentKey]));
};

export const flatten = function (arr, result = []) {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      flatten(value, result);
    } else {
      result.push(value);
    }
  }
  return result;
};

export function rotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}

export const objectValue = ([x, ...xs]: any[], acc, def) =>
  xs.length === 0 ?
    acc[x] === undefined ?
      def :
      acc[x] :
    acc[x] === undefined ?
      def :
      objectValue(xs, acc[x], def);


export function clone(item) {
  if (!item) {
    return item;
  } // null, undefined values check

  let types = [Number, String, Boolean], result;

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function (type) {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result === 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = [];
      item.forEach(function (child, index, array) {
        result[index] = clone(child);
      });
    } else if (typeof item === 'object') {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode === 'function') {
        result = item.cloneNode(true);
      } else if (!item.prototype) { // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};
          for (const i in item) {
            result[i] = clone(item[i]);
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }

  return result;
}

