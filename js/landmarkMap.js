
/*
 *  LandmarkMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class LandmarkMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, displayData, coord) {
		// this.parentElement = parentElement;
		// this.displayData = displayData;
		this.coord = coord;

		console.log(this.coord)

		this.initVis();
	}


	/*
	 *  Initialize map
	 */
	initVis () {
		let vis = this;

		vis.map = L.map("landmark-map").setView(vis.coord, 13);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(vis.map);

		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		vis.updateVis();
	}

	updateVis() {
		let vis = this;
	}
}

