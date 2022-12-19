//retrieve the JSON data from the URL and parse it into a JavaScript object
function buildMetaData(sample) {
  d3.json("samples.json").then((data) => {

    // get the metadata info for the demo panel
    var metadata = data.metadata;

  // Filter data
  var buildArray = metadata.filter(obj => obj.id == sample);
  var result = buildArray[0];
  // d3 for selector
  var panel = d3.select("#sample-metadata");

  // clears existing data
  panel.html("");

  
  Object.entries(result).forEach(([key, value]) => {
    panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
});
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sampleData = data.samples;
    
    var buildArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    var result = buildArray[0];
  
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    //  Bubble Chart with sample data
    const createBubbleChart = (otuIds, sampleValues, otuLabels) => {
      const chartConfig = {
        title: "Bacteria Cultures Per Sample",
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
      };
      const chartData = [
        {
          x: otuIds,
          y: sampleValues,
          text: otuLabels,
          mode: "markers",
          marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: "Earth",
          },
        },
      ];
      Plotly.newPlot("bubble", chartData, chartConfig);
    };
    
    createBubbleChart(otu_ids, sample_values, otu_labels);
    
    //creating a bar chart using the Plotly library.
    //The y-axis of the chart is determined by the yticks variable
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var chartLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, chartLayout);
  });
};

function init() {
  // ref to dropdown select element
  var selectDropdown = d3.select("#selDataset");

  // use the list of sample names to populate 'select options'
  d3.json("samples.json").then((data) => {
    var name = data.names;

    name.forEach((sample) => {
      selectDropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    })

    // build plots w sample data
    var sampleData = name[0];
    buildCharts(sampleData);
    buildMetaData(sampleData);
  });
};

function optionChanged(newSample) {
  // new data when new sample is selected 
  buildCharts(newSample);
  buildMetaData(newSample);
};


// Initialize dashboard
init()