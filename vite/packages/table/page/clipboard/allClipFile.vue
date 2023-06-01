<template>
  <div class="flex">
    <div v-for="item in allList"   style="width:338px;" @contextmenu="rightMouseButton"  class="mr-3 flex flex-col s-bg rounded-md">
      <div class="flex flex-col  rounded-t-md s-item px-5 py-3">
        <div class="flex items-center">
          <Icon :icon="item.icon" style="font-size: 1.5em;"></Icon>
          <span class="ml-2">{{item.title}}</span>
        </div>
        <div class="flex justify-between pt-1">
          <span class="">{{item.time}}</span>
          <span>{{item.capacity}}</span>
        </div>
      </div>
      <div style="padding: 46px 13px;width:299px;" class="flex-1">
        <span v-if="item.content">{{ item.content }}</span>
        <div style="width:100%;height:185px;" class="rounded-lg flex flex-col" v-if="item.imgUrl">
          <img :src="item.imgUrl" alt="" class="rounded-lg" style="width: 100%;height: 100%;object-fit: cover;">
          <span class="py-5">{{ item.name }}</span>
        </div>
        <div v-if="item.picIcon" class="flex flex-col items-center justify-center"> 
          <Icon :icon="item.picIcon" style="font-size: 9.15em;"></Icon>
          <span class="pt-6">{{item.name}}</span>
        </div>
      </div>
      <div class="s-item h-12  rounded-b-md flex"> 
        <template v-if="item.type === 'text'">
          <div v-for="i in textType" class="flex items-center justify-between px-10">
            <Icon :icon="i.icon" style="font-size: 1.5em;"></Icon>
            <span>{{i.title}}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { allList} from '../../js/data/clipboardData'
export default {
  data(){
    return{
      allList,
      operationShow:false,
      textType:[
        {title:'纯文本',icon:'ziyuan',name:'text'},
        {title:'代码块',icon:'daima',name:'dm'}
      ]
    }
  },
  methods:{
    rightMouseButton(){
      console.log('测试');
    }
  }
}
</script>

<style lang="scss" scoped>

</style>