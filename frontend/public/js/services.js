var queryConferences = function(queryString) {
  return $.getJSON("/conferences/?callback=");
}

var getConferenceDetails = function(confId) {
  return $.getJSON("/conferences/" + confId + "/?callback=");
}

var getHotels = function(confId) {
  return $.getJSON("/conferences/" + confId + "/hotels/?callback=")
}
