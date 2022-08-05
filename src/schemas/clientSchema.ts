import joi from 'joi';
import { CreateClientData } from '../services/clientsService.js';

const clientSchema = joi.object<CreateClientData>({
  name: joi.string().required(),
  payment: joi.string().required().equal("Mensal","Trimestral","Semestral","Anual"),
  startDate: joi.string().required().pattern(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/)
});

export default clientSchema;