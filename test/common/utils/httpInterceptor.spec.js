import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import fetchMock from 'fetch-mock';

chai.use(chaiEnzyme());

describe('httpInterceptor', () => {
  describe('get', () => {
    afterEach(() => {
      fetchMock.restore();
    });

    it('should return response when status is 200', (done) => {
      fetchMock.mock('/someUrl', { data: { id: 1 } });
      httpInterceptor.get('/someUrl')
        .then(res => {
          expect(fetchMock.calls().matched.length).to.eql(1);
          expect(res.data.id).to.eql(1);
          done();
        });
    });

    it('should not try to parse response if responseType is text', (done) => {
      fetchMock.mock('/someUrl', 'text response');
      httpInterceptor.get('/someUrl', 'text')
        .then(res => {
          expect(fetchMock.calls().matched.length).to.eql(1);
          expect(res).to.eql('text response');
          done();
        });
    });

    it('should throw an error when status is not 2xx', (done) => {
      fetchMock.mock('/someUrl', 404);
      httpInterceptor.get('/someUrl')
        .then(() => {})
        .catch(err => {
          expect(err.response.status).to.eql(404);
          done();
        });
    });
  });

  describe('post', () => {
    afterEach(() => {
      fetchMock.restore();
    });

    it('should be called with correct params and should return response ' +
      'when status is 200', (done) => {
      fetchMock.post('/someUrl', { data: { id: 123 } });
      const inputBody = { name: 'someFormName' };
      httpInterceptor.post('/someUrl', inputBody)
        .then(res => {
          expect(fetchMock.calls().matched.length).to.eql(1);
          expect(res.data.id).to.eql(123);
          expect(JSON.parse(fetchMock.lastOptions('/someUrl').body)).to.deep.equal(inputBody);
          done();
        });
    });

    it('should throw an error when status is not 200', (done) => {
      fetchMock.post('/someUrl', 404);
      httpInterceptor.post('/someUrl', { name: 'someFormName' })
        .then(() => {})
        .catch(err => {
          expect(err.response.status).to.eql(404);
          done();
        });
    });
  });
});
