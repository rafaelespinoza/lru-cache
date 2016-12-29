const test = require('ava');
const {
  createList, unshiftToList, popFromList, removeFromList,
  moveToFrontOfList, mapList
} = require('../src/linked-list');
const { createNode, deleteNode } = require('../src/list-node');

test('#createList', t => {
  const list = createList();
  t.is(list.head, null);
  t.is(list.tail, null);
  t.is(list.size, 0);
});

test('#unshiftToList: when list size is 0', t => {
  const list = createList();
  const node = createNode('foo', 'bar');
  const limit = 3;

  const val = unshiftToList(list, node, limit);

  t.deepEqual(list.head, node);
  t.deepEqual(list.tail, node);
  t.is(list.size, 1);
  t.is(val, 'bar', 'returns node.val');
});

test('#unshiftToList: when list size is 1', t => {
  const list = createList();
  const foo = createNode('foo', 'bar');
  const bar = createNode('bar', 'qux');
  const limit = 3;

  unshiftToList(list, foo, limit);
  const val = unshiftToList(list, bar, limit);

  t.deepEqual(list.head, bar);
  t.deepEqual(list.tail, foo);
  t.is(list.size, 2);
  t.is(val, 'qux', 'returns node.val');
});

test('#unshiftToList: when list size is === to its limit', t => {
  const list = createList();
  const one = createNode('one', 1);
  const two = createNode('two', 2);
  const three = createNode('three', 3);
  const four = createNode('four', 4);
  const limit = 3;

  unshiftToList(list, one, limit);
  unshiftToList(list, two, limit);
  const val_3 = unshiftToList(list, three, limit);

  t.is(list.head, three);
  t.is(list.tail, one);
  t.is(list.size, limit);
  t.is(val_3, 3, 'returns node.val');

  const val_4 = unshiftToList(list, four, limit);

  t.is(list.head, four);
  t.is(list.tail, two);
  t.is(list.size, limit);
  t.is(val_4, 4, 'returns node.val');
});

test('#popFromList: when list size is 0', t => {
  const list = createList();
  t.is(list.size, 0);
  const val = popFromList(list);
  t.is(val, null);
});

test('#popFromList: when list size > 0', t => {
  const list = createList();
  const foo = createNode('foo', 'bar');
  const bar = createNode('bar', 'qux');
  const qux = createNode('qux', 'fiz');
  const limit = 3;

  unshiftToList(list, foo, limit);
  unshiftToList(list, bar, limit);
  unshiftToList(list, qux, limit);

  t.is(list.size, 3);

  const fooed = popFromList(list);
  t.is(list.size, 2);
  t.is(list.tail, fooed.prev, 'tail shallowly-equals popped.prev');
  t.is(fooed, foo, 'popped shallow-equals first added node');

  const barred = popFromList(list);
  t.is(list.size, 1);
  t.is(list.tail, barred.prev, 'tail shallowly-equals popped.prev');
  t.is(barred, bar, 'popped shallow-equals first added node');

  const quxxed = popFromList(list);
  t.is(list.size, 0);
  t.is(list.head, null);
  t.is(list.tail, null);
  t.is(quxxed, qux, 'popped shallow-equals first added node');
});
