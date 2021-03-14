var express = require('express');
var router = express.Router();
var Youtube = require('youtube-node');
const fetch = require('node-fetch');
const dotenv = require("dotenv").config();

router.get('/',function(req,res,next){
    var url = "https://www.googleapis.com/youtube/v3/search?"
    var optionParams={
      q:"playlist 슬픈",
      part:"snippet",
      key: process.env.YOUTUBE_KEY,
      type:"video",
      maxResults:10,
      regionCode:process.env.REGION,
     };
  
     optionParams.q=encodeURI(optionParams.q);
     for(var option in optionParams){
      url+=option+"="+optionParams[option]+"&";
      }
  
      //url의마지막에 붙어있는 & 정리
      url=url.substr(0, url.length-1);
      fetch(url).then(function(response){
          // console.log(response)
          return response.json();
      })
      .then(function(result) {
          //console.log(result)
          const items = result["items"]; 
          res.render('youtube', { items: items });
          
        })
      .catch(function(err){
        console.log(err)

        res.render('index', { title: 'Express' });
      })
  })
  

  // youtube npm module 사용하는 경우 
/*router.get('/',function(req,res,next){
  var youtube = new Youtube();
  youtube.setKey(process.env.YOUTUBE_KEY); // API 키 입력

  //// 검색 옵션 시작
  youtube.addParam('order', 'rating'); // 평점 순으로 정렬
  youtube.addParam('type', 'video');   // 타입 지정
  youtube.addParam('videoLicense', 'creativeCommon'); // 크리에이티브 커먼즈 아이템만 불러옴
//// 검색 옵션 끝

  var word = '플레이리스트'; // 검색어 지정
  var limit = 10;  // 출력 갯수
  youtube.search(word, limit, function (err, result) { // 검색 실행
      if (err) { console.log(err); return; } // 에러일 경우 에러공지하고 빠져나감
      //console.log(JSON.stringify(result, null, 2)); // 받아온 전체 리스트 출력

      var items = result["items"]; // 결과 중 items 항목만 가져옴
      res.render('youtube', { items: items })
      // db에 저장하면 될 듯
    //   for (var i in items) { 
    //       var it = items[i];
    //       var title = it["snippet"]["title"];
    //       var video_id = it["id"]["videoId"];
    //       var url = "https://www.youtube.com/watch?v=" + video_id;
    //       console.log("제목 : " + title);
    //       console.log("URL : " + url);
    //       console.log("-----------");
    // }
});
})*/


module.exports = router;