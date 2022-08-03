import joi from 'joi';
// import { CreateUserData } from '../services/userService';

const signUpSchema = joi.object({
  name: joi.string().required(),
  cpf: joi.string().required().pattern(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/),
  password: joi.string().required().min(7),
  confirmPassword: joi.ref('password')
});

export default signUpSchema;