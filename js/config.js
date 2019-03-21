// Initialize Firebase
var config = {
  apiKey: "AIzaSyAibcZTu2ldbVMNrj0hQr3f2dMTfxnQVJY",
  authDomain: "evocative-reef-120709.firebaseapp.com",
  databaseURL: "https://evocative-reef-120709.firebaseio.com",
  projectId: "evocative-reef-120709",
  storageBucket: "evocative-reef-120709.appspot.com",
  messagingSenderId: "62185104409"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var domain = getParameterByName('domain');
var campaignId = getParameterByName('campaignId');
var features = getParameterByName('features');

var featuresArray = features.split(",");

function filterNavHeaderBasedOnFeatures(currentNavItem) {
  $("#navHeader").load("../htmlComponents/header.html", function(){
    for (let i = 0; i < featuresArray.length; i++){
      switch (featuresArray[i]) {
        case "Analytics":
          $("#insightsNavItem").show();
          break;
        case "Surveys":
          $("#surveysNavItem").show();
          break;
        case "PromotersPerformance":
          $("#promoterLogsNavItem").show();
          break;
        case "PromotersMap":
          $("#promoterMapsNavItem").show();
          break;
        default:
          console.log("Error Removing Header Item");
      }
    }

    $("#agencyName").text(domain);
    $("#" + currentNavItem).addClass("active");
    // pass params to links
    $('.nav-link').each(function(i, obj) {
        if ($(this).is(":hidden")){
          $(this).remove();
        } else {
          let href = $(this).attr("href");
          $(this).attr("href", `${href}?campaignId=${campaignId}&domain=${domain}&features=${features}`);
        }
    });
  });
}
