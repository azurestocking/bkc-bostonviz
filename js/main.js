let landmarkMap;

renderMap();

function renderMap(data) {

    console.log(data);

    let displayData = [];

    landmarkMap = new LandmarkMap("landmark-map", displayData, [42.360082, -71.058880]);
}
