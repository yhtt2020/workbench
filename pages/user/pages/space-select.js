const userModel = require('../../../src/model/userModel')
const userApi = require('../../util/api/userApi')
const spaceModel = require('../../../src/model/spaceModel')
const tpl = `
<div>
  <div style="text-align: center">
  <a-row style="margin-top: 20px">
  <a-col :span="12" style="text-align: right">
      <a-avatar :size="60" :src="user.avatar">
    </a-avatar>
</a-col>
<a-col :span="12" style="text-align: left;padding-left: 10px">
 <div style="margin-top: 10px">{{user.nickname}}</div>
    <p style="text-align: left;font-size: 16px">{{ user.spaces.length }} <span style="color: #999;font-size: 12px">空间</span></p>
</a-col>
</a-row>


  </div>
  <div style="text-align: center">
    <!--      <a-empty text="无空间" v-if="user.spaces.length===0"></a-empty>-->
    <div style="text-align: left;overflow-y: auto;max-height: 310px;margin-right: 20px;padding-top: 10px;padding-left: 40px;padding-bottom: 10px" class="scroller">
      <a-card :style="{'margin-right':index%2===1?'0':'10px'}" v-for="space,index in user.spaces" hoverable style="margin-left:20px;width: 250px;display: inline-block;margin-bottom: 10px;">
        <a-card-meta :title="space.name" :description="space.count_task+ ' 标签组  '+ space.count_tab+' 标签'">
          <template #avatar>
           <svg :class="{'offline':this.user.uid===0?true:false}" t="1648106444295" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32437" width="32" height="32"><path d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667z m205.653333-210.090667A298.666667 298.666667 0 0 0 385.365333 241.408l41.6 74.88A213.333333 213.333333 0 0 1 725.333333 512h-91.733333a21.333333 21.333333 0 0 0-18.645333 31.701333l102.698666 184.874667z m-120.618666-20.864A213.333333 213.333333 0 0 1 298.666667 512h91.733333a21.333333 21.333333 0 0 0 18.645333-31.701333L306.346667 295.424a298.666667 298.666667 0 0 0 332.288 487.168l-41.6-74.88z" fill="#14D081" p-id="32438"></path></svg>
          </template>
        </a-card-meta>
      </a-card>
      <a-card @click="showCreateSpace" hoverable style="width: 250px;display: inline-block;margin-left:20px;">
        <a-card-meta title="创建新空间" description="创建一个全新的空间">
          <template #avatar>
            <a-avatar :size="40" style="background-color: #eeeeee">
              <template #icon>
                <svg style="margin-top: 3px;width: 30px" t="1648099588078" class="icon" viewBox="0 0 1024 1024"
                     version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21372" width="36" height="36">
                  <path
                    d="M512 42.666667c259.2 0 469.333333 210.133333 469.333333 469.333333s-210.133333 469.333333-469.333333 469.333333S42.666667 771.2 42.666667 512 252.8 42.666667 512 42.666667z m0 85.333333a384 384 0 1 0 0 768 384 384 0 0 0 0-768z m0 170.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v128h128a42.666667 42.666667 0 0 1 0 85.333334h-128v128a42.666667 42.666667 0 0 1-85.333334 0v-128H341.333333a42.666667 42.666667 0 0 1 0-85.333334h128V341.333333a42.666667 42.666667 0 0 1 42.666667-42.666666z"
                    fill="#666666" p-id="21373"></path>
                </svg>
              </template>
            </a-avatar>
          </template>
        </a-card-meta>
      </a-card>
      <div>
      </div>
    </div>
  </div>

  <div style="position: absolute;bottom: 10px;width: 100%;padding: 30px;padding-bottom: 15px">
   <div style="float: left;"><a-button size="small" shape="round">隐私空间</a-button></div>
   <div style="float:right;width: 200px;text-align: right">
   <a-button v-if="user.uid!==0" style="margin-right: 10px">设置密码</a-button>
   <a-button v-if="user.uid!==0" @click="deleteAccount(user.uid)">解绑账号</a-button>
</div>
  </div>

  <a-modal
  centered
      v-model:visible="visibleCreate"
      title="创建空间"
      ok-text="创建"
      cancel-text="取消"
      width="300px"
      @ok="doCreateSpace"
    >
      <p>输入空间名称</p>
      <p><a-input ref="spaceNameInput" @keyup.enter="doCreateSpace" v-model:value="newSpaceName" placeholder="空间名称"></p>
      <p></p>
    </a-modal>
</div>
</div>
`
// const userModel = require('../../util/model/userModel')
const SpaceSelect = {
  template: tpl,
  data () {
    return {
      user: {
        uid:0,
        spaces: []
      },
      pwd: '',
      visibleCreate:false,
      newSpaceName:''
    }
  },
  async mounted () {
    if(!Number(this.$route.params.uid)){
      let user={
        nickname:'本机空间',
        avatar:'../../icons/logo128.png',
        spaces:[],
        uid:0
      }
      this.user=user
      let spaces= spaceModel.getUserSpaces(0)
      this.user.spaces=spaces
      return
    }


    let user = await userModel.get({ id: this.$route.params.uid })
    if (user) {
      try{
        let result=await userApi.getMySpaceList(user)
        if(result.data)
          user.spaces= result.data
      }catch (e){
        window.antd.message.error('获取用户信息失败，用户登录信息已过期。请解绑后重新绑定。')
      }
      console.log(user.spaces)
      if(!!!user.spaces) user.spaces=[]
      this.user = user
    } else {
      console.error('user can\'t find')
    }
  },
  methods: {
    goLogin () {
      ipc.send('login')
      //https://s.apps.vip/login?response_type=code&client_id=10001&state=1
    },
    async doCreateSpace(){
      try{
        let result= await  spaceModel.setUser(this.user).addSpace({name:this.newSpaceName})
        if(result.status===1){
          this.newSpaceName=''
          window.antd.message.success('创建空间成功。')
          this.user.spaces.push(result.data)
          this.visibleCreate=false
        }else{
          window.antd.message.error('空间名称长度在1-10个汉字，请重新输入。')//获取真实的错误信息
          this.$refs.spaceNameInput.input.select()
        }

        //let result=await userApi.addSpace(this.newSpaceName,this.user)
        // if(result.code===1000){
        //   this.newSpaceName=''
        //   window.antd.message.success('创建空间成功。')
        //   this.user.spaces.push(result.data)
        //   this.visibleCreate=false
        // }else{
        //   window.antd.message.error('空间名称长度在1-10个汉字，请重新输入。')
        //   this.$refs.spaceNameInput.input.select()
        // }
      }catch (e){
        window.antd.message.error('创建空间失败，失败原因：')
        console.log(e)
      }
    },
    showCreateSpace(){
      this.visibleCreate=true
      setTimeout(()=>{
        this.$refs.spaceNameInput.input.focus()
      },200)
    },
    deleteAccount (uid) {
      antd.Modal.confirm({
        title: '解绑此账号',
        content: '解绑账号并不会影响账号数据，仅仅是将本地账号退出。但是退出后无法再使用此账号下的所有空间。',
        centered: true,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          let result = userModel.delete( uid ).then(() => {
            window.antd.message.success('解绑账号成功。')
            this.$router.replace({path:'/'})
          }).catch(()=>{
            window.antd.message.error('解绑账号失败。')
          })
        }
      })
    },
  }
}

module.exports = SpaceSelect
