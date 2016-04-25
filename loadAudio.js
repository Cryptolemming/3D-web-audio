// declare required
let audioCtx, source, sourceProcessor, analyser
let transform = 0;
const URL = 'http://sampleswap.org/mp3/artist/92209/construct_Hummingbird-RMX-Edit-3-320.mp3';

// determine Web Audio API support and set context
audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create a buffer source node
source = audioCtx.createBufferSource();

// load audio with XMLHttpRequest for asynchronous loading
let request = new XMLHttpRequest();
request.open('GET', URL, true);
request.responseType = 'arraybuffer';

// prepare and connect an analyser node for frequency visualization data
analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);

getData = () => {
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

var c = document.getElementById("myCanvas");
var canvasCtx = c.getContext("2d");

draw = () => {
  WIDTH = canvasCtx.width;
  HEIGHT = canvasCtx.height;

  let drawVisual = requestAnimationFrame(draw);

  canvasCtx.fillStyle = 'rgb(3, 4, 5)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
    canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

    x += barWidth + 1;
  }
};

getData();
draw();
source.start(0);
