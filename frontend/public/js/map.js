var map;
var directionsService;
var directionsDisplay;
var latitude;
var longitude;
var markerPosArr = new Array(); //array for the marker positions from google maps api


function get_location(somedate) {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initMap,show_err);


    //TODO do we need to call the getHotelAvailabiltyV2 from here ?
    $.ajax({
      url: "http://confy.localtunnel.me/gethotel",
      type: "GET",
      dataType: "json",
      data: {lat: latitude, lng: longitude},
      contentType: "application/json",

      success: function(route) {
        console.log('success on the ajax');
        console.log(route);
        var hotels = route.hotels;
        var hid;

        for(i=0;i<hotels.length;i++) {

          //console.log(markerPosArr)
          for(j=0;j<markerPosArr.length;j++) {
            //check if within range of POIs
            var latlng = new google.maps.LatLng(markerPosArr[j].lat(), markerPosArr[j].lng());
            var latlng1 = new google.maps.LatLng(hotels[i].location.latitude, hotels[i].location.longitude);
            //console.log(latlng);
            //console.log(latlng1);
            var dist = google.maps.geometry.spherical.computeDistanceBetween(latlng,latlng1);
            console.log(hotels[i].hotel_name + " about a " + dist + " meters");

            if(dist <= 300.0) {
              console.log(hotels[i].hotel_name + " about a " + dist + " meters");


              hid = hotels[i].hotel_id;

              //put a marker ??
              marker = new google.maps.Marker({
                map: map,
                draggable: false,
                animation: google.maps.Animation.DROP,
                position: latlng1,
                title: hotels[i].hotel_name + "\n Price: " + hotels[i].price + " Php",
                icon: 'http://maps.google.com/mapfiles/kml/pal3/icon21.png',
                //map_icon_label: '<span class="map-icon map-icon-trail-walking"></span>'
              });

            }
          }

        }

        //console.log(markerPosArr);

      }
    });
  } else {
    alert('No geolocation support from your browser. Kindly enable and reload your browser');
  }
}


function initMap(latitude, longitude) {
  latitude = parseFloat(latitude);
  longitude = parseFloat(longitude);

  console.log("new lat = " + latitude + " long = " + longitude);

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  var mylonglat = {lat: latitude, lng: longitude};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: mylonglat,
    zoom: 17
  });

  var marker = new google.maps.Marker({
    position: mylonglat,
    map: map,
    title: 'I am here'
  });

  return map;
}

/**
https://developers.google.com/maps/documentation/javascript/directions
Create markers and determine travel time and distance via modes

example:
google.maps.TravelMode.DRIVING (Default) indicates standard driving directions using the road network.
google.maps.TravelMode.BICYCLING requests bicycling directions via bicycle paths & preferred streets.
google.maps.TravelMode.TRANSIT requests directions via public transit routes.
google.maps.TravelMode.WALKING requests walking directions via pedestrian paths & sidewalks.
*/
function createMarkers(map, hotels, originLat, originLong) {
  var min = hotels.length;
  var markers = [];
  var infoWindows = [];
  for(i=0;i<min;i++) {
    //check if within range of POIs
    var latlng = new google.maps.LatLng(originLat, originLong);
    var latlng1 = new google.maps.LatLng(hotels[i].location.latitude, hotels[i].location.longitude);
    var dist = google.maps.geometry.spherical.computeDistanceBetween(latlng,latlng1);

    hid = hotels[i].hotel_id;

    //put a marker ??
    markers.push(new google.maps.Marker({
      map: map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: latlng1,
      title: hotels[i].hotel_name + "\n Price: " + hotels[i].price + " " + hotels[i].hotel_currency_code,
      icon: 'http://maps.google.com/mapfiles/kml/pal3/icon21.png'
      //map_icon_label: '<span class="map-icon map-icon-trail-walking"></span>'
    }));

    var currentHotel = hotels[i];
    var infoWindow = new google.maps.InfoWindow();
    (function (marker, hotel) {
      google.maps.event.addListener(markers[i], "click", function (e) {
        //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
        infoWindow.setContent('<div id="info' + hotel.hotel_id  + '" style = "width:200px;min-height:40px;">' + hotel.hotel_name + '</div>');
        infoWindow.open(map, marker);
      });
    })(markers[i], hotels[i]);

  }
}


function isEmpty(val){
  return (val === undefined || val == null || val.length <= 0) ? true : false;
}
function show_err() {
  console.log("Error in geoloc!");
}
