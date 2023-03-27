<template>
  <div class="p-3">
    <div class="mb-4">
      <BackBtn></BackBtn>
      <a-row class="pl-20 pt-6">
        <a-col :span="16">
          <div class="mb-2 text-lg ">{{ data.title }}</div>
        </a-col>
        <a-col :span="8" style="text-align: right">
          <a-row class="text-center" :gutter="10">
            <a-col :span="{sm:24,md:12}">
              <a-button @click="share" type="primary">
                <Icon class="mr-2" icon="fenxiang"></Icon>
                生成报告
              </a-button>
            </a-col>
            <a-col :span="{sm:24,md:12}">
              <a-dropdown-button :type="!task.running?'primary':''" @click="handleButtonClick">
                <template v-if="task.running">
                  <Icon class="mr-3" icon="zanting"></Icon>
                  暂停
                </template>
                <template v-else>
                  <Icon class="mr-3" icon="bofang"></Icon>
                  启动
                </template>
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item v-if="task.running" @click="refresh" key="1">
                      立即刷新
                    </a-menu-item>
                    <a-menu-item v-if="task.running" @click="showTask" key="1">
                      显示运行中网页
                    </a-menu-item>
                    <a-menu-item @click="openUrl" key="2">
                      浏览器打开源网页
                    </a-menu-item>
                    <a-menu-item key="3">
                      编辑任务
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <vue-custom-scrollbar :settings="outerSettings" style="position:relative;height:calc(100vh - 21em);  ">
      <div id="report" style="max-width: 900px;margin:auto;background: #323232">
        <div class="p-3">
          <a-row class="mb-5" :gutter="[20,10]">
            <a-col :md="5">
              <img crossorigin="anonymous" class="cover" :src="fixHttp(data.cover+'@320w_200h')">
            </a-col>
            <a-col :md="18">
              <div class="mb-2" style="color:#999"><span data-html2canvas-ignore>任务：{{ task.title }} </span>&nbsp;
                &nbsp;发布于 {{
                  data.pudate || '-'
                }}
              </div>
              <div>
                <a-row>
                  <a-col :span="6" class="pt-7 text-center">
                    <div
                      style="background: #555;line-height:30px;width: 100px;border-radius: 6px;display: inline-block">
                      <Icon title="播放" icon="bofang"></Icon>
                      总播放
                      <div>
                        <span class="text-white text-lg ml-2">{{ format(data.viewText) }}</span>
                      </div>
                    </div>

                  </a-col>
                  <a-col :offset="2">
                    <a-row class="text-l" :gutter="[10,15]">
                      <a-col :span="8">
                        <Icon title="点赞" icon="dianzan"></Icon>
                        点赞<br/>
                        <span class="text-white  ml-2">{{ format(data.like) }}</span>
                      </a-col>
                      <a-col :span="8">
                        <Icon title="投币" icon="jinbi"></Icon>
                        投币 <br>
                        <span class="text-white  ml-2">{{ format(data.coin) }}</span>
                      </a-col>
                      <a-col :span="8">
                        <Icon title="收藏" icon="shoucang"></Icon>
                        收藏 <br>
                        <span class="text-white  ml-2">{{ format(data.collect) }}</span>
                      </a-col>
                      <a-col :span="8">
                        <Icon title="弹幕" icon="shouqi"></Icon>
                        弹幕 <br>
                        <span class="text-white  ml-2">{{ format(data.dm) }}</span>
                      </a-col>
                      <a-col :span="8">
                        <Icon title="评论" icon="xiaoxi"></Icon>
                        评论 <br>
                        <span class="text-white  ml-2">{{ format(data.totalReply) }}</span>
                      </a-col>
                      <a-col :span="8">
                        <Icon title="转发" icon="fenxiang"></Icon>
                        分享<br>
                        <span class="text-white ml-2">{{ format(data.share) }}</span>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>

              </div>
            </a-col>

          </a-row>
          <div class="mb-5">

            <!--            <a-row>-->
            <!--              <a-col :span="3">-->
            <!--                作品成就：-->
            <!--              </a-col>-->
            <!--              <a-col :span="21">-->
            <!--                <div class="w-24 bg-indigo-500 px-1 py-1 text-white text-center font-extrabold rounded-full">播放破千-->
            <!--                </div>-->
            <!--              </a-col>-->
            <!--            </a-row>-->

          </div>
        </div>


        <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">
          <h3 class="mb-4">
            <icon icon="diannao"/>
            实时票房
          </h3>
          <!--          <a-row class="text-center mb-3">-->
          <!--            <a-col :span="3">-->
          <!--              <div>今日票房</div>-->
          <!--              <div>?</div>-->
          <!--            </a-col>-->
          <!--            <a-col :span="3">-->
          <!--              <div>当前在看</div>-->
          <!--              <div>?</div>-->
          <!--            </a-col>-->
          <!--            <a-col :span="3">-->
          <!--              <div>今日预估</div>-->
          <!--              <div>?</div>-->
          <!--            </a-col>-->
          <!--            <a-col :span="3">-->
          <!--              <div>点赞</div>-->
          <!--              <div>-->
          <!--                ? <span>?%</span>↓-->
          <!--              </div>-->
          <!--            </a-col>-->
          <!--            <a-col :span="3">-->
          <!--              <div>投币</div>-->
          <!--              <div>-->
          <!--                384 <span>?%</span> ↑-->
          <!--              </div>-->
          <!--            </a-col>-->
          <!--            <a-col :span="3">-->
          <!--              <div>-->
          <!--                收藏-->
          <!--              </div>-->
          <!--              <div>-->
          <!--                ? <span>?%</span>-->
          <!--              </div>-->
          <!--            </a-col>-->
          <!--            <a-col :span="3">-->
          <!--              <div>转发</div>-->
          <!--              <div>-->
          <!--                ? <span>?%</span>-->
          <!--              </div>-->


          <!--            </a-col>-->
          <!--            <a-col :span="3"></a-col>-->
          <!--          </a-row>-->
          <a-row class="text-center">
            <a-col :span="4">
              <div>累计票房</div>
              <div class="text-white text-lg"> {{ format(data.view) }}</div>
            </a-col>
            <!--            <a-col :span="3">-->
            <!--              <div>首日票房</div>-->
            <!--              <div>?</div>-->
            <!--            </a-col>-->
            <!--            <a-col :span="3">-->
            <!--              <div>前3日票房</div>-->
            <!--              <div>? 万</div>-->
            <!--            </a-col>-->
            <a-col :span="3">
              <div>点赞</div>
              <div>
                <span class="text-white mr-1">{{ format(data.like) }}</span> <span>{{ data.rate.like }}%</span>
                <Arrow type="like" :value="data.rate.like"></Arrow>
              </div>
            </a-col>
            <a-col :span="3">
              <div>投币</div>
              <div>
                <span class="text-white mr-1">{{ format(data.coin) }}</span> <span>{{ data.rate.coin }}%</span>
                <Arrow type="coin" :value=" data.rate.coin"></Arrow>
              </div>
            </a-col>
            <a-col :span="3">
              <div>
                收藏
              </div>
              <div>
                <span class="text-white mr-1">{{ format(data.collect) }}</span> <span>{{ data.rate.collect }}%</span>
                <Arrow type="collect" :value=" data.rate.collect"></Arrow>
              </div>
            </a-col>
            <a-col :span="3">
              <div>
                弹幕
              </div>
              <div>
                <span class="text-white mr-1">{{ format(data.dm) }}</span> <span>{{ data.rate.dm }}%</span>
                <Arrow type="dm" :value=" data.rate.dm"></Arrow>
              </div>
            </a-col>
            <a-col :span="3">
              <div>
                评论
              </div>
              <div>
                <span class="text-white mr-1">{{ format(data.totalReply) }}</span> <span>{{ data.rate.reply }}%</span>
                <Arrow type="dm" :value="data.rate.reply"></Arrow>
              </div>
            </a-col>


            <a-col :span="3">
              <div>转发</div>
              <div>
                <span class="text-white mr-1">{{ format(data.share) }}</span> <span>{{ data.rate.share }}%</span>
                <Arrow type="share" :value=" data.rate.share"></Arrow>
              </div>
            </a-col>
            <a-col :span="3"></a-col>
          </a-row>
        </div>


        <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">
          <h3 class="mb-4">
            <Icon icon="gupiao"/>
            热度走势
          </h3>
          <p class="ml-5">热度监控数据主要来自于同时在线观看人数，每30秒获得一次在线数据并更新到图表上。</p>
          <div>

            <OnlineChart :data="chartData"></OnlineChart>
          </div>

        </div>

        <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5 ">
          <a-row :gutter="40" class="">
            <a-col :span="12">
              <h3 class="mb-4">
                <icon icon="yiwen-xianxing"/>
                预测总票房
              </h3>
              <a-row class="text-center" :gutter="[10,10]">
                <a-col :span="8">
                  <div>总票房</div>
                  <div class="text-lg text-white">{{ caculateData.view }}</div>
                </a-col>
                <a-col :span="16">
                  <a-row :gutter="[10,10]">
                    <a-col :span="8">
                      <div>总点赞</div>
                      <div class="text-white">{{ caculateData.like }}</div>
                    </a-col>
                    <a-col :span="8">
                      <div>总投币</div>
                      <div class="text-white">{{ caculateData.coin }}</div>
                    </a-col>
                    <a-col :span="8">
                      <div>总收藏</div>
                      <div class="text-white">
                        {{ caculateData.collect }}
                      </div>
                    </a-col>
                    <a-col :span="8">
                      <div>总弹幕</div>
                      <div class="text-white">
                        {{ caculateData.dm }}
                      </div>
                    </a-col>
                    <a-col :span="8">
                      <div>总评论</div>
                      <div class="text-white">
                        {{ caculateData.reply }}
                      </div>
                    </a-col>
                    <a-col :span="8">
                      <div>总转发</div>
                      <div class="text-white">
                        {{ caculateData.share }}
                      </div>
                    </a-col>
                  </a-row>
                </a-col>

              </a-row>
            </a-col>
            <a-col :span="12">
              <div data-html2canvas-ignore>
                <h3 class="mb-4">猜测流量池</h3>
                <a-row>
                  <a-col :span="4">
                    <div :style="{background: stage.data.bg}" class="text-xl stage">S{{ stage.no }}</div>
                  </a-col>
                  <a-col :span="14">
                    <div>
                      <div>
                        {{
                          stage.data.name
                        }}流量池：<span class="text-white">{{
                          formatWan(stage.data.show[0])
                        }}-{{ formatWan(stage.data.show[1]) }}</span>
                      </div>
                      <div>
                        预测阶段播放量：<span class="text-white">{{ formatWan(stage.data.view) }}</span>
                      </div>

                    </div>
                  </a-col>
                  <a-col :span="6">
                    <a-button type="primary" @click="visibleStages=true">参考</a-button>
                    <a-drawer placement="right" v-model:visible="visibleStages">
              <pre>
