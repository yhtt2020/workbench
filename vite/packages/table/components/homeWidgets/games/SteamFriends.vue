<template>
  <HomeComponentSlot :options="options" :customData="customData" :customIndex="customIndex">
      <div class="mt-5 my-friends">
        <div v-for="item in avatarList" class="pointer avatar-item">
          <a-avatar shape="square" :size="48" :src="item.url"  class="mb-4 rounded-md" style="border:3px solid rgba(82, 196, 26, 1);"></a-avatar>
        </div>
      </div>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
export default {
  name:'SteamFriends',
  components:{
    HomeComponentSlot
  },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    }
  },
  data(){
    return{
      options: {
        className: 'card small',
        title: 'Steam好友',
        icon: 'steam',
        type: 'games',
      },
      avatarList:[
        {
          url:'https://img.js.design/assets/img/62d55fffcd17e6382247fd75.png'
        },
        {
          url:'https://img.js.design/assets/img/63be28cdfff5f0030255a405.png'
        },
        {
          url:'https://img.js.design/assets/img/6204c84966d3a142bc89492b.png'
        },
        {
          url:'https://img.js.design/assets/img/63be28cdfff5f0030255a405.png'
        },
        {
          url:'https://img.js.design/assets/img/61934e73d2c3fe6c76e06328.png',
        },
        {
          url:'https://img.js.design/assets/img/61934e6b3404f55df2bb23af.png',
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.my-friends{
  display: grid;
  grid-template-columns: repeat(3,0.35fr);
  grid-gap: 10px;
  justify-content: center;
  align-items: center;
}
.avatar-item{
  display: flex;
  align-items: center;
  justify-content: center;
  margin:  0  auto;
}
</style>