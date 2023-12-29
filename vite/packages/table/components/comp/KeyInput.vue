<template>
  <a-input-group compact style="min-width: 120px">
    <a-input :placeholder="placeholder" @click="toggleListenKey()"
      style="width: calc(100% - 200px);min-width: 200px;color: var(--primary-text)" placeholder="按下快捷键" size="large"
      :value="value">
    </a-input>
    <a-button @click="toggleListenKey()" size="large" type="primary">
      修改
    </a-button>
  </a-input-group>
  <div tabindex='0/1' :id="'keyListener_' + this.name" v-show="listening"
    style="transform: translateX(-50%) translateY(-50%); position: absolute;width: 40vw;height:40vh;left: 50%;top: 50%;text-align: center;bottom: 0;background: rgba(21,21,21,0.8);border-radius:20px;line-height: 100px;font-size: 28px;z-index: 999">
    请按下 {{ this.title }} 快捷键<br>先按功能键（Ctrl、Shift、Alt再按其他键）<br>
    当前键位 {{ this.value }}
  </div>
</template>

<script>
export default {
  name: 'KeyInput',
  props: ['placeholder', 'name', 'title', 'value'],
  emits: ['changeKeys'],
  data() {
    return {
      listening: false,
      shortKeys: '',
      listener: null
    }
  },
  mounted() {
    this.shortKeys = this.value
    this.listener = document.getElementById('keyListener_' + this.name)
    // this.listener.onkeydown = (e) => {
    // }
    this.listener.onkeyup = (e) => {
      if (this.listening && (e.ctrlKey || e.altKey || e.shiftKey)) {
        this.shortKeys = this.getKeys(e)
        this.listening = false
        this.$emit('changeKeys', {key:this.name, shortcut: this.shortKeys })
        e.preventDefault()
      }
      e.stopPropagation()
    }
  },
  methods: {
    toggleListenKey() {
      this.listening = true
      this.$nextTick(() => {
        this.listener.focus()
      })
    },
    getKeys(e) {
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
      key += e.code.replaceAll('Key', '')
      return key
    },
  }
}
</script>

<style scoped></style>
