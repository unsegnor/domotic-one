module.exports = function({tuyaFactory, xiaomiFactory, devicesData}){
    return Object.freeze({
        getDevice
    })

    async function getDevice(deviceName){
        var deviceInfo = devicesData[deviceName]
        
        if(deviceInfo.company === 'Tuya'){
            return tuyaFactory.create({
                deviceInfo
            })
        }else if(deviceInfo.company === 'Xiaomi'){
            return xiaomiFactory.create({
                deviceInfo
            })
        }
    }
}