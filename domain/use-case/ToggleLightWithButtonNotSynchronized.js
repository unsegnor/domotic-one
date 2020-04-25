module.exports = function({button, light}){
    var lightIsOn = false;
    button.onClick(async function(){
        if(!lightIsOn){
            await light.turnOn();
            lightIsOn = true;
        }else{
            await light.turnOff();
            lightIsOn = false;
        }
    })
}