const {assert} = require('chai')
var FakeMovementSensor = require('../../test-doubles/FakeMovementSensor');
var FakeLight = require('../../test-doubles/FakeLight');
var TurnOnLightWithMovement = require('./TurnOnLightWithMovement')

describe('Turn on light with movement', function(){
    it('must turn on the given light with 0 luminosity when the sensor detects movement', async function(){
        var sensor = FakeMovementSensor()
        var light = FakeLight()
        light.isOn.resolves(false)
        TurnOnLightWithMovement({sensor, light})
        await sensor.fireMovementDetected()
        assert.isTrue(light.setLuminosity.calledWith(0))
    })

    it('must not modify the light when it is already on', async function(){
        var sensor = FakeMovementSensor()
        var light = FakeLight()
        light.isOn.resolves(true)
        TurnOnLightWithMovement({sensor, light})
        await sensor.fireMovementDetected()
        assert.isFalse(light.setLuminosity.calledWith(0))
    })
});