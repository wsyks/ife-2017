var colorPicker= function(id,config){
	this.element=$("#"+id)[0];
	this.jqelement=$("#"+id);
	this.slide=$("#colorpicker-slide")[0];
	this.jqslide=$("#colorpicker-slide");
	this.width = this.element.width || 300;
	this.height = this.element.height ||300;
	this.pickercircle=$("#colorpicker-circle");
	this.context = this.element.getContext("2d"); 
	this._init();
}
colorPicker.prototype = {
	_init:function(){
		this.canvasX=0;
		this.canvasY=0;
		this.hsl=[0,100,50];
		this.rgb=[255,0,0];
		this.hsv=[0,100,100];
		this.hex="#ffffff";
		this._drawbg();
		this._pickcolor();
		this._slidecolor();
		this._updatergb();
		this._updatehslv();
		this._contentchange();
	},
	//填充左边颜色的渐变
	_drawbg:function(color){
		var x1 = 0;
		var y1 = 0;
		//水平的渐变
		var linear_gradient_hori = this.context.createLinearGradient(x1, y1, this.width, 0);
		linear_gradient_hori.addColorStop(0, 'rgba(255,255,255,1)'); 
		linear_gradient_hori.addColorStop(1,color?color:'rgba(255,0,0,1)');//添加上颜色
		this.context.fillStyle=linear_gradient_hori;
		this.context.fillRect(0, 0, this.width, this.height); 
		//垂直的渐变
		var linear_gradient_ver = this.context.createLinearGradient(x1, y1, 0, this.height);
		linear_gradient_ver.addColorStop(0, 'rgba(0,0,0,0)'); 
		linear_gradient_ver.addColorStop(1,'rgba(0,0,0,1)');
		this.context.fillStyle=linear_gradient_ver;
		this.context.fillRect(0, 0, this.width, this.height); 
	},
	//点击取色
	_pickcolor:function(){
		var that=this;
		that.jqelement.bind("click",function(e){
			var canvasrect=that.element.getBoundingClientRect();
			that.canvasX = e.clientX-canvasrect.left*(that.width/canvasrect.width);
			that.canvasY = e.clientY-canvasrect.top*(that.height/canvasrect.height);
			var imageData = that.context.getImageData(that.canvasX, that.canvasY, 1, 1);
			var pixel = imageData.data;
			that.rgb=pixel.slice(0,3);
			that.hex=rgbtohex(pixel[0],pixel[1],pixel[2]);
			that.hsl=rgbtohsl(pixel[0],pixel[1],pixel[2]);
			that.hsv=rgbtohsv(pixel[0],pixel[1],pixel[2]);
			that._updatergb();
			that._updatehslv();
			that.pickercircle.show();
			that.pickercircle.css({"top":that.canvasY-5,"left":that.canvasX-5});//-5是因为是圆形，需要减去宽高和边框;
		})
	},
	_slidecolor:function(){
		var that=this;
		// that.slide.addEventListener('mousedown',function(e){
		that.jqslide.bind("click",function(e){
			// console.log();
			if(e.target.id=="colorpicker-slide"){
				$("#colorslide-circle").show();
				that.pickercircle.show();
				$("#colorslide-circle").css({"top":e.offsetY-8});//减去圆圈本身的高度和边框;
				console.log(that.hsl);
				// var hsl=[];
				that.hsl[0]=that.hsv[0]=Math.round(e.offsetY/that.height*360);//在这里选择只是变化了h值
				var hsl=that.hsl[0]+",100%,50%,1";
				that._drawbg("hsla("+hsl+")");//重新绘制左边的渐变图;
				that.rgb=hsltorgb(that.hsl[0],that.hsl[1],that.hsl[2]);
				that._updatergb();
				$("#colorpicker-hslh").val(that.hsl[0]);
				$("#colorpicker-hsvh").val(that.hsv[0]);
			}
		})
	},
	//更新rgb ，hex 和颜色块数据
	_updatergb:function(){
		$("#colorpicker-rgbr").val(this.rgb[0]);
		$("#colorpicker-rgbg").val(this.rgb[1]);
		$("#colorpicker-rgbb").val(this.rgb[2]);
		this.hex=rgbtohex(this.rgb[0],this.rgb[1],this.rgb[2]);
		$("#hex").val(this.hex);
		$("#pickercolor").css({"background-color":this.hex});
	},
	//更新hsl和hsv的数据
	_updatehslv:function(){
		this.hsv=rgbtohsv(this.rgb[0],this.rgb[1],this.rgb[2]);
		$("#colorpicker-hsvh").val(this.hsv[0]);
		$("#colorpicker-hsvs").val(this.hsv[1]);
		$("#colorpicker-hsvv").val(this.hsv[2]);
		$("#colorpicker-hslh").val(this.hsl[0]);
		$("#colorpicker-hsls").val(this.hsl[1]);
		$("#colorpicker-hsll").val(this.hsl[2]);
	},
	//监听表单数据变化
	_contentchange(){
		var that=this;
		$("#hex").bind("change",function(e){
		// $("#hex").change=function(){
			var hex=$("#hex").val();
			var rgb;
			if(rgb=hextorgb(hex)){
				that.hex=hex;
				that.rgb=rgb;
				that.hsl=rgbtohsl(rgb[0],rgb[1],rgb[2]);
				that.hsv=rgbtohsv(that.rgb[0],that.rgb[1],that.rgb[2]);
				that._updatechange();
			}
		})
		$(".rgbbox input").each(function(index,obj){
			$(obj).bind("change",function(e){
				var value=parseInt($(obj).val());
				if(value>0 && value<=255){
					that.rgb[index]=value;
					that.hex=rgbtohex(that.rgb[0],that.rgb[1],that.rgb[2]);
					that.hsl=rgbtohsl(that.rgb[0],that.rgb[1],that.rgb[2]);
					that.hsv=rgbtohsv(that.rgb[0],that.rgb[1],that.rgb[2]);
					that._updatechange();
				}
			})
			
		})
		$(".hslbox input").each(function(index,obj){
			$(obj).bind("change",function(e){
				var value=parseInt($(obj).val());
				if((index==0 && value<=360 && value>=0)||(value<=100 && value>=0)){
					that.hsl[index]=value;
					that.rgb=hsltorgb(that.hsl[0],that.hsl[1],that.hsl[2]);
					that.hsv=rgbtohsv(that.rgb[0],that.rgb[1],that.rgb[2]);
					that.hex=rgbtohex(that.rgb[0],that.rgb[1],that.rgb[2]);
					that._updatechange();
				}
			})
			
		})
		$(".hsvbox input").each(function(index,obj){
			$(obj).bind("change",function(e){
				var value=parseInt($(obj).val());
				if((index==0 && value<=360 && value>=0)||(value<=100 && value>=0)){
					that.hsv[index]=value;
					that.rgb=hsvtorgb(that.hsv[0],that.hsv[1],that.hsv[2]);
					that.hsl=rgbtohsl(that.rgb[0],that.rgb[1],that.rgb[2]);
					that.hex=rgbtohex(that.rgb[0],that.rgb[1],that.rgb[2]);
					that._updatechange();
				}
			})
			
		})
		
	},
	// 更新表单输入而产生的变化
	_updatechange(){
		this._updatergb();
		this._updatehslv();
		var offestheight=this.hsl[0]/360*this.height;
		//改变颜色条选择圆圈的位置
		$("#colorslide-circle").show();
		this.pickercircle.show();
		$("#colorslide-circle").css({"top":offestheight-8});
		var hsl=this.hsl[0]+",100%,50%,1";
		this._drawbg("hsla("+hsl+")");//重新绘制左边的渐变图;
		// 根据hsb来确定渐变区域选色圆圈的位置
		this.hsv=rgbtohsv(this.rgb[0],this.rgb[1],this.rgb[2]);
		var canvaswidth=this.hsv[1]/100*this.width;
		var canvasheight=(1-this.hsv[2]/100)*this.height;
		this.pickercircle.css({"top":canvasheight-5,"left":canvaswidth-5});//-5是因为是圆形，需要减去宽高和边框;

	}
};

