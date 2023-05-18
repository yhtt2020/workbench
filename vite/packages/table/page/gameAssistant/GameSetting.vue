<template>
<div class="s-bg  h-20 rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
  <Icon style="height: 36px;width: 36px" icon="steam"></Icon>
  <div class="flex flex-col ml-4 w-2/3">
    <span class="text-white">Steam</span>
    <span v-if="steamLoginData.refreshToken">{{userData.name}}</span>
    <span v-else>绑定Steam帐号即可同步显示你的游戏数据</span>
  </div>
  <div class="s-item ml-10 w-28 h-12 rounded-lg flex justify-center items-center pointer" @click="clickBind">
  {{steamLoginData.refreshToken?'解绑':'绑定'}}
  </div>
</div>
  <div class="s-bg  h-20 rounded-lg flex flex-row items-center px-6 mb-4" style="width: 572px">
    <Icon style="height: 36px;width: 36px" icon="position"></Icon>
    <div class="flex flex-col ml-4 w-2/3">
      <span class="text-white">折扣地区</span>
      <span>选择默认的折扣地区</span>
    </div>
    <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);"
              @change="getRegion($event)"    class="w-56 h-auto rounded-lg  text-xs s-item" size="large" :bordered="false" v-model:value="area">
      <a-select-option v-for="item in region" :value="item.id">{{item.name}}</a-select-option>
    </a-select>
  </div>
  <Modal v-model:visible="modalVisibility"   v-show="modalVisibility" animationName="bounce-in" :maskNoClose="true" :blurFlag="true" @click.stop>
    <div class="flex flex-col p-6 text-white"  @click.stop>
      <div class="mx-auto">绑定Steam</div>
      <HorizontalPanel :navList="loginTypeList" v-model:selectType="loginType" class="mt-4 mx-auto" bgColor="drawer-item-select-bg"></HorizontalPanel>
      <div class=" mt-6">
        <a-input v-model:value="userName" placeholder="账号"  class="no-drag rounded-lg h-12 mx-auto"  style="width: 328px;background: rgba(42, 42, 42, 0.6);" @click.stop/></div>
      <div class=" mt-6">
        <a-input-password v-model:value="password" class="no-drag  rounded-lg h-12  mx-auto" placeholder="密码"  style="width: 328px;background: rgba(42, 42, 42, 0.6);" @click.stop/>
      </div>
      <div class=" mt-6" v-show="loginType.name==='phone'">
        <a-input v-model:value="authCode" class="no-drag   rounded-lg h-12  mx-auto" placeholder="令牌"   style="width: 328px;background: rgba(42, 42, 42, 0.6);" @click.stop/>
      </div>
      <div class=" mt-6" v-show="mailBoxShow&&loginType.name!=='phone'">
        <a-input v-model:value="mailBoxAuthCode" class="no-drag   rounded-lg h-12  mx-auto" placeholder="邮箱验证码"   style="width: 328px;background: rgba(42, 42, 42, 0.6);" @click.stop/>
      </div>
      <div class="flex justify-between mt-6">
        <div class="s-item  h-12 rounded-lg flex justify-center items-center pointer w-40" style="background: #2A2A2A" @click="()=>{this.modalVisibility = false}">
          取消
        </div>
        <div class="s-item  h-12 rounded-lg flex justify-center items-center pointer w-40" style="background: #508BFE" @click.stop="bindSteam">
          {{loginLoading?'登录中....':'登录'}}
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapState,mapActions } from 'pinia'
import Modal from '../../components/Modal.vue'
import HorizontalPanel from "../../components/HorizontalPanel.vue";
import {message} from 'ant-design-vue'
import {cardStore} from "../../store/card";
import {steamUserStore} from "../../store/steamUser";
const {steamSession,path,https} = $models
const {LoginSession, EAuthTokenPlatformType} = steamSession
let session = new LoginSession(EAuthTokenPlatformType.SteamClient);
session.on('authenticated', async () => {
  message.info({
    content:`登录成功用户名 ${session.accountName}`,
  })
  let webCookies = await session.getWebCookies();
  if (webCookies) {
    const steamLoginData = {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      webCookies: webCookies
    }
    steamUserStore().setSteamLoginData(steamLoginData)
  }
});
export default {
  name: "gameSetting",
  components:{Modal,HorizontalPanel},
  data(){
    return {
      mailBoxShow:false,
      loginTypeList:[{title:'邮箱验证',name:'mailBox'},{title:'手机令牌',name:'phone'}],
      loginType:{title:'邮箱验证',name:'mailBox'},
      loginLoading:false,
      userName:'',
      password:'',
      mailBoxAuthCode:'',
      authCode:'',
      modalVisibility:false,
      area:'国区',
      region:[
        {
          id:'us',
          name:'美国'
        },
        {
          id:'ca',
          name:'加拿大'
        },
        {
          id:'gb',
          name:'英国'
        },{
          id:'fr',
          name:'法国'
        },{
          id:'de',
          name:'德国'
        },{
          id:'it',
          name:'意大利'
        },{
          id:'jp',
          name:'日本',
        },{
          id:'cn',
          name:'国区',
        },{
          id:'br',
          name:'巴西',
        },{
          id:'in',
          name:'印度',
        },{
          id:'ru',
          name:'俄罗斯',
        },{
          id:'au',
          name:'澳大利亚',
        },
        {
          id:'hk',
          name:'香港',
        },
        {
          id:'ar',
          name:'阿根廷',
        }

      ],
    }
  },
  mounted() {
    console.log(this.userData)
    console.log(session)
  },
  computed:{
    ...mapState(steamUserStore, ['steamLoginData','userData'])
  },
  methods:{
    ...mapActions(steamUserStore, ['setSteamLoginData','setUserData']),
    clickBind(){
      if( this.steamLoginData.refreshToken ===''){
        this.modalVisibility = true
      }else{
        this.setSteamLoginData({
          accessToken: '',
          refreshToken: '',
          webCookies: ''
        })
        this.setUserData({})
      }
    },
    getRegion(e){
      console.log(e)
    },
    mailBox(){
      session.submitSteamGuardCode(this.mailBoxAuthCode)
    },
   async bindSteam(){
     if(this.loginLoading===true)return
     this.loginLoading = true
     switch (this.loginType.name){
       case'mailBox':
         if( this.mailBoxShow !== true){
           session.startWithCredentials({
             accountName: this.userName,
             password:this.password,
           }).then((res) =>{
             this.mailBoxShow = true
           }).catch(err=>{
             console.warn(err)
             message.error({
               content:'用户或密码错误',
             })
           }).finally(()=>{this.loginLoading = false})
         }else{
           session.submitSteamGuardCode(this.mailBoxAuthCode).then((res) =>{
             message.info({
               content:'登录成功',
             })
             this.userName=''
             this.password=''
             this.mailBoxAuthCode = ''
             this.authCode = ''
           }).catch(err=>{
             console.warn(err)
             message.error({
               content:'邮箱错误',
             })
           }).finally(()=>{
             this.loginLoading = false
           this.modalVisibility = false})
         }
         break;
       case'phone':
         session.startWithCredentials({
           accountName: this.userName,
           password:this.password,
           steamGuardCode:this.authCode
         }).then((res) =>{

         }).catch(err=>{
           console.warn(err)
           message.error({
             content:'用户或密码或令牌错误',
           })
         }).finally(()=>{this.loginLoading = false});
         break;
     }
    }
  }
}
</script>

<style scoped>

</style>
