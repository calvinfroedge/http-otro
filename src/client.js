import fetch from 'isomorphic-fetch'

export default function(defaults={}){
  let host = defaults.host || '';

  const query = (params)=>{
    var arr = [];
    for(var p in params){
      if (params.hasOwnProperty(p)) {
        arr.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
      }
    }

    return (arr.length > 0) ? arr.join('&') : '';
  }

  const queryURL = (resource, qs)=>{
    return qs.length ? [resource, qs].join('?') : resource;
  }

  const request = (resource, method, body={}, options={})=>{
    method = method.toUpperCase();

    let args = {
      method,
      headers: {}
    };

    //Options & defaults
    for(var key in defaults){
      if(key != 'headers'){
        args[key] = defaults[key];
      }
    }

    for(var key in options){
      if(key != 'headers'){
        args[key] = options[key];
      }
    }

    // end Options & defaults

    for(var key in options.headers){
      args.headers[key] = options.headers[key];
    }

    for(var key in defaults.headers){
      args.headers[key] = defaults.headers[key];
    }

    if(!args.headers['Content-Type']){
      args.headers['Content-Type'] = 'application/json';
    }

    if(method != 'GET') args.body = typeof(body) == 'object' ? JSON.stringify(body) : body;

    return fetch(host + resource, args);
  }

  const get = (resource, params={}, options={})=>{
    let qs = query(params);
    return request(queryURL(resource, qs), 'GET', {}, options);
  }

  const put = (resource, body={}, options={})=>{
    return request(resource, 'PUT', body, options);
  }

  const post = (resource, body={}, options={})=>{
    return request(resource, 'POST', body, options);
  }

  const del = (resource, params={}, options={})=>{
    let qs = query(params);
    return request(queryURL(resource, qs), 'DELETE', {}, options);
  }

  return { request, get, put, post, del };
}
