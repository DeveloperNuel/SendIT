import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import app from '../app';


// const pid = '98bdf263-a37b-433b-81f7-f557a74fdb85';
// const url = 'http://localhost:5000';

chai.use(chaiHttp);

describe('SendIT API TESTS', () => {
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
});
