handleUploadSinglePic = (file) => {
	$('#btn-handleRecognizeFace').show()
	uploadSinglePic(file)
}

handleRecognizeFace = () => {
	$('#btn-handleRecognizeFace').hide()
	$('#loadingText').show()
	recognizeFace();
};

handleRestart = () => {
	$('#analyseResult, #btn-handleRestart, #noFaceDetected').hide();
	$('#analyseResult, #single-pic-preview').empty();
	$('#single-pic-uploader').show();
	// Clear record of uploaded file
	$('#single-pic-input').val('');
};
