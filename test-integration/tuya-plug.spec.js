const {assert} = require('chai')
const TuyaFactory = require('../adapters/TuyaAdapters/TuyaFactory');
const XiaomiFactory = require('../adapters/XiaomiAdapters/XiaomiFactory');
const DeviceRepository = require('../interface/DeviceRepository');
const devicesData = require('../interface/TestDevicesData')
const IpSolver = require('../interface/ipSolver');

const tuyaFactory = TuyaFactory();
const xiaomiFactory = XiaomiFactory();
const ipSolver = IpSolver({ipRange: '192.168.1.1-192.168.1.254'});
const deviceRepository = DeviceRepository({tuyaFactory, xiaomiFactory, devicesData, ipSolver});

describe('Testing tuya plug', function(){
    async function wait(milliseconds){
        return new Promise(function(resolve){
            setTimeout(resolve, milliseconds)
        })
    }

    it(`connecting to a tuya plug`, async function(){
        var device = await deviceRepository.getDevice('test-tuya-plug')
        assert.isDefined(device)
        await device.connect()
        if(device.disconnect) await device.disconnect()
    })

    it(`retrieving state from a tuya plug`, async function(){
        var device = await deviceRepository.getDevice('test-tuya-plug')
        var state = await device.getState()
        assert.isDefined(state)
        if(device.disconnect) await device.disconnect()
    })

    it(`turning on and off`, async function(){
        var device = await deviceRepository.getDevice('test-tuya-plug')
        var wasOn = await device.isOn()

        await device.turnOn()
        assert.isTrue(await device.isOn())
        assert.isFalse(await device.isOff())

        await wait(2000)

        await device.turnOff()
        assert.isFalse(await device.isOn())
        assert.isTrue(await device.isOff())

        await wait(2000)

        await device.turnOn()
        assert.isTrue(await device.isOn())
        assert.isFalse(await device.isOff())

        await wait(2000)

        await device.turnOff()
        assert.isFalse(await device.isOn())
        assert.isTrue(await device.isOff())

        await wait(2000)

        if(wasOn) await device.turnOn()
        else await device.turnOff()

        if(device.disconnect) await device.disconnect()
    })
})