1.初始流量池：200-500
2.千人流量池：3K-5K
3.万人流量池：1W-2W
4.初级流量池：10W-15W（会有人工审核介入）
5.中级流量池：30W-70W
6.高级流量池：100W-300W
7.热门流量池：500W-1200W
8.全站推荐
              </pre>
                    </a-drawer>


                  </a-col>

                </a-row>
                <div class="text-lg mt-2">
                <span v-if="stage.condition==='pre'"> <Icon style="font-size: 40px;vertical-align: middle"
                                                            icon="gaoxingneng"/>  正在 <strong
                  class="text-white">预热</strong> 阶段</span>
                  <span v-if="stage.condition==='in'"><Icon style="font-size: 40px;vertical-align: middle;color: white"
                                                            icon="xingneng"/> 正在 <strong
                    class="text-white">推送</strong> 阶段</span>
                </div>
                <div class="pl-11" v-if="stage.condition==='in'">
                  <icon icon="tishi-xianxing"/>
                  此阶段主要是分发流量，相对比较平稳
                </div>
                <div class="pl-11" v-if="stage.condition==='pre'">
                  <icon icon="tishi-xianxing"/>
                  此阶段如果无法达成流量目标，可能导致推送停止
                </div>
              </div>


            </a-col>

          </a-row>


        </div>

        <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">

          <a-row :gutter="40">
            <a-col :span="12">
              <h3 class="mb-4">
                <icon icon="xingneng2"/>
                作品评分
              </h3>
              <a-row class="text-center">
                <a-col :span="8">
                  <div>作品质量度</div>
                  <div class="text-xl">
                    {{ score.quality }}
                  </div>
                </a-col>
                <!--                <a-col :span="8">-->
                <!--                  <div>流量力度</div>-->
                <!--                  <div class="text-xl">-->
                <!--                    ?-->
                <!--                  </div>-->
                <!--                </a-col>-->
                <a-col :span="8">
                  <div>票房得分</div>
                  <div class="text-xl">
                    {{ score.view }}
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <h3 class="mb-4">作品评价 <span class="float-right text-sm">仅供参考</span></h3>
              <a-row>
                <a-col :span="24">
                  <div>
                    <div v-if="suggestions.length===0">
                      暂无评价
                    </div>
                    <div v-else>
                      <div v-for="suggest in suggestions">
                        {{ suggest.title }}
                      </div>
                    </div>
                  </div>

                </a-col>

              </a-row>
            </a-col>
          </a-row>

        </div>
      </div>

    </vue-custom-scrollbar>
  </div>

  <div>
    <a-image
      :width="200"
      :style="{ display: 'none' }"
      :preview="{
        previewVisible,
        onVisibleChange: setVisible,
      }"
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
    />
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import BackBtn from '../../../components/comp/BackBtn.vue'
import dataHelper from '../../../js/watch/dataHelper'
import Arrow from '../../../components/watch/Arrow.vue'
import bili from '../../../js/watch/bili'
import { fixHttp, formatSeconds } from '../../../util'
import Template from '../../../../user/pages/Template.vue'
import OnlineChart from './OnlineChart.vue'
import html2canvas from 'html2canvas'
import viewer from 'viewerjs'

