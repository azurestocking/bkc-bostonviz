class LandmarkMap {

	constructor(parentElement, officialLandmarks, yourLandmarks, coord) {
		this.parentElement = parentElement;
		this.officialLandmarks = officialLandmarks;
		this.yourLandmarks = yourLandmarks;
		this.coord = coord;
		this.markers = [];

		console.log("Fetched: ", this.yourLandmarks);

		this.initVis();
	}



	initVis() {
		let vis = this;

		vis.map = L.map(vis.parentElement).setView(vis.coord, 13);

		L.tileLayer('https://api.mapbox.com/styles/v1/chryslee/clud04f3c02hi01qqcln59pcq/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2hyeXNsZWUiLCJhIjoiY2x1MnRjOWl0MHNvNjJxbnZ3bmF3MWMzbyJ9.SlEk5odFwq2SeUxLZps3SQ', {
			minZoom: 12,
			attribution: '© <a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a>'
		}).addTo(vis.map);

		// define icons
		let LeafIcon = L.Icon.extend({
			options: {
				iconSize: [20, 20]
			}
		});
		vis.approvedIcon = L.divIcon({ className: 'emoji-icon', html: '🔵', iconSize: [20, 20] });
		vis.pendingIcon = L.divIcon({ className: 'emoji-icon', html: '🟡', iconSize: [20, 20] });
		vis.deniedIcon = L.divIcon({ className: 'emoji-icon', html: '🔴', iconSize: [20, 20] });

		vis.tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		vis.wrangleData();
	}



	wrangleData() {
		let vis = this;

		vis.updateVis("all");
	}



	updateVis(selectedCategory = "all") {
		let vis = this;

		// clear existing markers
		vis.markers.forEach(marker => vis.map.removeLayer(marker));
		vis.markers = [];

		const createMarkers = (landmarks, icon, category) => {
			landmarks.forEach(landmark => {
				if (landmark.coordinate) {
					let coordinate = landmark.coordinate.split(",").map(d => parseFloat(d.trim()));
					let marker = L.marker(coordinate, {icon: icon})
						.addTo(vis.map)
						.on("mouseover", function (event) {
							vis.tooltip.style("opacity", 0.9)
								.html(() => {
									let tooltipContent = `<b>INFO</b><br/>`;
									Object.keys(landmark).forEach(key => {
										tooltipContent += `${key}: ${landmark[key]}<br/>`;
									});
									return tooltipContent;
								})
								.style("left", (event.originalEvent.pageX + 10) + "px")
								.style("top", (event.originalEvent.pageY + 10) + "px")
								.style("visibility", "visible");
						})
						.on("mouseout", function () {
							vis.tooltip.style("opacity", 0)
								.style("visibility", "hidden");
						});

					vis.markers.push(marker);
				}
			});
		};

		// show all landmarks by default
		if (selectedCategory === "all") {
			createMarkers(vis.officialLandmarks.approvedLandmarks, vis.approvedIcon);
			createMarkers(vis.officialLandmarks.pendingLandmarks, vis.pendingIcon);
			createMarkers(vis.officialLandmarks.deniedLandmarks, vis.deniedIcon);
		} else {
			switch (selectedCategory) {
				case "approved":
					createMarkers(vis.officialLandmarks.approvedLandmarks, vis.approvedIcon);
					break;
				case "pending":
					createMarkers(vis.officialLandmarks.pendingLandmarks, vis.pendingIcon);
					break;
				case "denied":
					createMarkers(vis.officialLandmarks.deniedLandmarks, vis.deniedIcon);
					break;
			}
		}

	}

}
