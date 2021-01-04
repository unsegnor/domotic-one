const TuyAPI = require('tuyapi');

const MAX_LUMINOSITY = 255;
const MIN_LUMINOSITY = 25;

const IS_TURNED_ON_PROPERTY = 1;
const LUMINOSITY_PROPERTY = 3;

module.exports = function({deviceInfo}){

    const tuyaDevice = new TuyAPI({
        id: deviceInfo.id,
        key: deviceInfo.key,
        ip: deviceInfo.ip
    });

    return Object.freeze({
        isOn,
        isOff,
        getColor,
        getLuminosity,
        setLuminosity,
        turnOn,
        turnOff,
        getRawStatus,
        getState: getRawStatus,
        disconnect
    })

    async function isOn(){
        return tuyaDevice.get({dps: IS_TURNED_ON_PROPERTY});
    }

    async function isOff(){
        return !(await isOn());
    }

    async function getRawStatus(){
        return tuyaDevice.get({schema: true});
    }

    function getColor(){

    }

    function getLuminosity(){

    }

    async function setLuminosity(percentage){
        var luminosity = MIN_LUMINOSITY + Math.round((MAX_LUMINOSITY - MIN_LUMINOSITY) * (percentage / 100))
        await tuyaDevice.set({dps: LUMINOSITY_PROPERTY, set: luminosity});
    }

    async function turnOn(){
        await tuyaDevice.set({dps: IS_TURNED_ON_PROPERTY, set: true});
    }

    async function turnOff(){
        await tuyaDevice.set({dps: IS_TURNED_ON_PROPERTY, set: false})
    }

    async function disconnect(){
        await tuyaDevice.disconnect()
    }
}