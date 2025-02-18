import Joi from 'joi';

export const signUpUserSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirm_password: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .label('Confirm password')
    .messages({ 'any.only': '{#label} does not match' }),
  gender: Joi.string().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
});

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};

export const loginUserSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export const createNoteSchema = Joi.object().keys({
  title: Joi.string().lowercase(),
  description: Joi.string().lowercase(),
  dueDate: Joi.string().lowercase(),
  status: Joi.string().lowercase(),
})

export const updateNoteSchema = Joi.object().keys({
  title: Joi.string().lowercase(),
  description: Joi.string().lowercase(),
  dueDate: Joi.string().lowercase(),
  status: Joi.string().lowercase(),
})