<template>
  <xt-container
    :customData="customData"
    :options="options"
    :desk="desk"
    :header="header"
    v-model:customSize="customData.customSize"
    :customIndex="customIndex"
    @delete="deleteCard">
    <div class="absolute w-16 h-6 left-4 top-1 pointer"   @click="moveToday"></div>
    <div style="color:var(--primary-text) !important" class="my-calendar">
      <Calendar style="color:var(--primary-text) !important" :is-dark="isDark" :attributes="attributes"  transparent borderless  :color="selectedColor" ref="calendar">
      </Calendar>
    </div>
  </xt-container>

</template>

<script>
import { mapActions } from 'pinia'
import { cardStore } from '../../store/card'
import Widget from '../card/Widget.vue'
import { Calendar  } from 'v-calendar';
import 'v-calendar/style.css';
import { Icon as newIcon } from '@iconify/vue';
import { communityNavStore } from "../bottomPanel/store/communityNavStore";

export default {
  name: 'CustomTimer',
  props:['desk','customData','openWay','customIndex'],
  data () {
    return {
      status: 'pause',
      value: null,
      visible: false,
      attributes:[{
        highlight: true,
        dates: new Date()
      },],
      selectedColor:'red',
      isDark:true,
      header:{
        title:'日历',
        // ifyIcon:"fluent:calendar-16-regular",
        showIcon:"/logo/countdownDay.svg",


      },
      customSize:'2x4'


    }
  },
  components: {
    Widget,
    Calendar,
    newIcon
  },
  computed:{
    options(){
      return {
        customDel: this.openWay === "nav" ? true : false,
        disableEdit:this.isCommunityDesktop(this.desk),
      }
    }
  },
  emit:['delete'],
  mounted() {
    this.customData.customSize = '2x3'
  },
  methods: {
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    onPanelChange (value, mode) {},
    ...mapActions(cardStore, ['removeCard']),
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
      this.removeCard(this.customIndex)
      this.visible = false
    },
    deleteCard(){
      this.$emit('delete')
    }
  },
}
</script>
<style>
.vc-arrow {
  color: var(--primary-text) !important;
}
.vc-weekday ,.vc-header >.vc-title{
  color: var(--primary-text) !important;
}
.ant-picker-calendar .ant-picker-panel {
  border-top: none;
  background: none;
}
.vc-header {
  margin-top: 0px;
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
