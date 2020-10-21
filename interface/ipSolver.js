const find = require('local-devices');

module.exports = function({ipRange}){
    var devices = undefined
    var reloading = false

    return Object.freeze({
        getIpFromName,
        getIpFromMacAddress,
        reloadDevices,
        showDevices
    })

    async function getIpFromName(name){
        await loadDevices();
        var selectedDevice = devices.find(function(device){
            return device.name === name
        })
        if(selectedDevice) return selectedDevice.ip
    }

    async function getIpFromMacAddress(macAddress){
        await loadDevices();
        var selectedDevice = devices.find(function(device){
            return device.mac === macAddress
        })
        if(selectedDevice) return selectedDevice.ip
    }

    async function loadDevices(){
        if(!devices){
            devices = await find(ipRange)
        }
    }

    async function showDevices(){
        await loadDevices();
        for(var device of devices){
            console.log(device)
        }
    }

    async function reloadDevices(){
        if(reloading) return;
        reloading = true
        devices = await find(ipRange)
        reloading = false
    }
}