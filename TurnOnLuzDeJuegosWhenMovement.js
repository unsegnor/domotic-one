const TuyaFactory = require('./adapters/TuyaAdapters/TuyaFactory');
const XiaomiFactory = require('./adapters/XiaomiAdapters/XiaomiFactory');
const DeviceRepository = require('./interface/DeviceRepository');
const TurnOnLightWithMovement = require('./domain/use-case/TurnOnLightWithMovement');
const devicesData = require('./interface/DevicesData')

const tuyaFactory = TuyaFactory();
const xiaomiFactory = XiaomiFactory();
const deviceRepository = DeviceRepository({tuyaFactory, xiaomiFactory, devicesData});

async function main(){
    const sensor = await deviceRepository.getDevice('sensor1');
    const light = await deviceRepository.getDevice('luzJuegos');
    await light.turnOff();
    TurnOnLightWithMovement({ sensor, light })
}

main()


