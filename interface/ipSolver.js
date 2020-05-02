const find = require('local-devices');

module.exports = function(){
    var devices = undefined
    var reloading = false

    return Object.freeze({
        getIpFromName,
        reloadDevices
    })

    async function getIpFromName(name){
        await loadDevices();
        var selectedDevice = devices.find(function(device){
            return device.name === name
        })
        if(selectedDevice) return selectedDevice.ip
    }

    async function loadDevices(){
        if(!devices){
            devices = await find()
        }
    }

    async function reloadDevices(){
        if(reloading) return;
        reloading = true
        devices = await find()
        reloading = false
    }
}