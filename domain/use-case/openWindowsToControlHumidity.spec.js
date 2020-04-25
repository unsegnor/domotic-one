const {assert} = require('chai')
//var FakeTemperatureSensor = require('../Domain/FakeTemperatureSensor');
//var FakeNotifier = require('../Domain/FakeNotifier');
//var OpenWindowsToControlHumidity = require('./OpenWindowsToControlHumidity')

xdescribe('Open windows to control humidity', function(){
    it('must suggest to open the windows when the humidity is over the maximum and the external humidity is below the maximum', async function(){
        var roomSensor = FakeTemperatureSensor();
        var externalSensor = FakeTemperatureSensor();
        var notifier = FakeNotifier();
        await externalSensor.setHumidity(55);
        OpenWindowsToControlHumidity({roomSensor, externalSensor, notifier});
        await roomSensor.setHumidity(61);

        assert.isTrue(notifier.receivedMessage('Open windows to reduce humidity'));
    })
});