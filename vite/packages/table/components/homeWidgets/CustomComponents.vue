<template>
  <div class="card">
    <div style="border-bottom: 1px solid #777777">
      <a-calendar
        v-model:value="value"
        :fullscreen="false"
        @panelChange="onPanelChange"
      >
        <template #headerRender="{}">
          <div class="title">
            <Icon
              icon="douban"
              style="height: 1.3em; width: 1.3em; margin-right: 0.1em"
            ></Icon>
            日历
          </div>
        </template>
      </a-calendar>
    </div>
    <a-row style="font-size: 1.2em; line-height: 2.2em">
      <a-col :span="12"><Icon icon="jieriyingxiao"></Icon> 清明节</a-col>
      <a-col :span="12">4月5日~4月5日</a-col></a-row
    >
  </div>
</template>

<script>
export default {
  name: "CustomComponents",
  data() {
    return {
      status: "pause",
      value: null,
    };
  },
  methods: {
    onPanelChange(value, mode) {

    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .ant-picker-date-panel {
  background: #363739;
}
::v-deep .ant-picker-calendar-date-value {
  border-radius: 100%;

  &:hover {
    background: red;
  }
}
::v-deep .ant-picker-cell-selected {
  background: #363739;
}
.ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner,
.ant-picker-cell-in-view.ant-picker-cell-range-start .ant-picker-cell-inner,
.ant-picker-cell-in-view.ant-picker-cell-range-end .ant-picker-cell-inner {
  background: red;
  border-radius: 100%;
}
.ant-picker-cell .ant-picker-cell-inner {
  border-radius: 100%;
}
.title {
  background: #363739;
}
</style>
