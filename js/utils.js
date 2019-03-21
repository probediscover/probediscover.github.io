function snapshotToArray(snapshot) {
    var returnArr = [];
    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
};

function getParameterByName(name, url) {
     if (!url) url = window.location.href;
     name = name.replace(/[\[\]]/g, '\\$&');
     var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
         results = regex.exec(url);
     if (!results) return null;
     if (!results[2]) return '';
     return decodeURIComponent(results[2].replace(/\+/g, ' '));
 }

function convertBooleanToYesNo(booleanVariable) {
    if (booleanVariable)
        return 'yes';
    else
        return 'no';
}

function dataHasGender(){
    // Check and see if surveys contain a gender field
    if (surveys.length > 0){
      for (let i = 0; i < surveys[0]['fields'].length; i++){
        let fieldTitle = surveys[0]['fields'][i]['title'].toLowerCase();
        if (fieldTitle.includes("gender") || fieldTitle.includes("sex"))
          return true;
      }
      return false;
    }
  }

function getFieldIndex(fieldTitle) {
    const firstSurveyIndex = 0;
    if (surveys.length > 0)
        for (let i = 0; i < surveys[firstSurveyIndex].fields.length; i++){
            if (surveys[firstSurveyIndex].fields[i]['title'].toLowerCase() === fieldTitle.toLowerCase())
                return i;
        }
    return -1;
}
