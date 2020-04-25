module.exports = function(){
    var _movementDetectedFn = function(){};

    return Object.freeze({
        onMovementDetected,
        fireMovementDetected
    })

    function onMovementDetected(fn){
        _movementDetectedFn = fn;
    }

    async function fireMovementDetected(){
        await _movementDetectedFn();
    }
}