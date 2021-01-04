const TuyaFactory = require('./adapters/TuyaAdapters/TuyaFactory');
const XiaomiFactory = require('./adapters/XiaomiAdapters/XiaomiFactory');
const Controller = require('./domain/use-case/controller');
const DeviceRepository = require('./interface/DeviceRepository');
const devicesData = require('./interface/DevicesData')
const IpSolver = require('./interface/ipSolver');

const tuyaFactory = TuyaFactory();
const xiaomiFactory = XiaomiFactory();
const ipSolver = IpSolver({ipRange: '192.168.1.1-192.168.1.254'});
const deviceRepository = DeviceRepository({tuyaFactory, xiaomiFactory, devicesData, ipSolver});

async function notify(message){
    console.log(message)
}

async function main(){
    const sensor = await deviceRepository.getDevice('temperatureAndHumidity1');
    const dehumidifier = await deviceRepository.getDevice('dehumidifier');
    const heater = await deviceRepository.getDevice('heater');

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

    controller.setTarget({
        property: 'noise',
        maxValue: '30',
        condition: {or:[
            {property: 'hour', lessThan:'10'},
            {property:'hour', greaterThan:'20'}
        ]}
    })

    controller.setAction({
        name: 'activate-dehumidifier',
        estimated_consequences:[
            {property: 'humidity', result: 'reduced'},
            {property: 'noise', result: 'increased', upTo:'55'}
        ]
    })

    controller.setAction({
        name: 'activate-heater',
        estimated_consequences:[
            {property: 'temperature', result: 'increased'},
            {property: 'noise', result: 'increased', upTo:'30'}
        ]
    })

    //const light = await deviceRepository.getDevice('luz-salón');
    sensor.onTemperatureOrHumidityChanged(async function({temperature, humidity}){
        var result = await controller.evaluate({observations:[
            {property: 'temperature', value: temperature.toString()},
            {property: 'humidity', value: humidity.toString()},
            {property: 'hour', value: new Date().getHours().toString()}
        ]})

        console.log(result)

        for(var warning of result.warnings){
            await notify(warning);
        }

        var activateDehumidifier = result.actions.find(function(action){
            return action.name == 'activate-dehumidifier'
        })

        var activateHeater = result.actions.find(function(action){
            return action.name == 'activate-heater'
        })

        if(activateDehumidifier) await dehumidifier.turnOn()
        else await dehumidifier.turnOff()

        if(activateHeater) await heater.turnOn()
        else await heater.turnOff()
    })
}

main()