new colorPicker("canvas");

// 颜色转换函数
// 
// r,g,b范围为[0,255],转换成h范围为[0,360]
// s,l为百分比形式，范围是[0,100],可根据需求做相应调整
function rgbtohsl(r,g,b){
	r=r/255;
	g=g/255;
	b=b/255;
	var min=Math.min(r,g,b);
	var max=Math.max(r,g,b);
	var l=(min+max)/2;
	var difference = max-min;
	var h,s,l;
	if(max==min){
		h=0;
	}else{
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	if(max==min ||l==0){
		s=0;
	}else{
		s=l>0.5?difference/(2.0-max-min):difference/(max+min);
	}
	s=Math.round(s*100);
	l=Math.round(l*100);
	return [h,s,l];
}

// r,g,b范围为[0,255],转换成h范围为[0,360]
// s,v为百分比形式，范围是[0,100],可根据需求做相应调整
function rgbtohsv(r,g,b){
	r=r/255;
	g=g/255;
	b=b/255;
	var h,s,v;
	var min=Math.min(r,g,b);
	var max=v=Math.max(r,g,b);
	var l=(min+max)/2;
	var difference = max-min;
	
	if(max==min){
		h=0;
	}else{
		switch(max){
			case r: h=(g-b)/difference+(g < b ? 6 : 0);break;
			case g: h=2.0+(b-r)/difference;break;
			case b: h=4.0+(r-g)/difference;break;
		}
		h=Math.round(h*60);
	}
	if(max==0){
		s=0;
	}else{
		s=1-min/max;
	}
	s=Math.round(s*100);
	v=Math.round(v*100);
	return [h,s,v];
}

//输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100] 
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hsltorgb(h,s,l){
	var h=h/360;
	var s=s/100;
	var l=l/100;
	var rgb=[];

	if(s==0){
		rgb=[Math.round(l*255),Math.round(l*255),Math.round(l*255)];
	}else{
		var q=l>=0.5?(l+s-l*s):(l*(1+s));
		var p=2*l-q;
		var tr=rgb[0]=h+1/3;
		var tg=rgb[1]=h;
		var tb=rgb[2]=h-1/3;
		for(var i=0; i<rgb.length;i++){
			var tc=rgb[i];
			console.log(tc);
			if(tc<0){
				tc=tc+1;
			}else if(tc>1){
				tc=tc-1;
			}
			switch(true){
				case (tc<(1/6)):
					tc=p+(q-p)*6*tc;
					break;
				case ((1/6)<=tc && tc<0.5):
					tc=q;
					break;
				case (0.5<=tc && tc<(2/3)):
					tc=p+(q-p)*(4-6*tc);
					break;
				default:
					tc=p;
					break;
			}
			rgb[i]=Math.round(tc*255);
		}
	}
	
	return rgb;
}

//输入的h范围为[0,360],s,l为百分比形式的数值,范围是[0,100] 
//输出r,g,b范围为[0,255],可根据需求做相应调整
function hsvtorgb(h,s,v){
	var s=s/100;
	var v=v/100;
	var h1=Math.floor(h/60) % 6;
	var f=h/60-h1;
	var p=v*(1-s);
	var q=v*(1-f*s);
	var t=v*(1-(1-f)*s);
	var r,g,b;
	switch(h1){
		case 0:
			r=v;
			g=t;
			b=p;
			break;
		case 1:
			r=q;
			g=v;
			b=p;
			break;
		case 2:
			r=p;
			g=v;
			b=t;
			break;
		case 3:
			r=p;
			g=q;
			b=v;
			break;
		case 4:
			r=t;
			g=p;
			b=v;
			break;
		case 5:
			r=v;
			g=p;
			b=q;
			break;
	}
	return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

function rgbtohex(r,g,b) {
	var temp;
	var hex=[];

	hex[0]=(temp = Number(r).toString(16)).length == 1 ? ('0' + temp) : temp;
	hex[1]=(temp = Number(g).toString(16)).length == 1 ? ('0' + temp) : temp;
	hex[2]=(temp = Number(b).toString(16)).length == 1 ? ('0' + temp) : temp;
	return "#"+hex.join("");
}
function hextorgb(hex) {
	var temp=hex.split("#");
	var rgb=[],hex;
	var pattern=/^[0-9a-fA-F]{6}$/i;
	if(temp.length==2 && pattern.test(temp[1])){
		hex=hex.split("#")[1];
	}else if(temp.length==1 && pattern.test(temp[0])){
		hex=hex.split("#")[0];
	}else{
		return false;
	}
	rgb[0]=parseInt(hex.slice(0,2).toString(),16);
	rgb[1]=parseInt(hex.slice(2,4).toString(),16);
	rgb[2]=parseInt(hex.slice(4).toString(),16);
	return rgb;
}
