<template>
   <div class="flex items-center">
    <HorzontanlPanelIcon :navList="clipType" v-model:selectType="defaultClipType"></HorzontanlPanelIcon>
   </div>
</template>

<script>
import HorzontanlPanelIcon from '../../components/HorzontanlPanelIcon.vue'
export default {
  name:'Clipboard',
  components:{
    HorzontanlPanelIcon
  },
  data(){
    return{
      clipType:[
         {title:'剪贴板历史',icon:'time-circle'},
         {title:'收藏',icon:'star'}
      ],
      defaultClipType:{title:'剪贴板历史',icon:'time-circle'},
      cutType:[
        {title:'全部',icon:'appstore'},
        {title:'文本',icon:'text-align-left'},
        {title:'图片',icon:'image'},
        {title:'文件',icon:'file'},
        {title:'视频',icon:'video'},
        {title:'音频',icon:''}
      ],
      defaultCutType:0,

    }
  },
  methods:{
    selectCutType(){

    }
  }
}
</script>

<style lang="scss" scoped>

</style>