$(document).ready(function() {
  $("#loadingBar1").show();
  queryConferences().then(function(data){
    renderConferenceList(data);
    $("#loadingBar1").hide();
  });
  //renderConferenceList(queryConferences());
});

var goToDetails = function(confId) {
  window.location.href = "/details.html?confId=" + confId;
}

function renderConferenceList(conferences) {
  console.log("RENDERING...");
  //retrieve list and render
  _.templateSettings.variable = "rc";
  // Grab the HTML out of our template tag and pre-compile it.
  var template = _.template(
    $( "script.template" ).html()
  );

  var templateData = {};
  templateData.listItems = conferences;

  $("#conferenceList").empty();
  $("#conferenceList").html(template(templateData));
}
