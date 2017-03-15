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



page.open('https://www.baidu.com/s?ie=GBK&wd=' + encodeURI(arg), function(status){
  var result;
  if(status==="success"){
      page.includeJs(
      // Include the https version, you can change this to http if you like.
        'https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js',
        function() {
          result=page.evaluate(function() {
            var json={
              code:0,
              msg:'',
              word:'',
              time:'',
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
              json.title=arg;

            }catch(error){
              json.msg=error.message;
            }
            json.time=Date.now-time;
            return json;
        })
          console.log(JSON.stringify(result));
          phantom.exit();
      }
    );
  }else{
    result={
      code:0,
      msg:"open failed"
    }
    result.time=Date.now-time;

    console.log(JSON.stringify(result));
    phantom.exit();
  }

  
})

