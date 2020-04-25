const {assert} = require('chai')
var FakeButton = require('../../test-doubles/FakeButton');
var FakeLight = require('../../test-doubles/FakeLight');
var ToggleLightWithButton = require('./ToggleLightWithButton')

describe('Toggle light with button', function(){

    let button, light;

    beforeEach(function(){
        button = FakeButton();
        light = FakeLight();
    })

    it('must turn on the given light when the button is clicked and it was off', async function(){
        light.isOn.resolves(false)
        ToggleLightWithButton({button, light});
        await button.fireClick();
        assert.isTrue(light.turnOn.called);
    })

    it('must turn the light off when it is already on', async function(){
        light.isOn.resolves(true)
        ToggleLightWithButton({button, light});
        await button.fireClick();
        assert.isTrue(light.turnOff.called);
    })
});