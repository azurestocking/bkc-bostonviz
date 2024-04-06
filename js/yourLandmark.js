let marker;
let displayName = "";

// Set map boundaries
var bounds = [
    [41.237964, -73.508142], // Southwestern coordinates
    [42.886589, -69.858861]  // Northeastern coordinates
];

// Initialize map element
let mymap = L.map('mapid', {
    zoomControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
}).setView([42.3601, -71.0589], 13); // Boston's coordinates

// Set zoom control position
L.control.zoom({position: 'bottomleft'}).addTo(mymap);

// Set high definition basemap
L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}@2x.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

// Initialize the marker at map center
function addInitialMarker() {
    marker = L.marker(mymap.getCenter()).addTo(mymap);
    marker.bindPopup("Move map or search to set your landmark.").openPopup();
}

addInitialMarker();

// Move the marker to the center of the map after any movement
mymap.on('move', function () {
    marker.setLatLng(mymap.getCenter());
});

// Initialize search control options
let searchControlOptions = {
    position: 'topleft',
    autoCollapse: false,
    autoResize: false,
    autoType: false,
    collapsed: false,
    firstTipSubmit: true,
    formatData: processSearchResults,
    jsonpParam: "json_callback",
    marker: null,
    minLength: 2,
    moveToLocation: function(location) { // Action set after search result
        displayName = location.display_name;
        var bounds = location.__boundingBox__;
        var displayNamePop = location.display_name ? location.display_name : "Your New Landmark";
        
        mymap.fitBounds(bounds);
        
        function showPopup() {
            marker.getPopup().setContent(displayNamePop);
            marker.openPopup();
        }

        if (mymap.getBounds().contains(bounds)) {
            showPopup();
        } else {
            function onMoveEnd() {
                showPopup();
                mymap.off('moveend', onMoveEnd);
            }
                mymap.on('moveend', onMoveEnd);
        }
    },
    propertyLoc: ["lat", "lon"],
    propertyName: "display_name",
    textPlaceholder: "Search for a place...",
    url: "https://nominatim.openstreetmap.org/search?format=json&q={s} Massachusetts, United States"
};

// Create and add the search control to the map
let searchControl = new L.Control.Search(searchControlOptions);
mymap.addControl(searchControl);

// Process search results
function processSearchResults(searchResults) {
    console.log("Search Results:", searchResults);

    const propName = this.options.propertyName;
    const propLoc = this.options.propertyLoc;
    const processedResults = {};
    for (const location of searchResults) {
        const locationName = this._getPath(location, propName);
        processedResults[locationName] = L.latLng(location[propLoc[0]], location[propLoc[1]]);
        processedResults[locationName].__boundingBox__ = [
            [location.boundingbox[0], location.boundingbox[2]].map(parseFloat), [location.boundingbox[1], location.boundingbox[3]].map(parseFloat)
        ];
        processedResults[locationName].display_name = location.name;
    }
    // console.log("Processed Results:", processedResults);

    return processedResults;
}

// Continue to next step action set
function submitLandmark() {
    var latlng = marker.getLatLng();
    var name = displayName;
    console.log('Latitude:', latlng.lat, 'Longitude:', latlng.lng, 'Display Name:', displayName);
    window.location.href = `https://lobs.boston/bostonlandmark/submission.php?name=${name}&latitude=${latlng.lat}&longitude=${latlng.lng}`;
}

// Click event listener
document.getElementById('submitLandmarkBtn').addEventListener('click', submitLandmark);

// iOS fix: Listen for the 'movestart' event on the map
mymap.on('movestart', function() {
    mymap.closePopup(); // Close any open popup
});
