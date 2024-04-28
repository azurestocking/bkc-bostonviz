class LandmarkMap {

	constructor(parentElement, officialLandmarks, bonusLandmarks, yourLandmarks, coord) {
		this.parentElement = parentElement;
		this.officialLandmarks = officialLandmarks;
		this.bonusLandmarks = bonusLandmarks;
		this.yourLandmarks = yourLandmarks;
		this.coord = coord;
		this.markers = [];

		// console.log("bonus: ", this.bonusLandmarks);

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
								<b>To name something as an official landmark, you need to...</b><br/><br/>
								<ol>
									<li data-emoji="1️⃣">Write a short report about why the building or place is important<br/></li>
								
									<li data-emoji="2️⃣">Email the draft to the <i>Boston Landmarks Commission (BLC)</i><br/></li>
								
									<li data-emoji="3️⃣">Gather enough signatures or support from <i>Mayor</i> or <i>BLC</i><br/></li>
								
									<li data-emoji="4️⃣"><i>BLC</i> will look at the request in a public meeting, if they agree, it becomes a <b><img src="img/icon-yellow.png" style="width: var(--bs-body-font-size); border: none;"/>pending landmark</b><br/></li>
								
									<li data-emoji="5️⃣">Write a <i>Study Report</i> and post it for the public to give opinions<br/></li>
								
									<li data-emoji="6️⃣">Finally, <i>BLC, Mayor</i>, and <i>City Council</i> will decide if it should be an <b><img src="img/icon-blue.png" style="width: var(--bs-body-font-size); border: none;"/>approved landmark</b>, otherwise, a <b><img src="img/icon-red.png" style="width: var(--bs-body-font-size); border: none;"/>denied petition</b></li>
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
								<b>Boston Landmarks Commission (BLC) and 10 local historic district commissions</b> work to keep Boston's culture and history safe.<br/><br/>
Local volunteers help out as commissioners. Neighborhood groups and professional groups suggest who should be commissioners. Then, the Mayor picks them, and the City Council agrees with the choice.
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
								<b>Landmarks can be buildings, places, objects, or natural spots.</b> There are four ways to decide if something is important enough to be a landmark:<br/><br/>
								<ol>
									<li data-emoji="1️⃣">It's on the <i>National List of Historic Places</i></li>
									<li data-emoji="2️⃣">It's where <b>important events</b> happened that helped shape our culture, politics, economy, military, or society</li>
									<li data-emoji="3️⃣">It's connected to the lives of <b>famous historical people</b></li>
									<li data-emoji="4️⃣">It shows off <b>special architecture</b> or <b>landscape designs</b>, great craftsmanship, or works by famous designers</li>
								</ol>
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
								<b>Which places in Boston do you think should be known as landmarks?</b><br/><br/>
								Think about the places around you, both big and small, and why they are important to your community. <br/><br/>
								<span class="highlight">Scan the QR code to add your landmark!</span></br></br>
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
								<b>You, in front of the screen!</b><br/><br/>
								Visitors of all backgrounds are welcome to nominate places of personal significance as landmarks!
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
								Look at the difference between landmarks chosen by officials and those picked by people who live in the area.<br/><br/>
								<b>Why are they different? What does this difference mean?</b><br/><br/>
								Think about what makes a place really important as a landmark and how it helps us remember history.					    
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
								
								let tooltipWidth = 350;
								let tooltipHeight = 320;
								let pageX = event.originalEvent.pageX;
								let pageY = event.originalEvent.pageY;
								let viewportWidth = window.innerWidth;
								let viewportHeight = window.innerHeight;

								let styleOptions = {
									left: pageX + 10 + 'px',
									top: pageY + 10 + 'px'
								};

								// If close to the right edge, use 'right' instead of 'left'
								if (pageX + tooltipWidth > viewportWidth) {
									styleOptions.right = (viewportWidth - pageX) + 10 + 'px';
									delete styleOptions.left; // Remove the 'left' style to prevent conflict
								}

								// If close to the bottom edge, use 'bottom' instead of 'top'
								if (pageY + tooltipHeight + 80 > viewportHeight) {
									styleOptions.bottom = (viewportHeight - pageY) + 10 + 'px';
									delete styleOptions.top; // Remove the 'top' style to prevent conflict
								}

								vis.tooltip.style("opacity", 1)
									.html(() => {
										let tooltipContent, encodedAddress, fullLocation, encodedLocation, streetViewImageUrl, fetchPrompt, identifier;

										switch (status) {
											case "approved":
												encodedAddress = encodeURIComponent(coordinate);
												streetViewImageUrl = `https://maps.googleapis.com/maps/api/streetview?source=outdoor&size=600x400&fov=120&location=${encodedAddress}&key=AIzaSyAZds2BIz-J0WNouMON5c25WPfO498vjk0`;

												identifier = landmark.pid_long;
												fetchPrompt = {
													landmark: landmark,
													instructions: "Additional Instruction: If no landmark's name is provided, use the geo-coordinate and street address to inference what it is, try your best. Tell the landmark's name if you are sure. Don't mention the street address or the coordinates."
												};
												// console.log(fetchPrompt)
												tooltipContent = isBonusLandmark ?
													`<i>Click to Catch Me and Know More!</i>`:
													`<img src="${streetViewImageUrl}" alt="Street View Image" width="300px"><br/>
                                                    <b>${landmark.name ? landmark.name.toUpperCase() : landmark.assessor_description.toUpperCase()}</b><br/>
													${landmark.full_address}<br/>
                                                    ${status.charAt(0).toUpperCase()}${status.slice(1)}, Built in ${Math.floor(landmark.yr_built)}<br/><br/>
													<span id="storyText${identifier}" style="padding-bottom: 0px;"></span>`;

												fetchOfficial(fetchPrompt, identifier);
												break;
											case "pending":
											case "denied":
												fullLocation = `${landmark["NAME OF PROPERTY"]}, ${landmark.full_address}`;
												encodedLocation = encodeURIComponent(fullLocation);
												streetViewImageUrl = `https://maps.googleapis.com/maps/api/streetview?source=outdoor&size=600x400&fov=120&location=${encodedLocation}&key=AIzaSyAZds2BIz-J0WNouMON5c25WPfO498vjk0`;

												identifier = landmark["NAME OF PROPERTY"]
												fetchPrompt = {
													"name": landmark["NAME OF PROPERTY"],
													"geo-coordinate": landmark.coordinate,
													"full address": landmark.full_address
												};
												tooltipContent = isBonusLandmark ?
													`<i>Click to Catch Me and Know More!</i>`:
													`<img src="${streetViewImageUrl}" alt="Street View Image" width="300px"></br>
												    	<b>${landmark["NAME OF PROPERTY"].toUpperCase()}</b><br/>
												    	${landmark.full_address}<br/>
												    	${status.charAt(0).toUpperCase()}${status.slice(1)}, ${landmark.DETAILS}<br/><br/>
														<span id="storyText${identifier}" style="padding-bottom: 0px;"></span>`;

												fetchOfficial(fetchPrompt, identifier);
												break;
											default:
												tooltipContent = ``
										}
										return tooltipContent;
									})
									.style("left", styleOptions.left || null) // Apply 'left' or 'null' if 'right' is used
									.style("top", styleOptions.top || null) // Apply 'top' or 'null' if 'bottom' is used
									.style("right", styleOptions.right || null) // Apply 'right' or 'null'
									.style("bottom", styleOptions.bottom || null) // Apply 'bottom' or 'null'
									.style("visibility", "visible");
							})
							.on("mouseout", function () {
								vis.tooltip.style("opacity", 0)
									.style("left", null) // Clear positioning styles
									.style("top", null)
									.style("right", null)
									.style("bottom", null)
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
					    let streetViewImageUrl = landmark.img ? landmark.img : `https://maps.googleapis.com/maps/api/streetview?source=outdoor&size=600x400&fov=120&location=${coordinate.join(',')}&key=AIzaSyAZds2BIz-J0WNouMON5c25WPfO498vjk0`;

						let dynamicIcon = L.divIcon({ className: 'emoji-icon-2', html: landmark.emoji, iconSize: [20, 20] });
						let marker = L.marker(coordinate, {icon: dynamicIcon}).addTo(vis.map)

						marker.on("mouseover", function (event) {

							let tooltipWidth = 350;
							let tooltipHeight = 320;
							let pageX = event.originalEvent.pageX;
							let pageY = event.originalEvent.pageY;
							let viewportWidth = window.innerWidth;
							let viewportHeight = window.innerHeight;

							let styleOptions = {
								left: pageX + 10 + 'px',
								top: pageY + 10 + 'px'
							};

							// If close to the right edge, use 'right' instead of 'left'
							if (pageX + tooltipWidth > viewportWidth) {
								styleOptions.right = (viewportWidth - pageX) + 10 + 'px';
								delete styleOptions.left; // Remove the 'left' style to prevent conflict
							}

							// If close to the bottom edge, use 'bottom' instead of 'top'
							if (pageY + tooltipHeight + 80 > viewportHeight) {
								styleOptions.bottom = (viewportHeight - pageY) + 10 + 'px';
								delete styleOptions.top; // Remove the 'top' style to prevent conflict
							}
							
							vis.tooltip.style("opacity", 1)
								.html(() => {
									let tooltipContent;
									if (landmark.name || landmark.story) {
										tooltipContent = `<img src="${streetViewImageUrl}" alt="Street View Image" width="300px"></br>
                  							<b>${landmark.name.toUpperCase()}</b><br/>` +
											(landmark.story ? `${landmark.story}<br/><br/>` : "") +
											`<span id="storyText${landmark.name}" style="padding-bottom: 0px;"><i>Our Take: </i></span>`;

											let fetchPrompt = {
												"name": landmark.name,
												"lat": landmark.lat,
												"lon": landmark.lon,
												"story": landmark.story
											};
											fetchPersonal(fetchPrompt);
									} else {
								    		tooltipContent = `<i>The New Proposal is Under Review!</i>`;
									}
									return tooltipContent;
								})
								.style("left", styleOptions.left || null) // Apply 'left' or 'null' if 'right' is used
								.style("top", styleOptions.top || null) // Apply 'top' or 'null' if 'bottom' is used
								.style("right", styleOptions.right || null) // Apply 'right' or 'null'
								.style("bottom", styleOptions.bottom || null) // Apply 'bottom' or 'null'
								.style("visibility", "visible");
						})
							.on("mouseout", function () {
								vis.tooltip.style("opacity", 0)
									.style("left", null) // Clear positioning styles
									.style("top", null)
									.style("right", null)
									.style("bottom", null)
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
					canvas.style.opacity = 0.4;
				}
		}

		document.getElementById('refresh').addEventListener('click', () => {
			window.location.reload();
		});

	}

}
