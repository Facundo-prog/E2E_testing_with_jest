const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/umzug');

describe('endpoint /products', () => {
  let server, api;

  beforeAll(async () => {
    const app = createApp();
    server = app.listen(9000);
    api = request(app);
    await upSeed();
  });


  describe('GET /products', () => {
    test('should return all products', async () => {
      const { status, body } = await api.get('/api/v1/products');

      expect(status).toBe(200);
      expect(body.length).toBe(2);
      expect(body[0].categoryId).toBeTruthy();
    });
  });


  describe('GET /products with limit and offset', () => {
    test('should return one product', async () => {
      const limit = 1, offset = 0;
      const { status, body } = await api.get(`/api/v1/products?limit=${limit}&offset=${offset}`);

      expect(status).toBe(200);
      expect(body.length).toBe(1);
      expect(body[0].id).toBe(1);
    });

    test('should return one product with offset a 1', async () => {
      const limit = 1, offset = 1;
      const { status, body } = await api.get(`/api/v1/products?limit=${limit}&offset=${offset}`);

      expect(status).toBe(200);
      expect(body.length).toBe(1);
      expect(body[0].id).toBe(2);
    });
  });


  describe('POST /products', () => {
    test('should return 404 not valid category', async () => {
      const inputData = {
        name: 'Product 2',
        price: 50,
        description: 'description product 2',
        image: 'http://image.png',
        categoryId: 6 //Not exist
      }

      const { status } = await api.post('/api/v1/products').send(inputData);
      expect(status).toBe(404);
    });

    test('should return 201 created', async () => {
      const inputData = {
        name: 'Product 2',
        price: 50,
        description: 'description product 2',
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
