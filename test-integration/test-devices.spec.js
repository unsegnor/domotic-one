const {assert} = require('chai')
const TuyaFactory = require('../adapters/TuyaAdapters/TuyaFactory');
const XiaomiFactory = require('../adapters/XiaomiAdapters/XiaomiFactory');
const DeviceRepository = require('../interface/DeviceRepository');

const tuyaFactory = TuyaFactory();
const xiaomiFactory = XiaomiFactory();
const deviceRepository = DeviceRepository({tuyaFactory, xiaomiFactory});

describe('Testing devices', function(){
    it('luz-salon is registered', async function(){
        var light = await deviceRepository.getDevice('luz-salón')
        assert.isDefined(light)
    })

    it('luz-salon is responding', async function(){
        var light = await deviceRepository.getDevice('luz-salón')
        var isOn = await light.isOn()
        assert.isDefined(isOn)
    })

    it('button1 is registered', async function(){
        var button1 = await deviceRepository.getDevice('button1')
        assert.isDefined(button1)
    })

    it('button1 is responding', async function(){
        var button1 = await deviceRepository.getDevice('button1')
        assert.isDefined(button1)
    })
})