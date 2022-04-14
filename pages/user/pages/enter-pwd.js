const userModel = require('../../../src/model/userModel')
const tpl = `
<div style="margin-top: 100px">
 <h1 style="font-size: 18px;margin:auto;margin-top: 20px;margin-bottom:10px;text-align: center">

      </h1>
      <div style="text-align: center">
      <a-avatar :size="60" :src="user.avatar">

</a-avatar>
<div>{{user.nickname}}</div>
</div>
      <p style="text-align: center;color: #999;margin-top: 20px;">
        <a-input-password :style="{'margin-left': shake+'px'}" placeholder="输入访问密码" @keyup.enter="doEnter" id="pwdInput" v-model:value="pwd" style="width: 200px">
</a-input-password>
      </p>
      <div style="text-align: center">
      <a-button @click="doEnter" :disabled="this.pwd===''" :type="this.pwd!==''?'primary':'default'">确定</a-button>
      </div>
</div>
`
// const userModel = require('../../util/model/userModel')
const EnterPwd = {
  template: tpl,
    data () {
      return {
        user:{},
        pwd:'',
        shake:0
      }
    },
    async mounted () {
      let user=await userModel.get({id:this.$route.params.uid})
      if(user){
        this.user=user
      }else{
        console.error('user can\'t find')
      }
      setTimeout(()=>{
        document.getElementById('pwdInput').focus()
      },200)
    },
    methods: {
      doEnter(){
        let right=userModel.compareEnterPwd(this.pwd,this.user.uid)
        console.log(right)
        if(right){
          this.$router.replace({ name: 'space', params: { uid: this.user.uid } })
        }else{
          let timer
          let i=0
          timer = setInterval(()=>{
            this.shake = (( i % 3 ) - 1) * 60;
            console.log(this.shake)
            i++
            if(i===5){
              clearInterval(timer);
            }
          },50);

        }
      },

      goLogin(){
        ipc.send('login')
      //https://s.apps.vip/login?response_type=code&client_id=10001&state=1
      }
    }
  }

module.exports = EnterPwd
