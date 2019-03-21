// contains all the data needed for the excel sheet
let locationObject = {};

let fieldIndices = [];
let fieldValues = {};

let elementTitleIndices = {};

function generateExcel(topFieldsToCompute) {

    let sampledData = [];
    let soldData = [];

    // add date at beginning
    let excelHeaderSampled = [];
    let excelHeaderSold = [];

    for (let i = 0; i < topFieldsToCompute.length; i++){
        let fieldTitle = topFieldsToCompute[i];
        let fieldIndex = getFieldIndex(fieldTitle);

        if (fieldIndex !== -1){
            // for fast injection when looping over surveys
            fieldIndices.push(fieldIndex);

            // get all the individual elements for this field
            for (let j = 0; j < surveys[0]['fields'][fieldIndex]['options'].length; j++){
                let elementTitle = surveys[0]['fields'][fieldIndex]['options'][j]['title'];

                sampledData.push(0);
                soldData.push(0);
                excelHeaderSampled.push(elementTitle + " Sampled");
                excelHeaderSold.push(elementTitle + " Sold");
                // store specific element index to locate it inside sampled or sold array
                elementTitleIndices[elementTitle] = j;
            }

            let optionTitle = topFieldsToCompute[i];
            sampledData.push(0);
            soldData.push(0);
            excelHeaderSampled.push("Total " + optionTitle + " Sampled");
            excelHeaderSold.push("Total " + optionTitle + " Sold");
        }
    }

    // for total sampled and total sold
    sampledData.push(0);
    soldData.push(0);
    excelHeaderSampled.push("Total Sampled");
    excelHeaderSold.push("Total Sold");

    for (let i = 0; i < surveys.length; i++){
        let location = surveys[i]['location'];
        
        // check if location already added, if not... add it
        if (locationObject[location] === undefined)
            locationObject[location] = [];

        // need to change it to real timestamp
        let date = surveys[i]['timestamp'].slice(0, 10);

        // check if date already added, if not... add it
        let indexOfDate = checkIfDateInArray(location, date);
        if (indexOfDate === -1) {
            // slice creates a new copy of the array
            locationObject[location].push({ 'date': date, 'sampledData': sampledData.slice(), 'soldData': soldData.slice() });
            indexOfDate = locationObject[location].length - 1;
        }

        // need to sort the dates

        for (let j = 0; j < fieldIndices.length; j++){
            let fieldIndex = fieldIndices[j];
            let surveyIndex = i;

            let sampled = surveys[i]['sampled'];
            if (sampled === true)
                incrementValueForSpecificField(location, indexOfDate, surveyIndex, 'sampled', fieldIndex);
                
    
            let bought = surveys[i]['bought'];
            if (bought === true)
                incrementValueForSpecificField(location, indexOfDate, surveyIndex, 'sold', fieldIndex);
        }        
    }
    console.log(locationObject);

    var filename = campaign.title + '.xlsx';
    var wb = XLSX.utils.book_new();

    for (var key in locationObject){

        let totalBought = 0;
        let totalSampled = 0;

        let excelRows = [
            ["Date"]
        ];

        const EXCEL_HEADER_INDEX = 0;

        // merge header arrays
        excelRows[EXCEL_HEADER_INDEX] = excelRows[EXCEL_HEADER_INDEX].concat(excelHeaderSampled, excelHeaderSold);

        for (let i = 0; i < locationObject[key].length; i++){

            // // used for location summary
            // totalBought += locationObject[key][i]['data'][indexOfBought];
            // totalSampled += locationObject[key][i]['data'][indexOfSampled];

            let date = locationObject[key][i]['date'];

            let sampledDataArray = locationObject[key][i]['sampledData'];
            let soldDataArray = locationObject[key][i]['soldData'];
            let data = sampledDataArray.concat(soldDataArray);

            // adds date to the beginning of data array
            data.unshift(date);
            excelRows.push(data);
        }

        // create two empty rows for spacing
        excelRows.push([], []);

        // let avgBought = totalBought / locationObject[key].length;
        // let avgSampled = totalSampled / locationObject[key].length;

        // excelRows.push(["Total Sold", totalBought]);
        // excelRows.push(["Total Sampled", totalSampled]);
        // excelRows.push(["Average Sold", avgBought]);
        // excelRows.push(["Average Sampled", avgSampled]);

        var ws_name = key;
        var ws = XLSX.utils.aoa_to_sheet(excelRows);

        /* add worksheet to workbook */
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
    }

    /* write workbook */
    XLSX.writeFile(wb, filename);
}

function checkIfDateInArray(location, date) {
    for (let i = 0; i < locationObject[location].length; i++){
        if (locationObject[location][i]['date'] === date)
            return i;
    }
    return -1;
}

// type is sampled or sold
function incrementValueForSpecificField(location, indexOfDate, surveyIndex, type, fieldIndex) {

    let arrayType = "";
    if (type === "sampled")
        arrayType = "sampledData";
    else
        arrayType = "soldData";

    for (let i = 0; i < surveys[surveyIndex]['fields'][fieldIndex]['response'].length; i++){
        let elementSelectedTitle = surveys[surveyIndex]['fields'][fieldIndex]['response'][i];
        if (elementSelectedTitle !== ""){
            let elementIndex = elementTitleIndices[elementSelectedTitle];
            locationObject[location][indexOfDate][arrayType][elementIndex]++;

            let totalIndex = locationObject[location][indexOfDate][arrayType].length - 1;
            locationObject[location][indexOfDate][arrayType][totalIndex]++;
        }
   } 
}