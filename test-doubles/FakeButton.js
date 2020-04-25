module.exports = function(){
    var _onClickFn = function(){};

    return Object.freeze({
        onClick,
        fireClick
    })

    function onClick(fn){
        _onClickFn = fn;
    }

    async function fireClick(){
        await _onClickFn();
    }
}