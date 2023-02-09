const sequalize = require('../../src/db/sequelize');
const bcrypt = require('bcrypt');
const { models } = sequalize;


const upSeed = async () => {
  try{
    await sequalize.sync({ force: true });// Dev only

    await models.User.create({
      email: 'admin@mail.com',
      password: await bcrypt.hash('admin1234', 10),
      role: 'admin'
    });

    await models.User.create({
      email: 'customer@gmail.com',
      password: await bcrypt.hash('12345678', 10),
      role: 'customer',
      createdAt: new Date()
    });

    await models.Category.create([
      {
        name: 'category 1',
        image: 'http://image.png'
      },
      {
        name: 'category 2',
        image: 'http://image.png'
      }
    ]);

    await models.Customer.create({
      name: "Valentina",
      lastName: "Molina",
      phone: "121212",
      user_id: 2
    });

    await models.Order.create({
      customerId: 1
    });

  } catch(e){
    console.error(e);
  }
}

const downSeed = async () => {
  await sequalize.drop();
}

module.exports = { upSeed, downSeed }
