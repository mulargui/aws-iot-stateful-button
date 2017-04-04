
//https://github.com/aws/aws-iot-device-sdk-js/blob/master/README.md#thingShadow

var awsIot = require('aws-iot-device-sdk');

var gettoken, updatetoken, emailcount;

var thingShadows = awsIot.thingShadow({
	keyPath: process.env.keyPath,
	certPath: process.env.certPath,
	caPath: process.env.caPath,
	clientId: process.env.clientId,
	region: process.env.region,
	debug: true
});

thingShadows.on('connect', function() {
	console.log('Connected!');

	//we need to register to our shadow
    thingShadows.register( process.env.thing, {persistentSubscribe: true}, function(){
		console.log('Registered ' + process.env.thing );
		
		//get the state of the dash button
		gettoken=thingShadows.get(process.env.thing);
	});
});

thingShadows.on('message', function(topic, payload) {
	console.log('message', topic, payload.toString());
	
	//update the state of the dash button after receiving confirmation of the event
	updatetoken=thingShadows.update(process.env.thing, { "state": { "reported": { "count": emailcount+1}}});
});

thingShadows.on('close', function() {
	console.log('close');
	
	//after closing the connection we exit gracefully
	process.exit(1);
});

thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
	console.log('Received '+stat+' on '+thingName+': '+
		JSON.stringify(stateObject)+' token: '+clientToken);
	
	//get the state of the dash button
	if(clientToken == gettoken){
		if(stat == 'rejected')
			//no shadow, so no email sent
			emailcount=0;
		else
			//get the count of emails sent 
			emailcount=stateObject.state.reported.count;
	
		// subscribe to the event to get confirmation of success
		thingShadows.subscribe(process.env.event);
		
		//send a click!
		thingShadows.publish(process.env.event, JSON.stringify({ID : process.env.clientId, clicked : 'single'}))
	}
	
	//receive confirmation of the change of state
	if(clientToken == updatetoken){
		//finish nicely
		thingShadows.unregister( process.env.thing);
		thingShadows.end();
	}
});

thingShadows.on('delta', function(thingName, stateObject) {
	console.log('Received delta on '+thingName+': '+
		JSON.stringify(stateObject));
});

thingShadows.on('foreignStateChange', function(thingName, operation, stateObject) {
	console.log('foreignStateChange: '+ operation + ' on ' + thingName + ' with state ' +
		JSON.stringify(stateObject));
});

thingShadows.on('timeout', function(thingName, clientToken) {
	console.log('Received timeout on '+thingName+
		' with token: '+ clientToken);
});

thingShadows.on('reconnect', function() {
	console.log('reconnect');
});

thingShadows.on('offline', function() {
	console.log('offline');
});

thingShadows.on('error', function(error) {
	console.log('error', error);
});
