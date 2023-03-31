<template>
  <HomeComponentSlot :options="options">
    <div>
      <a-calendar
        v-model:value="value"
        :fullscreen="false"
        @panelChange="onPanelChange"
      >
        <template #headerRender="{}">
          <div class="timer-title" style="display: none">
          </div>
        </template>
      </a-calendar>
    </div>
    <a-row style="font-size: 1.2em; line-height: 2em">
      <a-col :span="12"><Icon icon="jieriyingxiao"></Icon> 清明节</a-col>
      <a-col :span="12">4月5日~4月5日</a-col>
      <a-col :span="12"><Icon icon="jieriyingxiao"></Icon> 劳动节</a-col>
      <a-col :span="12">4月29日~5月3日</a-col>
      <a-col :span="12"><Icon icon="jieriyingxiao"></Icon> 端午节</a-col>
      <a-col :span="12">6月22日~6月24日</a-col>
    </a-row>
  </HomeComponentSlot>

</template>

<script>
import {mapActions} from "pinia";
import {tableStore} from "../../store";
import HomeComponentSlot from "./HomeComponentSlot.vue";
export default {
  name: "CustomTimer",
  data() {
    return {
      status: "pause",
      value: null,
      visible:false,
      options:{
        className:'card',
        title:'日历',
        icon:'rili3',
        type:'customTimer'
      },
    };
  },
  components:{
    HomeComponentSlot
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
