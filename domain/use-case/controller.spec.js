const {expect} = require('chai')
const Controller = require('./controller')

describe('Controller', function(){
    let controller, result

    beforeEach(async function(){
        controller = await Controller()

        await given_the_target({
            property: 'humidity',
            maxValue: '60',
            minValue: '40'
        })

        await given_the_target({
            property: 'temperature',
            maxValue: '30',
            minValue: '20'
        })

        await controller.setAction({
            name: 'activate-dehumidifier',
            estimated_consequences: [
                { property: 'humidity', result: 'reduced', minimum:'0', maximum:'1' },
                { property: 'noise', result: 'increased', upTo:'55'}
                //,{ property: 'temperature', result: 'increased'}
            ]
        })

        await controller.setAction({
            name: 'activate-heater',
            estimated_consequences: [
                { property: 'temperature', result: 'increased', minimum:'0', maximum:'1' },
                { property: 'noise', result: 'increased', upTo:'25'}
                //,{ property: 'humidity', result: 'reduced'}
            ]
        })

        await controller.setAction({
            name: 'activate-humidifier',
            estimated_consequences: [
                { property: 'humidity', result: 'increased', minimum:'0', maximum:'1' },
                { property: 'temperature', result: 'reduced', minimum:'0', maximum:'1' },
                { property: 'noise', result: 'increased', upTo:'30'}
            ]
        })

        observations = []
        result = undefined
    })

    it('must take actions to reduce the humidity when it is higher than the maximum', async function(){
        await when_evaluating_the_status({
            temperature: '25.5',
            humidity:'70.1'
        })
        await then_there_must_be_an_action('activate-dehumidifier')
    })

    it('must not take actions to reduce the humidity when it is lower than the maximum', async function(){
        await when_evaluating_the_status({
            temperature: '22.45',
            humidity:'50.12'
        })
        await then_there_must_be_no_actions()
    })

    it('must take actions to increase temperature when it is lower than the minimum', async function(){
        await when_evaluating_the_status({
            temperature: '18.2',
            humidity:'50.32'
        })
        await then_there_must_be_an_action('activate-heater')
    })

    it('must not take actions to increase temperature when it is higher than the minimum', async function(){
        await when_evaluating_the_status({
            temperature: '22.001',
            humidity:'50.001'
        })
        await then_there_must_be_no_actions()
    })

    it('must take actions to increase humidity when it is lower than the minimum', async function(){
        await when_evaluating_the_status({
            temperature: '25',
            humidity:'30'
        })
        await then_there_must_be_an_action('activate-humidifier')
    })

    it('must not take actions to increase humidity when it is higher than the minimum', async function(){
        await when_evaluating_the_status({
            temperature: '25',
            humidity:'50'
        })
        await then_there_must_be_no_actions()
    })

    it('must return warning message when there are no available actions to increase a property to the target', async function(){
        await given_the_target({
            property: 'color',
            minValue: '100'
        })
        
        await when_evaluating_the_status({
            temperature: '25',
            humidity:'50',
            color: '0'
        })

        await then_there_must_be_a_warning('Property "color" (0) is below the target (100) and there is no available action to increase it.')
    })

    it('must not return warning messages when there are available actions to increase a property to the target', async function(){
        await given_the_target({
            property: 'color',
            minValue: '100'
        })

        await controller.setAction({
            name: 'activate-color-increaser',
            estimated_consequences: [
                {property: 'color', result: 'increased'}
            ]
        })
        
        await when_evaluating_the_status({
            temperature: '25',
            humidity:'50',
            color: '0'
        })

        await then_there_must_be_no_warnings()
    })

    it('must return warning message when there are no available actions to decrease a property to the target', async function(){
        await given_the_target({
            property: 'size',
            maxValue: '20'
        })
        
        await when_evaluating_the_status({
            temperature: '25',
            humidity:'50',
            size: '80'
        })

        await then_there_must_be_a_warning('Property "size" (80) is over the target (20) and there is no available action to reduce it.')
    })

    it('must return no warning message when there are available actions to decrease a property to the target', async function(){
        await given_the_target({
            property: 'size',
            maxValue: '20'
        })

        await controller.setAction({
            name: 'activate-size-reducer',
            estimated_consequences: [
                {property: 'size', result: 'reduced'}
            ]
        })
        
        await when_evaluating_the_status({
            temperature: '25',
            humidity:'50',
            size: '80'
        })

        await then_there_must_be_no_warnings()
    })

    var noInformationAvailableCases = ['size', 'otherProperty']
    noInformationAvailableCases.forEach(function(property){
        it(`must return warning message when there is no information available for a defined property "${property}"`, async function(){
            await given_the_target({
                property,
                maxValue: '20'
            })
            
            await when_evaluating_the_status({
                temperature: '25',
                humidity:'50'
            })
    
            await then_there_must_be_a_warning(`Missing the value for the property "${property}".`)
            await then_there_must_be_no_actions()
        })
    })

    it('must not activate the dehumidifier if it makes a lot of noise while sleeping', async function(){
        await given_the_target({
            property: 'noise',
            maxValue: '30',
            condition: {or:[
                {property: 'hour', lessThan:'10'},
                {property: 'hour', greaterThan:'20'}
            ]}
        })

        await when_evaluating_the_status({
            temperature: '25',
            humidity:'70',
            hour: '23'
        })

        await then_there_must_be_no_actions()
    })

    it('must activate the dehumidifier if we are not in sleeping time', async function(){
        await given_the_target({
            property: 'noise',
            maxValue: '30',
            condition: {or:[
                {property: 'hour', lessThan:'10'},
                {property: 'hour', greaterThan:'20'}
            ]}
        })

        await when_evaluating_the_status({
            temperature: '25',
            humidity:'70',
            hour: '17'
        })

        await then_there_must_be_an_action('activate-dehumidifier')
    })

    it('must activate the heater if we are in sleeping time as its noise is below the maxValue', async function(){
        await given_the_target({
            property: 'noise',
            maxValue: '30',
            condition: {or:[
                {property: 'hour', lessThan:'10'},
                {property: 'hour', greaterThan:'20'}
            ]}
        })

        await when_evaluating_the_status({
            temperature: '10',
            humidity:'50',
            hour: '5'
        })

        await then_there_must_be_an_action('activate-heater')
    })

    async function then_there_must_be_no_actions(){
        expect(result.actions.length).to.equal(0)
    }

    async function then_there_must_be_an_action(actionName){
        expect(result.actions.length).to.equal(1)
        expect(result.actions[0].name).to.equal(actionName)
    }

    async function then_there_must_be_a_warning(message){
        expect(result.warnings.length).to.equal(1)
        expect(result.warnings[0]).to.equal(message)
    }

    async function then_there_must_be_no_warnings(){
        if(result.warnings.length > 0){
            throw `Expected no warnings but found: ${result.warnings}`
        }
    }

    async function when_evaluating_the_status(status){
        var observations = []
        for(var property in status){
            observations.push({
                property,
                value: status[property]
            })
        }
        result = await controller.evaluate({observations})
    }

    async function given_the_target(target){
        await controller.setTarget(target)
    }
})