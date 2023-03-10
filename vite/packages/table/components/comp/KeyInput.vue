<template>
  <a-input-group compact style="min-width: 120px">
    <a-input :placeholder="placeholder" @click="toggleListenKey()" style="width: calc(100% - 200px);min-width: 200px"  placeholder="按下快捷键" size="large" :value="value">
    </a-input>
    <a-button @click="toggleListenKey()" size="large" type="primary">
      修改
    </a-button>
  </a-input-group>
  <div tabindex='0/1' :id="'keyListener_'+this.name" v-show="listening" style="position: fixed;width: 100vw;height: 100vh;left: 0;right: 0;text-align: center;bottom: 0;top: 0;background: rgba(21,21,21,0.93);line-height: 33vh;font-size: 3em;z-index: 999">
    请按下 {{this.title}} 快捷键<br>先按功能键（Ctrl、Shift、Alt再按其他键）<br>
    当前键位 {{this.value}}
  </div>
</template>

<script>
export default {
  name: 'KeyInput',
  props:['placeholder','name','title','value'],
  emits:['changeKeys'],
  data(){
    return {
      listening:false,
      shortKeys:'',
      listener:null
    }
  },
  mounted () {
    this.shortKeys=this.value
    this.listener=document.getElementById('keyListener_'+this.name)
    // this.listener.onkeydown = (e) => {
    // }
    this.listener.onkeyup = (e) => {
      if(this.listening && (e.ctrlKey||e.altKey||e.shiftKey)){
        this.shortKeys=this.getKeys(e)
        this.listening=false

        this.$emit('changeKeys',{keys:this.shortKeys})
        e.preventDefault()
      }
      e.stopPropagation()
    }
  },
  methods:{
    toggleListenKey(){
      this.listening=true
      this.$nextTick(()=>{
        this.listener.focus()
      })
    },
    getKeys (e) {
      let key = ''
      if (e.ctrlKey) {
        key += 'ctrl+'
      }
      if (e.altKey) {
        key += 'alt+'
      }
      if (e.shiftKey) {
        key += 'shift+'
      }
      key += e.code.replaceAll('Key','')
      return key
    },
  }
}
</script>

<style scoped>

</style>
