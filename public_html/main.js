var long = 43.2362657216;
var lat = -79.8847431277;
var markerList = [];
var markerList1 = [];
var map;
var marker = new google.maps.Marker();
//initialize the map with the user's location
/**
 * Methods is called at the end to put the map on the screen
 * @returns {undefined}
 */
function intMap() {
    //diclaring essential objects to make the user task work
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var geocoder = new google.maps.Geocoder;
    //var infowindow = new google.maps.InfoWindow;
    var userAddress = "";
    //setting the default longitude and latitude
    var center = {lat: 43.2362657216, lng: -79.8847431277};
    //initializing map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center
    });
    //setting the map oon the screen
    directionsDisplay.setMap(map);

    /**
     * function to set the marker of the location user want's to go and the map is updated to show the traffic
     * @returns {undefined}
     */
    var change = function () {
        for (var a = 0; a < markerList.length; a++) {
            markerList[a].setMap(null);
        }
        var mode = $("#mode").val();
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);

        getRoute(directionsService, directionsDisplay, mode);
    };

    //each time the button is hit the change method is called to re-initialize map
    document.getElementById("getDirections").addEventListener('click', change);

    //getting user location and putting it on the map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //getting the address from the coordinates/current location of the user using geocoder
            geocoder.geocode({'location': pos}, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        map.setZoom(13);
                        var marker = new google.maps.Marker({
                            position: pos,
                            map: map,
                            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        });
                        userAddress = results[0].formatted_address;
                        var infowindow = new google.maps.InfoWindow({
                            content: "<strong>Current Location<strong><p>" + userAddress + "</p>"
                        });
                        marker.addListener('click', function () {
                            infowindow.open(map, marker);
                        });
                        infowindow.open(map, marker);
                        marker.setAnimation(google.maps.Animation.DROP);
                        marker.setMap(map);
                        //adding options to start from the location
                        $("#end").append('<option value="Mohawk College">Mohawk College</option>');
                        $("#end").append('<option id="current" value="' + userAddress + '">Your Location</option>');

                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });

            //getting the values from the json object and putting markers at the longitude and latitude
            addMarkers();
            for (var i = 0; i < markerList.length; i++) {
                infoWindow(i);
            }

            $("#error").hide();
        }, function () {
            $("#error").show();
        });
    }
}

function infoWindow(i) {
    map.setZoom(13);
    var infowindow = new google.maps.InfoWindow({
        content: listLibrary[i].NAME
    });
    markerList[i].addListener('click', function () {
        infowindow.open(map, this);
    });
}

function addMarkers() {
    for (var i = 0; i < listLibrary.length; i++) {
        //setting the longitude and latitude
        var libPos = {lat: listLibrary[i].LATITUDE, lng: listLibrary[i].LONGITUDE};
        //putting it on map and adding it to a list
        markerList.push(new google.maps.Marker({
            position: libPos,
            map: map
        }));
        //adding the names of library into a div tag so user can refer it
        $("#start").append('<option value="' + listLibrary[i].NAME + ' Hamilton">' + listLibrary[i].NAME + '</option>');
        if (i <= 10) {
            $("#names1").append("<button class='btn' style='width: auto; border: none; background: transparent; color: Gray;'>" + listLibrary[i].NAME + "</button><br>");
        } else {
            $("#names2").append("<button class='btn' style='width: auto; border: none; background: transparent; color: Gray;'>" + listLibrary[i].NAME + "</button><br>");
        }
        //click function on each button
        var infowindow = new google.maps.InfoWindow;
        var geocoder = new google.maps.Geocoder;
        $('button').on("click", function () {
            var name = ($(this).text().toLowerCase());
            for (var i = 0; i < listLibrary.length; i++) {
                var lib = listLibrary[i].NAME.toLowerCase();
                decodeLibrary(name, false, lib, i, geocoder, infowindow);
            }
        });
    }
}

/**
 * Putting the destination in the map and selecting the route
 * @param {type} directionsService
 * @param {type} directionsDisplay
 * @param {type} mode
 * @returns {undefined}
 */
function getRoute(directionsService, directionsDisplay, mode) {
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: mode
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

/**
 * Reading the library name and finding it on map
 * @returns {undefined}
 */
function getLibrary() {
    var name = document.getElementById("libName").value;
    name = name.toLowerCase();
    name = name.trim();
    var infowindow = new google.maps.InfoWindow;
    var geocoder = new google.maps.Geocoder;
    var flag = false;
    for (var i = 0; i < listLibrary.length; i++) {
        var lib = listLibrary[i].NAME.toLowerCase();
        decodeLibrary(name, markerList1, marker, markerList, flag, lib, i, geocoder, infowindow);
    }
    if (!flag) {
        $("#123").addClass("has-error has-feedback");
        $("#123").addClass("has-success has-feedback");

    }
}


function decodeLibrary(name, flag, lib, i, geocoder, infowindow) {
    if (lib === name) {
        if (markerList1.length > 0) {
            marker.setMap(null);
        }
        $("#123").removeClass("has-error has-feedback");
        $("#123").addClass("has-success has-feedback");
        var mark = {lat: listLibrary[i].LATITUDE, lng: listLibrary[i].LONGITUDE};

        geocoder.geocode({'location': mark}, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    map.setZoom(13);
                    marker = new google.maps.Marker({
                        position: mark,
                        map: map
                    });
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);
                    marker.setMap(map);
                    markerList1.push(marker);
                }
            }
        });
        flag = true;
    }
}



function reload() {
    window.location = 'index.html';
}
