import joi from 'joi';
import { CreateLoginData } from '../services/instructorsService.js';

const loginSchema = joi.object<CreateLoginData>({
  cpf: joi.string().required().pattern(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/),
  password: joi.string().required().min(7),
});

export default loginSchema;