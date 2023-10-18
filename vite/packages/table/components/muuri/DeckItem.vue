<template>
  <div @click="doActions(item)" class="item-content">
    <svg v-if="item.type==='icon'" style="margin-top: 7px" :style="getStyle" class="icon group-icon" aria-hidden="true">
      <use v-bind:xlink:href="'#icon-'+item.icon.name"></use>
    </svg>
    <div class="text-icon" v-if="item.type==='font'" :style="{'font-size':item.font.size+'px',color:item.font.color,'background':item.font.bgColor}">
      {{ item.font.text }}
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { deckStore } from '../../apps/deck/store'
import {message} from'ant-design-vue'
import { ActionHandler } from '../../js/action/actionHandler'
export default {
  name: 'DeckItem',
  props: ['item'],
  computed: {
    ...mapState(deckStore, ['settings','editing']),
    getStyle () {
      let width = 80
      switch (this.settings.iconSize) {
        case 'small':
          width = 40
          break
        case 'middle':
          width = 80
          break
        case 'large':
          width = 160
          break
        default:
          width = 80
      }
      return { 'font-size': width-10 + 'px' }
    }
  },
  methods:{
    async doActions (item) {
      if (this.editing) {
        //如果正在编辑，则不触发任何状态
        return
      }
      let done = []
      let success = []
      let failure = []
      let unknown = []
      if (item.actions) {
        for (const action of item.actions) {
          let handler = new ActionHandler(action)
          let result = await handler.doAction()
          done.push(result)
          if (result.status === 1) {
            success.push(result)
          } else if (result.status === 0) {
            failure.push(result)
          } else {
            unknown.push(result)
          }
        }
        if (failure.length === 0) {
          if (unknown.length) {
            message.success({content:`共为您执行${done.length}个动作，成功${success.length}个，未知${unknown.length}个`,key:'action'})
          } else {
            message.success({content:`共为您成功执行${done.length}个动作`,key:'action'})
          }

        } else {
          if (success.length > 0) {
            message.warn({content:`共为您执行${done.length}个动作，其中失败${failure.length}个，成功${success.length}，未知${unknown.length}个`,key:'action'})
          } else {
            message.error({content:`共为您执行${done.length}个动作，其中失败${failure.length}个，成功${success.length}，未知${unknown.length}个`,key:'action'})
          }
        }
        if(failure.length>0){
          console.warn({content:'打印失败日志：',key:'action'})
          failure.forEach(f=>{
            console.warn(f.message)
          })
        }
      } else {
      }
    }
  }
}
</script>

<style scoped>

</style>
