<template>
  <Modal v-model:visible="updateInfoVisible"  v-show="updateInfoVisible"  :blurFlag="true" style="z-index: 5000;">
    <div class="flex flex-col items-center myinfo-container justify-between w-full p-3">
      <vue-custom-scrollbar :settings="settingsScroller" class="w-full">
        <div class="flex justify-between items-center w-full h-12 mb-3">
          <div class="flex items-center update-title justify-center" style="width:95%;">
            我的信息
          </div>
          <div class="w-12 h-12 flex items-center com-button pointer justify-center rounded-lg" style="background: var(--secondary-bg);" @click="closeUpdateMyInfo">
            <Icon icon="guanbi" style="font-size: 1.45em;"></Icon>
          </div>
        </div>
        <div class="flex-grow flex w-full justify-between px-5">
          <div class="w-1/2 flex flex-col">
            <span class="update-title mb-3">昵称</span>
            <div class="flex items-center rounded-xl justify-center h-10 px-3 mb-3" style="border: 1px solid var(--divider);background: var(--secondary-bg);">
              <a-input v-model:value="randomNickname" placeholder="请输入" :bordered="false" style="padding: 0;width:90%;"></a-input>
              <div class="flex p-1 rounded-md pointer" style="background: var(--active-bg);" @click="roll" >
                <Icon id="touzi" ref="touzi" class=" " icon="touzi" style="font-size: 1.8em"></Icon>
              </div>
            </div>
            <span class="update-title mb-3">头像</span>
            <div class="flex w-full mx-1.5 flex-wrap justify-between" style="position: relative;">
              <UploadImage :key="key" class="avatar-box rounded-lg"></UploadImage>
              <div v-for="item in avatarNumber" class="avatar-box rounded-lg pointer  mb-3" :class="{'select-active':presetIndex === item.id}"  @click="selectPreset(item)">
               <a-avatar :size="48" :src="getAvatarUrl(item.id)"></a-avatar>
              </div>
            </div>
          </div>
          <a-divider type="vertical" class="mx-6"  style="height:380px;"/>
          <div class="w-1/2 flex flex-col">
            <span class="update-title mb-3">个性签名</span>
            <a-textarea v-model:value="areaValue" placeholder="请输入" class="rounded-lg no-scrollbar mb-6"  :rows="3" :maxlength="200" style="height: 100px;background: var(--secondary-bg);border: 1px solid var(--divider);"/>
            <span class="update-title mt-3 mb-3">性别</span>
            <HorizontalPanel :navList="sexType" v-model:selectType="gender"></HorizontalPanel>
            <div class="my-16 flex mx-auto">
              <span class="com-title" style="color: var(--secondary-text);">更多个人信息编辑、账号设置等，请前往</span>
              <span class="go-com pl-2 pointer"  @click="go('https://s.apps.vip/user/info')" >元社区</span>
            </div>
          </div>
        </div>
        <div class="flex w-full items-center justify-center mt-6" >
          <a-button type="primary" class="h-48 rounded-xl mr-3" @click="closeUpdateMyInfo" style="width:120px;color: var(--primary-text);border:none;background: var(--secondary-bg);">
           稍后设置
          </a-button>
          <a-button type="primary" class="h-48 rounded-xl" style="width:120px;color: var(--active-text);" @click="comSave">
           保存
          </a-button>
        </div>
      </vue-custom-scrollbar>
    </div>
  </Modal>
</template>

<script>
import { mapWritableState,mapActions } from 'pinia'
import {message} from 'ant-design-vue'
import Modal from '../Modal.vue'
import UploadImage from '../UploadImage.vue'
import HorizontalPanel from '../HorizontalPanel.vue'
import { avatarNumber } from '../../js/common/teamAvatar'
import browser from '../../js/common/browser'
import { frameStore } from '../../store/avatarFrame'
import { appStore } from '../../store'

