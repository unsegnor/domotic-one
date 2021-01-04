const {assert} = require('chai')
const TuyaFactory = require('../adapters/TuyaAdapters/TuyaFactory');
const XiaomiFactory = require('../adapters/XiaomiAdapters/XiaomiFactory');
const DeviceRepository = require('../interface/DeviceRepository');
const devicesData = require('../interface/DevicesData')
const IpSolver = require('../interface/ipSolver');

const tuyaFactory = TuyaFactory();
const xiaomiFactory = XiaomiFactory();
const ipSolver = IpSolver({ipRange: '192.168.1.1-192.168.1.254'});
const deviceRepository = DeviceRepository({tuyaFactory, xiaomiFactory, devicesData, ipSolver});

describe('Testing devices', function(){

    var devices = []

    for(var deviceId in devicesData){
        devices.push({
            id: deviceId,
            deviceInfo: devicesData[deviceId]
        })
    }

    devices.forEach(function(device){
        it(`device ${device.id} must be reachable`, async function(){
            var loadedDevice = await deviceRepository.getDevice(device.id)
            if(loadedDevice.connect) await loadedDevice.connect()
            assert.isDefined(loadedDevice)
            if(loadedDevice.disconnect) await loadedDevice.disconnect()
        })

        it(`device state for ${device.id} must be retrievable`, async function(){
            var loadedDevice = await deviceRepository.getDevice(device.id)
            var state
            if(loadedDevice.getState) state = await loadedDevice.getState()
            console.log(state)
            if(loadedDevice.disconnect) await loadedDevice.disconnect()
        })
    })
})