var express = require('express');
var router = express.Router();
const axios = require('axios');

const version = process.env.VERSION || 'v1';

// GET home page. 
//curl -X GET localhost:8080
router.get('/', function(req, res, next) {


  res.render('index.html', 
  { 
    msg: process.env.HEADER_MSG || 'Sample App' 
    ,app_version: version || 'v1'
    ,app_description: process.env.DESC || 'Sample application'
  });

});

//for demo services

router.post('/submitForm', function(req, res, next){
  const payload = req.body;
  console.log(payload);
  let baseUrl=process.env.DEMO_BACKEND_URL || 'http://localhost:8081/app2/submit';
  const url = baseUrl;
  axios.post(url, payload)
  .then(resp => {
    const data = resp.data;
    console.log(data);
    res.status(200).send(data);
  })
  .catch(err => {
    console.log('Error: ', err.message);
    res.status(500).send(err);

  });  

})

//end

/*
router.get('/', function(req, res, next) {
  res.status(200).send("app1-ok")
});
*/

//curl -X GET localhost:8080/app1/test/hello
router.get('/app1/test/:message', function(req, res, next) {
  let headers = getHeaders(req);
  var message = req.params.message;

  //console.log(Object.keys(headers))
  let headerStr;
  Object.keys(headers).map(hdr => {
    console.log(hdr+":"+headers[hdr]);
    headerStr+=hdr+":"+headers[hdr]+'\n';
  });
  let response = {};
  response.message = message || '';
  response.status = 'app1-ok';
  res.status(200).send(response)
});

// call app2 - GET 
//curl -X GET -H "Content-type: application/json" localhost:8080/callapp2/hello

router.get('/callapp2/:message', function(req, res, next){

  var message = req.params.message;
  console.log("Message: %s",message);
  //pass header to downstream
  const h = req.headers;
  console.log(h);
  var hdr = {}
  //testing , just check for end-user
  console.log(h["end-user"])
  if (h["end-user"]) {
    console.log('found header')
    hdr["end-user"] = h["end-user"];
  }
    //console.log(h.end-user)
  //calling app2
  let baseUrl=process.env.APP2_URL || 'http://localhost:8081/app2'
  const url = baseUrl+'/'+message;
  console.log('**********************URL '+url)
  //axios.get(url)
  axios.get(url,{ headers: hdr })
  .then(resp => {
    const headerDate = resp.headers && resp.headers.date ? resp.headers.date : 'no response date';
    console.log('Status Code:', resp.status);
    console.log('Date in Response header:', headerDate);
    const data = resp.data;
    console.log(data);
    res.status(200).send(data);
  })
  .catch(err => {
    console.log('Error calling '+url+': ', err.message);
  }); 

});

//call app2 POST
//curl -X POST -H "Content-type: application/json" -d '{"message":"hello"}' localhost:8080/callapp2

router.post('/callapp2', function(req, res, next){
  
  const payload = req.body;
  console.log(payload);
  let baseUrl=process.env.APP2_URL || 'http://localhost:8081/app2'
  const url = baseUrl;

  axios.post(url, payload)
  .then(resp => {
    const headerDate = resp.headers && resp.headers.date ? resp.headers.date : 'no response date';
    console.log('Status Code:', resp.status);
    console.log('Date in Response header:', headerDate);

    const data = resp.data;
    console.log(data);
    res.status(200).send(data);
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });  

});


function getHeaders(req) {
  const h = req.headers;
  console.log(h);
  return h;
}
module.exports = router;
