class tagcloud{
    constructor(id,option){
        let defaluts={
        	radius: 250,  //标签云的直径
        	color: "#5CA3E9", // 标签颜色
        	speed: 0.5, //转动速度
        };
        Object.assign(this,Object.assign({},defaluts,option));//合并配置
        this.tag = document.getElementById(id);
        this.element = option.data.map((value,index) => {
        	let para = document.createElement("a");
        	let node = document.createTextNode(value);
        	para.appendChild(node);
        	this.tag.append(para);
        	para.style.color = this.color;
        	return {item:para};
        });
        this.tag.style.width = this.radius * 2 + "px";
        this.tag.style.height = this.radius * 2 + "px";
        this.speed = Number(this.speed);
    	this.speed = this.speed > 1 ? 1 : this.speed;
    	this.speed = this.speed < 0 ? 0 : this.speed;
    	this.angleX = this.speed * Math.PI / 1000;
    	this.angleY = this.speed * Math.PI / 1000;
    	this.falllength = this.radius * 2;
        this.initposition();
        this.animation();
        this.onmouse();
    }
    //设置初始每个标签位置
    initposition(){
    	let itemcount = this.data.length;
 		
    	this.element.map((item,index) => {
    		let k = -1 +(2 * (index + 1) - 1) / itemcount;
    		let a = Math.acos(k);
    		let b = a * Math.sqrt(itemcount * Math.PI);
    		let [x, y, z] = [this.radius * Math.sin(a) * Math.cos(b), this.radius * Math.sin(a) * Math.sin(b), this.radius * Math.cos(a)];
    		
    		Object.assign(item,{x : x, y : y, z : z});
    	});
    }
    //设置运动
    animation(){
    	setInterval(() => {
    		this.rotateX();
    		this.rotateY();
    		this.draw();
    	},15)
    }
    //绘制每个时间段标签的位置
    draw(){
    	this.element.map((item) => {
    		let [left, top, scale, alpha] = [item.x + this.radius + "px", item.y + this.radius + "px", this.falllength/ (this.falllength - item.z), (item.z + this.radius) / (2 * this.radius)];
    		let [fontSize, opacity ,filter ,zIndex] = [15 * scale + "px", alpha +0.5, "alpha(opacity =" + (alpha +0.5) * 100 + ")", parseInt(scale * 100)];
    		item.item.style.cssText +=  "left:"+ left + "; top:" + top + ";font-size" + fontSize +";opacity:" + opacity + ";filter:"+filter+";z-index:"+zIndex+";";
    	})
    }
    //绕X轴转动后的新位置
    rotateX(){
    	let angleX = this.angleX;
    	this.element.map((item) => {
    		let y2 = item.y * Math.cos(angleX) - item.z * Math.sin(angleX);
    		let z2 = item.z * Math.cos(angleX) + item.y * Math.sin(angleX);
			item.y = y2;
			item.z = z2;
    	})
    }
    //绕Y轴转动后的新位置
    rotateY(){
    	let angleY = this.angleY;
    	this.element.map((item) => {
    		let x2 = item.x * Math.cos(angleY) - item.z * Math.sin(angleY);
    		let z2 = item.z * Math.cos(angleY) + item.x * Math.sin(angleY);
			item.x = x2;
			item.z = z2;
    	})
    }
    //监听鼠标移动
    onmouse(){
    	this.tag.addEventListener("mouseover",e =>{
    		console.log(e.offsetX,e.offsetY);
    		this.angleX = (Math.abs(e.offsetY) - this.radius) * this.speed * 0.000025;
    		this.angleY = (Math.abs(e.offsetX) - this.radius) * this.speed * 0.000025;
    	})
    	this.tag.addEventListener("mouseout",e =>{
    		this.angleX = this.speed * Math.PI / 1000;
			this.angleY = this.speed * Math.PI / 1000;
    	})
    // 	this.element.map((item) => {
    // 		item.item.addEventListener("mouseover",e =>{
    // 			this.angleX = 0;
    // 			this.angleY = 0;
    // 		})
    // 		item.item.addEventListener("mouseout",e =>{
    // 			this.angleX = this.speed * Math.PI / 1000;
				// this.angleY = this.speed * Math.PI / 1000;
    // 		})
    // 	})
    }


}
let option={
	data:["要","显","的","标","数","标","内","都","支","用","自","标","的","转","也","可","通","自","来","进","调","不","的","标","需","要","不","的","颜","和","字","大","区","区","开","示","仅","参","样","及","交","方","不","完","实","一","请","代","风","的","整","优","代","中","必","要","注","可","合","使","第","框","类","但","可","使","现","的","功","库"],
	speed:1,
	radius:200,
};

let a = new tagcloud("tagcloud", option);
