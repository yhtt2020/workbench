<template>
  <div class="flex flex-col justify-start mt-2">
    <div class="rounded-lg epic-detail-image">
      <img :src="detailOptions.image" alt="" class="rounded-lg">
    </div>
    <span class="mt-2 truncate" style="max-width:252px;font-size: 16px;font-weight: 500;color: var(--primary-text);">{{ detailOptions.title }}</span>
    <span class="h-12 content-introduction" style="font-size: 16px; font-weight: 400;color: var(--secondary-text);">{{detailOptions.summary}}</span>
    <span class="mt-1 line-through xt-num-font-600" style="color:var(--secondary-text);">{{detailOptions.price}}</span>
    <div class="flex items-center justify-between">
      <span class="xt-num-font-600" style="color: rgba(255, 77, 79, 1);font-size: 16px;font-weight: 600;">免费领取</span>
      <span class="xt-num-font-600" style="background: rgba(255, 77, 79, 1); padding: 1px 7px 3px 6px;border-radius: 4px;color:var(--active-text);">
        剩余{{detailOptions.days}}天
      </span>
    </div>
    <div class="flex justify-between mt-2">
        <span @click.stop="epicBack" class="flex items-center justify-center w-12 h-12 rounded-lg cursor-pointer epic-back" style="color: var(--primary-text);background: var(--primary-bg);">
           <Icon icon="xiangzuo" class="text-xl"></Icon>
        </span>
        <span @click.stop="onClickOffice" class="w-2/3 mr-3 text-center rounded-lg epic-back pointer s-item" style="padding:13px 30px;color: var(--primary-text);background: var(--primary-bg);">领取</span>
    </div>
 </div>
</template>

<script>
import { Icon as ButtonIcon } from '@iconify/vue'
import browser from '../../../js/common/browser'

export default {
  name:'EpicDetail',
  props:{
    detailOptions:{
      type:Object,
      default:()=>{}
    },
    detailType:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      backShow:false
    }
  },
  methods:{
    epicBack(){
      this.$emit('update:backShow',this.backShow)
    },
    onClickOffice(){
      browser.openInUserSelect(`https://store.epicgames.com/zh-CN`)
    }
  }
}
</script>

<style lang="scss" scoped>
.epic-detail-image{
  width: 252px;
  height: 115px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.content-introduction{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}
.epic-back:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
.open-epic:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
</style>
