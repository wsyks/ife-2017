//
var http = require('http');
// url 模块提供了一些实用函数，用于 URL 处理与解析
var url = require('url');
// querystring 模块提供了一些实用工具，用于解析与格式化 URL 查询字符串
// var querystring = require('querystring');

// 连接数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/baidu');

// 添加数据库连接失败和打开时的回调
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('mongoose connected!')
});

// 定义一个Schema
var resultSchema = new mongoose.Schema({
  code: Number,
  msg: String,
  word: String,
  device: String,
  time: Number,
  dataList: [{
    info: String,
    link: String,
    pic: String,
    title: String
  }]
});

// 编译定义好的Schema
var Result = mongoose.model('Result', resultSchema);

// child_process.exec(): 衍生一个 shell 并在 shell 上运行一个命令，当完成时会传入 stdout 和 stderr 到一个回调
var exec = require('child_process').exec;
var cmdStr = 'phantomjs task.js ';

http.createServer(function(req, res) {
      // 浏览器会默认请求favicon.ico，将其过滤掉
      if(req.url !== '/favicon.ico') {
        console.log('request received');

        // 解析URL，取出其中的query对象
        var queryObj = url.parse(req.url,true).query;
        console.log(queryObj);

        exec(cmdStr + queryObj.word + ' ' + queryObj.device, function(err, stdout, stderr){
            if(err) {
                console.error(`exec error: ${error}`);
            } else {
                try {
                    JSON.parse(stdout);
                } catch (err) {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    return res.end(JSON.stringify({code: 0, msg: '请确认查询参数是否正确'}));
                }
                // 新建一个文档
                var result = new Result(JSON.parse(stdout));

                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(stdout);

                // 将文档保存到数据库
                result.save(function(err, result) {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(result);
                  }
                });
            }
        });
      }

}).listen(8000);
console.log('server started');