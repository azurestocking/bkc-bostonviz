var bounds = [
    [41.237964, -73.508142], // Southwestern coordinates
    [42.886589, -69.858861]  // Northeastern coordinates
];


let mymap = L.map('mapid', {
    zoomControl: false,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
}).setView([42.3601, -71.0589], 13); // Boston's coordinates
L.control.zoom({position: 'bottomleft'}).addTo(mymap);

L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}@2x.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

let marker;
let displayName = "";


// Initialize the marker at map center
function addInitialMarker() {
    // let name = document.getElementById('name').value;
    marker = L.marker(mymap.getCenter()).addTo(mymap);
    marker.bindPopup("Move map or search to set your landmark.").openPopup();
}


addInitialMarker();

// Move the marker to the center of the map after any movement
mymap.on('move', function () {
    marker.setLatLng(mymap.getCenter());
});


// mymap.addControl(new L.Control.Search({
//     layer: landmarksLayer,
//     initial: false,
//     propertyName: 'title',
//     marker: false,
//     moveToLocation: function(latlng, title, map) {
//         map.setView(latlng, 17);
//         let marker = L.marker(latlng).addTo(map);
//         marker.bindPopup(title).openPopup();
//     }
// }));


// Define the control options in a variable
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
    moveToLocation: function(location) {
        mymap.fitBounds(location.__boundingBox__);
        console.log("Location Name inside moveToLocation:", location.display_name);
        displayName = location.display_name;
        var displayNamePop = location.display_name ? location.display_name : "Your New Landmark";
        marker.bindPopup(displayNamePop).openPopup();
    },
    propertyLoc: ["lat", "lon"],
    propertyName: "display_name",
    textPlaceholder: "Search for a place...",
    url: "https://nominatim.openstreetmap.org/search?format=json&q={s} Massachusetts, United States"
};

// Create and add the search control to the map
let searchControl = new L.Control.Search(searchControlOptions);
mymap.addControl(searchControl);
console.log(searchControlOptions.propertyName);

// mymap.addControl(new L.Control.Search({
//     autoCollapse: false,
//     autoResize: false,
//     autoType: false,
//     collapsed: false,
//     firstTipSubmit: true,
//     formatData: processSearchResults,
//     jsonpParam: "json_callback",
//     marker: null,
//     minLength: 2,
//     moveToLocation: function(location) {
//         mymap.fitBounds(location.__boundingBox__);
//     },
//     propertyLoc: ["lat", "lon"],
//     propertyName: "display_name",
//     textPlaceholder: "Search for a place...",
//     url: "https://nominatim.openstreetmap.org/search?format=json&q={s} Massachusetts, United States"
// }));





function submitLandmark() {
    // var name = document.getElementById('name').value;
    // var description = document.getElementById('description').value;
    var latlng = marker.getLatLng();
    var name = displayName;

    // console.log('Name:', name);
    // console.log('Description:', description);
    console.log('Latitude:', latlng.lat, 'Longitude:', latlng.lng, 'Display Name:', displayName);
    window.location.href = `https://lobs.boston/bostonlandmark/submission.php?name=${name}&latitude=${latlng.lat}&longitude=${latlng.lng}`;

    // Here, you would send this data to your server via AJAX or a form submission
}



// TEST FIELD

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
    console.log("Processed Results:", processedResults);

    return processedResults;
}


document.getElementById('submitLandmarkBtn').addEventListener('click', submitLandmark);
