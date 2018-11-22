import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import app from '../app';


const pid = '98bdf263-a37b-433b-81f7-f557a74fdb85';
// const url = 'http://localhost:5000';

chai.use(chaiHttp);

// Get a Specific Parcel
describe('GET/ Specif Parcel', () => {
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
