module.exports = function({sensor, light}){
    sensor.onMovementDetected(async function(){
        var lightIsOn = await light.isOn();
        if(!lightIsOn){
            await light.setLuminosity(0);
        }
    })
}