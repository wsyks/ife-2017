var page = require('webpage').create();
var system = require('system');
phantom.outputEncoding="GB18030";

if(system.args.length===1){
  console.log("请输入关键字");
  phantom.exit();
}

var time=Date.now();//开始计算时间
var arg=system.args;
arg.shift();//移除第一个参数，即task.js值
arg=arg.join(" ");

function analyse(keyword,time) {
  // console.log(keyword+time);
  var result=page.evaluate(function(keyword) {
    var json={
      code:0,
      msg:'',
      dataList:[]
    };
    try{
      var containers = $('.c-container');
      containers.each(function(i,obj){
        var data={};
        data.title=$(obj).find('h3 a').text();//获取标题
        data.info=$(obj).find('.c-abstract').text();//获取摘要
        data.link=$(obj).find('h3 a').attr("href");//获取链接
        if($(obj).find('img')){//获取图片链接
          data.pic=$(obj).find('img').attr('src');
        }else{
          data.pic="";
        }
        json.dataList.push(data);
      })
      json.code=1;
      json.msg="success";
      json.word=keyword;
      console.log(keyword);
    }catch(error){
      json.msg=error.message;
    }
    return json;
  })
  result.word=keyword||"";
  result.time=(Date.now()-time)+"ms";
  console.log(JSON.stringify(result));
  phantom.exit();
}

page.open('https://www.baidu.com/s?ie=GBK&wd=' + encodeURI(arg), function(status){
  var result;
  if(status==="success"){
    console.log(arg);
      page.includeJs(
        'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
        analyse(arg,time)
    );
  }else{
    result={
      code:0,
      msg:"open failed"
    }
    result.time=(Date.now()-time)+"ms";
    phantom.exit();
  }

  
})

