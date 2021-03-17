const { celebrate, Joi } = require('celebrate');

module.exports =
  celebrate({
    body: Joi.object().keys({
      full_name: Joi.string().required(),
      cpf: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/).required(),
      phone: Joi.number().required(),
      is_admin: Joi.boolean().required()
    })
  }, {
    abortEarly: false
  })