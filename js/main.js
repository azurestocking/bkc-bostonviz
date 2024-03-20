let landmarkMap;

Promise.all([
    d3.csv("data/blc_data_cleaned.csv").then(data => {
        let deniedLandmarks = data.filter(row => row.CATEGORY === "E = Unsuccessful Petition" || row.CATEGORY === "E = Unsuccessful Petition & Demolished");
        let pendingLandmarks = data.filter(row => row.CATEGORY === "C = Pending Landmark/District");
        return { deniedLandmarks, pendingLandmarks };
    }),
    d3.csv("data/building_data_cleaned.csv").then(data => {
        return { approvedLandmarks: data };
    })
]).then(results => {
    renderMap(results[0].deniedLandmarks, results[0].pendingLandmarks, results[1].approvedLandmarks);
});

function renderMap(deniedLandmarks, pendingLandmarks, approvedLandmarks) {
    landmarkMap = new LandmarkMap("landmark-map", deniedLandmarks, pendingLandmarks, approvedLandmarks, [42.360082, -71.058880]);
}
