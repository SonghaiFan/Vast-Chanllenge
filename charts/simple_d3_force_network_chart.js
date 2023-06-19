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

// Updated createGraph function
export function createGraph(graphElement, data) {
  // get width and height of the graph element
  const width = graphElement.clientWidth;
  const height = graphElement.clientHeight;
  // Define the SVG for the visualization
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

  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 1);

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", "#69b3a2")
    .call(drag(simulation));

  node.append("title").text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  return { svg, simulation, nodes, links };
}

// Updated updateGraph function
export function updateGraph({ svg, simulation }, data) {
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
    .data(updatedLinks)
    .join(
      (enter) => enter.append("line"),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("stroke-width", 1);

  const node = svg
    .selectAll(".nodes")
    .selectAll("circle")
    .data(updatedNodes)
    .join(
      (enter) => enter.append("circle").call(drag(simulation)),
      (update) => update,
      (exit) => exit.remove()
    )
    .attr("r", 5)
    .attr("fill", "#69b3a2");

  node.append("title").text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });
}
