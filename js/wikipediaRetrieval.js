wikiRetrieval = (keyword) => {
	if (keyword === 'UNKNOWN') {
		document.getElementById(keyword.replace(/ /g, '')).innerHTML = 'No Record';
	} else {
		let id = document.getElementById(keyword.replace(/ /g, ''));
		// Prevent multiple Wikipedia API calling
		id.removeAttribute('onclick');
		// Show loader
		id.innerHTML =
			'<img src="img/loading.gif" width="24px" height="24px"> <span style="text-decoration:none">Processing ...</span>';

		$.ajax({
			method: 'POST',
			url:
				'https://apis.sentient.io/microservices/utility/wikipedia/v0.1/getresults',
			headers: {
				accept: 'application/json',
				'x-api-key': apikey,
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({
				title: keyword,
				pageid: 0,
			}),
			success: (response) => {
				let wikiResult = document.getElementById(keyword.replace(/ /g, ''));

				if (!Boolean(response.results.summary)) {
					// If result is undefined
					wikiResult.innerHTML = 'No related wikipedia result';
				} else {
					// Render summary text and create the link
					wikiResult.innerHTML = response.results.summary;
					wikiResult.setAttribute('href', `${response.results.url}`);
					wikiResult.setAttribute('target', '_blank');
					wikiResult.setAttribute('style', 'text-decoration:underline');
					wikiResult.classList.add('wiki-link');
				}
			},
			error: (err) => {
				let errMsg = (document.createElement('p').innerHTML = err.responseText);
				$('#errMsgConainer').append(errMsg);
				$('#errMsgWindow').modal('toggle');
			},
		});
	}
};
