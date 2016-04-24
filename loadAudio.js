// declare required
let audioCtx, source, analyser;
const URL = '#';

// determine Web Audio API support and set context
try {
	if(typeof webkitAudioContext === 'function' || 'webkitAudioContext' in window) {
		audioCtx = new webkitAudioContext();
	}
	else {
		audioCtx = new AudioContext();
	}
}
catch(e) {
	let div = document.createElement('div');
	div.textContent = 'Web Audio API is not supported in this browser';

	document.body.appendChild(div);
}

// load audio with XMLHttpRequest for asynchronous loading
let request = XMLHttpRequest;
request.open('GET', URL, true);
request.responseType = 'arraybuffer';

// and decode asynchronously after loading
request.onload = () => {
	audioCtx.decodeAudioData(request.response).then((decodedData) => {
		// if audio doesn't decode properly, inform and return
		if (!decodedData) {
			let div = document.createElement('div');
			div.textContent = 'Audio did not load properly';

			document.body.appendChild(div);
			return;
		}

		// set the source buffer to the decoded data
		source.buffer = decodedData;

		// connect the buffer to the destination node
		source.connect(audioCtx.destination);

	});
};


request.send();

source.start(0);