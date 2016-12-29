const test = require('ava');
const LRUCache = require('../src/lru-cache');
const { mapList } = require('../src/linked-list');

// verify keys of 'head' and 'tail' nodes on a linked list
const checkListHelper = (t, list, headKey, tailKey) => {
  t.is(list.head.key, headKey, `"${headKey}" key should be at head of list`);
  t.is(list.tail.key, tailKey, `"${tailKey}" key should be at tail of list`);
};

let store;

test.beforeEach(t => {
  const capacity = 3;
  const optionalInitialVals = { a: 1 };
  store = new LRUCache(capacity, optionalInitialVals);
});

test('initial values', t => {
  const checkList = checkListHelper.bind(null, t);

  t.is(store.size, 1);
  t.is(store.capacity, 3);
  t.is(store.a, 1);
  checkList(store.list, 'a', 'a');
});

test('#cache: adding values when under capacity', t => {
  const checkList = checkListHelper.bind(null, t);

  store.cache('b', 2);

  t.is(store['b'], 2);
  t.is(store.size, 2);
  checkList(store.list, 'b', 'a');
});

test('#cache: adding & updating values while at capacity', t => {
  const checkList = checkListHelper.bind(null, t);

  store.cache('b', 2);
  t.is(store.size, 2);
  checkList(store.list, 'b', 'a');

  store.cache('c', 3);
  t.is(store.size, 3);
  checkList(store.list, 'c', 'a');

  // adding value to reach capacity
  store.cache('d', 4);
  t.true(store.size === store.capacity);
  t.false(store.hasOwnProperty('a'), 'removes the "a" property, least recently used');
  checkList(store.list, 'd', 'b');

  // updating existing value when at capacity
  store.cache('c', 30);
  t.is(store['c'], 30);
  t.true(store.size === store.capacity);
  checkList(store.list, 'c', 'b');

  // adding value when at capacity
  store.cache('e', 5);
  t.true(store.size === store.capacity);
  t.false(store.hasOwnProperty('b'), 'removes the "b" property, least recently used');
  checkList(store.list, 'e', 'd');
});

test('updating property values through assignment', t => {
  const checkList = checkListHelper.bind(null, t);

  store.a = 5;

  t.is(store.a, 5);
  t.is(store.size, 1);
  checkList(store.list, 'a', 'a');
});

test('#delete: restrictions & return values', t => {
  const checkList = checkListHelper.bind(null, t);

  t.false(store.delete('delete'), 'cannot remove "delete" method');
  t.false(store.hasOwnProperty('d'));
  t.true(store.delete('d'), 'whether or not property exists, returns true');
});

test('#delete: removing properties', t => {
  const checkList = checkListHelper.bind(null, t);

  // setup context
  store.cache('b', 2);
  t.true(store.hasOwnProperty('b'));
  t.is(store.size, 2);

  // trigger
  t.true(store.delete('b'), 'deleting an existing property returns true')

  // verify results
  t.false(store.hasOwnProperty('b'));
  t.is(store.size, 1, 'decrements store size');
});

test('updating capacity', t => {
  const checkList = checkListHelper.bind(null, t);

  // setup context
  store.cache('b', 2);
  store.cache('c', 3);
  t.is(store.capacity, 3);
  t.is(store.size, 3);
  t.deepEqual(Object.keys(store), ['a', 'b', 'c'], 'starts with these enumerable properties');

  // trigger
  store.capacity = 1;

  // verify results
  t.is(store.capacity, 1, 'updates store capacity');
  t.true(store.size === store.capacity, 'decrements store size to match capacity');

  t.deepEqual(Object.keys(store), ['c'], 'retains most recently used keys');
});

test('property descriptors', t => {
  const store = new LRUCache(1);

  const listDescriptor = Object.getOwnPropertyDescriptor(store, 'list');
  t.false(listDescriptor.enumerable);
  t.true(listDescriptor.writable);

  const mapDescriptor = Object.getOwnPropertyDescriptor(store, 'map');
  t.false(mapDescriptor.enumerable);
  t.true(mapDescriptor.writable);

  const sizeDescriptor = Object.getOwnPropertyDescriptor(store, 'size');
  t.false(sizeDescriptor.configurable);
  t.false(sizeDescriptor.enumerable);
  t.falsy(sizeDescriptor.writable); // if not specified, implied to be false

  const capacityDescriptor = Object.getOwnPropertyDescriptor(store, 'capacity');
  t.false(capacityDescriptor.enumerable);

  const cacheDescriptor = Object.getOwnPropertyDescriptor(store, 'cache');
  t.false(cacheDescriptor.configurable);
  t.false(cacheDescriptor.enumerable);
  t.false(cacheDescriptor.writable);

  const deleteDescriptor = Object.getOwnPropertyDescriptor(store, 'delete');
  t.false(deleteDescriptor.configurable);
  t.false(deleteDescriptor.enumerable);
  t.false(deleteDescriptor.writable);
});
