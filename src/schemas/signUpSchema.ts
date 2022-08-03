import joi from 'joi';

interface CreateSignUpData {
  name: string
  cpf: string
  password: string
  confirmPassword: string
}

const signUpSchema = joi.object<CreateSignUpData>({
  name: joi.string().required(),
  cpf: joi.string().required().pattern(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/),
  password: joi.string().required().min(7),
  confirmPassword: joi.ref('password')
});

export default signUpSchema;