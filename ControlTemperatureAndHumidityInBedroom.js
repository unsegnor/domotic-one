const TuyaFactory = require('./adapters/TuyaAdapters/TuyaFactory');
const XiaomiFactory = require('./adapters/XiaomiAdapters/XiaomiFactory');
const Controller = require('./domain/use-case/controller');
const DeviceRepository = require('./interface/DeviceRepository');
const devicesData = require('./interface/DevicesData')
const IpSolver = require('./interface/ipSolver');

const tuyaFactory = TuyaFactory();
const xiaomiFactory = XiaomiFactory();
const ipSolver = IpSolver({ipRange: '192.168.0.1-192.168.0.254'});
const deviceRepository = DeviceRepository({tuyaFactory, xiaomiFactory, devicesData, ipSolver});

async function main(){
    const sensor = await deviceRepository.getDevice('temperatureAndHumidity1');

    const controller = await Controller()
    controller.setTarget({
        property: 'humidity',
        maxValue: '60',
        minValue: '40'
    })

    controller.setTarget({
        property: 'temperature',
        maxValue: '30',
        minValue: '20'
    })

    controller.setAction({
        name: 'dehumidifier-activated',
        estimated_consequences:[
            {property: 'humidity', result: 'reduced'}
        ]
    })

    controller.setAction({
        name: 'heater-activated',
        estimated_consequences:[
            {property: 'temperature', result: 'increased'}
        ]
    })

    //const light = await deviceRepository.getDevice('luz-salón');
    sensor.onTemperatureOrHumidityChanged(async function({temperature, humidity}){
        var actions = await controller.getActionFor({observations:[
            {property: 'temperature', value: temperature.toString()},
            {property: 'humidity', value: humidity.toString()}
        ]})
        console.log(actions)
    })
}

main()


