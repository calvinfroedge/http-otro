import express from 'express'
import bodyParser from 'body-parser'

let app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let echoHeaders = (req, res)=>{
  res.json(req.headers);
}

let echoBody = (req, res)=>{
  res.json(req.body);
}

let echoQs = (req, res)=>{
  res.json(req.query);
}

export default function(){
  let p = new Promise((resolve)=>{
    app.get('/json', (req, res)=>{
      res.json({foo: 'bar'});
    });

    app.post('/test', echoBody);

    app.put('/test', echoBody);

    app.delete('/test', echoQs);

    app.get('/test', echoQs);

    app.get('/headers', echoHeaders);

    app.listen(process.env.PORT || 3000, ()=>{
      console.log('server listening');
      resolve();
    });
  });

  return p;
}
