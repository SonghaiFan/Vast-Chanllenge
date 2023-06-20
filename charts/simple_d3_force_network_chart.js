// graph.js

// Define setup and configuration for data display
// The function should include the following:
// createGraph function to create the initial graph
// - This function should take two arguments:
// - graphElement: the DOM element where the graph will be displayed
// - data: the data to be displayed
// updateGraph function to update the graph with new data
// - This function should take two arguments:
// - graph: an object containing the SVG and simulation objects or any other objects needed to update the graph
// - data: the data to be displayed

const nodeSize = 10;

const nodesType = [
  "company",
  "organization",
  "unknown",
  "person",
  "location",
  "political_organization",
  "vessel",
  "movement",
  "event",
];
const linksType = [
  "ownership",
  "partnership",
  "family_relationship",
  "membership",
];

const linkColorScale = d3
  .scaleOrdinal()
  .domain(linksType)
  .range(d3.schemeTableau10);

function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

function addLinkLegend(svg, width) {
  const linkLegend = svg
    .append("g")
    .attr("class", "linkLegend")
    .attr("transform", `translate(${width - 150}, 20)`);

  linksType.forEach((type, i) => {
    const legendRow = linkLegend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    legendRow
      .append("line")
      .attr("x1", -10)
      .attr("x2", 0)
      .attr("stroke", linkColorScale(type))
      .attr("stroke-width", 10);

    legendRow
      .append("text")
      .attr("x", 10)
      .attr("y", 0)
      .attr("dy", ".35em") // to vertically align text
      .text(type);
  });
}

function addNodeLegend(svg) {
  const nodeLegend = svg
    .append("g")
    .attr("class", "nodeLegend")
    .attr("transform", "translate(20,20)");

  const nodeSize = 10; // Define a suitable size for the icons in the legend

  nodesType.forEach((type, i) => {
    const legendRow = nodeLegend
      .append("g")
      .attr("transform", `translate(0, ${i * (nodeSize + 2)})`); // Including some vertical space between items

    legendRow
      .append("image")
      .attr(
        "xlink:href",
        type ? `../icons/${type}.png` : `../icons/unknown.png`
      ) // Use the type to get the correct icon
      .attr("width", nodeSize)
      .attr("height", nodeSize);

    legendRow
      .append("text")
      .attr("x", nodeSize + 2) // Position the label to the right of the icon
      .attr("y", nodeSize / 2) // Center the label vertically relative to the icon
      .attr("dy", ".35em") // A common adjustment to vertically center text
      .text(type);
  });
}

// Updated createGraph function
export function createGraph(graphElement, data) {
  // get width and height of the graph element
  const width = graphElement.clientWidth;
  const height = graphElement.clientHeight;
  // Define the SVG for the visualization

  console.log(linksType);
  const svg = d3
    .select(graphElement)
    .html("") // Clear the previous graph
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const links = data.links.map((d) => Object.create(d));
  const nodes = data.nodes.map((d) => Object.create(d));

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Add node legend
  addNodeLegend(svg);

  // Add link legend
  addLinkLegend(svg, width);

  // Add the links and the node

  const g = svg.append("g");

  const link = g
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links, (d) => d.source + "-" + d.target)
    .join("line")
    .attr("stroke", (d) => linkColorScale(d.type))
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 0.6);

  const node = g
    .append("g")
    .attr("class", "nodes")
    .selectAll("image")
    .data(nodes, (d) => d.id)
    .join("image")
    .attr("xlink:href", (d) =>
      d.type ? `../icons/${d.type}.png` : `../icons/unknown.png`
    )
    .attr("height", nodeSize) // size of the image
    .attr("width", nodeSize) // size of the image
    .attr("x", (d) => -nodeSize / 2) // center the image at the node position
    .attr("y", (d) => -nodeSize / 2) // center the image at the node position
    .call(drag(simulation));

  node.append("title").text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  // Create zoom behavior
  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 8]) // The zoom range
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom); // Attach zoom behavior to the svg

  return { svg, simulation, nodes, links, zoom };
}

// Updated updateGraph function
export function updateGraph({ svg, simulation }, data, entityId) {
  console.log("Updating graph with new data", data);

  const updatedNodes = data.nodes.map((d) => Object.create(d));
  const updatedLinks = data.links.map((d) => Object.create(d));

  const linkForce = d3.forceLink(updatedLinks).id((d) => d.id);

  simulation.nodes(updatedNodes);
  simulation.force("link", linkForce);

  simulation.alpha(1).restart();

  const link = svg
    .selectAll(".links")
    .selectAll("line")
    .data(updatedLinks, (d) => d.source + "-" + d.target)
    .join(
      (enter) =>
        enter
          .append("line")
          .attr("stroke", (d) => linkColorScale(d.type))
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.6),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("stroke-width", 1);

  const getNodeSize = (d) => {
    // using "==", because d.id is a string and entityId is a number
    if (d.id == entityId) {
      return nodeSize * 2.5;
    }
    return nodeSize;
  };

  const node = svg
    .selectAll(".nodes")
    .selectAll("image")
    .data(updatedNodes, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append("image")
          .attr("xlink:href", (d) =>
            d.type ? `../icons/${d.type}.png` : `../icons/unknown.png`
          )
          .classed("selected", (d) => d.id == entityId)
          .attr("height", getNodeSize)
          .attr("width", getNodeSize)
          .attr("x", (d) => -getNodeSize(d) / 2)
          .attr("y", (d) => -getNodeSize(d) / 2)
          .call(drag(simulation)),
      (update) =>
        update
          .classed("selected", (d) => d.id == entityId)
          .attr("height", getNodeSize)
          .attr("width", getNodeSize)
          .attr("x", (d) => -getNodeSize(d) / 2)
          .attr("y", (d) => -getNodeSize(d) / 2),
      (exit) => exit.remove()
    );

  node.append("title").text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });
}
