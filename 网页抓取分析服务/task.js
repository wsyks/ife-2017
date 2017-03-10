// var webPage = require('webpage');
var page = require('webpage').create();

var system = require('system');
phantom.outputEncoding="GB18030";

if(system.args.length===1){
  console.log("请输入关键字");
  phantom.exit();
}
var time=Date.now();
var arg=system.args;
arg.shift();
arg=arg.join(" ");

page.open('https://www.baidu.com/s?ie=GBK&wd=' + encodeURI(arg), function(status){
  var result;
  result=page.evaluate(function() {
    var json={
      code:0,
      msg:'',
      word:'',
      time:'',
      dataList:[]
    };
    var containers = document.querySelectorAll('.c-container');
        for(var i = 0; i < containers.length; ++i) {
            var container = containers[i];
            var data = {}, dom;
            //标题 title
            dom = container.querySelector('a');
            data.title = dom.innerText;
            //链接 link
            // data.link = processLink(dom.href);
            //摘要 info
            dom = container.querySelector('.c-abstract') || container.querySelector('.c-span-last p:first-child');
            dom && (data.info = dom.innerText);
            //缩略图 pic
            dom = container.querySelector('img.c-img6');
            // dom && (data.pic = processLink(dom.src));
            json.dataList.push(data);
        }
        json.code = 1;  //成功状态码
        json.msg = '抓取成功';  //成功状态信息
        // console.log(JSON.stringify(json));

        return json;
  })
  console.log(JSON.stringify(result));
  phantom.exit();
})


// if (system.args.length === 2) {
//     var page = webPage.create();
//     // key=system.args[1].toString();
//     // console.log(system.args[1].toString());
//     page.open("https://www.baidu.com/",function(status){
//       if(status==="success"){
//          page.includeJs("https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js", function() {
//             console.log('ddd');
//             setTimeout(function(){
//               page.evaluate(function() {
//                 $("#kw").value="sdsd";

//                 // $("#kw").value=system.args[1].toString();
//                 $("#su").submit();
//                 var content=$('.result c-container');
//                 for(var i=0; i<content.length;i++){
//                   console.log(content[i].find("a.c-showurl").text());
//                 }
//                 console.log($('#content_left'));
//             });
//             phantom.exit();
//           },10000);
//         });
//       }else{
//         phantom.exit();
//       }
//     })
    
// } else {
//   console.log("please input one keyword");
//   phantom.exit();
  
// }


// page.includeJs(
//       // Include the https version, you can change this to http if you like.
//       'https://www.baidu.com/',
//       function(key) {
//         (page.evaluate(function(key) {
//           // console.log('key');
//           var keyword=document.getElementById("kw");
//             console.log(keyword);

//           // document.getElementById("kw").value='key';
//           // keyword.value=key;
//           // // $('#kw').value(system.args[1].toString());
//           // document.getElementById("su").click();
//           // var result=[];
//           setTimeout(function(){
//           console.log('hahah');

//             // var resultpage=document.getElementById('content_left');
//             // result.push(resultpage);
//             // console.log(result);
//             console.log(keyword);
//             phantom.exit();
//           },100000)
          
//         }))
//         // console.log(result);
//       }
//     );