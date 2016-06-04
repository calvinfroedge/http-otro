# http-otro

A configuration lib and caller for [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch):

```
import { fetch } from 'isomorphic-fetch'

client({host: 'myhost', headers: {'Authorization': 'Bearer SomeToken'}}).get('/foo', {bar: 'baz'}) // Requests GET /foo?bar=baz
.then((res)=>{
  //deal with response
})
```

Default `host` and `headers` can be provided via `client`, or you can just call `client().method`.

For all methods, headers can be given via the last param. A `Content-Type` of `application/json` is the default for all requests.

There are also *response handlers* which provide a shorthand for working with promises. For instance, the `json` handler allows you to write:

```
json(client().get('/foo'))
```

...instead of:
```
client().get('/foo').then((res)=>{
  return res.json();
}).then((json)=>{
  //Do something with json
});
```

# Client API

## request(resource, method, body={}, headers={})

All other methods alias this method.

## get(resource, params={}, headers={})

Turns `params` into a query string.

## post(resource, body={}, headers={})

## put(resource, body={}, headers={})

## del(resource, body={}, headers={})

# Response Handling API

## json(request)
