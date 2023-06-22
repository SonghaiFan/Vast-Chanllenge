// display.js
// Define setup and configuration for data display

// Function to create data display
function createDisplay() {
  // ... code to create initial data display
}

const insightElement = document.getElementById("insight");

// Function to update data display
function updateDisplay(id, data) {
  // ... code to update display with new data
  const { nodes, links } = data;
  console.log(nodes);
  console.log(links);
  let matrix = Array(nodes.length)
    .fill(null)
    .map(() => Array(nodes.length).fill(0));

  links.forEach((link) => {
    let sourceIndex = nodes.findIndex((node) => node.id == link.source);
    let targetIndex = nodes.findIndex((node) => node.id == link.target);

    // Log out the link if it doesn't match any node
    if (sourceIndex === -1 || targetIndex === -1) {
      console.log("Link with no matching node found:", link);
    }

    matrix[sourceIndex][targetIndex] = 1;
    matrix[targetIndex][sourceIndex] = 1; // For undirected graphs
  });

  console.log(matrix);

  d3.select(insightElement).selectAll("*").remove();

  // Append an SVG to the insightElement
  let svg = d3
    .select(insightElement)
    .append("svg")
    .attr("width", nodes.length * 21) // +1 for grid lines
    .attr("height", nodes.length * 21) // +1 for grid lines
    .style("margin", "1em"); // optional, adds some margin around the svg

  // Draw the cells
  svg
    .selectAll("rect")
    .data(matrix.flat())
    .join("rect")
    .attr("x", (d, i) => (i % nodes.length) * 21) // change the size and/or the multiplier as needed
    .attr("y", (d, i) => Math.floor(i / nodes.length) * 21) // change the size and/or the multiplier as needed
    .attr("width", 20) // the size of cell
    .attr("height", 20) // the size of cell
    .attr("fill", (d) => (d ? "steelblue" : "#eee")) // color based on whether a link exists
    .attr("stroke", "gray"); // color of grid lines
}

// Listen for postMessages from other scripts
window.addEventListener("message", function (event) {
  // Check the event type
  if (event.data.type && event.data.type === "DATA_SELECTED") {
    const { id, data } = event.data;
    // If the event contains a data selection, update the display
    updateDisplay(id, data);
  }
});

// Run display creation function
createDisplay();
