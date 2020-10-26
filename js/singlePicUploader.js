// 1MB is 1048576
let fileSizeLimit = 1048576 * 5;
let canvasResizeRatio

let dropArea = document.getElementById('single-pic-uploader');
// Prevent default behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
	dropArea.addEventListener(eventName, preventDefaults, false);
});
function preventDefaults(e) {
	e.preventDefault();
	e.stopPropagation();
}

// Highlight effect when drag files over
['dragenter', 'dragover'].forEach((eventName) => {
	dropArea.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach((eventName) => {
	dropArea.addEventListener(eventName, unhighlight, false);
});
function highlight(e) {
	dropArea.classList.add('highlight');
}
function unhighlight(e) {
	dropArea.classList.remove('highlight');
}

//Get the data for the files that were dropped
dropArea.addEventListener('drop', handleDrop, false);
function handleDrop(e) {
	let dt = e.dataTransfer;
	let files = dt.files;
	handleUploadSinglePic(files);
}

// Handle picture preview
uploadSinglePic = (files) => {
	if (files[0].size >= fileSizeLimit) {
		// Toggle popup window
		let errMsg = (document.createElement('p').innerHTML =
			'File size it too big! Please uploade image size within 5MB.');
		$('#errMsgConainer').append(errMsg);
		$('#errMsgWindow').modal('toggle');
		// Clear record of uploaded file
		$('#single-pic-input').val('');
	} else {
		// Preview uploaded file
		let reader = new FileReader();
		reader.readAsDataURL(files[0]);
		reader.onloadend = () => {
			let img = document.createElement('img');
			img.setAttribute('id', 'sourcePic');
			img.src = reader.result;

			// Hide original image
			$(img).hide();

			let image = new Image();
			image.src = reader.result;
			image.onload = () => {
				let canvas = canvasDrawImage(
					reader.result,
					image.width,
					image.height,
					500
				);
				canvas.setAttribute('id', 'uploadedPic');
				$('#single-pic-preview').append(canvas);
				if(image.width >= image.height){
					canvasResizeRatio = 500 / image.width
				}else{
					canvasResizeRatio = 500 / image.height
				}
				//console.log(canvasResizeRatio)
			};

			$('#single-pic-preview').append(img);
			$('#btn-handleRecognizeFace').show();
		};
		$('#single-pic-uploader').hide();
	}
};
