module.exports = function({tuyaFactory, xiaomiFactory, devicesData, ipSolver}){
    return Object.freeze({
        getDevice
    })

    async function getDevice(deviceName){
        var deviceInfo = devicesData[deviceName]

        if(deviceInfo.name){
            console.log("Looking for ip for " + deviceInfo.name)
            var ip = await ipSolver.getIpFromName(deviceInfo.name)
            if(ip){
                console.log("Found ip: "+ip)
                deviceInfo.ip = ip
            }
        }
        
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