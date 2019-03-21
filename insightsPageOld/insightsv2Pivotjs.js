

var pivotRows = [];
var pivotSurveys = [];
function initializePivotTable(){
  for (let i = 0; i < surveys.length; i++){
      let surveyObject = surveys[i];

      let location = surveyObject['location'];
      let date = surveyObject['timestamp'].slice(0, 10);
      let bought = convertBooleanToYesNo(surveyObject['bought']);

      pivotSurveys.push({ location: location, date: date, bought: bought });

      for (let j = 0; j < surveyObject['fields'].length; j++){
        let fieldTitle = surveyObject['fields'][j]['title'];
        let fieldValueArray = surveyObject['fields'][j]['response'];
        for (let k = 0; k < fieldValueArray.length; k++){
          let fieldValue = fieldValueArray[k];
          if (fieldValue !== "")
            pivotSurveys[pivotSurveys.length - 1][fieldTitle] = fieldValue;
        }
      }
  }
}

function createPivotTable(pivotId, rows, cols, vals){
  var dataClass = $.pivotUtilities.SubtotalPivotData;
  var derivers = $.pivotUtilities.derivers;
  var renderers = $.extend(
    $.pivotUtilities.c3_renderers, $.pivotUtilities.subtotal_renderers);

  $("#" + pivotId).pivotUI(
      pivotSurveys,
      {
          rows: rows,
          cols: cols,
          vals: vals,
          dataClass: dataClass,
          renderers: renderers,
          rendererName: "Table With Subtotal",
          rendererOptions: {
            c3: { data: {colors: {
                Liberal: '#dc3912', Conservative: '#3366cc', NDP: '#ff9900',
                Green:'#109618', 'Bloc Quebecois': '#990099'
            }}},
            rowSubtotalDisplay: {
                disableExpandCollapse: true
            },
            colSubtotalDisplay: {
                disableExpandCollapse: true
            }
        }
      }
  );
}
// End Of PIVOT Table
