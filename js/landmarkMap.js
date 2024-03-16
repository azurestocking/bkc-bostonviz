
/*
 *  LandmarkMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class LandmarkMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, deniedLandmarks, pendingLandmarks, approvedLandmarks, coord) {
		this.parentElement = parentElement;
		this.deniedLandmarks = deniedLandmarks;
		this.pendingLandmarks = pendingLandmarks;
		this.approvedLandmarks = approvedLandmarks;
		this.coord = coord;

		this.initVis();
	}


	/*
	 *  Initialize map
	 */
	initVis () {
		let vis = this;

		console.log("denied landmarks: ", vis.deniedLandmarks);
		console.log("pending landmarks: ", vis.pendingLandmarks);
		console.log("approved landmarks: ", vis.approvedLandmarks);

		vis.map = L.map("landmark-map").setView(vis.coord, 13);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		}).addTo(vis.map);

		// Define icons
		var LeafIcon = L.Icon.extend({
			options: {
				shadowUrl: 'img/marker-shadow.png',
				iconSize:     [12.5, 20],
				shadowSize:   [12.5, 20]
			}
		});
		vis.approvedIcon = new LeafIcon({ iconUrl: 'img/marker-blue.png' });
		vis.pendingIcon = new LeafIcon({ iconUrl: 'img/marker-yellow.png' });
		vis.deniedIcon = new LeafIcon({ iconUrl: 'img/marker-red.png' });

		vis.tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

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

		vis.deniedLandmarks.forEach(function(landmark) {
			let coordinate = landmark.coordinate.split(',').map(Number);
			L.marker(coordinate, {icon: vis.deniedIcon}).addTo(vis.map)
				.on("mouseover", function (event, d) {
					vis.tooltip.transition()
						.duration(200)
						.style("opacity", 0.9);

					let tooltipContent = `
						<b>DENIED</b><br/>
						Name: ${landmark["NAME OF PROPERTY"]}<br/>
						Address: ${landmark["ADDRESS"]}<br/>
						Details: ${landmark["DETAILS"]}<br/>
						Petition: ${landmark["PETITION"]}<br/>
						Petition by ${landmark["PETITION BY"]}
                	`;

					let mouseEvent = event.originalEvent;

					vis.tooltip.html(tooltipContent)
						.style("left", (mouseEvent.pageX + 10) + "px")
						.style("top", (mouseEvent.pageY + 10) + "px")
						.style("visibility", "visible");
				})
				.on("mouseout", function (event, d) {
					vis.tooltip.transition()
						.duration(500)
						.style("opacity", 0)
						.end()
						.then(() => vis.tooltip.style("visibility", "hidden"));
				});
		});

		vis.pendingLandmarks.forEach(function(landmark) {
			let coordinate = landmark.coordinate.split(',').map(Number);
			L.marker(coordinate, {icon: vis.pendingIcon}).addTo(vis.map)
				.on("mouseover", function (event, d) {
					vis.tooltip.transition()
						.duration(200)
						.style("opacity", 0.9);

					let tooltipContent = `
						<b>PENDING</b><br/>
						Name: ${landmark["NAME OF PROPERTY"]}<br/>
						Address: ${landmark["ADDRESS"]}<br/>
						Details: ${landmark["DETAILS"]}<br/>
						Petition: ${landmark["PETITION"]}<br/>
						Petition by ${landmark["PETITION BY"]}
                	`;

					let mouseEvent = event.originalEvent;

					vis.tooltip.html(tooltipContent)
						.style("left", (mouseEvent.pageX + 10) + "px")
						.style("top", (mouseEvent.pageY + 10) + "px")
						.style("visibility", "visible");
				})
				.on("mouseout", function (event, d) {
					vis.tooltip.transition()
						.duration(500)
						.style("opacity", 0)
						.end()
						.then(() => vis.tooltip.style("visibility", "hidden"));
				});
		});

		vis.approvedLandmarks.forEach(function(landmark) {
			let coordinate = landmark.coordinate.split(',').map(Number);
			L.marker(coordinate, {icon: vis.approvedIcon}).addTo(vis.map)
				.on("mouseover", function (event, d) {
					vis.tooltip.transition()
						.duration(200)
						.style("opacity", 0.9);

					let tooltipContent = `
						<b>APPROVED</b><br/>
						Address: ${landmark["full_address"]}<br/>
						Use: ${landmark["use_class"]}<br/>
						Building Typology: ${landmark["building_typology"]}<br/>
						Assessor Category: ${landmark["assessor_category"]}<br/>
						Assessor Description: ${landmark["assessor_description"]}<br/>
						Owner List: ${landmark["owner_list"]}<br/>
						Year of Built: ${landmark["year_built_class"]}
                	`;

					let mouseEvent = event.originalEvent;

					vis.tooltip.html(tooltipContent)
						.style("left", (mouseEvent.pageX + 10) + "px")
						.style("top", (mouseEvent.pageY + 10) + "px")
						.style("visibility", "visible");
				})
				.on("mouseout", function (event, d) {
					vis.tooltip.transition()
						.duration(500)
						.style("opacity", 0)
						.end()
						.then(() => vis.tooltip.style("visibility", "hidden"));
				});
		});
	}
}

