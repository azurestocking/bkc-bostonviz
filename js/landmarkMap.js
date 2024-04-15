class LandmarkMap {

	constructor(parentElement, officialLandmarks, bonusLandmarks, yourLandmarks, coord) {
		this.parentElement = parentElement;
		this.officialLandmarks = officialLandmarks;
		this.bonusLandmarks = bonusLandmarks;
		this.yourLandmarks = yourLandmarks;
		this.coord = coord;
		this.markers = [];

		console.log("bonus: ", this.bonusLandmarks);

		this.initVis();
	}



	initVis() {
		let vis = this;

		// define map
		vis.map = L.map(vis.parentElement, {
			center: vis.coord,
			zoom: 13,
			zoomControl: false
		});

		let southWest = L.latLng(41.579061, -71.940924),
			northEast = L.latLng(43.533192, -70.177619),
			bounds = L.latLngBounds(southWest, northEast);

		vis.map.setMaxBounds(bounds);

		L.tileLayer('https://api.mapbox.com/styles/v1/chryslee/cluvukbjc005i01p64vdcawqd/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2hyeXNsZWUiLCJhIjoiY2x1MnRjOWl0MHNvNjJxbnZ3bmF3MWMzbyJ9.SlEk5odFwq2SeUxLZps3SQ', {
			minZoom: 12,
			attribution: '© <a href=\'https://www.mapbox.com/about/maps/\'>Mapbox</a> © <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a>'
		}).addTo(vis.map);

		// define icons
		vis.approvedIcon = L.divIcon({ className: 'emoji-icon-1', html: "<img src='img/icon-blue.png' />" });
		vis.pendingIcon = L.divIcon({ className: 'emoji-icon-1', html: "<img src='img/icon-yellow.png' />" });
		vis.deniedIcon = L.divIcon({ className: 'emoji-icon-1', html: "<img src='img/icon-red.png' />" });

		// define tooltip
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
			document.getElementById("sidebar").innerHTML = `
				<div class="title">
					<h5 class="card-title"><b>MARKING MEMORY:</b></h5>
					<h6 class="card-subtitle"><b>BOSTON’S LANDMARKS IN THE MAKING</b></h6>
				</div>
				<div class="accordion" id="accordionExample">
				  	<div class="accordion-item">
						<h2 class="accordion-header">
							<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
								<b>Propose a new landmark...</b>
							</button>
						</h2>
						<div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
							<div class="accordion-body">
								The designation process is formal and public. You must prepare a written summary of the history and significance of the resource, then:</br>
								(1) Submit a draft petition via email to the BLC Executive Director.</br>
								(2) The process involves public hearings, voter signatures, and contributions from the Mayor or BLC commissioners.</br>
								(3) Following acceptance, the site is added to the pending landmarks list.</br>
								(4) A Study Report is prepared and opened for public feedback.</br>
								(5) The BLC votes on designation, followed by the Mayor and City Council's approval.</br>
							</div>
						</div>
				  	</div>
				  	<div class="accordion-item">
						<h2 class="accordion-header">
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
								<b>Who decides?</b>
							</button>
						</h2>
						<div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
							<div class="accordion-body">
								Boston Landmarks Commission (BLC) and historic district commissions recognize, preserve, and protect Boston culture and history. Local volunteers serve as commissioners. All commissioners are nominated by neighborhood groups and professional organizations. They are appointed by the Mayor and confirmed by the City Council.
							</div>
						</div>
				    </div>
				    <div class="accordion-item">
						<h2 class="accordion-header">
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseTwo">
								<b>What is a landmark?</b>
							</button>
						</h2>
						<div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
							<div class="accordion-body">
							    Landmarks can be structures, sites, objects, man-made, or natural. There are four criteria used to evaluate the significance of a resource:</br>
							    (1) Listed on the National Register of Historic Places.</br>
								(2) Sites of significant events contributing to cultural, political, economic, military, or social history.</br>
								(3) Associated with the lives of outstanding historic personages.</br>
								(4) Exemplary of distinctive architectural or landscape design, craftsmanship, or a notable work by influential figures in these fields.</br>
							</div>
						</div>
				    </div>
				</div>
            `;
		} else if (selectedCategory === "your-landmarks") {
			document.getElementById("sidebar").innerHTML = `
				<div class="title">
					<h5 class="card-title"><b>MARKING MEMORY:</b></h5>
					<h6 class="card-subtitle"><b>BOSTON’S LANDMARKS IN THE MAKING</b></h6>
				</div>
				<div class="accordion" id="accordionExample">
				  	<div class="accordion-item">
						<h2 class="accordion-header">
							<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
								<b>Propose a new landmark...</b>
							</button>
						</h2>
						<div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
							<div class="accordion-body">
							Consider the spaces around you, both grand and seemingly ordinary, and explore their significance for your community. Which spaces in the city of Boston do you believe deserve landmark status?</br>
							Scan the QR code to add your chosen site to our interactive map and share your story.</br>
							</br>
							<img src="img/qr-code.jpg" alt="QR Code">
							</div>
						</div>
				  	</div>
				  	<div class="accordion-item">
						<h2 class="accordion-header">
							<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
								<b>Who decides?</b>
							</button>
						</h2>
						<div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
							<div class="accordion-body">
								You, in front of the screen! Visitors of all backgrounds are welcome to nominate places of personal significance as landmarks!
							</div>
						</div>
				    </div>
				    <div class="accordion-item">
				        <h2 class="accordion-header">
						  	<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
								<b>What is a landmark?</b>
						  	</button>
					    </h2>
					    <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
					  	  	<div class="accordion-body">
					  	  		Compare the distribution of officially defined landmarks with those defined by residents. What factors contribute to the distinction? What implications arise from the difference? Reflect on what it truly means for a place to be considered a landmark and its role in the shaping of public memory.
					  	  	</div>
					    </div>
				    </div>
				</div>
            `;
		}

		// display data points
		vis.markers.forEach(marker => vis.map.removeLayer(marker));
		vis.markers = [];

		if (selectedCategory === "official-landmarks") {

			const createMarkers = (landmarks, icon, status) => {
				landmarks.forEach(landmark => {
					if (landmark.coordinate) {
						let coordinate = landmark.coordinate.split(",").map(d => parseFloat(d.trim()));
						let isBonusLandmark = vis.bonusLandmarks.some(bonus => bonus.PID === landmark["pid_long"] || bonus.PID === landmark["PID"]);

						let finalIcon = L.divIcon({
							className: icon.options.className + (isBonusLandmark ? ' bounce' : ''),
							html: icon.options.html,
							iconSize: icon.options.iconSize
						});

						let marker = L.marker(coordinate, {icon: finalIcon})
							.addTo(vis.map)
							.on("mouseover", function (event) {
								vis.tooltip.style("opacity", 1)
									.html(() => {
										let tooltipContent, encodedAddress, fullLocation, encodedLocation, streetViewImageUrl;

										switch (status) {
											case "approved":
												encodedAddress = encodeURIComponent(coordinate);
												streetViewImageUrl = `https://maps.googleapis.com/maps/api/streetview?source=outdoor&size=600x400&fov=120&location=${encodedAddress}&key=AIzaSyAZds2BIz-J0WNouMON5c25WPfO498vjk0`;

												tooltipContent = isBonusLandmark ?
													`<i>Click to Catch Me and Know More!</i>`:
													`<img src="${streetViewImageUrl}" alt="Street View Image" width="100%"><br/>
                                                    <b>${landmark.assessor_description.toUpperCase()}</b><br/>
													${landmark.full_address}<br/>
                                                    ${status.charAt(0).toUpperCase()}${status.slice(1)}, Built in ${Math.floor(landmark.yr_built)}</div>`;
												break;
											case "pending":
											case "denied":
												fullLocation = `${landmark["NAME OF PROPERTY"]}, ${landmark.full_address}`;
												encodedLocation = encodeURIComponent(fullLocation);
												streetViewImageUrl = `https://maps.googleapis.com/maps/api/streetview?source=outdoor&size=600x400&fov=120&location=${encodedLocation}&key=AIzaSyAZds2BIz-J0WNouMON5c25WPfO498vjk0`;

												tooltipContent = isBonusLandmark ?
													`<i>Click to Catch Me and Know More!</i>`:
													`<img src="${streetViewImageUrl}" alt="Street View Image" width="100%"></br>
                                                    <b>${landmark["NAME OF PROPERTY"].toUpperCase()}</b><br/>
                                                    ${landmark.full_address}<br/>
                                                    ${status.charAt(0).toUpperCase()}${status.slice(1)}, ${landmark.DETAILS}</div>`;
												break;
											default:
												tooltipContent = ``
										}
										return tooltipContent;
									})
									.style("left", (event.originalEvent.pageX + 10) + "px")
									.style("top", (event.originalEvent.pageY + 10) + "px")
									.style("visibility", "visible");
							})
							.on("mouseout", function () {
								vis.tooltip.style("opacity", 0)
									.style("visibility", "hidden");
							})
							.on('click', function () {
								if (isBonusLandmark) {
									let bonusLandmark = vis.bonusLandmarks.find(bonus => bonus.PID === landmark["pid_long"] || bonus.PID === landmark["PID"]);

									let modalTitle =
										`<b>${bonusLandmark["NAME OF PROPERTY"]}</b> <span class="badge text-bg-secondary">${status.charAt(0).toUpperCase()}${status.slice(1)}</span></br>
										${bonusLandmark.full_address}`;

									let modalBodyContent =
										`<div style="position: relative; width: 100%; padding-top: 56.25%; overflow: hidden; margin-bottom: 10px; ">
											<img src="${bonusLandmark.image}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" alt="Photos">
											<div style="position: absolute; bottom: 0; right: 0; background-color: rgba(0, 0, 0, 0.5); color: white; padding: 5px 10px; font-size: 0.8em; text-align: right;">
												Photo: ${bonusLandmark.image_credit}
											</div>
										</div>
										${bonusLandmark.story}
										`;

									document.getElementById("modalTitle").innerHTML = modalTitle;
									document.getElementById("modalBody").innerHTML = modalBodyContent;

									let modalElement = document.getElementById("staticBackdrop");
									let modalInstance = new bootstrap.Modal(modalElement);
									modalInstance.show();
								}
							});

						vis.markers.push(marker);
					}
				});
			};

			createMarkers(vis.officialLandmarks.approvedLandmarks, vis.approvedIcon, "approved");
			createMarkers(vis.officialLandmarks.pendingLandmarks, vis.pendingIcon, "pending");
			createMarkers(vis.officialLandmarks.deniedLandmarks, vis.deniedIcon, "denied");
		} else if (selectedCategory === "your-landmarks") {
			const createMarkers = (landmarks) => {
				landmarks.forEach(landmark => {
					if (landmark.lat && landmark.lon) {
						let coordinate = [parseFloat(landmark.lat), parseFloat(landmark.lon)];
					    let streetViewImageUrl = `https://maps.googleapis.com/maps/api/streetview?source=outdoor&size=600x400&fov=120&location=${coordinate.join(',')}&key=AIzaSyAZds2BIz-J0WNouMON5c25WPfO498vjk0`;

						let dynamicIcon = L.divIcon({ className: 'emoji-icon-2', html: landmark.emoji, iconSize: [20, 20] });
						let marker = L.marker(coordinate, {icon: dynamicIcon}).addTo(vis.map)

						marker.on("mouseover", function (event) {
							vis.tooltip.style("opacity", 1)
								.html(() => {
									let tooltipContent;
									if (landmark.name || landmark.story) {
								    		tooltipContent = `<img src="${streetViewImageUrl}" alt="Street View Image" width="100%"></br>
                        									 <b>${landmark.name.toUpperCase()}</b><br/>
                        									 ${landmark.story}<br/>`;
									} else {
								    		tooltipContent = `<i>The New Proposal is Under Reviewed!</i>`;
									}
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
		if (vis.heatLayer) {
		 	vis.map.removeLayer(vis.heatLayer);
		 	vis.heatLayer = null;
		}

		const getCoord = (landmarks) => {
			return landmarks.map(landmark => [landmark.lat, landmark.lon]);
		};

		let landmarkCoord = [];

		if (selectedCategory === "official-landmarks") {
			landmarkCoord = getCoord(vis.officialLandmarks.approvedLandmarks)
				.concat(getCoord(vis.officialLandmarks.pendingLandmarks))
				.concat(getCoord(vis.officialLandmarks.deniedLandmarks));
		} else if (selectedCategory === "your-landmarks") {
			landmarkCoord = getCoord(vis.yourLandmarks);
		}

		vis.heatLayer = L.heatLayer(landmarkCoord, {
		    radius: 30,
		    // gradient: {0.2: '#101c56', 0.4: '#2e4d9d', 0.6: '#4d99bd', 0.8: '#8ec8bc', 1: '#e2f1b8'}
		}).addTo(vis.map);

		if (vis.heatLayer) {
			let canvas = vis.heatLayer._canvas;
				if (canvas) {
					canvas.style.opacity = 0.7;
				}
		}

		document.getElementById('refresh').addEventListener('click', () => {
			window.location.reload();
		});

	}

}
