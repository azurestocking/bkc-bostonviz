class LandmarkMap {

	constructor(parentElement, deniedLandmarks, pendingLandmarks, approvedLandmarks, coord) {
		this.parentElement = parentElement;
		this.deniedLandmarks = deniedLandmarks;
		this.pendingLandmarks = pendingLandmarks;
		this.approvedLandmarks = approvedLandmarks;
		this.coord = coord;
		this.markers = [];

		this.initVis();
	}



	initVis() {
		let vis = this;

		vis.map = L.map(vis.parentElement).setView(vis.coord, 13);

		L.tileLayer('https://api.mapbox.com/styles/v1/chryslee/clu2uvkqj003r01qq26vrhji7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2hyeXNsZWUiLCJhIjoiY2x1MnRjOWl0MHNvNjJxbnZ3bmF3MWMzbyJ9.SlEk5odFwq2SeUxLZps3SQ', {
			minZoom: 12,
			attribution: '© <a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a>'
		}).addTo(vis.map);

		// define icons
		let LeafIcon = L.Icon.extend({
			options: {
				// shadowUrl: 'img/marker-shadow.png',
				// shadowSize: [12.5, 20],
				iconSize: [12.5, 20]
			}
		});
		vis.approvedIcon = new LeafIcon({ iconUrl: "img/marker-blue.png" });
		vis.pendingIcon = new LeafIcon({ iconUrl: "img/marker-yellow.png" });
		vis.deniedIcon = new LeafIcon({ iconUrl: "img/marker-red.png" });

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

		// filter out the selected landmarks
		const createMarkers = (landmarks, category) => {
			landmarks.forEach(landmark => {
				let coordinate = landmark.coordinate.split(",").map(Number);
				let icon = vis[`${category}Icon`];

				let marker = L.marker(coordinate, { icon: icon }).addTo(vis.map)
					.on("mouseover", function (event) {
						vis.tooltip.transition()
							.duration(200)
							.style("opacity", 0.9);

						let tooltipContent = `<b>${category.charAt(0).toUpperCase() + category.slice(1)}</b><br/>`;
						Object.keys(landmark).forEach(key => {
							tooltipContent += `${key}: ${landmark[key]}<br/>`;
						});

						let mouseEvent = event.originalEvent;
						vis.tooltip.html(tooltipContent)
							.style("left", (mouseEvent.pageX + 10) + "px")
							.style("top", (mouseEvent.pageY + 10) + "px")
							.style("visibility", "visible");
					})
					.on("mouseout", function () {
						vis.tooltip.transition()
							.duration(500)
							.style("opacity", 0)
							.end()
							.then(() => vis.tooltip.style("visibility", "hidden"));
					});

				vis.markers.push(marker);
			});
		};

		// show all landmarks by default
		if (selectedCategory === "all") {
			createMarkers(vis.approvedLandmarks, "approved");
			createMarkers(vis.pendingLandmarks, "pending");
			createMarkers(vis.deniedLandmarks, "denied");
		} else {
			switch (selectedCategory) {
				case "approved":
					createMarkers(vis.approvedLandmarks, "approved");
					break;
				case "pending":
					createMarkers(vis.pendingLandmarks, "pending");
					break;
				case "denied":
					createMarkers(vis.deniedLandmarks, "denied");
					break;
			}
		}
	}

}
