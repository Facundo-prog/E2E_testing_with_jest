const request = require('supertest');
const createApp = require('../src/app');
const { models } = require('../src/db/sequelize');
const { upSeed, downSeed } = require('./utils/seed');

describe('endpoint /users', () => {
  let server, api;

  beforeAll(async () => {
    const app = createApp();
    api = request(app);
    server = app.listen(9000);
    await upSeed();
  });

  describe('GET /users and /users/{id}', () => {
    test('Should return all users', async () => {
      const { status, body, headers } = await api.get('/api/v1/users');

      expect(status).toBe(200);
      expect(headers['content-type']).toContain('application/json');
      expect(body.length).toBe(2);
    });

    test('Should return one user', async () => {
      const user = await models.User.findByPk('1');
      const { status, body, headers } = await api.get('/api/v1/users/' + user.id);

      expect(status).toBe(200);
      expect(headers['content-type']).toContain('application/json');
      expect(body.password).toBe(user.password);
    });
  });

  describe('POST /users', () => {
    test('Should return a 400 Bad request with email invalid', async () => {
      const dataInput = {
        email: "test.com",
        password: "password"
      }

      const { status, body } = await api.post('/api/v1/users').send(dataInput);

      expect(status).toBe(400);
      expect(body.error).toBe("Bad Request");
      expect(body.message).toContain("email");
    });

    test('Should return a 400 Bad request with password invalid', async () => {
      const dataInput = {
        email: "test@gmail.com",
        password: "short"
      }

      const { status, body } = await api.post('/api/v1/users').send(dataInput);

      expect(status).toBe(400);
      expect(body.error).toBe("Bad Request");
      expect(body.message).toContain("password");
    });

    test('Should return a 201 user created', async () => {
      const dataInput = {
        email: "test@gmail.com",
        password: "test1234"
      }

      const { status, body } = await api.post('/api/v1/users').send(dataInput);
      const user = await models.User.findByPk(body.id);

      expect(status).toBe(201);
      expect(user.email).toBe(dataInput.email);
      expect(user.role).toContain("admin");
    });
  });


  afterAll(async () => {
    server.close();
    await downSeed();
  });
});
