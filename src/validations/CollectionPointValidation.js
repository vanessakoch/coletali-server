const { celebrate, Joi } = require('celebrate');

module.exports =
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      items: Joi.string().required(),
      address_id: Joi.number().required(),
      user_id: Joi.number().required(),
    })
  }, {
    abortEarly: false
  })