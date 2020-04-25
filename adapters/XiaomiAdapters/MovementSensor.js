var Hub = require("node-xiaomi-smart-home").Hub;

module.exports = function({deviceInfo}){

    let hub = new Hub();
    hub.listen();

    return Object.freeze({
        onMovementDetected
    })

    function onMovementDetected(fn){
        hub.on('data.motion', function (sid, motion, battery) {
            if(sid === deviceInfo.id && motion === true){
                fn()
            }
        });
    }
}