<template>
<h3 style="margin-bottom: 1em"><a-avatar src="https://up.apps.vip/logo/yuan.png"></a-avatar> 元社区

  <div  style="float: right">
    <a-button @click="go('https://s.apps.vip')">
      <Icon icon="yichu"> </Icon> 前往元社区
    </a-button>
  </div></h3>
  <div>
  <a-row :gutter="[0,10]" >
    <a-col :span="24">
      UID：{{userInfo.uid}} （用于社区活动身份）
    </a-col>
    <a-col :span="24">
      社区等级：{{userInfo.grade.new_name}}
    </a-col>
    <a-col :span="24" style="text-align: center">
      <a-row>
        <a-col :span="8">
          <div class="num">{{userInfo.post_count}}</div>
          <div>内容</div>
        </a-col>
        <a-col :span="8">
          <div class="num">{{userInfo.fans}}</div><div>粉丝</div>
        </a-col>
        <a-col :span="8">
          <div class="num">{{userInfo.follow}}</div><div>关注</div>
        </a-col>
      </a-row>
    </a-col>
<!--    <a-col :span="24">-->
<!--      <edit-outlined style="margin-right: 0.5em" /> {{userInfo.signature}}-->
<!--    </a-col>-->
  </a-row>
  </div>
</template>

<script>
import { appStore } from '../../store'
import {mapState} from 'pinia'
import {SendOutlined,UserAddOutlined,EyeOutlined,EditOutlined} from '@ant-design/icons-vue '

export default {
  name: 'ComPanel',
  components:{
    SendOutlined,UserAddOutlined,EyeOutlined,EditOutlined
  },
  data(){
    return {

    }
  },
  computed:{
    ...mapState(appStore,['userInfo'])
  },
  mounted () {

  },
  methods:{
    go(url){
      ipc.send('addTab',{url:url})
    }
  }
}
</script>

<style scoped>
.num{
  font-size: 1.2em;
  font-weight: bold;
}
</style>
