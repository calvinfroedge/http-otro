import fetch from 'isomorphic-fetch'

export default function(defaults={}){
  var context = {};

  if(!defaults.headers) defaults.headers = {};

  context.defaults = defaults;

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

  context.request = (resource, method, body={}, options={})=>{
    method = method.toUpperCase();

    let args = {
      method,
      headers: {}
    };

    //Options & defaults
    for(var key in context.defaults){
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

    for(var key in context.defaults.headers){
      args.headers[key] = defaults.headers[key];
    }

    if(!args.headers['Content-Type'] && args.headers['Content-Type'] !== false){
      args.headers['Content-Type'] = 'application/json';
    }

    if(method != 'GET') args.body = typeof(body) == 'object' ? JSON.stringify(body) : body;

    return fetch(host + resource, args);
  }

  context.get = (resource, params={}, options={})=>{
    let qs = query(params);
    return context.request(queryURL(resource, qs), 'GET', {}, options);
  }

  context.put = (resource, body={}, options={})=>{
    return context.request(resource, 'PUT', body, options);
  }

  context.post = (resource, body={}, options={})=>{
    return context.request(resource, 'POST', body, options);
  }

  context.del = (resource, params={}, options={})=>{
    let qs = query(params);
    return context.request(queryURL(resource, qs), 'DELETE', {}, options);
  }

  return context;
}
