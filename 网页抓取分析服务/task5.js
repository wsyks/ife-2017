var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/baidu');

// 添加数据库连接失败和打开时的回调
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('mongoose connected!')
});

            var PersonSchema = new mongoose.Schema({
      name:String   //定义一个属性name，类型为String
    });
    
     var PersonModel = db.model('Result',PersonSchema);  
    db.on('error',console.error.bind(console,'连接错误:'));
    db.once('open',function(){
      //一次打开记录
        console.log("openned");
        

    
      var personEntity = new PersonModel({name:'zKrxxxouky'});
         personEntity.save();
       
        PersonModel.find(function(err,persons){
      //查询到的所有person
            console.log(err);
            console.log(persons);
              db.close();
    });
   
    });