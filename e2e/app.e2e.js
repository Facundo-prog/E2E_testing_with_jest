const request = require('supertest');
const createApp = require('../src/app');
const { upSeed, downSeed } = require('./utils/seed');

describe('GET tests', () => {
  let server, api;

  beforeEach(async () => {
    const app = createApp();
    api = request(app);
    server = app.listen(9000, "", () => {
      console.log('E2E server runing');
    });
    await upSeed();
  });

  test('Should response code 200', async () => {
    const res = await api.get('/hello');
    expect(res).toBeTruthy();
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('facu');
    expect(res.headers['content-type']).toContain('application/json');
  });

  afterEach(async () => {
    server.close();
    await downSeed();
  });
});
