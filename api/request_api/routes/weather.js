var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
var ip = require("ip");
const axios = require('axios');
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv").config();


router.get('/', function(req, res, next) {
    //var ip_address = ip.address()
    const access_key = process.env.NAVER_ACCESS_API_KEY;
    const secret_key = process.env.NAVER_SECRET_API_KEY;
  
    const requestMethod = "GET";
    const hostName = 'https://geolocation.apigw.ntruss.com'
    const requestUrl= '/geolocation/v2/geoLocation'
  
    const timeStamp = Math.floor(new Date).toString();
  
    (()=>{
    const sortedSet = {};
    //집 ip가 private이므로, 가상 주소 가져옴.
    sortedSet["ip"] = process.env.PRIVATE_IP;
    sortedSet["ext"] = "t";
    sortedSet["responseFormatType"] = "json";
  
    let queryString = Object.keys(sortedSet).reduce( (prev, curr)=>{
      return prev + curr + '=' + sortedSet[curr] + '&';
    }, "");
  
    queryString = queryString.substr(0, queryString.length -1 );
  
    const baseString = requestUrl + "?" + queryString;
    const signature = makeSignature(secret_key, requestMethod, baseString, timeStamp, access_key);
  
    const config = {
      headers: {
        'x-ncp-apigw-timestamp': timeStamp,
        'x-ncp-iam-access-key' : access_key,
        'x-ncp-apigw-signature-v2': signature
      }
    }
    // console.log(config)
    axios.get(`${hostName}${baseString}`, config)
      .then( response=>{ 
        console.log( response.data ); 
        let lat = response.data.geoLocation.lat
        let long = response.data.geoLocation.long  
        return {lat,long}
      })
      .then(success => {
        const API_KEY = process.env.OPENWEATHER_API_KEY;
        let lat = success.lat
        let lon = success.long
        if (success.lat == '' && success.long == ''){
          lat = 37.28431856732866
          lon = 127.04453585707081
        }
      fetch(
      `${process.env.OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      ).then(function(response){
          return response.json();
      })
      .then(function(json) {
          //console.log(json)
          data = {}
          const temperature = json.main.temp;
          const place = json.name;
          var imgURL = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png";
          data['temperature'] = temperature
          data['place'] = place
          data['imgURL'] = imgURL
          res.render('weather', { title: 'Express', temperature : temperature, place : place, img : imgURL})
          // res.json(data = data)
        })
        .catch(err => console.log(err)) 
      })
      .catch( error =>{ console.log( error.response.data ); })
   })();
  
  function makeSignature(secretKey, method, baseString, timestamp, accessKey) {
      const space = " ";
      const newLine = "\n";
      let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  
      hmac.update(method);
      hmac.update(space);
      hmac.update(baseString);
      hmac.update(newLine);
      hmac.update(timestamp);
      hmac.update(newLine);
      hmac.update(accessKey);
      const hash = hmac.finalize();
  
      return hash.toString(CryptoJS.enc.Base64);
  }
  
  });


module.exports = router;