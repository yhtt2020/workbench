const tpl = `

<div>
<a-row style="margin-top: 20px">
<a-col :span="12">
<a-row>
<a-col :span="10" style="text-align: right">
<a-avatar style="position: relative;cursor: pointer" :size="60"
                            :src="user.avatar">
                          </a-avatar>
</a-col>
<a-col :span="14" style="padding-left: 20px">
<div style="font-size: 16px;font-weight: bold">{{user.nickname}}</div>
 <div class="live-grade" style="cursor:pointer;">
                              <div class="ts-grade flex justify-start align-center" style="margin-top: 4px" v-if="grade.lv > 0">
                                <div class="ts-grade-crown" v-for="item in grade.crown">
                                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                                </div>
                                <div class="ts-grade-sun" v-for="item in grade.sun">
                                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                                </div>
                                <div class="ts-grade-moon" v-for="item in grade.moon">
                                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                                </div>
                                <div class="ts-grade-star" v-for="item in grade.star">
                                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                                </div>
                              </div>
                              <div v-else class="ts-grade flex justify-start align-center" style="margin-top: 4px; color: #B6B6B6">
                                剩余{{remainHour}}小时{{remainMinute}}分达到1级
                              </div></div>
</a-col>

</a-row>
<a-row>
<div class="arrow-box" style="width: 330px;height: 305px;line-height: 3">
 <div class="text-black" style="line-height: 2;margin-bottom: 5px">在线等级: <span style="font-size: 20px">{{grade.lv}}</span>级


 <div v-if="badge.rank < 300" style="background-color: white;margin-top:7px;border-radius: 6px;border: 1px solid #c1c1c1;padding: 2px 5px;position: absolute;display: inline-block;right: 65px;line-height: 18px"


 ><span >
                                   全网排名:<span style="font-size: 20px"> {{badge.rank}}</span>
</span></div><div v-else>全网排名: 超过{{grade.percentage}}%的用户</div>

 </div>
                                  <div class="text-grey" style="line-height: 2">升级剩余时长: {{remainHour}}小时{{remainMinute}}分</div>
                                  <div class="text-grey" style="line-height: 2">累计在线时长: {{grade.cumulativeHours}}小时{{grade.cumulativeMinutes}}分</div>
                                 <div class="badge-box" :style="{'border-color':this.getBadge().color}" >
<a-row>
<a-col :span="10">
<img style="width: 75px;margin-top: 10px" :src="'./assets/badge/'+getBadge().badge+'.png'">
<div v-if="badge.rank<100" class="badge-num" :style="{'background-color':this.getBadge().color}">{{badge.rank}}</div>
</a-col>
<a-col  :span="14">
<div style="font-size: 16px;font-weight: bold;">{{getBadge().title}}</div>
<div class="text-grey">{{getBadge().summaryNames}}</div>
<div class="text-grey">{{getBadge().summaryDes}}</div>
</a-col>
</a-row>
</div>
</div>
</a-row>
</a-col>
<a-col :span="12" style="padding-left: 20px">
<div style="border-left: 1px solid rgb(239 239 239);
    height: 385px;
    margin-top: 0px;
    display: inline-block;
    position: absolute;
    margin-left: -22px;"></div>
<h2 style="text-align: center;margin-top: 20px"><img src="./assets/level.svg" style="width: 26px;vertical-align: text-top"> 在线等级</h2>
<p>
启动想天浏览器主程序的情况下即可升级。<br>
无需打开元社区、轻聊。
</p>
<p>
排名展示规则：<br>
300名以内，展示名次<br>
300名以外，展示比例
</p>
<div class="card-tip">
<div class="tip">距离上一名 ： {{distance}}</div>
<div>剩余{{times}}张 「查看卡」</div>
<div>
<a-button :disabled="this.times===0" @click="use" type="primary" style="margin-top: 10px">查看上一名距离</a-button>
</div>
</div>
</a-col >
</a-row>
</div>

  `
