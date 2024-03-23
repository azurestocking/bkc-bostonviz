var mymap = L.map('mapid').setView([42.3601, -71.0589], 13); // Boston's coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var marker;

// Initialize the marker at map center
function addInitialMarker() {
    marker = L.marker(mymap.getCenter()).addTo(mymap);
}
addInitialMarker();

// Move the marker to the center of the map after any movement
mymap.on('move', function () {
    marker.setLatLng(mymap.getCenter());
});
