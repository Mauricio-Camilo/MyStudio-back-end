import joi from 'joi';
import { CreateClientData } from '../services/clientsService.js';

const updateClientSchema = joi.object<CreateClientData>({
  name: joi.string().allow(null,''),
  payment: joi.string().equal("Mensal","Trimestral","Semestral","Anual").allow(null,''),
  service: joi.string().required().equal("Pilates","Fisioterapia","Barras","Osteopatia"),
  startDate: joi.string().pattern(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/).allow(null,''),
});

export default updateClientSchema;