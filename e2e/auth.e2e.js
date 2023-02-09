const request = require('supertest');
const createApp = require('../src/app');
const { config } = require('../src/config/config');
const { models } = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/seed');

describe('endpoint /auth', () => {
  let server, api;

  beforeAll(async () => {
    const app = createApp();
    api = request(app);
    server = app.listen(9000, "", () => {
      console.log('E2E server runing');
    });
    await upSeed();
  });

  describe('POST request', () => {
    test('Should return a 401 Unauthorized', async () => {
      const dataInput = {
        email: "admin@mail.com",
        password: "password"
      }

      const { status, body } = await api.post('/api/v1/auth/login').send(dataInput);

      expect(status).toBe(401);
      expect(body.error).toBe("Unauthorized");
    });

    test('Should return a 200 ok', async () => {
      const user = await models.User.findByPk('1');
      const dataInput = {
        email: user.email,
        password: "admin1234"
      }

      const { status, body } = await api.post('/api/v1/auth/login').send(dataInput);

      expect(status).toBe(200);
      expect(body.user.email).toEqual(dataInput.email);
      expect(body.user.password).toBeUndefined();
      expect(body.access_token).toBeTruthy();
    });
  });

  describe('GET /protected-route', () => {
    test('Should return a 401 Unauthorized', async () => {
      const { status, body } = await api.get('/protected-route');

      expect(status).toBe(401);
      expect(body.error).toBe("Unauthorized");
    });

    test('Should return a 200 ok', async () => {
      const { status, body } = await api.get('/protected-route').set({ api: config.apiKey });

      expect(status).toBe(200);
      expect(body.message).toEqual('Hola, soy una ruta protegida');
    });
  });

  afterAll(async () => {
    server.close();
    await downSeed();
  });
});
