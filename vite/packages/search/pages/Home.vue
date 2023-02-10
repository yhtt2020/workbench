<template>
  <div
    class="apps flex flex-direction justify-between align-start"
  >
    <span class="text-grey">推荐</span>
    <div class="apps-content flex">
      <ul class="flex">
        <li v-for="(app, index) in apps"
            :key="index"
            class="flex flex-direction justify-around align-center"
            @click="executeApp(app)"
        >
          <img
            :src="app.logo"
            alt=""
            onerror="this.src='../../icons/default.svg'"
            shape="circle"
          />
          <span
            class="text-black sg-omit-sm flex justify-center align-center"
          >{{ app.name }}</span
          >
        </li>
      </ul>
    </div>
  </div>
  <div v-if="tip!=='1'" class="gpt-tip-wrapper">
    <div class="gpt-icon">
      <img  :src="gpt">
    </div>
    按下ctrl+回车，或者无搜索结果将会询问ChatGPT，<strong @click="learn" style="color:#0a84ff;cursor: pointer"><bulb-outlined />学习提问方式</strong>
    <span  @click="closeTip" style="float: right" class="close-btn">
                  <close-outlined />
                </span>

  </div>
</template>

<script>
import {SearchOutlined, SmileOutlined,CloseOutlined,BulbOutlined} from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
import { appStore } from '../store'
import { mapWritableState } from 'pinia'
import gpt from '../assets/img/gpt.svg'
import SearchInput from '../components/SearchInput.vue'
export default {
  name: 'Home',
  components: {
    SearchInput,
    SearchOutlined, SmileOutlined,CloseOutlined,BulbOutlined
  },
  data(){
    return {
      gpt,
      tip:''
    }
  },
  computed:{
    ...mapWritableState(appStore,['apps'])
  },
  mounted () {

    this.tip=localStorage.getItem('closeTip')
  },
  methods:{
    learn(){
      this.$router.push('/learn')
    },
    /**
     * 关闭提示
     */
    closeTip(){
      Modal.confirm({
        centered:true,
        content:'是否关闭ChartGPT提示？在关闭提示后，您仍可点击搜索输入栏左侧放大镜🔍图标学习如何使用GPT。',
        onOk:()=>{
          this.tip='1'
          localStorage.setItem('closeTip','1')
        },
        okText:'了解',
        cancelText:'取消'
      })

    }
  }
}
</script>

<style scoped>

</style>
