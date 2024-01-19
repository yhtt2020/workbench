<template>
  <div class="pt-6 text-center font-16 xt-text">添加推荐小组件</div>
  <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">根据你选择偏好，我们为你推荐了以下小组件。你可以稍后添加更多其他的小组件。
  </div>
  <div class="flex flex-wrap mt-4 overflow-hidden overflow-y-auto xt-scrollbar" style="height: 440px;padding-left:16px;">
    <div v-for="(item, index) in cardList" :key="index" class="flex rounded-lg card-list xt-bg-2"
      :class="index % 2 != 0 ? 'ml-3' : '', index > 1 ? 'mt-3' : ''" style="">
      <div class="relative flex items-center flex-shrink-0 h-full overflow-hidden rounded-l-lg xt-bg-m card-left"
        style="">

        <div class="flex tran" :style="{ transform: `translateX(${-180 * item.imgIndex}px)` }">
          <div v-for="img in item.option" class="flex justify-center flex-shrink-0" style="width:180px;">
            <img :style="{ zoom: `${img.zoom}%` }" :src="`https://a.apps.vip/cards/${img.imgName}.png`" />
          </div>
        </div>
        <!-- 图片圆点 -->
        <div class="absolute flex bottom-3 pointer left-1/2" v-if="item.option.length > 1"
          :style="{ transform: `translateX(${-6 * item.option?.length}px)` }">
          <div class="circle xt-enable-bg" v-for="(cir, cle) in item.option" @click="item.imgIndex = cle"
            :class="cle == item.imgIndex ? 'circle-active' : '', cle > 0 ? 'ml-2' : ''"></div>
        </div>
      </div>

      <div class="w-full px-3 pt-3 pointer" @click="item.isCheck = !item.isCheck">
        <div class="flex items-center justify-between w-full">
          <div class="font-18 xt-text text-hidden">{{ item.cname }}</div>
          <div class="flex items-center justify-center w-8 h-8 ml-2 rounded-lg xt-bg">
            <a-checkbox v-model:checked="item.isCheck"></a-checkbox>
          </div>
        </div>

        <div class="mt-2 font-16 xt-text-2 text-hidden-2">{{ item.detail }}</div>
        <div class="mt-2 ">
          <span class="rounded-md font-14 xt-text-2 xt-enable-bg" :class="n > 0 ? 'ml-1' : ''" style="padding:4px 8px;"
            v-for="(key, n) in item.sizes.slice(0, 2)">{{ key }}</span>
        </div>
        <div class="flex items-center mt-4 xt-text-2">
          <Icon icon="fluent:arrow-download-20-filled" width="16" height="16" />
          <div class="ml-1">{{ item.download }}</div>
        </div>

      </div>
    </div>
  </div>
</template>
  
<script>
import { Icon } from '@iconify/vue';

export default {
  name: 'CardList',
  props: ['cardList'],
  data() {
    return {

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


  }
}
</script>
  
<style scoped lang="scss">
  .card-list{
    width: 378px;
    height: 184px;
  }
  .card-list:hover{
    opacity: 0.8;
  }

  .tran{
    transition: all 0.15s linear;
  }

  .circle{
    width: 8px;
    height: 8px;
    border-radius: 4px;
    opacity: 0.2;
  }

  .circle-active{
    opacity: 1;
  }
  // 滚动条配置
  ::-webkit-scrollbar-thumb {
      background-color: #ccc; /* 滚动条颜色 */
      border-radius: 6px; /* 滚动条圆角 */
  }

  ::-webkit-scrollbar-thumb:hover {
      background-color: #999; /* 悬停时滚动条颜色 */
  }

  ::-webkit-scrollbar-track {
      border-radius: 6px; /* 轨道圆角 */
  }
  .text-hidden{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .text-hidden-2{
    overflow: hidden;
    // white-space: nowrap;
    display:-webkit-box;
    -webkit-box-orient: vertical; /* 必须 */
    -webkit-line-clamp: 2; /* 限制显示的行数 */
  }

  .card-left{
    width: 180px;
  }
</style>
  