//global vars
var locationFilter = '';
var masterConferenceList = [];

$(document).ready(function() {
  initialize();

  //listen on enter event on locationFilter
  $('#locationFilter').keyup(function(e){
      if(e.keyCode == 13) {
          locationFilter = $('#locationFilter').val().toLowerCase();
          filterList();
      }
  });
});

var goToDetails = function(confId) {
  window.location.href = "/details.html?confId=" + confId;
}

var processFilters = function(dataList){
  if(locationFilter && locationFilter.length > 0){
    return _.filter(dataList, function(data) {
      return data.city.toLowerCase().includes(locationFilter)
      || data.state.toLowerCase().includes(locationFilter)
      || data.country.toLowerCase().includes(locationFilter);
    });
  } else {
    return dataList;
  }
}

function filterList() {
  $("#loadingBar1").show();
  renderConferenceList(processFilters(masterConferenceList));
  $("#loadingBar1").hide();
}

function initialize() {
  console.log("Initializing...");
  locationFilter = $('#locationFilter').val().toLowerCase();
  $("#loadingBar1").show();
  queryConferences().then(function(data){
    masterConferenceList = data;
    renderConferenceList(processFilters(data));
    $("#loadingBar1").hide();
  });
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