export default {
  name: 'Dashboard',
  components: { OnlineChart, Template, Arrow, BackBtn },
  data () {
    return {
      previewVisible: false,

      intervalDataTimer: null,
      onlineData: [],
      chartData: [],
      // chartKey:Date.now(),

      nanoid: '',
      task: {
        data: {
          rate: {}
        },
      },
      data: {
        rate: {}
      },
      stage: {
        data: {
          show: [100, 200]
        }
      },
      visibleStages: false,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      updateExecutedTimer: null
    }

  },
  mounted () {
    let nanoid = this.$route.params['nanoid']
    console.log(nanoid)
    this.nanoid = nanoid
    this.loadTaskInfo(nanoid, () => {
      this.getData()
      this.intervalDataTimer = setInterval(() => {
        this.getData()
      }, 30000)

    })
    this.updateExecutedTimer = setInterval(() => {
      this.updateExecutedTime()
    }, 1000)

  },
  unmounted () {
    clearInterval(this.updateExecutedTimer)
  },
  computed: {
    suggestions () {
      let suggestion = []
      let data = this.data
      let score = this.score
      if (data.rate.like < 4) {
        suggestion.push({
          title: `· 点赞率过低， ${this.data.rate.like} % 小于基准 4%，可能限制作品的播放上限`
        })
      }
      if (score.quality < 7) {
        suggestion.push({
          title: `· 作品质量度过低，${this.score.quality} 小于 7 ，随机成分较大`
        })
      }

      if (score.quality > 9) {
        suggestion.push({
          title: ` · 作品质量度非常优秀，${score.quality} 远超同类作品`
        })
      }

      if (score.view < 6) {
        suggestion.push({
          title: `· 作品票房得分过低，努力提升粉丝数推动票房成长`
        })
      }
      return suggestion
    },
    caculateData () {
      let data = {}
      let view = this.stage.data.view
      let videoRate = this.data.rate
      data.view = this.format(view)
      Object.keys(this.data.rate).forEach(key => {
        data[key] = this.format(view * videoRate[key] / 100)
      })
      return data
    },
    score () {
      let score = {}
      let data = this.data
      if (!data) {
        return 0
      }
      let num = data.num
      if (!num) {
        return 0
      }
      score.quality = ((num.coin * 0.4 + num.collect * 0.3 + num.dm * 0.4 + num.totalReply * 0.4 + num.view * 0.25 + num.like * 0.4 + num.share * 0.6) / num.view / 0.4 * 10).toFixed(1)
      score.view = (((this.stage.no) / 8) * 10).toFixed(1)
      return score
    }
  },
  methods: {
    setVisible (visible) {
      this.previewVisible = visible
    },
    async getData () {
      let data = await tableApi.watch.getTaskData({ task_id: this.task.nanoid, type: 'interval' }, 10000)
      let chartData = []
      try {
        chartData = data.map(d => {
          return {
            time: d.grab_time,
            online: JSON.parse(d.data).online
          }
        })
      } catch (e) {
        console.warn(e)
      }
      this.onlineData = data
      this.chartData = chartData
      //this.chartKey=Date.now()
      console.log(chartData, '获得interval数据')
    },
    loadTaskInfo (nanoid, cb) {
      tableApi.watch.getTask({ nanoid: nanoid }).then(task => {
        this.task = task
        this.data = task.data
        let data = this.data

        data.num = {}
        Object.keys(data).forEach(key => {
          data.num[key] = this.convertWan(data[key])
        })

        data.rate = {}
        data.rate.like = this.getRate(data.like, data.view)
        data.rate.dm = this.getRate(data.dm, data.view)
        data.rate.collect = this.getRate(data.collect, data.view)
        data.rate.share = this.getRate(data.share, data.view)
        data.rate.coin = this.getRate(data.coin, data.view)
        data.rate.reply = this.getRate(data.totalReply, data.view)

        this.stage = this.guessStage(task.data.view)
        console.log(task)
        if (cb) cb(task)
      })
    },
    handleButtonClick () {
      if (!this.task.running) {
        tableApi.watch.startTask(this.task)
        this.task.running = true
      } else {
        tableApi.watch.stopTask(this.task)
        this.task.running = false
      }
    },
    fixHttp: fixHttp,
    updateExecutedTime () {
      this.task.executed_time_until_now = this.formatSeconds((Date.now() - this.task.last_execute_time) / 1000)
    },
    formatSeconds: formatSeconds,
    format: dataHelper.format,
    getRate: dataHelper.getRate,
    convertWan: dataHelper.convertWan,
    refresh () {
      tableApi.watch.refreshTask(this.task)
    },
    showTask () {
      tableApi.watch.showTask(this.task)
    },
    stopTask () {
      tableApi.watch.stopTask(this.task)
    },
    openUrl () {
      ipc.send('addTab', { url: this.task.url })
    },
    share () {
      Modal.info({
        content: '点击生成报告',
        onOk: () => {//allowTaint: true,
          html2canvas(document.querySelector('#report'), { useCORS: true }).then(canvas => {
            document.querySelector('#report').appendChild(canvas)
            let ctx = canvas.getContext('2d')
            var img = new Image()
            img.onload = function () {
              console.log(img, 'draw')
              ctx.drawImage(this, 0, 0, 60, 60)
            }
            img.src = '/icons/logo128.png'
            this.setVisible(true)
          })
        }
      })
    },
    guessStage: bili.guessStage,
    formatWan: bili.formatWan
  }
}
</script>

<style scoped>
.cover {
  width: 160px;
  height: 100px;
  border-radius: 6px;
}

.stage {
  transform: rotate(30deg);
  background: #487cff;
  color: white;
  border-radius: 4px;
  width: 50px;
  text-align: center;
  display: inline-block;
  margin-top: 0.3em;
  font-weight: bold;
}
</style>
