const knex = require('../database/connection');

class AddressesController {

  async index(request, response) {
    const addresses = await knex('address').select('*');
    response.json(addresses)
  }

  async show(request, response) {
    const { id } = request.params;

    const address = await knex('address').where('id', id).first();

    if (!address) {
      return response.status(400).json({ message: 'Endereço não encontrado.' })
    }

    return response.json(address);
  }

  async create(request, response) {
    const {
      latitude,
      longitude,
      number,
      city,
      uf
    } = request.body

    const trx = await knex.transaction();

    const address = {
      latitude,
      longitude,
      number,
      city,
      uf
    }

    const inserted = await trx('address').insert(address)
    const address_id = inserted[0];
    await trx.commit();

    return response.json({
      id: address_id
    })
  }

  async update(request, response) {
    const { id } = request.params;

    const addressUpdate = {
      ...request.body
    }
    const address = await knex('address').where('id', id).first();

    if (!address) {
      return response.send(400, { message: 'Endereço não encontrado.' })
    }

    const trx = await knex.transaction()

    await trx('address')
      .where('id', id)
      .first()
      .update(addressUpdate)

    await trx.commit()

    return response.send({ message: 'Endereço atualizado com sucesso.' })
  }

  async delete(request, response) {
    const { id } = request.params;

    const address = await knex('address').where('id', id).first();

    if (!address) {
      return response.status(400).json({ message: 'Endereço não encontrado.' })
    }

    const trx = await knex.transaction()

    await trx('address')
      .where('id', id)
      .first()
      .delete()

    await trx.commit()

    return response.status(200).send({ message: 'Endereço apagado com sucesso.' })
  }

}

module.exports = AddressesController;