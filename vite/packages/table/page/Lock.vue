<template>
<div @click="enter" style="position:relative;">
  <div v-if="loaded" style="margin-top: 15%;z-index: 9;position: absolute;font-size: 2em;color: white;text-shadow: 0 0 2em #000;left: 50%;margin-left: -4em;text-align: center">
    <span style="font-size: 3.5em">{{hours}}:{{minutes}}</span><br>
    {{ year}}年{{month}}月{{day}}日 {{week}}
  </div>
 <img :src="wallPaper" style="width: 100vw;height: 100vh;object-fit: cover">

</div>
</template>

<script>
export default {
  name: 'Lock',
  data(){
    return {
      loaded:false,
      year:0,
      month:0,
      day:0,
      hours:0,
      minutes:0,
      seconds:0,
      week:'',
      timer:null,
      date:"2023年2月11日 周四",
      time:' 14:51 ',
      wallPaper:'https://ts1.cn.mm.bing.net/th/id/R-C.653b2eb4ae081875675c6d25a69834b0?rik=p%2fCn01vlMrCUxQ&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1208%2f02%2fc0%2f12659156_1343874598199.jpg&ehk=d8OPA9%2bWy7YX9FLF95st3Rmd8lG6XtopCz0uNZAbebs%3d&risl=&pid=ImgRaw&r=0'
    }
  },
  mounted(){
    this.tick()
    if(!this.timer){
      this.timer=setInterval(()=>{
        this.tick()
      },1000)
    }
  },
  methods:{
    tick(){
      let  weeks=['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
      var date=new Date()
      this.year=date.getFullYear()
      this.month=date.getMonth()+1
      this.day=date.getDate()
      this.hours=date.getHours()

      this.minutes=date.getMinutes()
      if(this.minutes<10){
        this.minutes='0'+this.minutes
      }
      this.seconds=date.getSeconds()
      this.week=weeks[date.getDay()-1]
      this.loaded=true
    },
    enter(){
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>

</style>
