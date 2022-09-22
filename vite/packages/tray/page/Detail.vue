<template>
  <div class="detail-title">
    <arrow-left-outlined @click="goBack"/>
    &nbsp;{{ detail.title }}
  </div>
  <vueCustomScrollbar  :settings="settings"  style="height: calc(100vh - 35px);padding: 15px">
    <GradePanel></GradePanel>
  </vueCustomScrollbar>
</template>

<script>
import GradePanel from '../compontents/GradePanel.vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
const components = {
  GradePanel,
  //下面是icons
  ArrowLeftOutlined,
  vueCustomScrollbar
}
const detailMap = {
  'grade': {
    title: '等级详情',
    component: GradePanel
  },
}
export default {
  name: 'Detail',
  components,
  data () {
    return {
      detail: {},
      settings: {
        swipeEasing:true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  mounted () {
    this.detail = detailMap[this.$route.params.path]
    ipc.send('resizeTray',{width:400,height:430})
    console.log(this.detail)
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.detail-title {
  color: white;
  line-height: 35px;
  padding-left: 10px;
}
</style>
