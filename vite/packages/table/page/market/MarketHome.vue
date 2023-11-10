<template>
  <transition name="fade">
    <div class="" style="
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 999;
      " v-if="visibleAdd">
      <NewAddCard @setCustoms="hideAddCard" @close="hideAddCard" :desk="currentDesk" :panelIndex="panelIndex"></NewAddCard>
    </div>
  </transition>
  <div class="box">
    <div @click="onBack" class="pointer button-active xt-mask h-12 w-12 flex items-center rounded-lg justify-center mr-3">
      <Icon icon="xiangzuo" style="font-size: 1.5em;color:var(--primary-text)"></Icon>
    </div>
    <div class="box-content">
      <div class="con-body">
        <div v-for="m in marketList" :key="m.title" class="con-item" @click="jumpMarket(m.type,m)">
            <a-avatar shape="square" :src="m.imgBack" class="w-full h-full object-cover item-back" style="" alt=""></a-avatar>
            <div class="item-content">
              <div class="item-head">
                <p>{{ m.title }}<span>{{ m.title }}</span></p>
                <Icon icon="xiangyou" class="mt-2" style="font-size: 1.5em;color:var(--secondary-text)"></Icon>
              </div>
              <!-- <div class="item-body">

              </div> -->
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import NewAddCard from "../app/card/NewAddCard.vue"
import { appStore } from '../../store';
import { cardStore } from '../../store/card'
export default {
  components: {
    NewAddCard
  },
  data() {
    return {
      marketList: [
        {
          imgBack: '/img/market/cool_app.png',
          title: '酷应用',
          children: [],
          type: 'cool'
        },
        {
          imgBack: '/img/market/card.png',
          title: '桌面小组件',
          children: [],
          type: 'card'
        },
        {
          imgBack: '/img/market/desk.png',
          title: '桌面市场',
          children: [],
          type: 'desk'
        },
        {
          imgBack: '/img/market/deck.png',
          title: '快捷指令',
          children: [],
          // route: {
          //   name: 'deck'
          // },
          // type: 'route',
          type: 'deck'
        },
        {
          imgBack: '/img/market/prop.png',
          title: '道具市场',
          children: [],
          route: {
            name: 'prop'
          },
          type: 'route'
        },
        // {
        //   imgBack: '/img/market/key.png',
        //   title: '快捷键市场',
        //   children: [],
        //   route: {
        //     name: 'creativeMarket',
        //   },
        //   type: 'route'
        // },
      ],
      visibleAdd: false
    }
  },
  methods: {
    onBack(){
      this.fullScreen = false
      this.$router.go(-1)
    },
    jumpMarket(val,market){
      switch(val){
        case 'route':
          this.fullScreen = false
          // if(market.route.name === 'prop'){
          //   window.toggleFrameStore()
          // }
          this.$router.push(market.route)
          break;
        case 'card':
        this.panelIndex = 0
          this.fullScreen = false
          this.visibleAdd = true
          break;
        case 'desk':
          this.fullScreen = false
          this.panelIndex = 1
          this.visibleAdd = true;
          this.addDeskVisible = false;
          break;
      }
    },
    newAddCard() {
      this.panelIndex = 0
      this.visibleAdd = true;
      this.menuVisible = false;
    },
    hideAddCard() {
      this.fullScreen = true
      this.visibleAdd = false
    },
  },
  mounted() {
    this.fullScreen = true
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
    ...mapWritableState(cardStore, [
      "settings",
      "desks",
      "currentDeskIndex",
    ]),
    currentDesk() {
      let find = this.desks.find((desk) => {
        return desk.nanoid === this.currentDeskIndex.name;
      });
      if (find) {
        find.cards.forEach((e) => {
          if (!e.data) {
            e.data = {};
          }
          if (!e.customData) {
            e.customData = {}
          }
        });
        return find;
      } else {
        return {
          cards: [],
        };
      }
    },
  },
} 
</script>


<style scoped lang="scss">
  .box{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--primary-bg);
    padding: 12px;
    .box-content{
      width: 100%;
      height: 90%;
      display: flex;
      justify-content: center;
      align-items: center;
      .con-body{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 1200px;
        height: 80%;
        overflow: auto;
        .con-item{
          width: 320px;
          height: 200px;
          position: relative;
          cursor: pointer;
          margin: 0 12px 24px;
          .item-back{
            position: absolute;
            width: 320px;
            height: 200px;
          }
          .item-content{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 2;
            padding: 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .item-head{
              width: 100%;
              display: flex;
              justify-content: space-between;
              p{
                width: 100%;
                font-size: 24px;
                color: var(--primary-text);
                position: relative;
                margin-top: 10px;
                letter-spacing: 1px;
                span{
                  opacity: 0.25;
                  position: absolute;
                  font-size: 32px;
                  top: -20px;
                  left: 0px;
                }
              }
            }
            .item-body{
              background: var(--mask-bg);
              border-radius: 12px;
              width: 288px;
              height: 78px;
            }
          }
        }
      }
    }
  }
  .con-body::-webkit-scrollbar{
    display: none;
  }
</style>
