<template>
    <HomeComponentSlot :options="options">
      <template v-if="!newPeoplePage">
        <div class="flex justify-between s-item p-4 rounded-lg" style="margin-top: 1em;">
          <div>
            <div style="color: rgba(255,255,255,0.85); font-size: 16px; font-weight: 600;">{{ signedIn ? '今日已签到' : '今日未签到' }}</div>
            <span style="color: rgba(255,255,255,0.60); font-size: 14px;">已连续签到2天</span>
          </div>
          <div @click="signIn" class="middle-button sign-in-btn s-item" :class="signedIn ? (completeLikes.length > 4 ? 'already' : 'new-people') : 'old-people'">{{ signedIn ? (completeLikes.length > 4 ? '已签到' : '每日迎新') : '签到' }}</div>
        </div>
        <HorizontalPanel :navList="signInTitle" v-model:selectType="signInType" :height="44"  class="mt-3"></HorizontalPanel>
        <div v-if="signInType.name === 'today'" class="flex flex-col overflow content-box pt-1">
          <!-- <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:210px;"> -->
            <div v-if="!todayList.length" class="not-sign h-full flex justify-center items-center">还没有人签到，快来抢第一</div>
            <div v-else v-for="item in todayList" :key="item.id" class="w-full flex items-center rounded-lg justify-between pointer set-type" style="margin: 6px 0 6px;">
              <span class="ranking">{{ item.id }}</span>
              <div class="flex-1 flex ml-3 items-center">
                <a-avatar>
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <div class="ml-3 truncate" style="color: rgba(255,255,255,0.85);font-size: 16px;max-width: 120px;">{{ item.username }}</div>
              </div>
              <div style="color: rgba(255,255,255,0.60);font-size: 16px;">{{ item.time }}</div>
            </div>
          <!-- </vue-custom-scrollbar> -->
        </div>
        <div v-else class="flex flex-col overflow content-box pt-1">
          <!-- <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:210px;"> -->
            <div v-for="item in accrueList" :key="item.id" class="w-full flex items-center rounded-lg justify-between pointer mt-3 set-type" style="margin: 6px 0 6px;">
              <span class="ranking">{{ item.id }}</span>
              <div class="flex-1 flex ml-3 items-center">
                <a-avatar>
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <div class="ml-3 truncate" style="color: rgba(255,255,255,0.85);font-size: 16px;max-width: 110px;">{{ item.username }}</div>
              </div>
              <div style="color: rgba(255,255,255,0.60);font-size: 16px;">{{ item.accumulate }}</div>
            </div>
          <!-- </vue-custom-scrollbar> -->
        </div>
        <div class="integral-modal s-bg" v-if="toggleModal">
          <img class="modal-icon" src="../../../../public/img/test/s-good.png" alt="">
          <span class="modal-number">+2积分</span>
        </div>
      </template>
      <template v-else>
        <div class="s-item rounded-lg" style="margin-top: 1em;padding: 10px 12px 15px;">
          <span class="test" style="color: rgba(255,255,255,0.85);font-size: 14px;">点击用户头像，为社区新人点赞，每日完成 5 个「迎新签到」可获得 n 倍签到奖励。</span>
          <div class="mt-1" style="color: rgba(255,255,255,0.60);font-size: 14px;">今日已为{{ completeLikes.length }}位社区新人点赞</div>
        </div>
        <div class="mt-3" style="height:178px; overflow:hidden;">
          <div class="text-center mb-1" style="color: rgba(255,255,255,0.60);font-size: 14px;">今日新人</div>
          <div class="head-list">
            <div v-for="item in newPeopleList" :key="item.id" style="margin:8px 14px;" @click="newLikes(item)">
              <a-avatar :size="56">
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </div>
          </div>
        </div>
        <div class="integral-modal" v-if="test">
          <img class="modal-icon" src="../../../../public/img/test/s-good.png" alt="">
        </div>
        <div class="flex items-center justify-around">
          <div @click="signInBack"
                class="s-item change cursor-pointer rounded-lg w-12 h-12 flex items-center justify-center">
            <Icon icon="xiangzuo" style="font-size: 1.715em;color: rgba(255, 255, 255, 0.85);"></Icon>
          </div>
          <span class="change pointer rounded-lg s-item  flex items-center justify-center" 
          style="padding:13px 74px;color: rgba(255, 255, 255, 0.85);"
          >
            换一换
          </span>
        </div>
      </template>
    </HomeComponentSlot>
