// main.js
import { loadData, filterData } from "./data.js";
import {
  createGraph,
  updateGraph,
} from "../charts/simple_d3_force_network_chart.js";

const graphElement = document.getElementById("graph");
const searchForm = document.getElementById("search-form");

let data;

async function init() {
  data = await loadData();
  console.log(data);
  const graph = createGraph(graphElement, data);

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the form from submitting normally
    console.log("Search submitted");
    const entityId = document.getElementById("search").value;

    console.log("Entity ID: " + entityId + ", Entity type: " + typeof entityId);

    const filteredData = filterData(data, entityId, 1);
    const { svg, simulation } = graph;

    updateGraph({ svg, simulation }, filteredData, entityId); // Pass filteredData here
    getSelectedData(filteredData); // Pass filteredData here
  });

  // Listen for user interactions
  // graphElement.addEventListener("click", getSelectedData(data));
}

// Run graph creation function with default node
init();

// Function to get selected data
function getSelectedData(data) {
  // ... code to retrieve selected subset of data
  const selectedData = data;
  // Use postMessage to communicate data to other scripts
  window.postMessage({ type: "DATA_SELECTED", data: selectedData }, "*");
}
