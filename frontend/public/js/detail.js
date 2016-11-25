$(document).ready(function() {
  var confId = getUrlParameter('confId');
  getConferenceDetails(confId).then(function(data){
    var conference = data;
    renderConferenceDetails(conference);
    $("#loadingBar2").show();
    var myMap = initMap(conference.lat, conference.lng);
    getHotels(confId).then(function(results){
      renderHotels(results.hotels);
      createMarkers(myMap, results.hotels, conference.lat, conference.lng);
      $("#loadingBar2").hide();
    });
  });
});

var goToSignUp = function(signUpUrl) {
  window.open(signUpUrl);
}

var showInfo = function(hotelId) {
  $("#info"+hotelId).show();
}

function renderConferenceDetails(conference) {
  console.log("RENDERING...");
  //retrieve list and render
  _.templateSettings.variable = "rc";
  // Grab the HTML out of our template tag and pre-compile it.
  var template = _.template(
    $("script.detailTemplate").html()
  );

  var templateData = {};
  templateData.details = conference;

  $("#conferenceDetails").empty();
  $("#conferenceDetails").html(template(templateData));
}

function renderHotels(hotels) {
  console.log("RENDERING hotels...");
  //retrieve list and render
  _.templateSettings.variable = "rc2";
  // Grab the HTML out of our template tag and pre-compile it.
  var template = _.template(
    $("script.hotelsTemplate").html()
  );

  var templateData = {};
  templateData.listItems = hotels;

  $("#hotelNav").empty();
  $("#hotelNav").html(template(templateData));
}
