// main.js
import { loadData, filterData } from "./data.js";
import {
  createGraph,
  updateGraph,
} from "../charts/simple_d3_force_network_chart.js";

const graphElement = document.getElementById("graph");
const searchForm = document.getElementById("search-form");

let fullData;

async function init() {
  fullData = await loadData();
  console.log(fullData);
  const graph = createGraph(graphElement, fullData);

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the form from submitting normally
    console.log("Search submitted");
    const entityId = document.getElementById("search").value;

    console.log("Entity ID: " + entityId + ", Entity type: " + typeof entityId);

    const filteredData = filterData(fullData, entityId, 1);
    const { svg, simulation } = graph;

    updateGraph({ svg, simulation }, filteredData);
  });

  // Listen for user interactions
  graphElement.addEventListener("click", getSelectedData);
}

// Run graph creation function with default node
init();

// Function to get selected data
function getSelectedData(data) {
  // ... code to retrieve selected subset of data
  const selectedData = "some data: " + Math.random();
  console.log("Selected data: " + selectedData);
  // Use postMessage to communicate data to other scripts
  window.postMessage({ type: "DATA_SELECTED", data: selectedData }, "*");
}
