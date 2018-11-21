import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import app from '../app';


const pid = '98bdf263-a37b-433b-81f7-f557a74fdb85';
const url = 'http://localhost:5000';
chai.use(chaiHttp);

describe('SendIT API TESTS', () => {
  // Test Invalid pathss
  describe('/GET INVALID_PATH', () => {
    it('should return not found', () => chai.request(app)
      .get('/INVALID_PATH')
      .then((res) => {
        expect(res).to.have.status(404);
      }));
  });

  // Test Parcels' requests
  describe('Parcels', () => {
    // Create parcel
    describe('POST/ Parcel', () => {
      // Parcel should be created
      it('should create a parcel', () => {
        const parcel = {
          userId: 1,
          parcel: {
            parcelId: 1,
            weigth: 40,
            height: 80,
            width: 40,
            length: 90,
            From: 'Kigali',
            stateFrom: 'Kicukiro',
            To: 'Rusizi',
            stateTo: 'Muhondo',
            services: 'Express',
            status: 'delivered',
          },
        };
        chai.request(app)
          .post('/api/v1/parcels/')
          .send(parcel)
          .then((res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success').eql(true);
            expect(res.body).to.have.property('parcelId');
            expect(res.body).to.have.property('price');
          });
      });

      // ASSIGN parcel to no exist User
      it('should return user not exit', () => {
        const parcel = {
          userId: 'INVALID_USER_ID',
          parcel: {
            parcelId: 1,
            weigth: 40,
            height: 80,
            width: 40,
            length: 90,
            From: 'Kigali',
            stateFrom: 'Kicukiro',
            To: 'Rusizi',
            stateTo: 'Muhondo',
            services: 'Express',
            status: 'delivered',
          },
        };
        chai.request(app)
          .post('/api/v1/parcels/')
          .send(parcel)
          .then((res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('success').eql(false);
          });
      });
    });

    // Get all parcels
    describe('GET/ Parcels', () => {
      it('should return all parcels', () => chai.request(app)
        .get('/api/v1/parcels')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.parcels).to.be.an('array');
        }));
    });

    // Get a Specific Parcel
    describe('GET/ Specif Parcel', () => {
      // Parcel Should be canceled
      it('should return a parcel', () => chai.request(app)
        .get(`/api/v1/parcels/${pid}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(true);
          expect(res.body.parcel).to.be.an('object');
        }));

      // Parcel not exit
      it('should return parcel Not Exit', () => chai.request(app)
        .get('/api/v1/parcels/4534PARCELID_NOT_EXIT')
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('success').eql(false);
          expect(res.body).to.be.an('object');
        }));
    });

    // Cancel a parcel
    describe('PUT/ Cancel a parcel', () => {
      // Should cancel a parcel
      it('should cancel a parcel', () => chai.request(app)
        .put(`/api/v1/parcels/${pid}/cancel`)
        .then((res) => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success').eql(true);
          expect(res.body).to.have.property('parcel');
          expect(res.body).to.be.an('object');
        }));

      // Should not allow to cancel a not booking-status parcel
      it('should not allow to cancel a parcel with status Delivered or Transit', () => chai.request(app)
        .put('/api/v1/parcels/2/cancel')
        .then((res) => {
          expect(res).to.have.status(405);
          expect(res.body).to.have.property('success').eql(false);
        }));

      // Parcel not found
      it('should return Not Found', () => chai.request(app)
        .put('/api/v1/parcels/234_INVALID_PARCEL_ID/cancel')
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('success').eql(false);
        }));
    });
  });

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
