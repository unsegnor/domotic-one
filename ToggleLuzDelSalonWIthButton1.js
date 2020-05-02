const TuyaFactory = require('./adapters/TuyaAdapters/TuyaFactory');
const XiaomiFactory = require('./adapters/XiaomiAdapters/XiaomiFactory');
const DeviceRepository = require('./interface/DeviceRepository');
const ToggleLightWithButton = require('./domain/use-case/ToggleLightWithButtonNotSynchronized');
const devicesData = require('./interface/DevicesData')
const IpSolver = require('./interface/ipSolver');

const tuyaFactory = TuyaFactory();
const xiaomiFactory = XiaomiFactory();
const ipSolver = IpSolver();
const deviceRepository = DeviceRepository({tuyaFactory, xiaomiFactory, devicesData, ipSolver});

async function main(){
    const button = await deviceRepository.getDevice('button1');
    const light = await deviceRepository.getDevice('luz-salón');
    ToggleLightWithButton({button, light})
}

main()


