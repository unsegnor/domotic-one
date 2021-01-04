const TuyaLight = require('./TuyaLight')
const TuyaPlug = require('./TuyaPlug')

module.exports = function(){
    return Object.freeze({
        create
    })

    function create({deviceInfo}){
        switch(deviceInfo.type){
            case 'light':
                return TuyaLight({
                    deviceInfo
                })
            case 'plug':
                return TuyaPlug({
                    deviceInfo
                })
        }
    }
}