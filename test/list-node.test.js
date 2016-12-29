const test = require('ava');
const { createNode, deleteNode } = require('../src/list-node');

test('#createNode', t => {
  const node = createNode('foo', 'bar');
  t.is(node.key, 'foo');
  t.is(node.val, 'bar');
  t.is(node.next, null);
  t.is(node.prev, null);
});

test('#deleteNode', t => {
  const node1 = createNode('foo', 'bar');
  const node2 = createNode('bar', 'qux');
  const node3 = createNode('qux', 'baz');

  node2.prev = node1;
  node2.next = node3;

  node1.next = node2;
  node3.prev = node2;

  deleteNode(node2);

  t.is(node1.next, node3, "references deleted node's 'next' node");
  t.is(node3.prev, node1, "references deleted node's 'prev' node");
});
