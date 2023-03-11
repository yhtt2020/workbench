<template>
  <div v-for="action in actions" :class="{active:isActive(action.name)}" @click="setActive(action.name)" class="action">
    {{ action.title }}
  </div>
  <div v-for="action in actions">

    <div v-if="this.isActive(action.name)">
      <div v-if="action.summary" class="line" v-html="action.summary">
      </div>
      <template v-for="input in action.inputs">
        <div class="line"   v-if="getShow(action,input,'input')">{{ input.title }}：
          <a-input  v-model:value="action.data[input.name]" :placeholder="input.placeholder"
                   :style="{width: input.width}"></a-input>
        </div>
        <div class="line" v-if="getShow(action,input,'radio')">{{ input.title }}：
            <a-radio-group v-model:value="action.data[input.name]">
              <a-radio v-for="option in input.options" :value="option.value">{{ option.name }}</a-radio>
            </a-radio-group>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Template from '../../../user/pages/Template.vue'

export default {
  name: 'ActionBuilder',
  components: { Template },
  props: ['actions'],
  data () {
    return {
      current: '',
    }
  },
  mounted () {
    console.log(this.actions)
    this.actions.forEach(action=>{
      action.data=action.defaultValue
      if(!action.data){
        action.data={}
      }
    })
  },
  methods: {
    getShow(action,input,type){
      let assign=true
      if(input.assign){
        let conditions=Object.keys(input.assign)
        let hasFalse= conditions.some(key=>{
          if(action.data[key]!==input.assign[key]){
            return true
          }
        })
        assign=!hasFalse
      }
      return input.type===type && assign
    },
    isActive (key) {
      return this.current === key
    },
    setActive (key) {
      this.current = key
    },
  }
}
</script>

<style scoped>
.action {
  border-radius: 0.4em;
  border: 1px solid #4f4f4f;
  display: inline-block;
  text-align: center;
  border-left: 4px solid #0a84ff;
  line-height: 2;
  font-size: 1.1em;
  padding: 0.3em 0.8em;
  color: #111111;
  margin-right: 1em;
  margin-bottom: 1em;
  background: #b9b9b9;
  cursor: pointer;
}

.active {
  font-weight: bold;
}
</style>
