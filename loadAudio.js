// declare required
let audioCtx, source, analyser;
const URL = 'http://sampleswap.org/mp3/artist/92209/construct_Hummingbird-RMX-Edit-3-320.mp3';

// determine Web Audio API support and set context
audioCtx = new (window.AudioContext || window.webkitAudioContext)();

getData = () => {
	// create a buffer source node
	source = audioCtx.createBufferSource();

	// load audio with XMLHttpRequest for asynchronous loading
	let request = new XMLHttpRequest();
	request.open('GET', URL, true);
	request.responseType = 'arraybuffer';
	
	request.onload = () => {
		// and decode asynchronously after loading
		audioCtx.decodeAudioData(request.response).then((buffer) => {
			// if audio doesn't decode properly, inform and return
			if (!buffer) {
				let div = document.createElement('div');
				div.textContent = 'Audio did not load properly';

				document.body.appendChild(div);
				return;
			}

			source.buffer = buffer;

			// connect the buffer to the destination node
			source.connect(audioCtx.destination);
		});
	};

	request.send();
}

getData();
source.start(0);