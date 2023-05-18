<template>
    <HomeComponentSlot :options="options">
      <div>
        <div class="flex justify-between s-item p-4 mt-3 rounded-lg">
          <div>
            <div style="color: rgba(255,255,255,0.85); font-size: 16px; font-weight: 600;">{{ signedIn ? '今日已签到' : '今日未签到' }}</div>
            <span style="color: rgba(255,255,255,0.60); font-size: 14px; font-weight: 400;">已连续签到2天</span>
          </div>
          <div @click="signIn" class="middle-button sign-in-btn s-item" :class="signedIn ? 'new-people' : 'old-people'">{{ signedIn ? '每日迎新' : '签到' }}</div>
        </div>
        <HorizontalPanel :navList="signInTitle" v-model:selectType="signInType" :height="44"  class="mt-4"></HorizontalPanel>
        <div v-if="signInType.name === 'today'" class="flex flex-col overflow">
          <!-- <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:210px;"> -->
            <div v-if="!todayList.length" class="not-sign h-full flex justify-center items-center">还没有人签到，快来抢第一</div>
            <div v-else v-for="item in todayList" :key="item.id" class="w-full flex items-center rounded-lg justify-between pointer mt-3 set-type">
              <span class="ranking">{{ item.id }}</span>
              <div class="flex-1 flex ml-3 items-center">
                <a-avatar>
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <div class="ml-3" style="color: rgba(255,255,255,0.85);font-size: 16px;">{{ item.username }}</div>
              </div>
              <div style="color: rgba(255,255,255,0.60);font-size: 16px;">{{ item.time }}</div>
            </div>
          <!-- </vue-custom-scrollbar> -->
        </div>
        <div v-else class="flex flex-col">
          <!-- <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:210px;"> -->
            <div v-for="item in accrueList" :key="item.id" class="w-full flex items-center rounded-lg justify-between pointer mt-3 set-type">
              <span class="ranking">{{ item.id }}</span>
              <div class="flex-1 flex ml-3 items-center">
                <a-avatar>
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <div class="ml-3" style="color: rgba(255,255,255,0.85);font-size: 16px;">{{ item.username }}</div>
              </div>
              <div style="color: rgba(255,255,255,0.60);font-size: 16px;">{{ item.accumulate }}</div>
            </div>
          <!-- </vue-custom-scrollbar> -->
        </div>
        <div class="integral-modal" v-if="toggleModal">
          <div class="modal-icon"></div>
          <span class="modal-number">+2积分</span>
        </div>
      </div>
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
          title: '签到',
          icon: 'sound',
          type: 'signIn'
        },
        signInTitle:[{title:'今日签到榜',name:'today'},{title:'累积签到榜',name:'accrue'}],
        signInType:{title:'今日签到榜',name:'today'},
        todayList: [
          {id: 1,headSculpture: '',username: '阳光小葵',time: '00:01'},
          {id: 2,headSculpture: '',username: '猫星人',time: '00:01'},
          {id: 3,headSculpture: '',username: '猫爪咖啡',time: '00:01'},
          {id: 4,headSculpture: '',username: '猪猪人',time: '00:01'},
          {id: 5,headSculpture: '',username: '彩虹马',time: '00:01'},
          {id: 6,headSculpture: '',username: '彩虹马',time: '00:01'},
          {id: 7,headSculpture: '',username: '彩虹马',time: '00:01'}
        ],
        // todayList: [],
        accrueList: [
          {id: 1,headSculpture: '',username: '外太空的狗',accumulate: '345天'},
          {id: 2,headSculpture: '',username: '猫星人',accumulate: '300天'},
          {id: 3,headSculpture: '',username: '晒太阳的猫',accumulate: '266天'},
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
        signedIn:false,
        toggleModal: false
      }
    },
    methods:{
      signIn(){
        if(!this.signedIn){
          this.toggleModal = true
          setTimeout(() => {
            this.toggleModal = false
          }, 1500);
          this.signedIn = true
        }else{

        }
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
      font-weight: 400;
      line-height: 48px;
      text-align: center;
      &:hover {
        opacity: 0.8;
        font-weight: bold;
        cursor: pointer;
      }
    }
    .old-people{
      background: #508BFE;
    }
    .new-people{
      background: #3CA10B;
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
      display: none;
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
      background: rgba(0,0,0,0.65);
      box-shadow: 0px 20px 20px 0px rgba(0,0,0,0.49);
      border-radius: 24px;
      .modal-icon{
        width: 64px;
        height: 64px;
        background: rgb(240, 197, 197);
      }
      .modal-number{
        font-size: 16px;
        color: rgba(255,255,255,0.85);
        font-weight: 600;
        margin-top: 14px;
      }
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
    .not-sign{
      font-size: 14px;
      color: rgba(255,255,255,0.60);
      text-align: center;
      font-weight: 400;
    }
    .test{
      overflow: hidden;
    }
    .nav-list-container{
      box-shadow: none !important;
      background: rgba(255, 255, 255, 0.2) !important;
    }
    ::v-deep .home-widgets .card{
      overflow: hidden !important;
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
  