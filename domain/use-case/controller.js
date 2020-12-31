module.exports = function(){

    let _actions = []
    let _targets = []

    return Object.freeze({
        setTarget,
        setAction,
        evaluate
    })

    async function setTarget(target){
        _targets.push(target)
    }

    async function setAction(action){
        _actions.push(action)
    }

    async function evaluate(status){
        var evaluation = await evaluateStatus(status)
        var result = await getActionsForViolations(evaluation.violations)
        var filteredActions = await removeConflictingActions(result.actionsForViolations, status)
        var actionNames = []
        for( var action of filteredActions){
            actionNames.push({
                name: action.name
            })
        }
        return {
            actions: actionNames,
            warnings: [...evaluation.warnings, ...result.warnings]
        }
    }

    async function isBetterOrEqual(previousStatus, nextStatus){
        //dependerá del tiempo que dure cada acción
        //dependerá de la cantidad que sume o reste cada acción
        //si no los conocemos, qué hacemos? nos los inventamos? y luego vamos ajustando según lo que ocurra en la realidad?
        //podemos preguntar por límites, por ejemplo, cuál es la cantidad mínima que va a añadir/quitar? y la máxima?
        //es decir, para trabajar con algo que sean números reales y no disparates
        //en cuánto tiempo? mínimo y máximo. con eso ya se puede hacer una idea el sistema y no esperar cosas imposibles
        var previousStatusEvaluation = await evaluateStatus(previousStatus)
        var nextStatusEvaluation = await evaluateStatus(nextStatus)

        if(nextStatusEvaluation.violations.length <= previousStatusEvaluation.violations.length) return true
    }

    async function removeConflictingActions(actions, status){
        var acceptedActions = []
        for(var action of actions){
            //si después de aplicarla hay más violaciones que antes, entonces la quitamos
            var nextExpectedStatus = await simulateAction(action, status)
            if(await isBetterOrEqual(status, nextExpectedStatus)){
                acceptedActions.push(action)
            }
        }

        return acceptedActions
    }

    async function simulateAction(action, status){
        var nextStatus = JSON.parse(JSON.stringify(status))
        for(var consequence of action.estimated_consequences){
            switch(consequence.result){
                case 'increased':
                    if(consequence.upTo) await setStatus(nextStatus, consequence.property, consequence.upTo)
                    break
                case 'reduced':
                    break
            }
        }
        return nextStatus
    }

    async function setStatus(status, property, value){
        // var written = true
        // for(var observation of status.observations){
        //     if(observation.property == property){
        //         observation.value = value
        //         written = true
        //     }
        // }
        // if(!written){
            status.observations.push({
                property,
                value
            })
        // }
    }

    //TODO: we could write the actions as methods
    //then the way to know which to apply is to simulate every combination
    //and evaluate the fitness of the expected result
    //that way we could even play with the probabilities
    //we could also generate the simulation from their descriptions
    //we can also write targets as functions that modify the fitness score
    //they can return a real number between -1 and 1, or an integer that can be negative
    //then we sum the fitness of every target to get the total value


        //in fact they are actions that reduce our fitness function
        //now we are applying heuristics to make it more efficient
        //but we could simulate them instead

        //0. Define how to calculate fitness for every target
        //0.1 For example:
            //with minValue -> we score more as we get greater values
            //with maxValue -> we score more as we get lower values? or do we score the same as long as we are below the maximum?
                //we may have two contributors, one saying if it is or not being completed
                //and another one indicating how close we are to complete it
                //so that it is choosing actions towards completion
        //1. Calculate fitness on the current state
        //2. Simulate application of different actions and calculat the estimated resulting state
        //3. Choose the combination of actions that will (more probably) give a higher fitness result

        //TODO: of we are more precise with the amounts added by the actions we could better optimize

    async function evaluateStatus(status){
        var targetViolations = []
        var warnings = []

        for(var target of _targets){
            var propertyInformed = false
            for(var observation of status.observations){
                if(await isTargetApplicable(target, status.observations)){
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

    async function isConditionViolated(condition, observation){
        if(observation.value > condition.lessThan) return true
        if(observation.value < condition.greaterThan) return true
        return false
    }

    async function isTargetApplicable(target, observations){
        if(!target.condition) return true
        for(var condition of target.condition.or){
            for(var observation of observations){
                if(observation.property == condition.property){
                    if (!(await isConditionViolated(condition, observation))){
                        return true
                    }
                }
            }
        }
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
        for(var action of _actions){
            for(var consequence of action.estimated_consequences){
                if(consequence.property == property && consequence.result == result)
                    actionsToReduce.push(action)
            }
        }
        return actionsToReduce
    }
}