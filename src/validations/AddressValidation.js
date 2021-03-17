const { celebrate, Joi } = require('celebrate');

module.exports =
  celebrate({
    body: Joi.object().keys({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      number: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
    })
  }, {
    abortEarly: false
  });




