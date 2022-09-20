<template>
  <div>
    <h1 style="font-size: 18px;margin:auto;margin-top: 20px;margin-bottom:10px;text-align: center">
      添加新帐号
    </h1>
    <div style="text-align: center">
      <a-avatar :size="60">
        头像
      </a-avatar>
    </div>
    <p style="text-align: center;color: #999;margin-top: 20px">
      绑定帐号后可以与云端数据<strong>实时同步</strong>。
      <br>
      强烈建议绑定帐号以提升使用体验。
    </p>
    <p style="text-align: center;color: #333">
      目前暂不支持云收藏夹、云密码。
    </p>
    <p style="text-align: center">本机全部账号在此计算机上均可浏览和使用收藏夹、密码。</p>
    <div style="text-align: center">
      <a-button @click="goLogin" type="primary">去登录</a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddAccount',
  mounted () {
  },
  methods: {
    goLogin(){
      ipc.send('login')
      //https://s.apps.vip/login?response_type=code&client_id=10001&state=1
    }
  }
}

</script>

<style scoped>

</style>
