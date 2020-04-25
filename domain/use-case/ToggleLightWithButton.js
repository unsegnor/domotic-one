module.exports = function({button, light}){
    button.onClick(async function(){
        var lightIsOn = await light.isOn();
        if(!lightIsOn){
            await light.turnOn();
        }else{
            await light.turnOff();
        }
    })
}