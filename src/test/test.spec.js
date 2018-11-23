import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import app from '../app';


// const pid = '98bdf263-a37b-433b-81f7-f557a74fdb85';
// const url = 'http://localhost:5000';
chai.use(chaiHttp);

describe('SendIT API TESTS', () => {

  // USER TESTS
  describe('Users', () => {
    // User parcels
    describe('GET/ User parcels', () => {
      // Get user parcels
      it('should get all user parcels', () => chai.request(app)
        .get('/api/v1/users/1/parcels')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success').eql(true);
          expect(res.body.parcels).to.be.an('array');
        }));

      // User has no parcels
      it('should return user parcels not found', () => chai.request(app)
        .get('/api/v1/users/3/parcels')
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success').eql(false);
          expect(res.body).to.have.property('message').eql('User has no parcels');
        }));

      // User not found
      it('should return user not found', () => chai.request(app)
        .get('/api/v1/users/3_INVALID_USER_ID/parcels')
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('success').eql(false);
          expect(res.body).to.have.property('message').eql('User not Exist');
        }));
    });

    // Register user
    describe('POST/ Register user', () => {
      // User should be registered
      it('should register new user', () => {
        const users = [
          {
            userId: 1,
            names: 'Emmanuel TUYISHIMIRE',
            email: 'egentle05@gmail.com',
            phone: 250788208798,
            password: 'jesus',
          },
        ];
        chai.request(app).post('/api/v1/users/register')
          .send(users)
          .then((res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success').eql(true);
          });
      });

      // Existing Email
      it('should return email has already registered', () => {
        const users = {
          userId: 1,
          names: 'Emmanuel TUYISHIMIRE',
          email: 'egentle05@gmail.com',
          password: 'jesus',
        };
        chai.request(app).post('/api/v1/users/register')
          .send(users)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success').eql(false);
          });
      });

      // Errors bad request
      it('should return valid data required', () => {
        const users = {
          userId: 1,
          names: 'Emmanuel TUYISHIMIRE',
          email: 'egentle05@gmail.com',
          password: 'jesus',
        };
        chai.request(app).post('/api/v1/users/register')
          .send(users)
          .then((res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success').eql(false);
            expect(res.body.error).to.be.an('array');
          });
      });
    });
  });
});
