import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import app from '../app';


const pid = '98bdf263-a37b-433b-81f7-f557a74fdb85';
// const url = 'http://localhost:5000';

chai.use(chaiHttp);

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