const screenname = '灵魂虐杀,浅寐,夏微凉っ゛,鱼哭了,陌屿,彼岸,青山独归晚,温唇,忻芝兰,喵咕嘟,皂白七'
export default {
  components:{
    Modal,UploadImage,
    HorizontalPanel
  },
  emits:['infoUpdated'],
  props:{
    updateVisible:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return{
      key:Date.now(),
      updateInfoVisible:this.updateVisible,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      avatarNumber,
      sexType:[    // 性别类型
        {title:'保密',sex:0},
        {title:'男',sex:1},
        {title:'女',sex:2}
      ],
      gender:'', // 接收切换到的性别
      areaValue:'',  // 接收文本输入框值
      randomNickname:'',
      presetIndex:'',  // 预设头像选中下标
      i: 1,
      j: 1,
      k: 0,
      no: 0,
    }
  },
  computed:{
    ...mapWritableState(appStore,['userInfo']),
    ...mapWritableState(frameStore,['frameData'])
  },
  mounted(){
    if(this.userInfo){
     this.randomNickname = this.userInfo.nickname
     this.areaValue = this.userInfo.signature
    }
  },
  methods:{
    ...mapActions(appStore,['editPresetAvatar','setInfoVisible','setSecondaryVisible','getUserInfo']),
    ...mapActions(frameStore,['updateMyinfo']),
    openMyInfo(){
      this.key=Date.now()
      this.updateInfoVisible = true

    },
    // 随机筛选
    roll (animate=true) {
      if(animate){
        if(this.timer){
          clearTimeout(this.timer)
        }
        $('#touzi').addClass('animate-spin')
        this.timer=setTimeout(()=>{
          this.rollName()
          $('#touzi').removeClass('animate-spin')
        },400)
      }else{
        this.rollName()
      }

    },
    rollName(){  // 掷骰子随机昵称
      let groups = screenname.split(',')
      let j = Math.ceil((Math.random() * groups.length)) - 1
      if (this.j === j) {
        this.rollName()
        return
      }
      this.j = j
      this.randomNickname = groups[j]
    },
    // 预设头像拼接
    getAvatarUrl(item){
      return 'https://up.apps.vip/avatar/' +  item + '.png'
    },
    // 点击选中预设头像
    selectPreset(item){
      this.presetIndex = item.id
      this.frameData.avatar_url = this.getAvatarUrl(item.id)
    },
    // 点击保存
    async comSave () {
      const saveUpdateMyInfo = {
        nickname: this.randomNickname,
        sex: this.gender.sex,
        signature: this.areaValue,
        avatar: this.frameData.avatar_url
      }
      let rs = await this.updateMyinfo(saveUpdateMyInfo)
      console.log(rs)
      if (rs.code===200) {
        this.$emit('infoUpdated',{})
        message.success('信息修改成功')

        this.updateInfoVisible = false
        this.setInfoVisible(false)
        this.setSecondaryVisible(true)
        setTimeout(() => {
          this.getUserInfo()
        }, 10)
      } else {
        message.error('修改失败')
      }

    },
    go(url){
      browser.openInInner(url)
    },
    closeUpdateMyInfo(){
      this.updateInfoVisible = false
      this.setInfoVisible(false)
      this.setSecondaryVisible(true)
    }
  },
  watch:{
    'gender':{
      handler(newVal){
        this.gender = newVal
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.animate-spin{
  animation: spin .6s linear infinite !important;
}


.update-title{

  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.com-title{

  font-size: 16px;
  font-weight: 400;
}

.com-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

.no-scrollbar ::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-y: auto;
}

.go-com{

  font-size: 16px;
  color:var(--active-bg);
  font-weight: 500;
}
.avatar-box{
  width: 72px;
  height: 72px;
  background: var(--secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px !important;
}

.select-active{
  border: 1px solid var(--active-bg);
  background: rgba(80,139,254,0.20);
}

:deep(.nav-item){
  border-radius: 10px !important;
}

.myinfo-container{
  width: 946px;
}

@media screen and (max-width:840px) {
  .myinfo-container{
    width:780px !important;
  }
  .avatar-box{
    margin-right: 5px !important;
  }
}

@media screen and (max-height:599px) {
  :deep(.ps-container){
    height: 90vh !important;
  }
}

@media screen and (min-height:600px) {
  :deep(.ps-container){
    height: 545px !important;
  }
}
</style>
