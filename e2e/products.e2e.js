const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/seed');

describe('endpoint /products', () => {
  let server, api;

  beforeAll(async () => {
    const app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });


  describe('POST /products', () => {
    test('should return 404 not valid category', async () => {
      const inputData = {
        name: 'Product 1',
        price: 100,
        description: 'description product',
        image: 'http://image.png',
        categoryId: 6 //Not exist
      }

      const { status } = await api.post('/api/v1/products').send(inputData);
      expect(status).toBe(404);
    });

    test('should return 201 created', async () => {
      const inputData = {
        name: 'Product 1',
        price: 100,
        description: 'description product',
        image: 'http://image.png',
        categoryId: 1
      }

      const { status, body } = await api.post('/api/v1/products').send(inputData);
      expect(status).toBe(201);

      const product = await models.Product.findByPk(body.id);
      expect(product.name).toBe(inputData.name);
    });
  });


  afterAll(async () => {
    await downSeed();
    server.close();
  });
});
