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

    nodeNeighbors.add(String(id));

    fullData.links.forEach((link) => {
      const sourceId = String(link.source);
      const targetId = String(link.target);

      if (sourceId === id && !nodeNeighbors.has(targetId)) {
        findNeighbors(targetId, currentLevel + 1);
      } else if (targetId === id && !nodeNeighbors.has(sourceId)) {
        findNeighbors(sourceId, currentLevel + 1);
      }
    });
  }

  // Start the search
  findNeighbors(String(nodeId), 0);

  // Filter nodes and links to include only those in the subgraph
  const nodes = fullData.nodes.filter((node) =>
    nodeNeighbors.has(String(node.id))
  );
  const links = fullData.links.filter(
    (link) =>
      nodeNeighbors.has(String(link.source)) &&
      nodeNeighbors.has(String(link.target))
  );

  return { nodes, links };
}
