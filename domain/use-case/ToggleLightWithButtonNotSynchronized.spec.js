const {assert} = require('chai')
const sinon = require('sinon')
var FakeButton = require('../../test-doubles/FakeButton');
var FakeLight = require('../../test-doubles/FakeLight');
var ToggleLightWithButton = require('./ToggleLightWithButtonNotSynchronized')

describe('Toggle light with button', function(){

    let button, light;

    beforeEach(function(){
        button = FakeButton();
        light = FakeLight();
    })

    it('must turn on the given light when the button is clicked the first time', async function(){
        ToggleLightWithButton({button, light});
        await button.fireClick();
        assert.isTrue(light.turnOn.called);
    })

    it('must not turn off the given light when the button is clicked the first time', async function(){
        ToggleLightWithButton({button, light});
        await button.fireClick();
        assert.isTrue(light.turnOn.called);
        assert.isFalse(light.turnOff.called);
    })

    it('must turn the light off when the button is clicked the second time', async function(){
        ToggleLightWithButton({button, light});
        await button.fireClick();
        await button.fireClick();
        assert.isTrue(light.turnOff.called);
    })

    it('must turn the light on when the button is clicked the third time', async function(){
        ToggleLightWithButton({button, light});
        await button.fireClick();
        await button.fireClick();
        await button.fireClick();
        sinon.assert.calledTwice(light.turnOn);
    })
});