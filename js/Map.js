<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA9sNuUlN9pN--GbgexsUGrQhcV5QddTig" 

var origin1 = new google.maps.LatLng(41.8369, 87.6847);
var origin2 = "Chicago, Illinois";
var destinationA = "Oak Park, Illinois";
var destinationB = new google.maps.LatLng(41.8833, 87.8000);

var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1, origin2],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: UnitSystem,
    durationInTraffic: Boolean,
    avoidHighways: false,
    avoidTolls: false
  }, callback);

function callback(response, status) {
  // See Parsing the Results for
  // the basics of a callback function.
}
