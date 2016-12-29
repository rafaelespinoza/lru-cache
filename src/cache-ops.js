const { unshiftToList, popFromList, removeFromList, moveToFrontOfList, mapList } = require('./linked-list');
const { createNode } = require('./list-node');

const trim = cacheObj => {
  const popped = popFromList(cacheObj.list);
  const { key } = popped;

  delete cacheObj.map[key];
  delete cacheObj[key]

  return popped;
};

const getVal = (cacheObj, key) => {
  const { map } = cacheObj;

  if (!map.hasOwnProperty(key)) {
    return null;
  } else {
    const { list } = cacheObj;
    const node = map[key];
    moveToFrontOfList(list, node);
    return node.val;
  }
};

const setVal = (cacheObj, key, val) => {
  const { map, list } = cacheObj;

  if (map.hasOwnProperty(key)) {
    const node = map[key];
    node.val = val;
    moveToFrontOfList(list, node);
  } else {
    const { capacity } = cacheObj;
    if (list.size === capacity) { trim(cacheObj); }

    const node = createNode(key, val);
    unshiftToList(list, node, capacity);
    cacheObj.map = mapList(list);

    setProperty(cacheObj, key);
  }
};

const delVal = (cacheObj, key) => {
  const { map } = cacheObj;

  if (map.hasOwnProperty(key)) {
    const { list } = cacheObj;
    const node = map[key];
    removeFromList(list, node);

    unsetProperty(cacheObj, key);
    cacheObj.map = mapList(list);
  }

  delete cacheObj[key];
};

const resetCapacity = (cacheObj, newCapacity) => {
  const { capacity, list } = cacheObj;

  const oldCapacity = capacity;
  const diff = oldCapacity - newCapacity;

  if (diff > 0) {
    for (let i = 0; i < diff - 1; i += 1) {
      const popped = trim(cacheObj);
      delVal(cacheObj, popped.key);
    }

    cacheObj.map = mapList(list);
  }
};

module.exports = { trim, getVal, setVal, delVal, resetCapacity };

function setProperty(cacheObj, key) {
  Object.defineProperty(cacheObj, key, {
    get: () => getVal(cacheObj, key),
    set: newVal => setVal(cacheObj, key, newVal),
    enumerable: true,
    configurable: true
  });
}

function unsetProperty(cacheObj, key) {
  Object.defineProperty(cacheObj, key, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: undefined
  });
}
