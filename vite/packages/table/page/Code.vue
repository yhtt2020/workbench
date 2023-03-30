<template>
  <div style="background: #333;width: 100vw;height: 100vw;" class="p-10 drag">
    <div class="no-drag" style="width: 600px;margin: auto">
      <h3 style="text-align: center;font-size: 1.5em">欢迎参与想天工作台抢先体验</h3>
      <p>目前我们尚未完全面向大众开发，必须使用邀请码方可体验产品。</p>
      <p>
        您可通过以下多种途径获得邀请码：
      </p>
      <p>
        1.参与各类产品活动，例如在产品群内等待发码，我们将不定期在产品群发码。
      </p>
      <p>
        2.通过老用户邀请，每一位老用户均可通过在线使用时长兑换邀请码。
      </p>
      <div class="p-5 mb-3" style="background: #3b3b3b;border-radius: 8px;border-width: 2px">
        <p style="font-weight: bold">
          EA阶段说明：
        </p>
        <p class="mb-1">
          EA（抢先体验）意味着产品尚未达到我们认为的成熟状态。目前所有的功能都不代表完成状态。我们极有可能在任何时刻对功能做修改。
        </p>
      </div>
      <p>
        请在下方输入您的邀请码，即刻参与产品抢先体验。
      </p>
      <p>
        <a-input v-model:value="code" placeholder="请输入邀请码" size="large"></a-input>
      </p>
      <a-button :loading="loading" @click="checkCode" :disabled="code===''" block type="primary" size="large">
        Go ! 发车
      </a-button>
    </div>
  </div>
</template>

<script>
import { message } from 'ant-design-vue'
import {axios} from 'axios'
export default {
  name: 'Code',
  data () {
    return {
      code: '',
      loading:false,
      serialNum:''
    }
  },
  async mounted () {
    await window.getSerialNum().then((s)=>{
      this.serialNum=s
      console.log(this.serialNum)
    })


  },
  methods: {
    checkCode () {
      if (this.code === '') {
        message.error('请输入邀请码')
        return
      }
      this.loading=true
      //axios.post('')
      this.loading=false
    }
  }
}
</script>

<style scoped>

</style>
