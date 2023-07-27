<template>
  <back-btn></back-btn>
  <!-- 快速搜索 闹钟 设置 -->
  <div class="title" style="color:var(--primary-text) ;margin-left:70px;margin-top: 27px">
    <Icon
      style="width: 5%; height: 2em; margin-right: 1%; vertical-align: middle"
      icon="shezhi1"
    ></Icon>
    <span style="margin-left: -1em" >「{{ title }}」设置</span>
  </div>
  <div class="card content" v-if="cardType === 'countdownDay'" >
    <a-row>
      <a-col :span="10" style="border-right: 1px solid #454545; height: calc(100vh - 16em)">

        <a-row> <a-col>事件名字 </a-col></a-row>
        <a-row>
          <a-col>
            <a-input v-model:value="eventValue" placeholder="请输入"
          /></a-col>
        </a-row>
        <a-row> <a-col>日期 </a-col></a-row>
        <a-row>
          <div class="button">
            <a-date-picker
              v-model:value="dateValue"
            />
            <a-button type="primary" @click="addCard">添加</a-button>
          </div>
        </a-row>
      </a-col>
      <a-col :span="14">
        <a-row>
          <a-col> 已添加的{{ title }}</a-col></a-row
        >
        <vue-custom-scrollbar
          :settings="outerSettings"
          style="position: relative; height: calc(100vh - 20em)"
          class="scroll"
        >
          <a-row class="list">
            <div
              class="event-list"
              v-for="(item, index) in countdownDay"
              style="background-color: #3b3b3b"
            >
              <a-dropdown :trigger="['contextmenu']">
                <div class="card-list">
                  <div class="event-title">
                    <span class="text-more">{{ item.eventValue }}</span>
                    <span class="event"
                      >{{ item.dateValue.year }}年{{ item.dateValue.month }}月{{
                        item.dateValue.day
                      }}日</span
                    >
                  </div>
                  <div>
                    <span v-if="item.type">还有</span>
                    <span v-else>已过</span> {{
                      transDate(
                        appDate.year + "-" + appDate.month + "-" + appDate.day,
                        item.dateValue.year +
                          "-" +
                          item.dateValue.month +
                          "-" +
                          item.dateValue.day
                      )
                    }}天
                  </div>
                </div>

                <template #overlay>
                  <a-menu @click="(e) => onContextMenuClick(e, index)">
                    <a-menu-item key="1">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </a-row></vue-custom-scrollbar
        >
      </a-col>
    </a-row>
  </div>
  <div class="card content" v-if="cardType === 'smallCountdownDay'">
    <a-row>
      <a-col :span="10" style="border-right: 1px solid #454545; height: calc(100vh - 16em)">

        <a-row> <a-col>事件名字 </a-col></a-row>
        <a-row>
          <a-col>
            <a-input v-model:value="eventValue" placeholder="请输入"
            /></a-col>
        </a-row>
        <a-row> <a-col>日期 </a-col></a-row>
        <a-row>
          <div class="button">
            <a-date-picker
              v-model:value="dateValue"
            />
            <a-button type="primary" @click="addCard">添加</a-button>
          </div>
        </a-row>
      </a-col>
      <a-col :span="14">
        <a-row>
          <a-col> 已添加的{{ title }}</a-col></a-row
        >
        <vue-custom-scrollbar
          :settings="outerSettings"
          style="position: relative; height: calc(100vh - 20em)"
          class="scroll"
        >
          <a-row class="list">
            <div
              class="event-list"
              v-for="(item, index) in countdownDay"
              style="background-color: #3b3b3b"
            >
              <a-dropdown :trigger="['contextmenu']">
                <div class="card-list">
                  <div class="event-title">
                    <span class="text-more">{{ item.eventValue }}</span>
                    <span class="event"
                    >{{ item.dateValue.year }}年{{ item.dateValue.month }}月{{
                        item.dateValue.day
                      }}日</span
                    >
                  </div>
                  <div>
                    {{
                      transDate(
                        appDate.year + "-" + appDate.month + "-" + appDate.day,
                        item.dateValue.year +
                        "-" +
                        item.dateValue.month +
                        "-" +
                        item.dateValue.day
                      )
                    }}天
                  </div>
                </div>

                <template #overlay>
                  <a-menu @click="(e) => onContextMenuClick(e, index)">
                    <a-menu-item key="1">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </a-row></vue-custom-scrollbar
        >
      </a-col>
    </a-row>
  </div>
  <div class="card content" v-if="cardType === 'clock'">

    <div class="line-title pl-10">当前时间： {{ dateTime.hours }}:{{dateTime.minutes}}</div>
    <a-row>
      <a-col :span="10" style="border-right: 1px solid #454545; height: calc(100vh - 16em)">
        <vue-custom-scrollbar
          :settings="outerSettings"
          style="position: relative; height: calc(100vh - 16em);color: var(--primary-text);"
          class="scroll"
        >
        <a-row>
          <a-col>
            <a-input ref="input" allow-clear @click="$refs.input.select()"  v-model:value="eventValue" placeholder="闹钟名称"
          /></a-col>
        </a-row>

          <div class="line">小时</div>
          <div class="line">
            <a-radio-group button-style="solid" v-model:value="timeHour">
              <template   v-for="i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]">
                <a-radio-button   :value="i" class="mb-2 text-center" style="width: 80px">{{i}}</a-radio-button>
              </template>

            </a-radio-group>
          </div>
          <div class="line">分钟 &nbsp;

            <a-select v-model:value="timeMinute" placeholder="选择分钟" style="width:120px">
              <a-select-option :value="index" v-for="(i,index) in new Array(60)">
                {{index}}
              </a-select-option>

            </a-select>
          </div>

