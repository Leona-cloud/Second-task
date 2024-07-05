import  { ValidationPipe, HttpStatus } from '@nestjs/common'
import { ValidationException } from './error'


export const ValidatorPipeInstance = (): ValidationPipe => {
    return new ValidationPipe({
        exceptionFactory(errors){
            const errorValues = errors.map((err)=> {
                if(err.constraints){
                    const [message] = Object.values(err.constraints)
                    const fieldName = err.property
                    return {fieldName, message}
                }
                return {
                    fieldName: err.property,
                    message: 'Invalid input'
                }
            });
            return new ValidationException(
                errorValues,
                HttpStatus.UNPROCESSABLE_ENTITY
            )
        }
        
    });

    
}