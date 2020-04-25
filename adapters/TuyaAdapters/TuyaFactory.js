const TuyaLight = require('./TuyaLight')

module.exports = function(){
    return Object.freeze({
        create
    })

    function create({deviceInfo}){
        return TuyaLight({
            deviceInfo
        })
    }
}