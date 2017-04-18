<template>
  <div class="fmbox">
    <div class="audio">
      <div class="title">{{title}}</div>
      <div class="singer">{{singer}}</div>
      <div class="control-sm">
        <span class="time"><span id="current">00:00</span>/{{musicTime}}</span>
        <span class="voice"><i :class=voiceclass aria-hidden="true"></i>
          <div class="voicebox">
            <div class="voicebar">
              <div class="voiceslide"></div>
            </div>
          </div>
        </span>
        <!-- <button class="download" @click="download"><i class="fa fa-download" aria-hidden="true"></i></button> -->
      </div>
      <div class="progress">
        <div class="progress-highlight"></div>
      </div>
      <div class="control">
        <!-- <button class="star"><i class="fa fa-star-o" aria-hidden="true"></i></button> -->
        <button class="delete" @click="deletesong"><i class="fa fa-trash" aria-hidden="true"></i></button>
        <div class="listcontrol">
          <button class="backward" @click="backward"><i class="fa fa-step-backward" aria-hidden="true"></i></button>
          <button class="pause" @click="pause"><i :class="['fa',pauseclass? 'fa-pause':'fa-play']" aria-hidden="true"></i></button>
          <button class="forward" @click="forward"><i class="fa fa-step-forward" aria-hidden="true"></i></button>
        </div>
      </div>
      <audio :src=source id="music" preload="preload">
        Your browser does not support the audio tag.
      </audio>
    </div>
    <div class="cover">
      <img :src=coversourse alt="" class="circle-img" id="cover">
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      seq:0,
      songlist:[
        {
          title:"蝴蝶",
          singer:"王菲"
        },
        {
          title:"后来的我们",
          singer:"五月天"
        },
        {
          title:"我喜欢上你时的内心活动",
          singer:"陈绮贞"
        }
      ],
      musicTime:"00:00",
      pauseclass:false,
      voice:1.0,
      voicetemp:1.0,
      width:430,
      voicewidth:55
      
    }
  },
  mounted:function(){
    this.cover=document.getElementById("cover");
    this.music=document.getElementById("music");
    this.current=document.getElementById("current");
    this.progressbar=document.querySelector(".progress-highlight");
    this.progress=document.querySelector(".progress");
    this.voicebar=document.querySelector(".voicebar");
    this.voiceslide=document.querySelector(".voiceslide");
    this.voiceicon=document.querySelector(".voice i");
    this.width=430;
    this.voicewidth=55;
    this.music.addEventListener('loadedmetadata', e => {
        this.musicTime=this.timeparse(this.music.duration);
        this.voiceslide.style.width=parseInt(this.music.volume*this.voicewidth)+"px";
    })
    var that=this;
    this.music.addEventListener('play', e => {
        var parse=this.timeparse;
        setInterval(function(){
          this.current.innerHTML=parse(this.music.currentTime);
          that.progressbar.style.width=parseInt(this.music.currentTime/this.music.duration*that.width)+"px";
        },300);    
    })
    this.music.addEventListener('ended',e=>{
      this.forward();
    })
    this.voicebar.addEventListener("click",e=>{
        this.music.volume=e.offsetX/this.voicewidth;
        this.voice=this.music.volume;
        this.voiceslide.style.width=parseInt(e.offsetX)+"px";
    })
    this.voiceicon.addEventListener("click",e=>{
        var that=this;
        if(this.voiceicon.className=="fa fa-volume-off"){
          that.music.volume=that.voice=that.voicetemp;//打开声音时从之前的temp中取值；
          this.voiceslide.style.width=parseInt(that.music.volume*this.voicewidth)+"px";
        }else{
          that.music.volume=0;
          that.voicetemp=that.voice;//在禁止前先把当前的音量赋给temp
          that.voice=0;
          this.voiceslide.style.width="0";
        }
    })

  },
  computed:{
    title:function(){
      return this.songlist[this.seq].title;
    },
    singer:function(){
      return this.songlist[this.seq].singer;
    },
    source:function(){
      return "./static/audio/"+this.title+".mp3";
    },
    coversourse:function(){
      return "./static/imgs/"+this.title+".jpg";
    },
    seq:function(){
      return this.seq;
    },
    current:function(){
      return this.currentTime;
    },
    musicTime:function(){
      return this.musicTime;
    },
    voiceclass:function(){
      if(this.voice>=0.8){
          return "fa fa-volume-up";
        }else if(this.voice>0 && this.voice<0.8){
          return "fa fa-volume-down";
        }else{
          return "fa fa-volume-off";
      }
    }

  },
  methods:{
    pause:function(){
      if (this.music.paused){ 
        this.play();
      }else{
        this.music.pause();
        this.pauseclass=false; 
        this.cover.style.animationPlayState="paused";
        this.cover.style.WebkitAnimationPlayState="paused";
      }
    },
    forward:function(){
      if(this.seq==(this.songlist.length-1)){
        this.seq=0;
      }else{
        this.seq++;
        this.music.addEventListener('loadedmetadata', e => {
          this.play();
        })
      }
    },
    backward:function(){
      if(this.seq==0){
        this.seq=this.songlist.length-1;
      }else{
        this.seq--;
        this.music.addEventListener('loadedmetadata', e => {
          this.play();
        })
      }
    },
    deletesong:function(){
      if(this.songlist.length>1){
        this.songlist.splice(this.seq,1);
        if(this.seq==this.songlist.length){
          this.seq=0;
        }
      }
      
    },
    timeparse:function(time){
        time=Math.floor(time);
        var temp;
        var m=(temp=parseInt((time/60)).toString()).length==1?('0'+temp):temp;
        var s=(temp=parseInt((time%60)).toString()).length==1?('0'+temp):temp;
        return m+":"+s;
    },
    play:function(){
      this.music.play();
      this.pauseclass=true;
      this.cover.style.animationPlayState="running";
      this.cover.style.WebkitAnimationPlayState="running";
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fmbox{
  width:720px;
  height: 240px;
  margin:50px auto;
  display: flex;
  padding:0 0 40px 0;
}
.audio{
  width: 430px;
  margin-right: 50px;
}
.cover{
  height: 240px;
  width: 240px;
  overflow: hidden;
}
.circle-img{
  width: 240px;
  height: 240px;
  border-radius: 50%;
  overflow: hidden;
  animation:coverplay 60s linear infinite;
  animation-play-state: paused;
}
.title{
  font-size: 25px;
  font-weight: 400;
  color: rgb(3, 3, 3);
  line-height: 1.28;
  margin-top:20px;
  margin-bottom: 10px;
}
.singer{
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  color: rgb(74, 74, 74);
  margin-bottom: 12px;
}
.control-sm{
  margin-bottom: 4px;
}
.time{
  color: rgb(155, 155, 155);
  font-weight: 400;
  margin-right: 10px;
  display: inline-block;
  font-size: 10px;
}
.download{
  float: right;
  color: rgb(155, 155, 155);
  font-weight: 100;
  margin-right: 10px;
  display: inline-block;
  font-size: 16px;
  border: none;
  outline: none;
  background-color: transparent;
}

.progress{
  width: 430px;
  height: 1px;
  border-radius: 1px;
  background-color:#DADADA;
  position: relative;
  margin-bottom: 50px;
}
.progress-highlight{
  height: 1px;
  border-radius: 1px;
  background-color: #6BBD7A;
  width: 0px;
  top:0;
  left: 0px;
}
.control button{
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 30px;
  color:#919191;
  
}
.pause{
  width: 35px;
}
.star{
  margin-right: 30px;
}
.listcontrol{
  float: right;
}
.backward, .pause{
  margin-right: 20px;
}
.voice{
  color:#919191;
  font-size: 13px;
  display: inline-block;
  position: relative;
  overflow:hidden;
  height: 13px;
}
.voice:hover .voicebox{
  animation:voiceslide 0.5s ease;
  animation-fill-mode :forwards;
}
.voice i{
  width: 10px;
}
.voicebox{
  width: 55px;
  display: inline-block;
  margin-right: -55px;
  cursor: pointer;
}
.voicebar{
  display: inline-block;
  vertical-align: middle;
  width: 55px;
  height: 3px;
  background: #DADADA;
  border-radius: 1px;
  position:relative;
}
.voiceslide{
  height: 3px;
  border-radius: 1px;
  background-color: #6BBD7A;
  width: 2px;
  top:0;
  left: 0px;
  position: absolute;
}
@keyframes coverplay
{
from {transform: rotate(0deg);}
to {transform: rotate(360deg);}
}
@keyframes voiceslide
{
  from {margin-right: -55px;}
  to {margin-right: 0px;}
}
</style>
