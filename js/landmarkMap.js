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
		vis.approvedIcon = L.divIcon({ className: 'emoji-icon-1', html: '🔵', iconSize: [20, 20] });
		vis.pendingIcon = L.divIcon({ className: 'emoji-icon-1', html: '🟡', iconSize: [20, 20] });
		vis.deniedIcon = L.divIcon({ className: 'emoji-icon-1', html: '🔴', iconSize: [20, 20] });

		vis.tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		vis.wrangleData();
	}



	wrangleData() {
		let vis = this;

		vis.updateVis("official-landmarks");
	}



	updateVis(selectedCategory = "official-landmarks") {
		let vis = this;

		// display writeup
		if (selectedCategory === "official-landmarks") {
			document.getElementById('nav').innerHTML = `
                <h1 class="row">OFFICIAL LANDMARKS</h1>
                <p class="row">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <div class="row">
                	🔵　Approved<br>
                	🟡　Pending<br>
                	🔴　Denied
				</div>
            `;
		} else if (selectedCategory === "your-landmarks") {
			document.getElementById('nav').innerHTML = `
                <h1 class="row">YOUR LANDMARKS</h1>
                <p class="row">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            `;
		}

		// display data points
		vis.markers.forEach(marker => vis.map.removeLayer(marker));
		vis.markers = [];

		if (selectedCategory === "official-landmarks") {
			const createMarkers = (landmarks, icon) => {
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

			createMarkers(vis.officialLandmarks.approvedLandmarks, vis.approvedIcon);
			createMarkers(vis.officialLandmarks.pendingLandmarks, vis.pendingIcon);
			createMarkers(vis.officialLandmarks.deniedLandmarks, vis.deniedIcon);
		} else if (selectedCategory === "your-landmarks") {
			const createMarkers = (landmarks) => {
				landmarks.forEach(landmark => {
					if (landmark.lat && landmark.lon) {
						let coordinate = [parseFloat(landmark.lat), parseFloat(landmark.lon)];
						let dynamicIcon = L.divIcon({ className: 'emoji-icon-2', html: landmark.emoji, iconSize: [20, 20] });
						let marker = L.marker(coordinate, {icon: dynamicIcon})
							.addTo(vis.map)
							.on("mouseover", function (event) {
								vis.tooltip.style("opacity", 0.9)
									.html(() => {
										let tooltipContent = `<b>${landmark.name}</b><br/>${landmark.story}<br/>`;
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
			createMarkers(vis.yourLandmarks);
		}

		// display heatmap

	}

}
