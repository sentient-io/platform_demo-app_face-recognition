recognizeFace = () => {
	let data = $('#uploadedPic').attr('src').split('base64,')[1];
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

//Draw detected face to canvas
drawRecognizedFace = (location) => {
	let top = location[0];
	let right = location[1];
	let bottom = location[2];
	let left = location[3];
	// expand face detection area to show the whole head
	let expandAreaVal = (bottom - top) * 0.3;

	//draw image
	let imgCanvasContainer = document.createElement('div');
	imgCanvasContainer.setAttribute('class', 'detected-picture shadow');
	let img = document.getElementById('uploadedPic');
	let canvas = document.createElement('canvas');
	let canvasCtx = canvas.getContext('2d');
	canvasCtx.drawImage(
		img,
		left - expandAreaVal,
		top - expandAreaVal,
		bottom - top + 2 * expandAreaVal,
		right - left + 2 * expandAreaVal,
		0,
		0,
		80,
		80
	);
	imgCanvasContainer.appendChild(canvas);
	return imgCanvasContainer;
};

// Render confidence icon and tool tio
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

			//Get Wiki Resule
			let wikiResult = document.createElement('a');
			wikiResult.setAttribute('class', 'wiki-result');
			Object.assign(wikiResult, {
				id: String(results[index].identity).replace(/ /g, ''),
			});
			wikiResult.innerHTML =
				'<img src="img/loading.gif" class="mr-2 mb-1" width="14" height="14" />Getting info from wikipedia ... ';

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

			// Calling Wiki API
			wikiRetrieval(results[index].identity);
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
