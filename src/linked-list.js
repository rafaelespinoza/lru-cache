const { createNode, deleteNode } = require('./list-node');

const createList = () => ({
  head: null,
  tail: null,
  size: 0
});

// add node to front of a list
const unshiftToList = (list, node, limit) => {
  if (list.size === 0) {
    list.head = node;
    list.tail = node;
    list.size += 1;
  } else if (list.size < limit){
    list.head.prev = node;
    node.next = list.head;
    list.head = node;
    list.size += 1;
  } else {
    list.head.prev = node;
    node.next = list.head;
    list.head = node;

    const penultimate = list.tail.prev;
    penultimate.next = null;
    list.tail = penultimate;
  }

  return node.val;
};

// remove node from end of list
const popFromList = list => {
  if (list.size === 0) {
    return null;
  } else {
    if (list.size === 1) { list.head = null; }
    const tail = list.tail;
    list.tail = list.tail.prev;
    deleteNode(tail);
    list.size -= 1;
    return tail;
  }
};

const removeFromList = (list, node) => {
  if (node === list.tail) { return popFromList(list); }
  if (node === list.head) {
    list.head = node.next;
    list.head.prev = null;
    list.size -= 1;
    deleteNode(node);
  } else {
    let curr = list.head;

    while (curr !== null) {
      if (curr === node) {
        deleteNode(node);
        list.size -= 1;
        break;
      }

      curr = curr.next;
    }
  }

  return node;
};

// move a node to front of list, does not change its size
const moveToFrontOfList = (list, node) => {
  if (node === list.head) { return; }
  if (node === list.tail) {
    popFromList(list);
    list.size += 1; // need to undo this side effect
  }

  node.prev = null;
  node.next = null;

  if (list.size === 0) {
    list.head = node;
    list.tail = node;
  } else {
    list.head.prev = node;
    node.next = list.head;
    list.head = node;
  }
};

// return mapping of each node's key to the corresponding node
const mapList = list => {
  const map = {};
  let curr = list.head;

  while (curr !== null) {
    const { key, next } = curr;
    map[key] = curr;
    curr = next;
  }

  return map;
};

if (typeof module !== 'undefined') {
  module.exports = {
    createList,
    unshiftToList,
    popFromList,
    removeFromList,
    moveToFrontOfList,
    mapList
  };
}
