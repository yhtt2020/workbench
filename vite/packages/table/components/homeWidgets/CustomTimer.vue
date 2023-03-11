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
              icon="rili3"
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
  name: "CustomTimer",
  data() {
    return {
      status: "pause",
      value: null,
    };
  },
  methods: {
    onPanelChange(value, mode) {},
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
.title {
  background: #363739;
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
</style>
