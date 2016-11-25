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


function initMap(position) {

  //  makati = 11.9636379,121.9244862
  //latitude = 11.9636379;
  //longitude = 121.9244862;
  // intramuras
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  //cebu
  // 9.5610103,123.4129313
  //latitude = 9.5610103;
  //longitude = 123.4129313;
  console.log("lat = " + latitude + " long = " + longitude);

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  var mylonglat = {lat: latitude, lng: longitude};
  map = new google.maps.Map(document.getElementById('map'), {
    center: mylonglat,
    zoom: 17
  });


  var marker = new google.maps.Marker({
    position: mylonglat,
    map: map,
    title: 'I am here'
  });

  var latlng1 = new google.maps.LatLng(52.3657092,4.8966912);

  var latlng2 = new google.maps.LatLng(52.365764,4.8970353);

  var placesX = [
    {"name":"Hotel Happy","position":latlng1},
    {"name":"Hotel Sadness", "position":latlng2}
  ];
  //create markers for the hotels
  createMarkers(placesX, mylonglat);

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
function createMarkers(places, centerLatLng, mode) {
  var bounds = new google.maps.LatLngBounds();
  var placesList = document.getElementById('map');
  //var placesList = $('#map');
  var request = {
    travelMode: google.maps.TravelMode.TRANSIT
  };
  for (var i = 0; i < places.length; i++) {
    console.log("places@@ :" + places[i].name);
    // var doc = $('#hotel-item--name_' + i)
    //console.log(doc);
    //Manipulate the hotel list !!
    // $('.hotel-item--name #hotel-item--name_' + i).html(places[i].name);

    var image = {
      url: 'http://maps.google.com/mapfiles/ms/icons/lodging.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var marker = new google.maps.Marker({
      map: map,
      icon: image,
      animation: google.maps.Animation.DROP,
      title: 'hotel #' + i,
      position: places[i].position
    });
    var hotelDescription = "<b><a href='someurl'>"+places[i].name+"</a></b><br>some address";
    //Attach click event to the marker.
    google.maps.event.addListener(marker, "click", function (e) {
      var infoWindow = new google.maps.InfoWindow();

      //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
      infoWindow.setContent("<div style = 'width:200px;min-height:40px'>" + hotelDescription + "</div>");
      infoWindow.open(map, marker);
    });

    var requestDS = {
      origin: centerLatLng, // LatLng|string
      destination: places[i].position, // LatLng|string
      travelMode: google.maps.DirectionsTravelMode.TRANSIT
    };

    directionsService.route( requestDS, function( response, status ) {

      if ( status === 'OK' ) {
        var point = response.routes[ 0 ].legs[ 0 ];
        // $( '#travel_data' ).html( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );
        console.log('Estimated travel time: ' + point.duration.text + " distance: " + point.distance.text);
      }
    } );

    var hotelDiv =  '<div class="mdl-card__media mdl-color--white mdl-color-text--grey-600">' +

    '    <a href="#" class="hotel-item" >' +
    '      <div class="hotel-item--image">' +
    '        <img src="http://q-ec.bstatic.com/images/hotel/square200/253/25352657.jpg" />'
    '      </div>' +
    '      <div class="hotel-item--info">'+
    '        <span id="hotel-item--name_0" class="hotel-item--name" >A Good Hotel</span>'+
    '        <div class="hotel-item--rating-bar">' +
    '          <div class="hotel-item--rating-bar-filled" style="width: 40%;"></div>' +
    '        </div>' +
    '        <span class="hotel-item--lastbooked" >Booked 2 times in the last 48 hours</span>' +
    '      </div>' +
    '     <div class="hotel-item--book">' +
    '        <span class="hotel-item--price" ><span class="price--currency">PHP</span> 2,000</span>' +
    '        <button class="button hotel-item--book-now">Book your room</button>' +
    '      </div>' +
    '    </a>' +
    '</div>'

    $("<li />")
    .html(hotelDiv)
    /*.click(function(){
    map.panTo(marker.getLatLng());
  }) */
  .appendTo("#list");
} //end of for loop
}



function isEmpty(val){
  return (val === undefined || val == null || val.length <= 0) ? true : false;
}
function show_err() {
  console.log("Error in geoloc!");
}
