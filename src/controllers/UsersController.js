const knex = require('../database/connection');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const { sign, verify } = require('../config/jwt');

class UsersController {

  async auth(request, response, next) {
    const headerAuth = request.headers.authorization;
    const token = headerAuth.split(" ")[1]

    try {
      const payload = await verify(token);

      if (!payload.user) {
        return response.json({ message: 'Falha na autenticação.' })
      }

      const user = await knex('user').where({ 'id': payload.user });

      if (!user) {
        return response.json({ message: 'Falha na autenticação.' })
      }

      const serializedUsers = user.map(user => {
        return {
          id: user.id,
          full_name: user.full_name,
          is_admin: user.is_admin
        };
      })

      response.json(serializedUsers)

    } catch (error) {
      response.json(error);
    }
  }

  async login(request, response, next) {
    const [hashType, hash] = request.headers.authorization.split(' ');
    const [email, password] = Buffer.from(hash, 'base64')
      .toString()
      .split(':');
    try {
      const user = await knex('user').where({ 'email': email });

      if (user.length === 0) {
        return response.status(401).send({ message: 'Falha na autenticação.' })
      }

      bcrypt.compare(password, user[0].password, function (err, result) {
        if (result) {
          const token = sign({ user: user[0].id })

          const sendUser = {
            id: user[0].id,
            full_name: user[0].full_name,
            is_admin: user[0].is_admin
          }

          response.json({ user: sendUser, token })
        } else {
          response.status(401).json({ message: 'Falha de autenticação' });
        }
      });
    } catch (error) {
      response.send(error);
    }
  }

  async index(request, response) {
    const users = await knex('user').select('*');

    const serializedUsers = users.map(user => {
      return {
        id: user.id,
        full_name: user.full_name,
        cpf: user.cpf,
        email: user.email,
        phone: user.phone,
        is_admin: user.is_admin
      };
    })

    response.json(serializedUsers)
  }

  async show(request, response) {
    const { id } = request.params;

    const user = await knex('user').where('id', id).first();

    if (!user) {
      return response.send(400, { message: 'Usuário não encontrado.' })
    }

    const donationPoint = await knex('donation_point')
      .where('donation_point.user_id', id)
      .select('donation_point.*');

    const collectionPoint = await knex('collection_point')
      .where('collection_point.user_id', id)
      .select('collection_point.*');

    return response.json({ user, donationPoint, collectionPoint });
  }

  async create(request, response) {
    const {
      full_name,
      cpf,
      email,
      password,
      phone,
      is_admin,
    } = request.body

    const user = {
      full_name,
      cpf,
      email,
      phone,
      is_admin
    }

    bcrypt.genSalt(saltRounds, async function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          return response.json({ message: "Falha na criação do usuário" })
        }
        const serializedUser = {
          ...user,
          password: hash
        }

        const trx = await knex.transaction();
        const inserted = await trx('user').insert(serializedUser)
        const user_id = inserted[0];
        await trx.commit();
        const token = sign({ user: user_id })
        return response.json({
          id: user_id,
          ...serializedUser,
          token
        })
      })
    })


  }

  async update(request, response) {
    const { id } = request.params;

    const userUpdate = {
      ...request.body
    }
    const user = await knex('user').where('id', id).first();

    if (!user) {
      return response.send(400, { message: 'Usuário não encontrado.' })
    }

    bcrypt.genSalt(saltRounds, async function (err, salt) {
      bcrypt.hash(userUpdate.password, salt, async function (err, hash) {
        if (err) {
          return response.json({ message: "Falha na criação do usuário" })
        }

        userUpdate.password = hash
        const trx = await knex.transaction()

        await trx('user')
          .where('id', id)
          .first()
          .update(userUpdate)

        await trx.commit()

        return response.send({ message: 'Usuário atualizado com sucesso.' })
      })
    })
  }

  async delete(request, response) {
    const { id } = request.params;

    const user = await knex('user').where('id', id).first();

    if (!user) {
      return response.send(400, { message: 'Usuário não encontrado.' })
    }

    const trx = await knex.transaction()

    await trx('user')
      .where('id', id)
      .first()
      .delete()

    await trx.commit()

    return response.send({ message: 'Usuário apagado com sucesso.' })
  }

  async collectList(request, response) {
    const { id } = request.params;

    const collects = await knex('collection_point')
      .where('collection_point.user_id', id)
      .join('address', 'collection_point.address_id', '=', "address.id")
      .select('collection_point.*')
      .select('address.latitude')
      .select('address.longitude')
      .select('address.number')
      .select('address.city')
      .select('address.uf')

    const donates = await knex('donation_point')
      .where('donation_point.user_id', id)
      .join('address', 'donation_point.address_id', '=', "address.id")
      .select('donation_point.*')
      .select('address.latitude')
      .select('address.longitude')
      .select('address.number')
      .select('address.city')
      .select('address.uf')

    response.json({ collect: collects, donate: donates })
  }

}

module.exports = UsersController;