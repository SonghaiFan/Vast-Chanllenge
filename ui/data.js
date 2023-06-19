// data.js

export async function loadData() {
  const fullData = await d3.json("../data/MC1.json");
  return fullData;
}

// Function to filter the data to create a subgraph based on a node and its neighbors up to a certain level
export function filterData(fullData, nodeId, level) {
  const nodeNeighbors = new Set(); // Set to store nodeId and its neighbors

  // Helper function to find all neighbors
  function findNeighbors(id, currentLevel) {
    if (currentLevel > level) {
      return;
    }

    nodeNeighbors.add(id);

    fullData.links.forEach((link) => {
      if (link.source === id && !nodeNeighbors.has(link.target)) {
        findNeighbors(link.target, currentLevel + 1);
      } else if (link.target === id && !nodeNeighbors.has(link.source)) {
        findNeighbors(link.source, currentLevel + 1);
      }
    });
  }

  // Start the search
  findNeighbors(nodeId, 0);

  // Filter nodes and links to include only those in the subgraph
  const nodes = fullData.nodes.filter((node) => nodeNeighbors.has(node.id));
  const links = fullData.links.filter(
    (link) => nodeNeighbors.has(link.source) && nodeNeighbors.has(link.target)
  );

  return { nodes, links };
}
