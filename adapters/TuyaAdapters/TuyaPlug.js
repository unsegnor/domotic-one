const TuyAPI = require('tuyapi');

const IS_TURNED_ON_PROPERTY = 1;

module.exports = function({deviceInfo}){

    let connected = false

    const tuyaDevice = new TuyAPI({
        id: deviceInfo.id,
        key: deviceInfo.key
        //ip: deviceInfo.ip
    });

    tuyaDevice.on('disconnected', () => {
        console.log('Disconnected from device. (general)');
        connected = false
    });

    tuyaDevice.on('connected', () => {
        console.log('Connected to device! (general)');
        connected = true
    });

    return Object.freeze({
        connect,
        isOn,
        isOff,
        turnOn,
        turnOff,
        getRawStatus,
        getState: getRawStatus,
        disconnect
    })

    async function connect(){
        if(!connected){
            return new Promise(function(resolve){
                // Add event listeners
                tuyaDevice.on('connected', () => {
                    console.log('Connected to device!');
                    resolve();
                });
    
                tuyaDevice.find().then(() => {
                    // Connect to device
                    tuyaDevice.connect();
                });
            })
        }
    }



    async function isOn(){
        await connect()
        return tuyaDevice.get({dps: IS_TURNED_ON_PROPERTY});
    }

    async function isOff(){
        return !(await isOn());
    }

    async function getRawStatus(){
        await connect()
        return tuyaDevice.get({schema: true});
    }

    async function turnOn(){
        await connect()
        await tuyaDevice.set({dps: IS_TURNED_ON_PROPERTY, set: true});
    }

    async function turnOff(){
        await connect()
        await tuyaDevice.set({dps: IS_TURNED_ON_PROPERTY, set: false})
    }

    async function disconnect(){
        return new Promise(function(resolve){
            tuyaDevice.on('disconnected', () => {
                console.log('Disconnected from device.');
                resolve()
              });
            tuyaDevice.disconnect()
        })
        
    }
}