var Hub = require("node-xiaomi-smart-home").Hub;

module.exports = function({deviceInfo}){

    let hub = new Hub();
    hub.listen();

    return Object.freeze({
        onClick,
        disconnect
    })

    function onClick(fn){
        hub.on('data.button', function (sid, type, battery) {
            // type can be click, double_click, long_click_press, long_click_release
            if (sid === deviceInfo.id && type == hub.clickTypes.click)
            {
                fn()
            }
        });
    }

    async function disconnect(){
        await hub.stop()
    }
}