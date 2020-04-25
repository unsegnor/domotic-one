const sinon = require('sinon')

module.exports = function(){
    return Object.freeze({
        setLuminosity: sinon.stub(),
        isOn: sinon.stub(),
        turnOff: sinon.stub(),
        turnOn: sinon.stub()
    })
}