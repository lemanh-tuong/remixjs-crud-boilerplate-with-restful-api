import { Leaf } from '../types/Leaf';
import { TreeDataNode } from '../types/TreeDataNode';

/**
 * Converts an array of Leaf objects into an array of TreeDataNode objects suitable for use with Ant Design's Tree Select component.
 *
 * @template Model - The type of the raw data associated with each leaf.
 * @param {Leaf<Model>[]} data - The array of Leaf objects to convert.
 * @returns {TreeDataNode[]} The converted array of TreeDataNode objects.
 */
export const leavesToAntTreeData = <Model>(data: Leaf<Model>[]): TreeDataNode[] => {
  const map: { [key: string]: TreeDataNode } = {};
  const treeData: TreeDataNode[] = [];

  const data_ = data.filter(item => !item.hidden);

  // Create a mapping of IDs to TreeDataNode objects
  data_.forEach(node => {
    map[node.value] = {
      disabled: node.disabled,
      rawData: node.rawData,
      title: node.label,
      value: node.value,
      searchValue: node.searchValue,
      children: [],
    };
  });

  // Build the tree structure
  data_.forEach(node => {
    const treeNode = map[node.value];
    // Add root nodes directly to treeData
    if (node.parent === null) {
      treeData.push(treeNode);
    }
    // Add children to their respective parent nodes
    else {
      const parentTreeNode = map[node.parent];
      if (parentTreeNode) {
        parentTreeNode.children = parentTreeNode.children ?? [];
        parentTreeNode.children?.push(treeNode);
      }
    }
  });

  return treeData;
};
