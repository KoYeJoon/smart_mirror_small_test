var express = require('express');
var router = express.Router();
var {PythonShell} = require('python-shell');

var options = {
    mode: 'text',
    pythonPath: '/Users/yejoonko/.pyenv/versions/anaconda3-5.3.1/bin/python',
    pythonOptions: ['-u'],
    //scriptPath: '/Users/yejoonko/git/Project/smart_mirror/python/',
    //args: ['value1', 'value2', 'value3']
  };
  
// var geoip = require('geoip-lite');
/* GET home page. */
router.get('/',function(req,res,next){
    // PythonShell.run('/Users/yejoonko/git/Project/smart_mirror/python/faceRecognition.py',options, function (err, results) {
    //     if (err) throw err;  
    //     console.log('results: %j', results);
    //     res.render('emotion',{emotion : results})
    //   });
    PythonShell.run('/Users/yejoonko/git/Project/smart_mirror_small_test/api/python/faceRecognition.py', { args: [] }, function (err, data) { 
        if (err) throw err;  
        console.log(data);
        res.render('emotion',{emotion : data})
     })
      
})

router.post('/',function(req,res,next){
    console.log(req.body);
    // res.render('emotion', { emotion : req.body.emotion});
})





module.exports = router;
