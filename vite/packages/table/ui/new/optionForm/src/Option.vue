<template>
  <xt-option-info
    v-if="option.type === 'info'"
    v-bind="option"
    v-model:switch="data[option.switchKey]"
    @onIconClick="test()"
  />
  <!-- 输入框组件 得优化 -->
  <xt-option-input
    v-else-if="option.type === 'input'"
    v-bind="option"
    v-model:input="data[option.inputKey]"
  />
  <!-- tab组件 得优化 -->
  <template v-else-if="option.type === 'tab'">
    <xt-option-tab
      :style="lineSpaceStyle"
      :option="option"
      v-bind="option"
      style="height: 40px"
      circle
      v-model="data[option.tabKey]"
    />
  </template>
  <template v-else-if="option.type === 'setAction'">
    <div @click="showEditAction(data,index)" :style="{'border-left-color':data.group.color}"
           v-for="(data,index) in data[option.actionKey]" class="action">
        {{ data.action.title }}
      <span v-if="data.action.name==='sendKeys'">
        {{data.action.data.keys.keyStr}}
      </span>
        <Icon class="close-btn" @click.stop="removeAction(index)" style="font-size: 15px" icon="guanbi1"></Icon>
    </div>
    <xt-button class="mb-2" size="sm" type="theme" @click="showEditAction">添加行为</xt-button>
  </template>
  <!-- 属于颜色选项 -->
  <xt-option-color
    v-bind="option"
    v-else-if="option.type === 'color'"
    v-model:color="data[option.colorKey]"
    v-model:switch="data[option.switchKey]"
    :style="lineSpaceStyle"
  />
  <xt-option-select
    v-bind="option"
    v-else-if="option.type === 'select'"
    v-model:select="data[option.selectKey]"
    :style="lineSpaceStyle"
  />
  <xt-option-multiple
    v-bind="option"
    v-else-if="option.type === 'multiple'"
    v-model:multiple="data[option.multipleKey]"
    :style="lineSpaceStyle"
  />
  <xt-option-slider
    v-bind="option"
    v-else-if="option.type === 'slider'"
    v-model:slider="data[option.sliderKey]"
    :style="lineSpaceStyle"
  />
  <dropDown
    v-else-if="option.type === 'drop'"
    v-bind="option"
    v-model:mode="data[option.dropKey]"
    :style="lineSpaceStyle"
  />
  <!-- 自定义插槽 -->
  <slot v-else-if="option.type === 'slot'" :name="option.slot"> </slot>
  <div v-if="option?.border" class="tt-divider"></div>
  <xt-modal
    v-if="editActionVisible"
    v-model="editActionVisible"
    title="选择指令"
    @close="editActionVisible = false"
  >
  <div style="width: 800px;height: 600px">
    <DeckAction :data="editAction" ref="_deckAction" @click="doAddAction"></DeckAction>
  </div>

  </xt-modal>
</template>

<script setup lang="ts">
import { defineAsyncComponent,ref } from 'vue'
import DeckAction from '../../../../apps/deck/DeckAction.vue'
const editingAction=ref({})
const editActionVisible=ref(false)
const editActionIndex=ref(-1)
const editAction=ref({})
// 下拉框选择 -- 打开模式选择（包含手机模式）
const dropDown = defineAsyncComponent(
  () => import('../../../../../table/components/desk/navigationBar/components/dropDown/DropDown.vue'));
export interface fromProps {
  option?: any;
  data?: any;
}
const props = withDefaults(defineProps<fromProps>(), {
  option: {},
});

const lineSpace = 12;
const lineSpaceStyle = {
  "margin-bottom": lineSpace + "px",
};
const showEditAction=(data,index=-1)=>{
  editAction.value=data
  editActionIndex.value=index
  editActionVisible.value=true
}
const doAddAction=(data)=>{
  editActionVisible.value=false
  if(!data){
    return
  }
  if(editActionIndex.value>-1){
    //编辑场景
    props.data[props.option.actionKey][editActionIndex.value]=data
  }else{
    props.data[props.option.actionKey].push(data)
  }

}
const removeAction=(index)=>{
  props.data[props.option.actionKey].splice(index,1)
}
const test = () => {
  // emits(option.iconCb);
};
</script>

<style lang="scss" scoped></style>
