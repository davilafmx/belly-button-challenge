// Put the Link intro a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function init() {

  // Use the dropdown selector
  var dropdownSelector = d3.select("#selDataset");
  
  // Put the Subject ID in the dropdown slector using an arrow function
    d3.json(url).then((data) => {
      var subjectId = data.names;
      subjectId.forEach((id) => {
        dropdownSelector
        .append("option")
        .text(id)
        .property("value", id);
      });
    
    // Use the first ID's to update the charts
    const firstId = subjectId[0];
    updateCharts(firstId);
    updateMetadata(firstId);
  });
}


// Put the selected data into variables using arrow functions
function updateMetadata(sample) {
  d3.json(url).then((data) => {
      var metadata = data.metadata;
      var filterOne = metadata.filter(sampleObject => sampleObject.id == sample);
      var results = filterOne[0];
      var metaP = d3.select("#sample-metadata");
      metaP.html("");
      Object.entries(results).forEach(([key, value]) => {
          metaP.append("h6").text(`${key.toUpperCase()}: ${value}`)
      })
  
// Data for Gauge Chart
  var data = [

  {
    type: "indicator",
    mode: "gauge+number+delta",
    value: results.wfreq,
    title: { text: 'Belly Button Scrubs<br> per Week', font: { size: 24 } },
    delta: { reference: 0, increasing: { color: "RebeccaPurple" } },
    gauge: {
      axis: { range: [null, 15], tickwidth: 1, tickcolor: "darkblue" },
      bar: { color: "darkblue" },
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "gray",
      steps: [
        { range: [0, 15], color: "cyan" },
        { range: [0, 15], color: "royalblue" }
      ],
    }
  }
];
  // Layout for Gauge Chart

  var layout = {
    width: 350,
     height: 300,
     margin: { t: 25, r: 25, l: 25, b: 25 },
     line: {
     color: '600000'
     },
     paper_bgcolor: "cornsilk",
     font: { color: "darkblue", family: "Arial" }
   };

  
  Plotly.newPlot("gauge", data, layout);
  });
}

// Updating the charts with the selected ID
function updateCharts(sample) {    
  d3.json(url).then((data) => {
  var samples = data.samples;
  var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
  var result = filterArray[0];
  var sample_values = result.sample_values;
  var otu_ids = result.otu_ids;
  var otu_labels = result.otu_labels; 

  // Bubble Chart
  var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
      size: sample_values,
      color: otu_ids,
      colorscale:"continent"
      }
  };
  var data = [trace1];
  var layout = {
      title: 'OTU ID',
      showlegend: false,
      hovermode: 'closest',
      xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
      margin: {t:30}
  };
  Plotly.newPlot('bubble', data, layout); 

  // Bar Chart
  var trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      name: "Greek",
      type: "bar",
      orientation: "h"
  };
  var data = [trace1];
  var layout = {
      title: "Top 10 OTUs found in that individual " +sample,
      margin: {l: 100, r: 100, t: 100, b: 100}
  };
  Plotly.newPlot("bar", data, layout);  
  });
}

// This function updates the chart everytime a new ID is selected

function optionChanged(newSample) {
  updateCharts(newSample);
  updateMetadata(newSample);
}

// Run everything
init();