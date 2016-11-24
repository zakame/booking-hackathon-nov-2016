$(document).ready(function() {
  var confId = getUrlParameter('confId');
  getConferenceDetails(confId).then(function(data){
    renderConferenceDetails(data);
  });
});

var goToSignUp = function(signUpUrl) {
  window.open(signUpUrl);
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
