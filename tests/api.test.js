const request = require('supertest');
const { app, VALID_STATUSES } = require('../app/index');

describe('Ticket API', () => {
  describe('GET /health', () => {
    it('should return status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /tickets', () => {
    it('should create a ticket with default status open', async () => {
      const res = await request(app)
        .post('/tickets')
        .send({ title: 'API returning 500 on /users endpoint' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('open');
      expect(res.body.title).toBe('API returning 500 on /users endpoint');
    });

    it('should return 400 when title is missing', async () => {
      const res = await request(app).post('/tickets').send({ status: 'open' });
      expect(res.status).toBe(400);
    });

    // This test FAILS with the current buggy code — it should be fixed by Copilot Agent
    it('should return 400 when status is invalid', async () => {
      const res = await request(app)
        .post('/tickets')
        .send({ title: 'Test incident', status: 'invalid-status' });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid status/i);
    });
  });

  describe('PATCH /tickets/:id', () => {
    it('should update ticket status to a valid value', async () => {
      const createRes = await request(app)
        .post('/tickets')
        .send({ title: 'Database connection timeout' });

      const { id } = createRes.body;

      const patchRes = await request(app)
        .patch(`/tickets/${id}`)
        .send({ status: 'in-progress' });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.status).toBe('in-progress');
    });

    // This test FAILS with the current buggy code — it should be fixed by Copilot Agent
    it('should return 400 when patching with an invalid status', async () => {
      const createRes = await request(app)
        .post('/tickets')
        .send({ title: 'Memory leak detected' });

      const { id } = createRes.body;

      const patchRes = await request(app)
        .patch(`/tickets/${id}`)
        .send({ status: 'hacked' });

      expect(patchRes.status).toBe(400);
    });

    it('should return 404 for non-existent ticket', async () => {
      const res = await request(app).patch('/tickets/000').send({ status: 'closed' });
      expect(res.status).toBe(404);
    });
  });

  describe('VALID_STATUSES', () => {
    it('should contain exactly the expected statuses', () => {
      expect(VALID_STATUSES).toEqual(
        expect.arrayContaining(['open', 'in-progress', 'resolved', 'closed'])
      );
      expect(VALID_STATUSES).toHaveLength(4);
    });
  });
});
