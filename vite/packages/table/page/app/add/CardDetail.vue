<template>
  <div class="mask">
    <a-card style="width: 60%" class="card-content">
      <a-button type="primary" style="background: transparent;border: none;position: absolute;top: 1%;right: 3%;font-size: 2em" @click="onBack">x</a-button>
      <div>{{cardType.cname}}</div>
      <div>{{cardType.detail}}</div>
      <div class="card cartoon" style="height: auto;">
        <div style="border-bottom: 1px solid #777777">
          <a-calendar
            v-model:value="value"
            :fullscreen="false"
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
    </a-card>
  </div>

</template>

<script>
export default {
  name: "CardDetail",
  props:{
    cardType:{
      type:Object,
      default:()=>{}
    }
  },
  mounted() {
    console.log(this.cardType)
  },
  methods:{
    onBack(){
      this.$emit("onBack")
    }
  }
}
</script>

<style lang="scss" scoped>
.mask{
  background-color: rgba(0,0,0,0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

.card-content {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  justify-content: center;
  text-align: center;
  perspective:1200px;
}
}
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
 .cartoon{

  transform:scale(0.8) rotate3d(1,1,1,15deg);

}
</style>
