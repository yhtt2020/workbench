<template>
  <!--  <SecondPanel size="small" @changeTab="change" :menus="menus">-->

  <!--  </SecondPanel>-->

  <a-tabs style="margin-top: 4em" v-model:activeKey="activeTab" tab-position="left">
    <a-tab-pane :key="group.name" :tab="group.title" v-for="group in actionGroups">
      <ActionBuilder :key="'ab-'+resetActionBuilder" :ref="group.name" :group="group" :actions="group.actions">
      </ActionBuilder>
    </a-tab-pane>
<!--    <a-tab-pane key="audio" tab="系统设置">-->
<!--      <div class="action">-->
<!--        调大音量-->
<!--      </div>-->
<!--      <div class="action">-->
<!--        调小音量-->
<!--      </div>-->
<!--      <div class="action">-->
<!--        静音-->
<!--      </div>-->
<!--      <div class="action">-->
<!--        调高亮度-->
<!--      </div>-->
<!--      <div class="action">-->
<!--        调低亮度-->
<!--      </div>-->
<!--    </a-tab-pane>-->
<!--    <a-tab-pane key="keys" tab="键鼠">-->
<!--      <div class="action">-->
<!--        模拟鼠标-->
<!--      </div>-->
<!--      <div class="action">-->
<!--        模拟按键-->
<!--      </div>-->
<!--    </a-tab-pane>-->
<!--    <a-tab-pane key="app" tab="应用">-->
<!--      <div class="action">-->
<!--        打开系统内应用-->
<!--      </div>-->
<!--      <div class="action">-->
<!--        打开轻应用-->
<!--      </div>-->
<!--      <div class="action">-->
<!--        打开酷应用-->
<!--      </div>-->
<!--    </a-tab-pane>-->

  </a-tabs>
  <div style="text-align: center">
    <a-button @click="addAction" type="primary">确认</a-button>

    <a-button @click="back">取消</a-button>
  </div>
  <div>


  </div>
</template>

<script lang="ts">
import BackBtn from '../../components/comp/BackBtn.vue'
import ActionBuilder from "../../components/deck/ActionBuilder.vue";
import {ActionGroups} from "../../consts";
import _ from 'lodash-es'
/**
 * 添加一个新的Tab行为
 */
interface AAddTab {
  //链接
  url: string,
  //builtin system table
  position: string,
  //current new
  tab: string,

}


export default {
  name: 'DeckAction',
  data() {
    return {
      current: '',//当前的
      activeTab: 'cmd',
      resetActionBuilder:0,//用于重载组件
      actionGroups: ActionGroups,
      actionData:{}//指令数据
    }
  },
  props:['data'],
  emits:['click'],
  components: {ActionBuilder, BackBtn},
  computed: {},
  mounted() {
   this.reset()
    if(this.data){
      this.$nextTick(()=>{
        this.activeTab=this.data.group.name
        this.$nextTick(()=>{
          this.$refs[this.activeTab][0].setActionData(this.data)
        })

      })

      //this.$refs[this.activeTab][0].setActionData(this.data)
    }
  },
  methods: {
    reset(){
      this.actionGroups=_.cloneDeep(ActionGroups)
      this.activeTab = this.actionGroups[0].name
      this.resetActionBuilder=Date.now()
    },
    change(tab) {
    },
    back() {
      this.$emit('click')
    },
    addAction(){
      let actionData=this.$refs[this.activeTab][0].getActionData()
      if(!actionData){
        return
      }
      this.$emit('click',actionData)
    }
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
  background: white;
  font-weight: bold;
}
</style>
