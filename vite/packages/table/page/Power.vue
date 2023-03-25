<template>
  <div class="main" style="text-align: center;padding-top: 3em">
    <BackBtn></BackBtn>
    <div @click="exit" class="power-btn">退出</div>
    <div style="margin:auto;width: 51em;text-align: center">
      <a-row>
        <a-col>
          <div @click="shutdown" class="power-btn">关机</div>
          <div @click="logout" class="power-btn">注销</div>
        </a-col>
        <a-col>
          <div @click="reboot" class="power-btn">重启</div>
          <div @click="sleep" class="power-btn">休眠</div>
        </a-col>
      </a-row>
    </div>


    <br/>

  </div>

</template>

<script>
import BackBtn from '../components/comp/BackBtn.vue'
import { Modal, message } from 'ant-design-vue'
import { runNir } from '../js/common/exec'

const execShell = require('child_process').exec
export default {
  name: 'Power',
  components: { BackBtn },
  methods: {
    exit () {
      ipc.send('exitTable')
    },
    shutdown () {
      Modal.confirm({
        content: '关闭系统？请保存文件后确认。',
        onOk () {
          let shell = 'shutdown -s -t 00'
          if (require('os').platform() != 'win32') {
            shell = 'shutdown now'
          }
          let command = execShell(shell, (err, stdout, stderr) => {
            if (err || stderr) {
              message.error('关机失败，请确认软件权限。')
            }
          })
        }
      })
    },
    logout () {
      Modal.confirm({
        content: '注销系统？',
        onOk () {
          let shell = 'shutdown -l'
          let command = execShell(shell, (err, stdout, stderr) => {
            if (err || stderr) {
              message.error('注销失败，请确认软件权限。')
            }
          })
        }
      })
    },
    sleep () {
      Modal.confirm({
        content: '休眠系统？',
        onOk () {
          runNir('standby')
        }
      })
    },
    reboot () {
      Modal.confirm({
        content: '重启系统？请保存文件后确认。',
        onOk () {
          let shell = 'shutdown -r -t 0'
          if (require('os').platform() != 'win32') {
            shell = 'shutdown -r now'
          }
          let command = execShell(shell, (err, stdout, stderr) => {
            if (err || stderr) {
              message.error('重启失败，请确认软件权限。')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.power-btn {
  display: inline-block;
  border-radius: 100%;
  color: white;
  width: 3.2em;
  height: 3.2em;
  line-height: 3em;
  text-align: center;
  font-size: 3em;
  background: rgba(0, 0, 0, 0.24);
  margin: 0.5em;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
}
</style>
