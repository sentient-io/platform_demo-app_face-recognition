handleUploadSinglePic = (file) => {
	uploadSinglePic(file);
};

handleRecognizeFace = () => {
	$('#btn-handleRecognizeFace').hide();
	loadingStart();
	recognizeFace();
};

handleRestart = () => {
	$('#analyseResult, #btn-handleRestart, #noFaceDetected').hide();
	$('#analyseResult, #single-pic-preview').empty();
	$('#single-pic-uploader').show();
	// Clear record of uploaded file
	$('#single-pic-input').val('');
};

//Draw full image to canvas
canvasDrawImage = (base64string, sWidth, sHeight, resize = 100) => {
	// Takes base64string, source Width and Height
	// Resize will be the size of rendered canvas
	let dWidth;
	let dHeight;
	if (sWidth >= sHeight) {
		// When image is landscape
		dWidth = resize;
		dHeight = (sHeight * dWidth) / sWidth;
	} else {
		// When image is portrait
		dHeight = resize;
		dWidth = (sWidth * dHeight) / sHeight;
	}

	let canvas = document.createElement('canvas');
	canvas.setAttribute('width', dWidth);
	canvas.setAttribute('height', dHeight);

	let ctx = canvas.getContext('2d');

	var image = new Image();
	image.onload = () => {
		ctx.drawImage(image, 0, 0, sWidth, sHeight, 0, 0, dWidth, dHeight);
	};
	image.src = base64string;

	return canvas;
};

// Draw box on canvas based on location
canvasDrawBox = (location, picId, objectName, objectID) => {
	//picId: base image
	// Location: array with 4 position number
	// Use canvasResideRatio to resize the returned box
	let y = location[0] * canvasResizeRatio;
	let x = location[3] * canvasResizeRatio;
	let width = location[1] * canvasResizeRatio - x;
	let height = location[2] * canvasResizeRatio - y;

	// Prevent API from return negative value
	if (y < 0) {
		y = 0;
	} else if (x < 0) {
		x = 0;
	}

	let canvas = document.getElementById(picId);
	let ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.lineWidth = '1';
	ctx.strokeStyle = 'red';
	ctx.rect(x, y, width, height);
	ctx.stroke();

	// Draw object name with ID on canvas

	/*
	let txtCtx = canvas.getContext('2d');
	txtCtx.font = '12px sans-serif';
	txtCtx.textBaseline = 'top';
	txtCtx.fillStyle = 'red';

	let txtWidth = txtCtx.measureText(objectName + ' - ' + objectID).width;
	txtCtx.fillRect(x, y, txtWidth + 10, 20);

	txtCtx.fillStyle = '#fff';
	txtCtx.fillText(objectName + objectID, x + 5, y + 5);
	*/
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
	let img = document.getElementById('sourcePic');
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

let loadingMsg = [
	'Just a moment more, processing your file...',
	'You can buy and sell data securely on Sentient.io’s blockchain network.',
	'Use utility microservices to save time during your app development.',
	'Have a microservice you\'re looking for but can\'t find? Write in to us <a style="text-decoration:underline"  href = "mailto: enquiry@sentient.io">enquiry@sentient.io</a>',
	"Need help with implementing the APIs? Click the 'Help' button at the bottom of the screen to reach out to our support team.",
	'The APIs on our platform are curated carefully to ensure reliability for deployment',
	'Usage discounts are automatically applied as the number of API calls made reaches the next tier',
	'Just a moment more, processing your file...',
];

let loading;

loadingStart = () => {
	$('#loader').toggle();

	let msgIndex = 0;
	loading = window.setInterval(() => {
		$('#loader-text').html(loadingMsg[msgIndex]);
		if (msgIndex < loadingMsg.length) {
			msgIndex += 1;
		} else {
			msgIndex = 1;
		}
	}, 4000);
};

loadingEnd = () => {
	$('#loader').toggle();
	window.clearInterval(loading);
};
