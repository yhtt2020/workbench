<template>
  <div :style="{'border-left-color':group.color}" v-for="action in actions" :class="{active:isActive(action.name)}"
       @click="setActive(action)" class="action">
    {{ action.title }}
  </div>
  <div v-for="action in actions">

    <div v-if="this.isActive(action.name)">
      <div v-if="action.summary" class="line" v-html="action.summary">
      </div>
      <template v-for="input in action.inputs">
        <div class="line" v-if="getShow(action,input,'input')">{{ input.title }}：
          <a-input v-model:value="action.data[input.name]" :placeholder="input.placeholder"
                   :style="{width: input.width}"></a-input>
        </div>
        <div class="line" v-if="getShow(action,input,'keyInput')">当前按键：{{action.data[input.name]?.keyStr}}
          <xt-button @click="showKeyboard(action,input.name)">修改</xt-button>
        </div>
        <div class="line" v-if="getShow(action,input,'switch')">{{ input.title }}：
          <a-switch v-model:checked="action.data[input.name]"></a-switch>
        </div>
        <div class="line" v-if="getShow(action,input,'radio')">{{ input.title }}：
          <a-radio-group v-model:value="action.data[input.name]">
            <a-radio v-for="option in input.options" :value="option.value">{{ option.name }}</a-radio>
          </a-radio-group>
        </div>

        <div class="line" v-if="getShow(action,input,'file')">{{ input.title }}：
          <a-input :placeholder="input.placeholder" @click="showOpenFileDialog(action,input)" style="width: 15em"
                   v-model:value="action.data[input.name]"></a-input>
        </div>
        <template class="line" v-if="getShow(action,input,'textarea')">
          <div class="line">
            {{ input.title }}：
          </div>
          <div class="line">
            <a-textarea :placeholder="input.placeholder" v-model:value="action.data[input.name]"></a-textarea>
          </div>
        </template>

      </template>
      <KeyBoard
        v-if="visibleKeyboard"
        :selectKey="selectKey"
        :parentKeyList="actions"
        :refreshKeys="refreshKey"
        @closeKeyBoard="visibleKeyboard=false"
        :custom="true"
        @saveKey="saveKey"
      >
      </KeyBoard>
    </div>
  </div>
</template>

<script>
import Template from '../../../user/pages/Template.vue'
import _ from 'lodash-es'
import {message} from 'ant-design-vue'
import KeyInput from "../comp/KeyInput.vue";
import KeyBoard from "../comp/KeyBoard.vue";

export default {
  name: 'ActionBuilder',
  components: {KeyBoard, KeyInput, Template},
  props: ['actions', 'group'],
  data() {
    return {
      current: '',
      currentAction: {},
      visibleKeyboard:false,
      type:'',
      selectKey:'',
    }
  },
  mounted() {
    this.current = this.actions[0].name
    this.actions.forEach(action => {
      action.data = action.defaultValue
      if (!action.data) {
        action.data = {}
      }
    })
  },
  methods: {

    saveKey(keyArr){
      console.log('获取到设置的key',keyArr)
      this.visibleKeyboard = false
      // this.keyList.forEach((item, index) => {
      //   if (item.id === keyArr.id) {
      //     if (keyArr.title && !this.bulkEditKey) {
      //       keyArr.isEdit = false
      //       keyArr.isNote = false
      //     }
      //     this.keyList.splice(index, 1, keyArr)
      //     this.keyContent = keyArr.keyStr
      //   }
      //   if (item.keyStr === '' || item.title === '') {
      //     item.isEdit = true
      //     item.isNote = true
      //   }
      // })
      this.selectKey.keyArr= keyArr.keyArr
      this.selectKey.keys= keyArr.keys
      this.selectKey.keyStr= keyArr.keyStr
      console.log(this.selectKey,'已经被设置的')
      console.log(this.actions,'全部action')
    },
    showKeyboard(action,inputName){
      action.data[inputName]={keyArr:[],keyStr:''}
      this.selectKey= action.data[inputName]
      this.visibleKeyboard=true
    },
    refreshKey(){
      this.actions[this.selectKey]=''
    },
    setActionData(data) {
      this.current = data.name
      let action = this.actions.find(ac => {
        return ac.name === this.current
      })
      action.data = _.cloneDeep(data.args)
    },



    getActionData() {
      let actionData = {}
      let action
      action = this.actions.find(ac => {
        return ac.name === this.current
      })
      let validate = this.validate(action)
      if (!validate.pass) {
        message.error(validate.message)
        return null
      }
      actionData = {
        action: action,
        group: this.group,
        name: action.name,
        args: _.cloneDeep(action.data)
      }
      return actionData
    },
    validate(action) {
      let message = ''
      if (!action.inputs) {
        //如果没有任何输入的直接返回成功即可
        return {
          pass: true
        }
      }
      let notPass = action.inputs.some(input => {
        if (input.rules) {
          return input.rules.some(rule => {
            if (Object.keys(rule).indexOf('required') > -1) {
              //如果是要校验require的
              if(input.type==='keyInput'){
                return action.data[input.name].keyStr === '';
              }


              if (typeof (action.data[input.name]) === 'undefined' || action.data[input.name].trim() === '') {
                message = rule.message
                return true
              }
            }
          })
        }
      })
      if (notPass) {
        return {
          pass: false,
          message: message
        }
      } else {
        return {
          pass: true
        }
      }
    },
    getShow(action, input, type) {
      let assign = true
      if (input.assign) {
        let conditions = Object.keys(input.assign)
        let hasFalse = conditions.some(key => {
          if (action.data[key] !== input.assign[key]) {
            return true
          }
        })
        assign = !hasFalse
      }
      return input.type === type && assign
    },
    isActive(key) {
      return this.current === key
    },
    setActive(action) {
      this.current = action.name
      this.currentAction = action
    },
    async showOpenFileDialog(action, input) {
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择', message: '请选择文件', properties: [
          'openFile ',
        ]
      })
      if (savePath) {
        action.data[input.name] = savePath[0]
      } else {
      }
    }
  }
}
</script>

<style>
.action {
  font-size: 0.9em;
}
</style>
