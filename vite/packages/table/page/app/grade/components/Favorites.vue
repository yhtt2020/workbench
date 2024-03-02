<template>
  <div class="text-center font-16 xt-text" style="padding-top: 140px;">导入浏览器收藏夹</div>
  <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">你可以选择导入浏览器收藏夹，在桌面上快速访问你收藏的网站。</div>
  <div class="flex justify-center mt-8">
    <div  v-for="(item,index) in browser" class="card-content xt-bg-2 flex items-center pl-4 pointer" @click="changeHandle(item.value)" :class="index!=0?'ml-4':'',browserList[item.value]?'select-bg':''">
      <a-avatar :size="56" shape="square" :src="item.url" />
      <div class="ml-4 font-16 xt-text">{{ item.name }}</div>
    </div>
  </div>
  <!-- <div style="color: #508BFE;" class="mt-8 text-center font-16 ">其他浏览器？</div> -->
</template>
  
<script>
import { Icon } from '@iconify/vue';
import { mapWritableState, mapActions } from 'pinia';
import { favoStore } from "../../../../apps/favorites/store";

export default {
  name: 'Favorites',
  // props: ['NavbarList'],
  data() {
    return {
      browser: [
        {
          name: 'Microsoft Edge',
          url:'/img/icon/edge.png',
          value:'edge',
        },
        {
          name: 'chrome',
          url:'/img/icon/chrome.png',
          value:'chrome',
        },
      ]

    }
  },
  async mounted() {
  },
  components: {
    Icon,
  },

  computed: {
    ...mapWritableState(favoStore, ['browserList']),
    
  },
  methods: {
    // changeNav(item, index){
    //   this.$emit('changeNavList', item, index)
    // },
    changeHandle(browser){
      this.browserList[browser] = !this.browserList[browser]
    }

  }
}
</script>
  
<style scoped lang="scss">
  .card-content{
    width: 230px;
    height: 88px;
    border-radius: 10px;
    border: 1px solid transparent;
  }
  .select-bg{
    border: 1px solid red;
    background: rgba(80,139,254,0.20);
    border: 1px solid rgba(80,139,254,1);
    // border-radius: 10px;
  }
</style>
  