<!--            <a-time-picker v-model:value="clockDate" format="HH:mm"-->
<!--                           />-->



        <a-row>



          <a-radio-group v-model:value="clockType" button-style="solid">
            <a-radio-button value="不重复" style="color:var(--primary-text)">不重复</a-radio-button>
            <a-radio-button value="每天">每天</a-radio-button>
          </a-radio-group>

        </a-row>

        <a-row>

            <a-button size="large" class="rounded-full" type="primary" block @click="addSettingClock"
              >设置</a-button
            >
        </a-row>
        </vue-custom-scrollbar>
      </a-col>
      <a-col :span="14">
        <a-row>
          <a-col style="color:var(--primary-text)"> 已设置的{{ title }}</a-col></a-row
        >
        <a-empty v-if="clockEvent.length===0" description="暂无闹钟" image="/img/test/load-ail.png"></a-empty>
        <vue-custom-scrollbar
          :settings="outerSettings"
          style="position: relative; height: calc(100vh - 20em)"
          class="scroll"
        >
          <a-row class="list">
            <div
              class="event-list rounded-lg"
              v-for="(item, index) in clockEvent"
              style="background: var(--primary-bg);color: var(--primary-text);"
            >
                <div class="card-list ">
                  <div class="event-title">
                    <span class="text-more">{{ item.eventValue }}</span>
                    <span class="event" style="color:var(--secondary-text)">{{ item.clockType }}</span>
                  </div>
                  <span
                    >{{ item.dateValue.hours }}:{{
                      item.dateValue.minutes
                    }}</span
                  >
                  <a-button class="rounded-full" type="danger" @click="(e) => onClockMenuClick(e, index)">删除</a-button>
                </div>
            </div></a-row
          ></vue-custom-scrollbar
        >
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { cardStore } from "../../../store/card";
import { timeStamp, transDate } from "../../../util";
import { message } from "ant-design-vue";
import dayjs from "dayjs";
import BackBtn from '../../../components/comp/BackBtn.vue'
import { getDateTime } from '../../../../../src/util/dateTime'
export default {
  name: "SetupCard",
  components: { BackBtn },

  data() {
    return {
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      title: "",
      countdownDayType: "大",
      clockType: "不重复",

      eventValue: "未命名",
      dateValue: null,
      clockDate: null,
      flag: true,
      customIndex:0,

      timeHour:0,//时钟设置的小时
      timeMinute:0,//时钟设置的分钟

      dateTime:{},//当前时间
      timer:null //当前时间更新计时器
    };
  },

  mounted() {
    if (this.$route.params["name"]) {
      // console.log(this.$route.params);
      this.title = this.$route.params["cname"];
      this.cardType = this.$route.params["name"];
      this.customIndex = this.$route.params["customIndex"];
    }
    this.updateTime()
    this.timer=setInterval(()=>{
      this.updateTime()
    },1000)
  },
  unmounted () {
    clearInterval(this.timer)
  },
  computed: {
    ...mapWritableState(cardStore, ["countdownDay", "appDate", "clockEvent"]),
  },
  methods: {
    dayjs,
    transDate,
    ...mapActions(cardStore, [
      "addCountdownDay",
      "addClock",
      "addCard",
      "removeCountdownDay",
      "removeClock",
    ]),
    updateTime(){
      this.dateTime = getDateTime()
    },
    addCard() {
      if (this.eventValue === "" || this.dateValue === null) {
        if (this.flag !== true) return;
        this.flag = false;
        setTimeout(() => {
          message.info("不可为空！");
          this.flag = true;
        }, 500);
        return;
      }
      this.addCountdownDay({
        eventValue: this.eventValue,
        dateValue: timeStamp(this.dateValue.valueOf()),
        customIndex:this.customIndex
      });
      // this.$router.push({
      //   name: "home",
      // });
      message.success("添加成功！");
    },
    addSettingClock() {
      if (this.eventValue === "") {
        if (this.flag !== true) return;
        this.flag = false;
        message.info("闹钟名称不可为空！");
        setTimeout(() => {
          this.flag = true;
        }, 500);
        return;
      }

      let date=new Date(Date.now())
      let timeSpan={
        day:date.getDate(),
        hours:this.timeHour<10?'0'+this.timeHour:this.timeHour,
        minutes:this.timeMinute<10?'0'+this.timeMinute:this.timeMinute,
        month:date.getMonth()+1,
        seconds:'00',
        year:date.getFullYear()
      }
      let dateSpan=timeStamp(timeSpan)


      this.addClock({
        clockType: this.clockType,
        eventValue: this.eventValue,
        dateValue: timeSpan,
        clockTimeStamp:timeSpan
      });
      // this.$router.push({
      //   name: "home",
      // });
      message.success("添加成功！");
    },
    onContextMenuClick(e, index) {
      this.removeCountdownDay(index);
    },
    onClockMenuClick(e, index) {
      this.removeClock(index,1);
    },
  },
};
</script>

<style lang="scss" scoped>
.event-list {
  padding: 0.2em 0.5em;

  width: 100%;
  margin-top: 0.5em;
  .card-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .event-title {
      display: flex;
      flex-direction: column;
      width: 70%;

      .event {
        padding: 0;
        margin: 0;
        font-size: 0.6em;
        color: #6a6a6a;
      }
    }
  }
}
.title {
  display: flex;
  align-items: center;
  color: #dddddd;
  font-size: 1.3em;
}
.content {
  color: #dddddd;
  font-size: 1.3em;
  width: calc(100vw - 10em);
  padding: 0;
  margin-top: 2em;
}
.ant-row {
  margin: 1em;
}
.scroll {
  @media screen and (max-width: 1100px) {
    width: 100%;
  }
}
.button {
  display: flex;
  flex-direction: column;
  height: 5em;
  width: 8em;
  justify-content: space-between;

  button {
    width: 6em;
  }
  @media screen and (max-width: 1200px) {
    flex-direction: row;
    height: 2em;
    width: 14em;
    align-items: center;
  }
}
.list {
  display: flex;
  flex-direction: column;
  margin-top: -0.5em;
}
:deep(.ant-picker-header){
  -webkit-app-region: no-drag;
}
</style>
