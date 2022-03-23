const tpl = `
<div>
 <h1 style="font-size: 18px;margin:auto;margin-top: 20px;margin-bottom:10px;text-align: center">
        添加新账号
      </h1>
      <div style="text-align: center">
      <a-avatar :size="60">
      头像
</a-avatar>
</div>
      <p style="text-align: center;color: #333;margin-top: 20px">
        绑定账号后可以与云端数据实时同步。
<br>
强烈建议绑定账号以提升使用体验。
      </p>
      <p style="text-align: center;color: #999">
        同一账号共享收藏夹、密码、应用。
      </p>
      <div style="text-align: center">
      <a-button type="primary">去登录</a-button>
      </div>
</div>
`
// const userModel = require('../../util/model/userModel')
const AddAccount = {
  template: tpl,
    data () {
      return {
      }
    },
    async mounted () {
    },
    methods: {

    }
  }

module.exports = AddAccount
