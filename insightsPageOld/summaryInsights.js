function displaySummaryInsights() {

    let numOfInteractedClients = 0;
    let numOfBoughtClients = 0;
    let numOfNotBoughtClients = 0;
    for (let i = 0; i < surveys.length; i++){
        if (surveys[i].sampled === true)
            numOfInteractedClients++;

        if (surveys[i].bought === true)
            numOfBoughtClients++;

        if (surveys[i].bought === false)
            numOfNotBoughtClients++;
    }

    $("#numberOfSurveysSubmitted").text(surveys.length);
    $("#numberOfInteractedClients").text(numOfInteractedClients);
    $("#numberOfBoughtClients").text(numOfBoughtClients);
    $("#numberOfNotBoughtClients").text(numOfNotBoughtClients);
}