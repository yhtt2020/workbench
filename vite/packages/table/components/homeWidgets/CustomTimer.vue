<template>
  <HomeComponentSlot :options="options">
    <div class="absolute  left-4 top-4 h-6 w-16 pointer"   @click="moveToday"></div>
    <div style="border-bottom: solid 1px  rgba(255, 255, 255, 0.1);" class="my-calendar">
      <Calendar  :is-dark="isDark" :attributes="attributes"  transparent borderless  :color="selectedColor" ref="calendar">

      </Calendar>
    </div>


      <a-row class="festival mt-4 s-item" style="border-radius: 12px;height: 60px">
        <a-col :span="11" class="flex flex-row items-center pl-2 py-2">
          <div class="round-dot mr-3"></div>
          <div class="flex flex-col">
            <span>劳动节</span>
            <span style="color: rgba(255, 255, 255, 0.4);font-size: 12px;">农历三月十二</span>
          </div>

        </a-col>
        <a-col :span="13" class="flex flex-row items-center justify-end pr-2" >4月29日~5月3日</a-col>
      </a-row>
<!--      <a-row class="festival mt-2 " style="border-radius: 12px;background: rgba(42, 42, 42, 1);height: 44px">-->
<!--        <a-col :span="11" class="flex flex-row items-center pl-2">-->
<!--          <div class="round-dot mr-3"></div>-->
<!--          端午节-->
<!--        </a-col>-->
<!--        <a-col :span="13"  class="text-right flex  items-center justify-end pr-2">6月22日~6月24日</a-col>-->
<!--      </a-row>-->

  </HomeComponentSlot>

</template>

<script>
import { mapActions } from 'pinia'
import { cardStore } from '../../store/card'
import HomeComponentSlot from './HomeComponentSlot.vue'
import { Calendar  } from 'v-calendar';
import 'v-calendar/style.css';
export default {
  name: 'CustomTimer',
  data () {
    return {
      status: 'pause',
      value: null,
      visible: false,
      options: {
        className: 'card',
        title: '日历',
        icon: 'carryout',
        type: 'customTimer'
      },
      attributes:[{
        highlight: true,
        dates: new Date()
      },],
      selectedColor:'red',
      isDark:true


    }
  },
  components: {
    HomeComponentSlot,
    Calendar,
  },
  mounted() {

  },
  methods: {
    onPanelChange (value, mode) {},
    ...mapActions(cardStore, ['removeCustomComponents']),
   async moveToday(){
    await  this.$refs.calendar.move(new Date());
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    removeCalendar () {
      this.removeCustomComponents(this.customIndex)
      this.visible = false
    }
  },
}
</script>
<style>
.ant-picker-calendar .ant-picker-panel {
  border-top: none;
  background: none;
}
</style>
<style scoped lang="scss">
:deep(.ant-picker-date-panel) {
  background: transparent;
}

:deep(.ant-picker-calendar-date-value) {
  border-radius: 100%;
  color: white;

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

:deep(.ant-picker-cell-in-view.ant-picker-cell-today .ant-picker-calendar-date-value,ant-picker-cell-inner ant-picker-calendar-date ant-picker-calendar-date-today) {
  color: white;
  z-index: 2;
}

:deep(.ant-picker-calendar) {
  background: transparent;
}

.festival {
  padding-left: 4px;
  padding-right: 4px;
  border-radius: 4px;
  margin-bottom: 2px;
}
:deep(.vc-title){
  background-color: transparent;
}
:deep(vc-arrow vc-next vc-focus){
  background-color: transparent;
}
:deep(.vc-container .vc-weekday-1) {
  color: rgba(255, 255, 255, 0.85);
}
:deep(.vc-container .vc-weekday-2) {
  color: rgba(255, 255, 255, 0.85);
}
:deep(.vc-container .vc-weekday-3) {
  color: rgba(255, 255, 255, 0.85);
}
:deep(.vc-container .vc-weekday-4) {
  color: rgba(255, 255, 255, 0.85);
}
:deep(.vc-container .vc-weekday-5) {
  color: rgba(255, 255, 255, 0.85);
}
:deep(.vc-container .vc-weekday-6) {
  color: rgba(255, 255, 255, 0.85);
}
:deep(.vc-container .vc-weekday-7) {
  color: rgba(255, 255, 255, 0.85);
}
:deep(.vc-header .vc-next){
  background-color: transparent;
}
:deep(.vc-header .vc-prev){
  background-color: transparent;
}
:deep(.vc-nav-arrow){
  background-color: transparent;
}
:deep(.vc-nav-title){
  background-color: transparent;
}
:deep(.vc-nav-item){
  background-color: transparent;
}
:deep(.vc-focus:focus-within) {
  outline: 0;
   box-shadow: none;
}
:deep(.vc-day){
  min-height: 35px;
}
</style>
