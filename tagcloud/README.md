tagcloud小插件
使用方法：

 1. 引入tagcloud.js与tagcloud.css
 

``` stylus
    <script type="text/javascript" src="tagcloud.js"></script>
```
``` stylus
<link rel="stylesheet" type="text/css" href="tagcloud.css">
```
 2. 创建一个div节点，设置id
 

``` stylus
<div id="tagcloud">
</div>
```
3.创建tagcloud
``` stylus
new tagcloud("your id", option);
```
4.配置选项

``` stylus
option={
	data:[], //标签数组
	speed:int,//转动速度，范围0-1
	radius:int,//tagcloud的半径
    color: //标签颜色
};
```



