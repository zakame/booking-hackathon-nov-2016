var queryConferences = function(queryString) {
  return $.getJSON("http://confy.localtunnel.me/conferences/?callback=");
}

var getConferenceDetails = function(confId) {
  return $.getJSON("http://confy.localtunnel.me/conferences/" + confId + "/?callback=");
}

var getHotels = function(confId) {
  return $.getJSON("http://confy.localtunnel.me/conferences/" + confId + "/hotels/?callback=")
}
