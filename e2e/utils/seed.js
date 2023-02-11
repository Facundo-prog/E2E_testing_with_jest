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
      role: 'customer'
    });

    await models.Category.create({
      name: 'category 1',
      image: 'http://image.png'
    });

    await models.Product.create({
      name: 'Product 1',
      price: 100,
      description: 'description product 1',
      image: 'http://image.png',
      categoryId: 1
    })

    await models.Customer.create({
      name: "Valentina",
      lastName: "Molina",
      phone: "121212",
      userId: 2
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
