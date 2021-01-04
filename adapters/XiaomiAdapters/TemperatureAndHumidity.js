var Hub = require("node-xiaomi-smart-home").Hub;

module.exports = function({deviceInfo}){

    let hub = new Hub();
    hub.listen();

    return Object.freeze({
        onTemperatureOrHumidityChanged
    })

    function onTemperatureOrHumidityChanged(fn){
        hub.on('data.th', function (sid, temperature, humidity, battery) {
            if(sid == deviceInfo.id)
                fn({sid, temperature, humidity, battery})
        });
    }
}