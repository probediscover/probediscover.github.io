var chartBackgroundColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ];
function createChart(ctx, baseLabels, datasetData, datasetLabel){
  // Generate Datasets
  var datasets = [];
  for (let i = 0; i < datasetLabel.length; i++){
    var backgroundColor = [];
    var borderColor = [];
    for (let j = 0; j < datasetData[i].length; j++){
      backgroundColor.push(chartBackgroundColors[i]);
      borderColor.push(chartBackgroundColors[i]);
    }

    datasets.push({
      label: datasetLabel[i],
      data: datasetData[i],
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1
    })
  }

  return new Chart(ctx, {
      type: 'bar',
      data: {
          labels: baseLabels,
          datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
              enabled: true
          },
          hover: {
              animationDuration: 1
          },
          animation: {
              duration: 1,
              onComplete: function () {
                  var chartInstance = this.chart,
                      ctx = chartInstance.ctx;
                  ctx.textAlign = 'center';
                  ctx.fillStyle = "rgba(0, 0, 0, 1)";
                  ctx.textBaseline = 'bottom';

                  this.data.datasets.forEach(function (dataset, i) {
                      var meta = chartInstance.controller.getDatasetMeta(i);
                      meta.data.forEach(function (bar, index) {
                          let data = dataset.data[index];
                          let barHeight = bar._model.y - bar._model.base;
                          let verticalCenter = bar._model.base + barHeight / 2;
                          ctx.fillText(data, bar._model.x, verticalCenter);
                      });
                  });
              }
          },
          legendCallback: function(chart) {
              var text = [];
              text.push('<ul>');
              for (let i = 0; i < chart.data.datasets.length; i++) {
                  text.push('<li>');
                  text.push('<span style="background-color:' + chart.data.datasets[i].backgroundColor[0] + '"></span>');
                  if (chart.data.datasets[i].label) {
                      text.push(chart.data.datasets[i].label);
                  }
                  text.push('</li>');
              }
              text.push('</ul>');
              return text.join("");
          },
          legend: {
              display: false
          },
          scales: {
              xAxes: [{
                ticks: {
                  autoSkip: false
                }
              }],
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  })
}

var maxBarsForWidth;
var widthToAddToChart;
if ($(window).width() < 700){
    maxBarsForWidth = 3;
    widthToAddToChart = 150;
}
else {
    maxBarsForWidth = 7;
    widthToAddToChart = 100;
}

function increaseBarGraphWidth(labelsArray, wrapperName){
  if (labelsArray.length > maxBarsForWidth){
    let graphWidth = $('#' + wrapperName).width();
    let newWidth = graphWidth + (labelsArray.length - maxBarsForWidth) * widthToAddToChart;
    $('#' + wrapperName).width(newWidth);
  }
}

// Populate Location chart that is not affected by location selection
var locationLabels = [];
var locationSold = [];
var locationSampled = [];
var legendLabels = ["Sold", "Sampled"];

function locationSampleSoldChart(){
  var locationDataSets = [];
  for (let i = 0; i < campaign['locations'].length; i++){
    let locationName = campaign['locations'][i]['location'];
    let locationIndex = locationLabels.indexOf(locationName);
    if (locationIndex === -1){
      locationIndex = locationLabels.length;
      locationLabels.push(locationName);
      locationSold[locationIndex] = 0;
      locationSampled[locationIndex] = 0;
    }
  }
  for (let i = 0; i < surveys.length; i++){
    let locationName = surveys[i]['location'];
    let locationIndex = locationLabels.indexOf(locationName);

    if (locationIndex === -1)
      continue;

    if (surveys[i]['bought'] === true)
      locationSold[locationIndex]++;
    else
      locationSampled[locationIndex]++;
  }

  locationDataSets[0] = locationSold;
  locationDataSets[1] = locationSampled;

  var locationSampledSoldChartctx = document.getElementById("locationSampledSoldChart").getContext('2d');
  var locationSampledSoldChart = createChart(locationSampledSoldChartctx, locationLabels, locationDataSets, legendLabels);

  increaseBarGraphWidth(locationLabels, 'locationSampledSoldChartAreaWrapper2');
  document.getElementById('locationChartLegend').innerHTML = locationSampledSoldChart.generateLegend();
}

// Populate Daily Performance chart
var dateSampledSoldChart;
var dateLabels;
function loadDayDateForLocation(location){
  dateLabels = [];
  var dateSold = [];
  var dateSampled = [];
  var dateDataSets = [];
  var dateTimestamps = [];

  for (let i = 0; i < surveys.length; i++){
    let locationName = surveys[i]['location'];
    if (location !== 'All' && locationName !== location)
      continue;
    let dateName = surveys[i]['timestamp'].slice(0, 10);
    let dateIndex = dateLabels.indexOf(dateName);

    if (dateIndex === -1){
        dateIndex = dateLabels.length;
        dateLabels.push(dateName);
        dateSold[dateIndex] = 0;
        dateSampled[dateIndex] = 0;
        // For Sorting
        dateTimestamps.push(surveys[i]['realTimestamp'])
    }

    if (surveys[i]['bought'] === true)
      dateSold[dateIndex]++;
    else
      dateSampled[dateIndex]++;
  }

  // Sort Dates
  for (let i = 0; i < dateTimestamps.length - 1; i++){
    for (let j = i + 1; j < dateTimestamps.length; j++){
      if (dateTimestamps[i] > dateTimestamps[j]){
        dateTimestamps[i] = dateTimestamps.splice(j, 1, dateTimestamps[i])[0];
        dateLabels[i] = dateLabels.splice(j, 1, dateLabels[i])[0];
        dateSold[i] = dateSold.splice(j, 1, dateSold[i])[0];
        dateSampled[i] = dateSampled.splice(j, 1, dateSampled[i])[0];
      }
    }
  }

  dateDataSets[0] = dateSold;
  dateDataSets[1] = dateSampled;

  var dateSampledSoldChartctx = document.getElementById("dateSampledSoldChart").getContext('2d');
  dateSampledSoldChart = createChart(dateSampledSoldChartctx, dateLabels, dateDataSets, legendLabels);

  increaseBarGraphWidth(dateLabels, 'dateSampledSoldChartAreaWrapper2');
  document.getElementById('dateChartLegend').innerHTML = dateSampledSoldChart.generateLegend();
}

// Populate Hourly Performance chart
var hourSampledSoldChart;
function loadHourDateForLocation(location, date){
  var hourLabels = [];
  var hourSold = [];
  var hourSampled = [];
  var hourDataSets = [];
  for (let i = 0; i < surveys.length; i++){
    let locationName = surveys[i]['location'];
    let dateName = surveys[i]['timestamp'].slice(0, 10);
    if (location !== 'All' && locationName !== location)
      continue;
    if (date !== 'All' && dateName !== date)
      continue;

    let hourName = surveys[i]['timestamp'].slice(16, 18);
    let hourIndex = hourLabels.indexOf(hourName);

    if (hourIndex === -1){
        hourIndex = hourLabels.length;
        hourLabels.push(hourName);
        hourSold[hourIndex] = 0;
        hourSampled[hourIndex] = 0;
    }

    if (surveys[i]['bought'] === true)
      hourSold[hourIndex]++;
    else
      hourSampled[hourIndex]++;
  }

  // Sort Hours
  for (let i = 0; i < hourLabels.length - 1; i++){
    for (let j = i + 1; j < hourLabels.length; j++){
      if (hourLabels[i] > hourLabels[j]){
        hourLabels[i] = hourLabels.splice(j, 1, hourLabels[i])[0];
        hourSold[i] = hourSold.splice(j, 1, hourSold[i])[0];
        hourSampled[i] = hourSampled.splice(j, 1, hourSampled[i])[0];
      }
    }
  }

  hourDataSets[0] = hourSold;
  hourDataSets[1] = hourSampled;

  var hourSampledSoldChartctx = document.getElementById("hourSampledSoldChart").getContext('2d');
  hourSampledSoldChart = createChart(hourSampledSoldChartctx, hourLabels, hourDataSets, ["Sold", "Sampled"]);

  increaseBarGraphWidth(hourLabels, 'hourSampledSoldChartAreaWrapper2');
  document.getElementById('hourChartLegend').innerHTML = hourSampledSoldChart.generateLegend();
}

// Index for Gender Field in "Fields" in Surveys
var genderFieldIndex = 0;

// Populate Both Gender Performance chart
var genderSampledSoldChart;
function loadGenderSoldSampledPerformanceForLocation(location, date){
  var genderLabels = ["Male", "Female"];
  var genderSold = [0, 0];
  var genderSampled = [0, 0];
  var genderDataSets = [];

  var isFound = false;
  if (surveys.length > 0){
    for (let i = 0; i < surveys[0]['fields'].length && !isFound; i++){
      let genderFieldTitle = surveys[0]['fields'][i]['title'].toLowerCase();
      if (genderFieldTitle === "gender" || genderFieldTitle === "sex"){
        genderFieldIndex = i;
        isFound = true;
      }
    }
  }

  for (let i = 0; i < surveys.length; i++){
    let locationName = surveys[i]['location'];
    let dateName = surveys[i]['timestamp'].slice(0, 10);
    if (location !== 'All' && locationName !== location)
      continue;
    if (date !== 'All' && dateName !== date)
      continue;

    if (surveys[i]['bought'] === true) {
      if (surveys[i]['fields'][genderFieldIndex]['response'][0].toLowerCase() === 'male')
        genderSold[0]++; // males
      else
        genderSold[1]++; // females
    } else {
      if (surveys[i]['fields'][genderFieldIndex]['response'][0].toLowerCase() === 'male')
        genderSampled[0]++; // males
      else
        genderSampled[1]++; // females
    }
  }

  genderDataSets[0] = genderSold;
  genderDataSets[1] = genderSampled;

  var genderSampledSoldChartctx = document.getElementById("genderSampledSoldChart").getContext('2d');
  genderSampledSoldChart = createChart(genderSampledSoldChartctx, genderLabels, genderDataSets, ["Sold", "Sampled"]);

  increaseBarGraphWidth(genderLabels, 'genderSampledSoldChartAreaWrapper2');
  document.getElementById('genderSampledSoldChartLegend').innerHTML = genderSampledSoldChart.generateLegend();
}

// Populate Conversion Performance chart
var conversionSampledSoldChart;
function loadConversionForAllLocations(){
  var conversionLabels = locationLabels;
  var conversion = [];
  for (let i = 0; i < locationSold.length; i++){
    conversion.push(+((locationSold[i] / locationSampled[i]).toFixed(2)));
  }
  var conversionDataSets = [];

  conversionDataSets[0] = conversion;
  console.log(conversionDataSets);

  var conversionSampledSoldChartctx = document.getElementById("conversionSampledSoldChart").getContext('2d');
  conversionSampledSoldChart = createChart(conversionSampledSoldChartctx, conversionLabels, conversionDataSets, ["Conversion"]);

  increaseBarGraphWidth(conversionLabels, 'conversionSampledSoldChartAreaWrapper2');
  document.getElementById('conversionChartLegend').innerHTML = conversionSampledSoldChart.generateLegend();
}

// For daily Performance
$(document).on('change','#locationSelectOptions',function(){
  let location = $(this).find(":selected").text();
  dateSampledSoldChart.destroy();
  loadDayDateForLocation(location);
});
// For Hourly Performance
$(document).on('change','#locationSelectOptionsForHourlyPerformance',function(){
  let location = $(this).find(":selected").text();
  let date = $("#dateSelectOptionsForHourlyPerformance").find(":selected").text();
  hourSampledSoldChart.destroy();
  loadHourDateForLocation(location, date);
});
// For Hourly Performance
$(document).on('change','#dateSelectOptionsForHourlyPerformance',function(){
  let date = $(this).find(":selected").text();
  let location = $("#locationSelectOptionsForHourlyPerformance").find(":selected").text();
  hourSampledSoldChart.destroy();
  loadHourDateForLocation(location, date);
});
// For Gender Sampled Sold Performance Location
$(document).on('change','#genderSampledSoldSelectPerformance',function(){
  let location = $(this).find(":selected").text();
  let date = $('#genderSampledSoldDateSelectPerformance').find(":selected").text();
  genderSampledSoldChart.destroy();
  loadGenderSoldSampledPerformanceForLocation(location, date);
});
// For Gender Sampled Sold Performance Date
$(document).on('change','#genderSampledSoldDateSelectPerformance',function(){
  let location = $("#genderSampledSoldSelectPerformance").find(":selected").text();
  let date = $(this).find(":selected").text();
  genderSampledSoldChart.destroy();
  loadGenderSoldSampledPerformanceForLocation(location, date);
});