// graph.js

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

export function createGraph(graphElement, data) {
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

export function updateGraph({ svg, simulation }, newData) {
  console.log("Updating graph with new data", newData);
  const updatedNodes = newData.nodes.map((d) => Object.create(d));
  const updatedLinks = newData.links.map((d) => Object.create(d));

  d3.forceLink(updatedLinks).id((d) => d.id);

  simulation.nodes(updatedNodes).links(updatedLinks);

  simulation.alpha(1).restart();

  svg
    .selectAll(".links")
    .selectAll("line")
    .data(updatedLinks)
    .join("line")
    .attr("stroke-width", 1);

  const node = svg
    .selectAll(".nodes")
    .selectAll("circle")
    .data(updatedNodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", "#69b3a2")
    .call(drag(simulation));

  node.append("title").text((d) => d.id);
}
