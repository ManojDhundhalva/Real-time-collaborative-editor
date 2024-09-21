const useTraverseTree = (socket) => {
  // Add a file or folder in tree
  // Can be optimized using Dynamic Programming
  const insertNode = function (tree, new_node) {
    // Ensure items is an array
    if (!tree.items) {
      tree.items = [];
    }

    if (tree.id === new_node.parent_id && tree.isFolder) {
      tree.items.unshift({
        id: new_node.file_tree_id,
        name: new_node.name,
        isFolder: new_node.is_folder,
        fileTreeTimestamp: new_node.file_tree_timestamp,
        parentId: new_node.parent_id,
        items: [],
      });

      return tree;
    }

    let latestNode = [];
    // Ensure tree.items is an array before mapping
    latestNode = tree.items.map((ob) => {
      return insertNode(ob, new_node);
    });

    return { ...tree, items: latestNode };
  };

  const deleteNode = () => {}; // Do it Yourself

  const renameNode = () => {}; // Do it Yourself

  return { insertNode, deleteNode, renameNode };
};

export default useTraverseTree;
