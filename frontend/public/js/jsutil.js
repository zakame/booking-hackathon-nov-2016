/*function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?callback=initialize";
  document.body.appendChild(script);
}
window.onload = loadScript;*/

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.
    //post('/contact/', {name: 'Johnny Bravo'});
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}
/*function get_location() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(show_map,show_err);
  } else {
    alert('No geolocation support from your browser. Kindly enable and reload your browser');
  }
}*/

function show_err() {
  console.log("Error!");
}
function show_map(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var inits = document.getElementsByName("initials")[0].value;
  console.log(latitude + " " + longitude + " initials=" + inits);
  post('/loc',{la:latitude,lo:longitude,initials:inits});
}

 /////////////////////////////////////

 var map;
      var directionsService; 
      var directionsDisplay; 
      var latitude;
      var longitude;
      var markerPosArr = new Array(); //array for the marker positions from google maps api


      function get_location(somedate) {
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(initMap,show_err);

          $.ajax({
            url: "http://localhost:443/gethotel",
            type: "GET",
            dataType: "json",
            contentType: "application/json",
           /*beforeSend: function(xhr) {
               xhr.setRequestHeader("Accept", "application/json");
               xhr.setRequestHeader("Content-Type", "application/json");
               xhr.setRequestHeader("Access-Control-Allow-Headers", "x-requested-with");
           },*/
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

                      //if(dist <= 300.0) {
                          console.log(hotels[i].hotel_name + " about a " + dist + " meters");
                        

                           hid = hotels[i].hotel_id;
                          /*var contentstr = '<div id="content">'+'<IMG ID="imgHolder" BORDER="1" SRC="' + hotels[i].photo + '">' +
                              '</div>'
                          var infowindow = new google.maps.InfoWindow({
                              content: contentstr,
                              maxWidth: 200
                            });
                           marker.addListener('click', function() {
                              infowindow.open(map, marker);
                            });*/
                            /*var ave_rating;
                             $.ajax({
                                url: "http://localhost:443/gethotelReviews",
                                type: "GET",
                                dataType: "json",
                                data: 'hid=' + hid,
                                contentType: "application/json",
                                success: function(data){
                                  //console.log(data)
                                  var tr = 0;
                                  for(i=0;i<data.length;i++) {
                                     tr += data[i].average_score
                                  }
                                  ave_rating = tr / data.length;
                                }

                              });*/
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

                      //}
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

      //  11.9636379,121.9244862
      //assume we're in cebu
      //latitude = position.coords.latitude;
      // longitude = position.coords.longitude;
      //10.2610243,123.9806643
      latitude = 10.2610243;
     longitude = 123.9806643;
      console.log("lat = " + latitude + " long = " + longitude);

      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();
        //14.5535513,121.0215767
        //9.9755791,118.8008843
        //var pyrmont = {lat: 14.5535513, lng: 121.0215767};
        var pyrmont = {lat: latitude, lng: longitude};
        map = new google.maps.Map(document.getElementById('map'), {
          center: pyrmont,
          zoom: 17
        });

        var service = new google.maps.places.PlacesService(map);
        /*service.nearbySearch({
          location: pyrmont,
          radius: 500,
          type: ['bar']
        }, processResults);*/

       service.textSearch({
          location: pyrmont,
          radius: 500,
          //type: ['bar']
          query: 'attractions'
        }, processResults);

        directionsDisplay.setMap(map);


      }

      function processResults(results, status, pagination) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        } else {
          //limit the results to 5 ?? because google maps only allows 8
          results = results.slice(0,6);

          createMarkers(results);
          console.log("results length is " + results.length);
          if (pagination.hasNextPage) {
            /*var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
              moreButton.disabled = true;
              pagination.nextPage();
            });*/
          }
        }
      }

      function createMarkers(places) {
        var bounds = new google.maps.LatLngBounds();
        var placesList = document.getElementById('places');
        var request = {
            travelMode: google.maps.TravelMode.WALKING
        };
        for (var i = 0, place; place = places[i]; i++) {
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });

          placesList.innerHTML += '<li>' + place.name + '</li>';

          bounds.extend(place.geometry.location);

          if (i == 0) {
              var coord1 = new google.maps.LatLng(latitude, longitude);
              request.origin = coord1;//marker.getPosition();
              markerPosArr.push(coord1);
          } else if (i == places.length - 1) {
            request.destination = marker.getPosition();
            var coord2 = marker.getPosition();
            markerPosArr.push(coord2);
          }
          else {
            if (!request.waypoints) request.waypoints = [];
            request.waypoints.push({
              location: marker.getPosition(),
              stopover: true
            });

            markerPosArr.push(marker.getPosition());
          }


        }
        map.fitBounds(bounds);

       directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
          }
        });

      }
      function isEmpty(val){
        return (val === undefined || val == null || val.length <= 0) ? true : false;
      }
      function show_err() {
        console.log("Error in geoloc!");
      }