Vue.component('gradePanel', {
  template: tpl,
  name: 'grade-panel',
  props: {
    grade: {},
    user: {}
  },
  data () {
    return {
      remainHour: '',
      remainMinute: '',
      times:2,
      distance:'未知',

      badge:{
        t9999:{
          badge:'silver-b',
          title:'默默无闻',
          summaryNames:'全网300名开外',
          summaryDes:'初出茅庐。',
          color:'#c1c1c1'
        },

        t300:{
          badge:'tstruck-b',
          title:'崭露锋芒',
          summaryNames:'全网前300名',
          summaryDes:'崭露锋芒，潜力无限！',
          color:'#9CA5CB'
        },
        t100:{
          badge:'bronzec-b',
          title:'实力非凡',
          summaryNames:'全网前100名',
          summaryDes:'不容小觑，成长惊人！',
          color:'rgb(196 85 35)'
        },
        t50:{
          badge:'silverc-b',
          title:'出类拔萃',
          summaryNames:'全网前50名',
          summaryDes:'能力过人，摧枯拉朽！',
          color:'rgb(159 183 204)'
        },
        t20:{
          badge:'goldc-b',
          title:'惊为天人',
          summaryNames:'全网前20名',
          summaryDes:'超强实力，惊天动地！',
          color:'rgb(201 126 7)'
        },
        t5:{
          badge:'platinumc-b',
          title:'超神',
          summaryNames:'全网前5名',
          summaryDes:'前无古人，后无来者！',
          color:'rgb(64 116 231)'
        },
        rank:0,
      }
    }
  },
  mounted () {
    let lv = this.grade.lv
    let section = this.gradeTableGenerate(64)[lv + 1]
    let remain = section[0] * 60 - this.grade.cumulativeMinute
    this.remainHour = Math.floor(remain / 60)
    this.remainMinute = remain - (Math.floor(remain / 60) * 60)
    this.times=this.getTimes()
  },

  methods: {
    getBadge(){
      let rank=this.grade.rank
      this.badge.rank=rank
      if(rank>300){
        return this.badge.t9999
      }else if(rank<5){
        return this.badge.t5
      }else if(rank<20){
        return this.badge.t20
      }else if(rank<50){
        return this.badge.t50
      }else if(rank<100){
        return this.badge.t100
      }else if(rank<=300){
        return this.badge.t300
      }
    },

    getTimes(){
     let str=this.getDateStr()
      let times=localStorage.getItem(str)
       times=Number(times===null?2:times)
      this.times=times
      return times
    },
    getDateStr(){
      let date=new Date(Date.now())
      let str=date.getFullYear()+'_'+date.getMonth()+"_"+date.getDay()+'_'+this.user.uid
      return str
    },
    setTimes(times){
      let str=this.getDateStr()
      localStorage.setItem(str,Number(times))
    },
    use(){
      let times=this.getTimes()
      if(times<=0){
        antd.message.error('剩余道具不足，无法使用。')
        return false
      }
      else{
        let confirm=antd.Modal.confirm({
          content:'是否使用道具？',
          okText:'使用',
          centered:true,
          cancelText:'取消',
          onOk:()=>{
            times--
            this.times=times
            this.setTimes(times)
            this.distance= (this.grade.distance /60).toFixed(0) +'小时' + this.grade.distance%60+'分'
            antd.message.success('已为您查看前一名距离。')
            confirm.destroy()
            return true
          }
        })

      }
    },


    gradeTableGenerate (num) {
      let lvSys = {}
      for (let i = 0; i < num + 1; i++) {
        let arrLef = 0
        let arrRg = 0
        for (let j = 0; j < i; j++) {
          arrLef += 10 * (j + 2)
        }
        for (let k = 0; k < i + 1; k++) {
          arrRg += 10 * (k + 2)
        }
        arrRg -= 1
        lvSys[`${i}`] = [arrLef, arrRg]
      }
      delete lvSys['lv0']
      return lvSys
    },
  }
})
