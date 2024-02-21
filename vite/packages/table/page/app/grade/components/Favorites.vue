<template>
  <div class="text-center font-16 xt-text" style="padding-top: 140px;">导入浏览器收藏夹</div>
  <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">你可以选择导入浏览器收藏夹，在桌面上快速访问你收藏的网站。</div>
  <div class="flex justify-center mt-8">
    <div  v-for="(item,index) in browser" class="card-content xt-bg-2 flex items-center pl-4 pointer" :class="index!=0?'ml-4':''">
      <a-avatar :size="56" shape="square" :src="item.url" />
      <div class="ml-4 font-16 xt-text">{{ item.name }}</div>
    </div>
  </div>
  <!-- <div style="color: #508BFE;" class="mt-8 text-center font-16 ">其他浏览器？</div> -->
</template>
  
<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'Favorites',
  // props: ['NavbarList'],
  data() {
    return {
      browser: [
        {
          name: 'Microsoft Edge',
          url:'/img/icon/edge.png'
        },
        {
          name: 'chrome',
          url:'/img/icon/chrome.png'
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
  },
  methods: {
    // changeNav(item, index){
    //   this.$emit('changeNavList', item, index)
    // },

  }
}
</script>
  
<style scoped lang="scss">
  .card-content{
    width: 230px;
    height: 88px;
    border-radius: 10px;
  }
</style>
  