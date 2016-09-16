import expect from 'expect'
import { client, response } from '../src'
import { queryURL } from '../src/client'
import testServer from '../test-server'

describe('URLs should be formed as expected', ()=>{
  it('Should handle adding query string correctly', ()=>{
    var qs = 'a=1&b=2';

    var url = 'http://foo.com/bar?baz=bop';
    expect(queryURL(url, qs)).toBe(url+'&'+qs);

    var url2 = 'http://foo.com';
    expect(queryURL(url2, qs)).toBe(url2+'?'+qs);
  });
});

describe('Requests should be configured as expected', ()=>{
  let app;
  let port = process.env.PORT || 3000;
  let url = `http://localhost:${port}`;
  let lib;

  function methodBodyTest(method, done){
    let body = {foo: 'bar'};
    lib[method]('/test', body).then((res)=>{
      return res.json();
    }).then((res)=>{
      expect(JSON.stringify(body)).toBe(JSON.stringify(res));
      done();
    }).catch((e)=>{
      throw e;
      console.log('error is', e);
    });
  }

  function queryTest(method, done){
    let params = {foo: 'bar', baz: 'bop'}
    lib[method]('/test', params).then((res)=>{
      return res.json();
    }).then((res)=>{
      expect(JSON.stringify(res)).toBe(JSON.stringify(params));
      done();
    });
  }

  before((done)=>{
    lib = client({host: url});
    testServer().then(done);
  })

  it('Get requests should have query string formed from params', (done)=>{
    queryTest('get', done);
  });

  it('Post requests should receive expected body', (done)=>{
    methodBodyTest('post', done);
  });

  it('Put requests should receive expected body', (done)=>{
    methodBodyTest('put', done);
  });

  it('Delete requests should receive expected body', (done)=>{
    queryTest('del', done);
  });

  it('Should handle a json response', (done)=>{
    response.json(lib.get('/json')).then((json)=>{
      expect(JSON.stringify(json)).toBe(JSON.stringify({foo: 'bar'}));
      done();
    });
  });

  it('Should allow us to change defaults dynamically, affecting headers', (done)=>{
    let c = client({host: url});
    expect(JSON.stringify(c.defaults.headers)).toBe("{}");
    c.defaults.headers['foo'] = 'bar';
    expect(c.defaults.headers.foo).toBe('bar');
    done();
  });
});
