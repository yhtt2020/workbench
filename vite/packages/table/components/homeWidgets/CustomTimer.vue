<template>
  <div class="card">
    <div>
      <a-calendar
        v-model:value="value"
        :fullscreen="false"
        @panelChange="onPanelChange"
      >
        <template #headerRender="{}">
          <div class="timer-title">
            <Icon
              icon="rili3"
              style="height: 1.3em; width: 1.3em; margin-right: 0.1em"
            ></Icon>
            日历
            <Icon
            style="width: 1em; height: 1em;cursor:pointer;position: absolute;right: 0.5em"
            icon="gengduo1"
            class="title-icon"
            @click="showDrawer"
          ></Icon>
          </div>

        </template>
      </a-calendar>
    </div>
    <a-row style="font-size: 1.2em; line-height: 2.2em">
      <a-col :span="12"><Icon icon="jieriyingxiao"></Icon> 清明节</a-col>
      <a-col :span="12">4月5日~4月5日</a-col></a-row
    >
  </div>
  <a-drawer
    :contentWrapperStyle="{ padding:10,marginLeft:'2.5%',
    backgroundColor:'#1F1F1F',width: '95%',height:'11em',borderRadius:'5%'}"
    :width="120"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="visible"
    @close="onClose"
  >
      <div class="option" @click="removeCalendar"><Icon
        style="
        width: 3em;
        height: 3em;
        vertical-align: middle;
      "
        icon="guanbi2"
      ></Icon>删除</div>

  </a-drawer>
</template>

<script>
import {mapActions} from "pinia";
import {tableStore} from "../../store";

export default {
  name: "CustomTimer",
  props:{
    customIndex:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      status: "pause",
      value: null,
      visible:false
    };
  },
  methods: {
    onPanelChange(value, mode) {},
    ...mapActions(tableStore, ["removeCustomComponents"]),
    showDrawer()  {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    removeCalendar(){
      this.removeCustomComponents(this.customIndex)
      this.visible = false;
    }
  },
};
</script>

<style scoped lang="scss">
.card{
  max-height:30em;
  border-radius: 8px;
  vertical-align: text-top;

  width: 20em;
  min-width: 20em;
  display: inline-block;
  height: 420px;
  padding: 10px 13px .5em 13px ;
  margin-right: 14px;
  position: relative;}
:deep(.ant-picker-date-panel) {
  background: #363739;
}
:deep(.ant-picker-calendar-date-value) {
  border-radius: 100%;

  &:hover {
    background: red;
    border-radius: 100%;
  }
}
:deep(.ant-picker-cell-selected) {
  background: #363739;
}
:deep(
    .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner
  ) {
  background: red;
  border-radius: 100%;
}
:deep(.ant-picker-cell .ant-picker-cell-inner) {
  border-radius: 100%;
}
.timer-title {
  background: #363739;
  font-size: 1.5em;
  position: relative;
}

:deep(
    .ant-picker-cell-in-view.ant-picker-cell-today
      .ant-picker-cell-inner::before
  ) {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  border: 1px solid red;
  border-radius: 100%;
  content: "";
}
.option{
  background: #161616;
  width: 8em;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10%;
  margin-left: 1.8em;
  cursor:pointer
}
:deep(.ant-picker-calendar){
  background: transparent;
}
</style>
