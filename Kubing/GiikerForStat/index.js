let moveArray = [];

$(() => {
    connectToGiiker();
});

function connectToGiiker() {
    var connectGiiker = document.getElementById("connectGiiker");
    connectGiiker.addEventListener('click', async () => {

        connectGiiker.disabled = true;
        try {
            const giiker = await connect();
            connectGiiker.textContent = 'Connected!';
            setVirtualCube(true);

            giiker.on('connected', () => {
                alert("Giiker cube connected");
            });

            giiker.on('move', (move) => {/* console.log(move);
                doAlg(move.notation); */
            });

            giiker.on('disconnected', () => {
                alert("Giiker cube disconnected");
                connectGiiker.textContent = 'Connect to Giiker Cube';
                connectGiiker.disabled = false;
            })
        
        } catch(e) {

            connectGiiker.textContent = 'Connect to Giiker Cube';
            connectGiiker.disabled = false;
        }
    });
}

function searchForBTDevice() {
    console.log('Requesting Bluetooth Device...');
    window.navigator.bluetooth.requestDevice(
        {filters: [
            {namePrefix: 'Gi'},
            {namePrefix: 'GAN'}
        ],
        optionalServices: ['battery_service']
    })
    .then(device => {
        console.log('Connecting to GATT Server...');
        return device.gatt.connect();
    })
    .then(server => {
        console.log('Getting Battery Service...');
        return server.getPrimaryService('battery_service');
    })
    .then(service => {
        console.log('Getting Battery Level Characteristic...');
        return service.getCharacteristic('battery_level');
    })
    .then(characteristic => {
        console.log("Characteristic");
        console.log(characteristic);
        //_parseCubeValue(characteristic.readValue());
        return characteristic.readValue();
    })
    .then(value => {
        let batteryLevel = value.getUint8(0);
        console.log('> Battery Level is ' + batteryLevel + '%');
        $("#battery").html("Battery: "+batteryLevel+"%");
    })
    .catch(error => {
        console.log(error);
    });
}

function _parseCubeValue (value) {
    const state = {
      cornerPositions: [],
      cornerOrientations: [],
      edgePositions: [],
      edgeOrientations: []
    };
    const moves = [];
    if (value.getUint8(18) == 0xa7) { // decrypt
	    var key = [176, 81, 104, 224, 86, 137, 237, 119, 38, 26, 193, 161, 210, 126, 150, 81, 93, 13, 236, 249, 89, 235, 88, 24, 113, 81, 214, 131, 130, 199, 2, 169, 39, 165, 171, 41];
            var k = value.getUint8(19);
            var k1 = k >> 4 & 0xf;
            var k2 = k & 0xf;
	    for (let i = 0; i < value.byteLength; i++) {
		    const move = (value.getUint8(i) + key[i + k1] + key[i + k2]) & 0xff;
		    const highNibble = move >> 4;
		    const lowNibble = move & 0b1111;
		    if (i < 4) {
			    state.cornerPositions.push(highNibble, lowNibble);
		    } else if (i < 8) {
			    state.cornerOrientations.push(highNibble, lowNibble);
		    } else if (i < 14) {
			    state.edgePositions.push(highNibble, lowNibble);
		    } else if (i < 16) {
			    state.edgeOrientations.push(!!(move & 0b10000000));
			    state.edgeOrientations.push(!!(move & 0b01000000));
			    state.edgeOrientations.push(!!(move & 0b00100000));
			    state.edgeOrientations.push(!!(move & 0b00010000));
			    if (i === 14) {
				    state.edgeOrientations.push(!!(move & 0b00001000));
				    state.edgeOrientations.push(!!(move & 0b00000100));
				    state.edgeOrientations.push(!!(move & 0b00000010));
				    state.edgeOrientations.push(!!(move & 0b00000001));
			    }
		    } else {
			    moves.push(this._parseMove(highNibble, lowNibble));
		    }
	    }
    }
     else { // not encrypted
	     for (let i = 0; i < value.byteLength; i++) {
		     const move = value.getUint8(i)
		     const highNibble = move >> 4;
		     const lowNibble = move & 0b1111;
		     if (i < 4) {
			     state.cornerPositions.push(highNibble, lowNibble);
		     } else if (i < 8) {
			     state.cornerOrientations.push(highNibble, lowNibble);
		     } else if (i < 14) {
			     state.edgePositions.push(highNibble, lowNibble);
		     } else if (i < 16) {
			     state.edgeOrientations.push(!!(move & 0b10000000));
			     state.edgeOrientations.push(!!(move & 0b01000000));
			     state.edgeOrientations.push(!!(move & 0b00100000));
			     state.edgeOrientations.push(!!(move & 0b00010000));
			     if (i === 14) {
				     state.edgeOrientations.push(!!(move & 0b00001000));
				     state.edgeOrientations.push(!!(move & 0b00000100));
				     state.edgeOrientations.push(!!(move & 0b00000010));
				     state.edgeOrientations.push(!!(move & 0b00000001));
			     }
		     } else {
			     moves.push(this._parseMove(highNibble, lowNibble));
		     }
	     } 
     }

    return {state, moves};
  }