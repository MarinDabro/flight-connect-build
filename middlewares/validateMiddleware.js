import {check, validationResult} from 'express-validator'


export let userValidation = [
    check('firstName').escape().trim().isLength({min: 3}).withMessage('Minimum characters required is 3'),

    check('lastName').escape().trim().isLength({max: 20}).withMessage('Maximum characters allowed are 20'),

    check('email').isEmail().normalizeEmail().withMessage('Please provide ue with a valid email'),

    check('password').exists().isLength({min: 3}).withMessage('Password is too short...').isLength({max: 20}).withMessage('Password is too long...'),

    (req,res, next) => {
        const result = validationResult(req)
        if(result.isEmpty()){
            next()
        }else{
            const error = result.errors.reduce((acc, curr) => {
                acc[ curr.param ] = curr.msg;
                return acc
            }, {}) 
           
            next({message: error})
        }
    }
]