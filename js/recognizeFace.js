recognizeFace = () => {
	let data = $('#sourcePic').attr('src').split('base64,')[1];
	// Calling object detection API
	$.ajax({
		method: 'POST',
		url:
			'https://apis.sentient.io/microservices/cv/facerecognition/v0.1/getpredictions',
		headers: {
			accept: 'application/json',
			'x-api-key': apikey,
			'Content-Type': 'application/json',
		},
		data: JSON.stringify({
			model: 'sg-parliament-2019',
			img_base64: data,
		}),
		success: (response) => {
			loadingEnd()
			if (!Boolean(response.results[0])) {
				// Handle no face detected
				handelNoFaceDetected();
			} else {
				renderAnalyseResult(response.results);
			}
		},
		error: (err) => {
			//Send error message to html error pop-up box
			let errMsg = (document.createElement('p').innerHTML = err.responseText);
			$('#errMsgConainer').append(errMsg);
			$('#errMsgWindow').modal('toggle');
			// console.log(err.responseText);
		},
	});
};

// Render confidence icon and tool tip
renderConfidence = (confidence) => {
	// Container of icon
	let container = document.createElement('div');
	container.setAttribute('class', 'conf-container');

	// Toogle :hover hide with css
	let icon = document.createElement('span');
	icon.innerHTML = 'info';
	icon.setAttribute('class', 'material-icons conf-icon');

	// Toggle :hover show with css
	let message = document.createElement('p');
	message.setAttribute('class', 'conf-message');
	let confidenceVal = confidence.toFixed(2);
	message.innerHTML = `Confidence:<br><p class="conf-message-num">${
		confidenceVal * 100
	}%</p>`;

	$(container).append(icon);
	$(container).append(message);

	return container;
};

// Render analyse result to html
renderAnalyseResult = (results) => {
	for (index in results) {
		// Draw boxes over detected faces
		//let identity = results[index].identity;
		canvasDrawBox(
			results[index].location,
			'uploadedPic',
			//Removes parameters below, removed name on box (text too long)
			//identity.substring(0, 3),
			//'...'
		);

		// Draw face thumbnails
		let recognizedFace = drawRecognizedFace(results[index].location);

		let name = document.createElement('h5');
		name.innerHTML = results[index].identity;

		// Create result card container
		let resultCard = document.createElement('div');
		resultCard.setAttribute(
			'class',
			'mt-4 d-flex flex-row align-items-center result-card'
		);

		//Create WIKI text container
		let resultTextContainer = document.createElement('div');
		resultTextContainer.setAttribute('class', 'col-9 result-text-container');

		//Get Wiki Results
		let wikiResult = document.createElement('a');
		wikiResult.setAttribute('class', 'wiki-result');
		// Calling Wiki API
		wikiResult.setAttribute(
			'onclick',
			`wikiRetrieval('${results[index].identity}')`
		);
		Object.assign(wikiResult, {
			id: String(results[index].identity).replace(/ /g, ''),
		});
		wikiResult.innerHTML = 'More Info';

		let headerContainer = document.createElement('div');
		headerContainer.setAttribute(
			'class',
			'd-flex flex-row justify-content-between'
		);

		// Display all rendered result
		$('#analyseResult').append(resultCard);
		$(resultCard).append(recognizedFace);
		$(resultCard).append(resultTextContainer);
		$(headerContainer).append(name);
		$(resultTextContainer).append(headerContainer);
		$(resultTextContainer).append(wikiResult);

		// Render confidence icon
		let confidence = renderConfidence(results[index].conf);
		$(headerContainer).append(confidence);
	}
	$('#analyseResult, #btn-handleRestart').show();
	$('#loadingText').hide();
	$('html, body').animate(
		{
			scrollTop: $('#analyseResult').offset().top,
		},
		1000
	);
};

handelNoFaceDetected = () => {
	$('#noFaceDetected, #btn-handleRestart').show();
	$('#loadingText').hide();
};
