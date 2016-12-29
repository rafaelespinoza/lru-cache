const { createList } = require('./linked-list');
const { trim, getVal, setVal, delVal, resetCapacity } = require('./cache-ops');

const LRUCache = function(capacity, initialVals = {}) {
  this.list = createList();
  this.map = {};

  for (const key in initialVals) {
    const val = initialVals[key];
    setVal(this, key, val);
  }

  Object.defineProperties(this, {
    'list': {
      enumerable: false,
      writable: true
    },
    'map': {
      enumerable: false,
      writable: true,
    },
    'size': {
      enumerable: false,
      configurable: false,
      get: () => this.list.size
    },
    'capacity': {
      enumerable: false,
      get: () => capacity,
      set: newCapacity => {
        resetCapacity(this, newCapacity);
        capacity = newCapacity;
      }
    },
    'cache': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: LRUCache.prototype['cache']
    },
    'delete': {
      enumerable: false,
      writable: false,
      configurable: false,
      value: LRUCache.prototype['delete']
    }
  });
};

LRUCache.prototype.cache = function(key, val) {
  setVal(this, key, val);
  return this;
};

LRUCache.prototype.delete = function(key) {
  if (key === 'delete') { return false; }
  delVal(this, key);
  return true;
};

if (typeof module !== 'undefined') {
  module.exports = LRUCache;
}
