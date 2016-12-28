const createNode = (key, val) => ({
  key,
  val,
  next: null,
  prev: null
});

const deleteNode = node => {
  if (node.prev) { node.prev.next = node.next; }
  if (node.next) { node.next.prev = node.prev; }
};

if (typeof module !== 'undefined') {
  module.exports = { createNode, deleteNode };
}
