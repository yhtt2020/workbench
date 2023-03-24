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
              <a-dropdown-button @click="handleButtonClick">
                <Icon class="mr-3" icon="zanting"></Icon>
                暂停
                <template #overlay>
                  <a-menu @click="handleMenuClick">
                    <a-menu-item @click="showTask" key="1">
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
    <vue-custom-scrollbar :settings="outerSettings" style="position:relative;height:calc(100vh - 18em);  ">
      <div style="max-width: 900px;margin:auto">
        <div class="p-3">
          <a-row class="mb-5" :gutter="[20,10]">
            <a-col :md="5">
              <img class="cover" :src="data.cover+'@320w_200h'">
            </a-col>
            <a-col :md="14">
              <div class="mb-2" style="color:#999">任务：{{ task.title }} &nbsp; &nbsp;{{
                  data.pudate || '-'
                }}
              </div>
              <div>
                <a-row class="text-l" :gutter="10">
                  <a-col :span="4">
                    <Icon icon="bofang"></Icon>
                    {{ format(data.view) }}
                  </a-col>
                  <a-col :span="4">
                    <Icon icon="dianzan"></Icon>
                    {{ format(data.like )}}
                  </a-col>
                  <a-col :span="4">
                    <Icon icon="jinbi"></Icon>
                    {{ format(data.coin ) }}
                  </a-col>
                  <a-col :span="4">
                    <Icon icon="jinbi"></Icon>
                    {{ format(data.totalReply)}}
                  </a-col>
                  <a-col :span="4">
                    <Icon icon="star"></Icon>
                    {{ format(data.dm) }}
                  </a-col>
                  <a-col :span="4">
                    <Icon icon="jinbi"></Icon>
                    {{ format(data.collect)}}
                  </a-col>
                </a-row>
              </div>
            </a-col>

          </a-row>
          <div class="mb-5">

            <a-row>
              <a-col :span="3">
                作品成就：
              </a-col>
              <a-col :span="21">
                <div class="w-24 bg-indigo-500 px-1 py-1 text-white text-center font-extrabold rounded-full">播放破千
                </div>
              </a-col>
            </a-row>

          </div>
        </div>


        <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">
          <h3 class="mb-4">实时票房</h3>
          <a-row class="text-center mb-3">
            <a-col :span="3">
              <div>今日票房</div>
              <div>?</div>
            </a-col>
            <a-col :span="3">
              <div>当前在看</div>
              <div>?</div>
            </a-col>
            <a-col :span="3">
              <div>今日预估</div>
              <div>?</div>
            </a-col>
            <a-col :span="3">
              <div>点赞</div>
              <div>
                ? <span>?%</span>↓
              </div>
            </a-col>
            <a-col :span="3">
              <div>投币</div>
              <div>
                384 <span>?%</span> ↑
              </div>
            </a-col>
            <a-col :span="3">
              <div>
                收藏
              </div>
              <div>
                ? <span>?%</span>
              </div>
            </a-col>
            <a-col :span="3">
              <div>转发</div>
              <div>
                ? <span>?%</span>
              </div>


            </a-col>
            <a-col :span="3"></a-col>
          </a-row>
          <a-row class="text-center">
            <a-col :span="3">
              <div>累计票房</div>
              <div> {{ format(data.view)}}</div>
            </a-col>
            <a-col :span="3">
              <div>首日票房</div>
              <div>?</div>
            </a-col>
            <a-col :span="3">
              <div>前3日票房</div>
              <div>? 万</div>
            </a-col>
            <a-col :span="3">
              <div>点赞</div>
              <div>
                {{ format(data.like) }} <span>{{ getRate(data.like,data.view) }}%</span> <Arrow type="like" :value="getRate(data.like,data.view)"></Arrow>
              </div>
            </a-col>
            <a-col :span="3">
              <div>投币</div>
              <div>
                {{ format(data.coin) }} <span>{{ getRate(data.coin,data.view) }}%</span>  <Arrow type="coin" :value="getRate(data.coin,data.view)"></Arrow>
              </div>
            </a-col>
            <a-col :span="3">
              <div>
                弹幕
              </div>
              <div>
                {{ format(data.dm) }} <span>{{ getRate(data.dm,data.view) }}%</span> <Arrow type="dm" :value="getRate(data.dm,data.view)"></Arrow>
              </div>
            </a-col>
            <a-col :span="3">
              <div>
                收藏
              </div>
              <div>
                {{ format(data.collect) }} <span>{{ getRate(data.collect,data.view) }}%</span> <Arrow type="collect" :value="getRate(data.collect,data.view)"></Arrow>
              </div>
            </a-col>
            <a-col :span="3">
              <div>转发</div>
              <div>
                {{ format(data.share) }} <span>{{ getRate(data.share,data.view) }}%</span> <Arrow type="share" :value="getRate(data.share,data.view)"></Arrow>
              </div>
            </a-col>
            <a-col :span="3"></a-col>
          </a-row>
        </div>


        <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">
          <h3 class="mb-4">分时票房</h3>

        </div>

        <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">
          <a-row :gutter="40">
            <a-col :span="12">
              <h3 class="mb-4">实时预测总票房</h3>
              <a-row>
                <a-col :span="4">
                  <div>总票房</div>
                  <div>?</div>
                </a-col>
                <a-col :span="4">
                  <div>总点赞</div>
                  <div>?</div>
                </a-col>
                <a-col :span="4">
                  <div>总投币</div>
                  <div>?万</div>
                </a-col>
                <a-col :span="4">
                  <div>总收藏</div>
                  <div>
                    ? <span>?%</span>↓
                  </div>
                </a-col>
                <a-col :span="4">
                  <div>总转发</div>
                  <div>
                    ? <span>?%</span> ↑
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <h3 class="mb-4">猜测流量池</h3>
              <a-row>
                <a-col :span="4">
                  <div class="text-xl">S4</div>
                </a-col>
                <a-col :span="9">
                  <div>
                    <div>
                      初级流量池：10-15万
                    </div>
                    <div>
                      预测阶段播放量：3000
                    </div>
                  </div>
                </a-col>
                <a-col :span="9">
                  <a-button type="primary" @click="visibleStages=true">查看参考</a-button>
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
            </a-col>

          </a-row>

        </div>

        <div style="background: #2d2d2d;" class="p-4 rounded-md mb-5">

          <a-row :gutter="40">
            <a-col :span="12">
              <h3 class="mb-4">作品评分</h3>
              <a-row class="text-center">
                <a-col :span="8">
                  <div>作品质量度</div>
                  <div class="text-xl">
                    ?
                  </div>
                </a-col>
                <a-col :span="8">
                  <div>流量力度</div>
                  <div class="text-xl">
                    ?
                  </div>
                </a-col>
                <a-col :span="8">
                  <div>票房得分</div>
                  <div class="text-xl">
                   ?
                  </div>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="12">
              <h3 class="mb-4">综合得分</h3>
              <a-row>
                <a-col :span="4">
                  <div class="text-xl">5.3</div>
                  <div class="text-xl">
                    c
                  </div>
                </a-col>
                <a-col :span="20">
                  <div>
                    <div>
                      · 点赞率低于4%，几乎没有爆款可能
                    </div>
                    <div>
                      · 首日达成播放过低， 流量池推进速度过慢
                    </div>
                    <div>
                      · 实时在看过低，需要再升级
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


</template>

<script>
import { Modal } from 'ant-design-vue'
import BackBtn from '../../../components/comp/BackBtn.vue'
import dataHelper from '../../../js/watch/dataHelper'
import Arrow from '../../../components/watch/Arrow.vue'
export default {
  name: 'Dashboard',
  components: { Arrow, BackBtn },
  data () {
    return {
      task: {
        data: {},
      },
      data:{},
      visibleStages: false,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  mounted () {
    tableApi.watch.getTask({ nanoid: this.$route.params['nanoid'] }).then(task => {
      this.task = task
      this.data=task.data
      console.log(task)
    })
  },
  methods: {
    format(num){
      if(String(num).indexOf('万')>-1){
        //已经是格式化文本
        return num
      }
      if(Number(num)>0){
        return (Number(num)).toLocaleString()
      }else{
        return '-'
      }

    },
    getRate:dataHelper.getRate,

    showTask(){
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
        content: '暂时还不支持分享'
      })
    }
  }
}
</script>

<style scoped>
.cover {
  width: 160px;
  height: 100px;
  border-radius: 6px;
}
</style>
