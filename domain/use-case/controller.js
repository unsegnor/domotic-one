module.exports = function(){

    let actions = []
    let targets = []

    return Object.freeze({
        setTarget,
        setAction,
        evaluate
    })

    async function setTarget(target){
        targets.push(target)
    }

    async function setAction(action){
        actions.push(action)
    }

    async function evaluate(status){
        var targetViolations = await getTargetViolations(status)
        var {actionsForViolations, warnings} = await getActionsForViolations(targetViolations)
        var actionNames = []
        for( var actionIndex in actionsForViolations){
            var action = actionsForViolations[actionIndex]
            actionNames.push({
                name: action.name
            })
        }
        return {
            actions: actionNames,
            warnings
        }
    }

    async function getTargetViolations(status){
        var targetViolations = []
        for(var observationIndex in status.observations){
            var observation = status.observations[observationIndex]
            for(var targetIndex in targets){
                var target = targets[targetIndex]
                if(await isTargetViolated(target, observation)){
                    targetViolations.push({
                        target,
                        observation
                    })
                }
            }
        }
        return targetViolations
    }

    async function isTargetViolated(target, observation){
        if(target.property != observation.property) return false
        if(observation.value > target.maxValue) return true
        if(observation.value < target.minValue) return true
    }

    async function getActionsForViolations(targetViolations){
        var actionsForViolations = []
        var warnings = []
        for(var violationIndex in targetViolations){
            var {target, observation} = targetViolations[violationIndex]

            if(observation.value > target.maxValue){
                var actionsToReduce = await getActionsToReduce(target.property)
                if(actionsToReduce.length == 0) warnings.push(`Property "${target.property}" (${observation.value}) is over the target (${target.maxValue}) and there is no available action to reduce it.`)
                actionsForViolations.push(...actionsToReduce)
            }
            if(observation.value < target.minValue){
                var actionsToIncrease = await getActionsToIncrease(target.property)
                if(actionsToIncrease.length == 0) warnings.push(`Property "${target.property}" (${observation.value}) is below the target (${target.minValue}) and there is no available action to increase it.`)
                actionsForViolations.push(...actionsToIncrease)
            }
        }
        return {actionsForViolations, warnings}
    }

    async function getActionsToReduce(property){
        return getActionsWithResultFor('reduced', property)
    }

    async function getActionsToIncrease(property){
        return getActionsWithResultFor('increased', property)
    }

    async function getActionsWithResultFor(result, property){
        var actionsToReduce = []
        for(var actionIndex in actions){
            var action = actions[actionIndex]
            for(var consequenceIndex in action.estimated_consequences){
                var consequence = action.estimated_consequences[consequenceIndex]
                if(consequence.property == property && consequence.result == result)
                    actionsToReduce.push(action)
            }
        }
        return actionsToReduce
    }
}