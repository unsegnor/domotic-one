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
        var evaluation = await evaluateTargets(status)
        var actions = await getActionsForViolations(evaluation.violations)
        var actionNames = []
        for( var action of actions.actionsForViolations){
            actionNames.push({
                name: action.name
            })
        }
        return {
            actions: actionNames,
            warnings: [...evaluation.warnings, ...actions.warnings]
        }
    }

    async function evaluateTargets(status){
        var targetViolations = []
        var warnings = []

        for(var target of targets){
            var propertyInformed = false
            for(var observation of status.observations){
                if(target.property == observation.property){
                    propertyInformed = true
                    if(await isTargetViolated(target, observation)){
                        targetViolations.push({
                            target,
                            observation
                        })
                    }
                }
            }
            if (!propertyInformed) warnings.push(`Missing the value for the property "${target.property}".`)
        }
        return {
            violations: targetViolations,
            warnings
        }
    }

    async function isTargetViolated(target, observation){
        if(observation.value > target.maxValue) return true
        if(observation.value < target.minValue) return true
        return false
    }

    async function getActionsForViolations(targetViolations){
        var actionsForViolations = []
        var warnings = []
        for(var {target, observation} of targetViolations){
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
        for(var action of actions){
            for(var consequence of action.estimated_consequences){
                if(consequence.property == property && consequence.result == result)
                    actionsToReduce.push(action)
            }
        }
        return actionsToReduce
    }
}