const MovementSensor = require('./MovementSensor')
const Button = require('./Button')
const TemperatureAndHumidity = require('./TemperatureAndHumidity')

module.exports = function(){
    return Object.freeze({
        create
    })

    function create({deviceInfo}){
        switch(deviceInfo.type){
            case 'button':
                return Button({deviceInfo})
            case 'movement':
                return MovementSensor({deviceInfo})
            case 'temperatureandhumidity':
                return TemperatureAndHumidity({deviceInfo})
        }
    }
}