</template>

  <script>
  import HomeComponentSlot from "./HomeComponentSlot.vue";
  import HorizontalPanel from '../HorizontalPanel.vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  export default {
    name: 'SingIn',
    components:{
      HomeComponentSlot,
      HorizontalPanel,
      UserOutlined
    },
    data(){
      return {
        options:{
          className: 'card',
          title: '签到（开发中）',
          icon: 'sound',
          type: 'signIn'
        },
        signInTitle:[{title:'今日签到榜',name:'today'},{title:'累积签到榜',name:'accrue'}],
        signInType:{title:'今日签到榜',name:'today'},
        todayList: [
          {id: 1,headSculpture: '',username: '阳光小葵',time: '00:01'},
          {id: 2,headSculpture: '',username: '猫星人',time: '00:02'},
          {id: 3,headSculpture: '',username: '猫爪咖啡87865453423',time: '12:59'},
          {id: 4,headSculpture: '',username: '猪猪人',time: '00:04'},
          {id: 5,headSculpture: '',username: '彩虹马',time: '00:05'},
          {id: 6,headSculpture: '',username: '彩虹马',time: '00:06'},
          {id: 7,headSculpture: '',username: '彩虹马',time: '12:59'}
        ],
        // todayList: [],
        accrueList: [
          {id: 1,headSculpture: '',username: '外太空的狗',accumulate: '345天'},
          {id: 2,headSculpture: '',username: '猫星人',accumulate: '300天'},
          {id: 3,headSculpture: '',username: '晒太阳的猫',accumulate: '1266天'},
          {id: 4,headSculpture: '',username: '猪猪人',accumulate: '240天'},
          {id: 5,headSculpture: '',username: '彩虹马',accumulate: '160天'}
        ],
        settingsScroller: {
          useBothWheelAxes: true,
          swipeEasing: true,
          suppressScrollY: false,
          suppressScrollX: true,
          wheelPropagation: true
        },
        signedIn: false,
        toggleModal: false,
        newPeoplePage: false,
        newPeopleList: [
          {id: 1,headSculpture: '',username: '外太空的狗'},
          {id: 2,headSculpture: '',username: '猫星人'},
          {id: 3,headSculpture: '',username: '晒太阳的猫'},
          {id: 4,headSculpture: '',username: '猪猪人'},
          {id: 5,headSculpture: '',username: '彩虹马'},
          {id: 6,headSculpture: '',username: 'yyq'}
        ],
        completeLikes: [],
        test: false
      }
    },
    methods:{
      signIn(){
        if(!this.signedIn){
          this.toggleModal = true
          setTimeout(() => {
            this.toggleModal = false
          }, 1000);
          this.signedIn = true
        }else{
          this.newPeoplePage = true
        }
      },
      signInBack(){
        this.newPeoplePage = false
      },
      newLikes(item){
        if(this.completeLikes.length){
          if(!this.completeLikes.find(info => info.id === item.id)){
            this.completeLikes.push(item)
            this.test = true
            setTimeout(() => {
              this.test = false
            }, 500);
          }  
        }else{
          this.completeLikes.push(item)
          this.test = true
          setTimeout(() => {
            this.test = false
          }, 500);
        }
        
        console.log(this.completeLikes)
       
      }
    }
  }
  </script>

  <style scoped lang="scss">
    .sign-in-btn {
      width: 91px;
      height: 48px;
      background: #508BFE;
      font-size: 18px;
      line-height: 48px;
      text-align: center;
      &:hover {
        opacity: 0.8;
        // font-weight: bold;
        cursor: pointer;
      }
    }
    .old-people{
      background: #508BFE;
    }
    .new-people{
      background: #3CA10B;
    }
    .already{
      background: rgba(0,0,0,0.30);
    }
    .ranking{
      width: 24px;
      height: 24px;
      text-align: center;
      background: rgba(0,0,0,0.30);
      border-radius: 4px;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      font-weight: 600;
    }
    .integral-modal{
      z-index: 999;
      position: fixed;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      width: 160px;
      height: 160px;
      margin: auto;
      border-radius: 24px;
      .modal-icon{
        width: 64px;
        height: 64px;
      }
      .modal-number{
        font-size: 16px;
        color: rgba(255,255,255,0.85);
        font-weight: 600;
        margin-top: 14px;
      }
    }
    .content-box{
      height: 220px;
      overflow: hidden;
    }
    .set-type:nth-of-type(1)>span{
      background: #FE2C46;
    }
    .set-type:nth-of-type(2)>span{
      background: #FF6600;
    }
    .set-type:nth-of-type(3)>span{
      background: #FAAA10;
    }
    .test{
      word-break: normal;
      display: block;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
      font-size: 14px;
      color: rgba(255,255,255,0.85);
    }
    .head-list{
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      // margin: 16px 16px 0;
    }
    .not-sign{
      font-size: 14px;
      color: rgba(255,255,255,0.60);
      text-align: center;
    }
    .nav-list-container{
      box-shadow: none !important;
      background: rgba(255, 255, 255, 0.2) !important;
    }
    
    ::v-deep .ant-slider-track{
      background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
    }
    .item-name{
      word-break: normal;
      display: block;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
    }
    .active-index{
      background: rgba(32, 32,32, 1);
      border-radius: 8px;
    }
    ::v-deep .ps__thumb-y{
      display: none !important;
    }
  </style>
