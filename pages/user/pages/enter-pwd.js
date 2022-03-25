const userModel = require('../../../src/model/userModel')
const tpl = `
<div>
 <h1 style="font-size: 18px;margin:auto;margin-top: 20px;margin-bottom:10px;text-align: center">

      </h1>
      <div style="text-align: center">
      <a-avatar :size="60" :src="user.avatar">

</a-avatar>
<div>{{user.nickname}}</div>
</div>
      <p style="text-align: center;color: #999;margin-top: 20px;">
        <a-input placeholder="输入快捷密码" ref="pwdInput" v-model:pwd="pwd" style="width: 150px">
         <template #suffix>
        <a-tooltip title="确认密码">
          <svg t="1648091812193" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21174" width="32" height="32"><path d="M161.536 523.52a42.666667 42.666667 0 0 1 42.666667-42.666667l518.058666 0.085334-228.266666-228.266667a42.666667 42.666667 0 0 1 60.373333-60.373333l301.653333 301.696a42.666667 42.666667 0 0 1 0 60.373333l-301.653333 301.653333a42.666667 42.666667 0 0 1-60.373333-60.330666l229.546666-229.418667-519.338666-0.042667a42.666667 42.666667 0 0 1-42.666667-42.666666z" fill="#2c2c2c" p-id="21175"></path></svg>
        </a-tooltip>
      </template>
</a-input>
      </p>
      <div style="text-align: center">
      </div>
</div>
`
// const userModel = require('../../util/model/userModel')
const EnterPwd = {
  template: tpl,
    data () {
      return {
        user:{},
        pwd:''
      }
    },
    async mounted () {
      let user=await userModel.get({id:this.$route.params.uid})
      if(user){
        this.user=user
      }else{
        console.error('user can\'t find')
      }
      console.log(this.$refs['pwdInput'])
      this.$refs['pwdInput'].input.focus()
    },
    methods: {
      goLogin(){
        ipc.send('login')
      //https://s.apps.vip/login?response_type=code&client_id=10001&state=1
      }
    }
  }

module.exports = EnterPwd
