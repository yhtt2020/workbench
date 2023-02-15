<template>
  <div class="main" style="text-align: center;padding-top: 3em">
    <BackBtn></BackBtn>
    <div @click="shutdown" class="power-btn">关机</div>
    <div class="power-btn">注销</div>
    <br/>
    <div @click="reboot" class="power-btn">重启</div>
    <div class="power-btn">休眠</div>
  </div>

</template>

<script>
import BackBtn from '../components/comp/BackBtn.vue'
import {Modal,message} from 'ant-design-vue'
const execShell=require('child_process').exec
export default {
  name: 'Power',
  components: { BackBtn },
  methods:{
    shutdown(){
      Modal.confirm({
        content:'关闭系统？请保存文件后确认。',
        onOk(){
          let shell='shutdown -s -t 00'
          if(require('os').platform()!='win32'){
            shell='shutdown now'
          }
          let command=execShell(shell, (err,stdout,stderr)=>{
            if(err||stderr){
              message.error('关机失败，请确认软件权限。')
            }
          })
        }
      })
    },
    reboot(){
      Modal.confirm({
        content:'重启系统？请保存文件后确认。',
        onOk(){
          let shell='shutdown -r -t 0'
          if(require('os').platform()!='win32'){
            shell='shutdown -r now'
          }
          let command=execShell(shell, (err,stdout,stderr)=>{
            if(err||stderr){
              message.error('重启失败，请确认软件权限。')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.power-btn{
  display: inline-block;
  border-radius: 100%;
  color: white;
  width: 3.2em;
  height: 3.2em;
  line-height: 3.2em;
  text-align: center;
  font-size: 3.5em;
  background: rgba(0, 0, 0, 0.24);
  margin:1em
}
</style>
