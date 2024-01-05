<template>
  <div class="medal-wrapper">
    <div class="badge-box" style="border:none;background: none;zoom: 0.5;margin: 0">
      <div style="width: 100px;height: 100px;position: relative">
        <img style="width: 75px;margin-top: 10px" :src="this.getPath+getBadge().badge+'.png'">
        <div v-if="badge.rank<100" class="badge-num" style="right: 33px;bottom: 20px"
             :style="{'background-color':this.getBadge().color}">
          {{ badge.rank }}
        </div>
      </div>
    </div>
    <div  style="position: absolute;width: 250px;z-index:9999" class="badge-box big ">
      <a-row>
        <a-col :span="10">
          <img style="width: 75px;margin-top: 10px" :src="this.getPath+getBadge().badge+'.png'">
          <div v-if="badge.rank<100" class="badge-num" :style="{'background-color':this.getBadge().color}">
            {{ badge.rank }}
          </div>
        </a-col>
        <a-col style="line-height: 2" :span="14">
          <div style="font-size: 16px;font-weight: bold;">{{ getBadge().title }}</div>
          <div class="text-grey">{{ getBadge().summaryNames }}</div>
          <div class="text-grey" style="font-size: 0.8em">{{ getBadge().summaryDes }}</div>
        </a-col>
      </a-row>
    </div>
  </div>


</template>

<script>
export default {
  name: 'OnlineMedal',
  data () {
    return {
      badge: {
        t9999: {
          badge: 'silver-b',
          title: '默默无闻',
          summaryNames: '全网300名开外',
          summaryDes: '初出茅庐。',
          color: '#c1c1c1'
        },

        t300: {
          badge: 'tstruck-b',
          title: '崭露锋芒',
          summaryNames: '全网前300名',
          summaryDes: '崭露锋芒，潜力无限！',
          color: '#9CA5CB'
        },
        t100: {
          badge: 'bronzec-b',
          title: '实力非凡',
          summaryNames: '全网前100名',
          summaryDes: '不容小觑，成长惊人！',
          color: 'rgb(196 85 35)'
        },
        t50: {
          badge: 'silverc-b',
          title: '出类拔萃',
          summaryNames: '全网前50名',
          summaryDes: '能力过人，摧枯拉朽！',
          color: 'rgb(159 183 204)'
        },
        t20: {
          badge: 'goldc-b',
          title: '惊为天人',
          summaryNames: '全网前20名',
          summaryDes: '超强实力，惊天动地！',
          color: 'rgb(201 126 7)'
        },
        t5: {
          badge: 'platinumc-b',
          title: '超神',
          summaryNames: '全网前5名',
          summaryDes: '前无古人，后无来者！',
          color: 'rgb(64 116 231)'
        },
        rank: 0,
      }
    }
  },
  props: ['rank'],
  computed: {
    getPath () {
      return 'file://' + window.globalArgs['app-dir_name'] + '/../../icons/badge/'
    }
  },
  methods: {
    getBadge () {
      if (!this.rank) {
        return this.badge.t9999
      }
      let rank = this.rank
      this.badge.rank = rank
      if (rank > 300) {
        return this.badge.t9999
      } else if (rank < 5) {
        return this.badge.t5
      } else if (rank < 20) {
        return this.badge.t20
      } else if (rank < 50) {
        return this.badge.t50
      } else if (rank < 100) {
        return this.badge.t100
      } else if (rank <= 300) {
        return this.badge.t300
      }
    },
  }

}
</script>

<style scoped lang="scss">
.medal-wrapper {
  display: inline-block;
  &:hover {
    .big{
      display: inline-block;
      opacity:1;

    }
  }
  .big{

    display: none;
    transition: opacity 0.3s ease 0.3s;
    opacity: 0;
    background: rgba(37, 37, 37, 0.6);
    backdrop-filter: blur(100px);
  }
}

.badge-box {
  border: 4px solid #c3c3c3;
  border-radius: 4px;
  background: #ffffff14;
  padding: 18px;
  padding-top: 10px;
  margin-top: 18px;
}

.badge-box .badge-num {
  bottom: 12px;
  background-color: rgb(64, 116, 231);
  position: absolute;
  height: 10px;
  line-height: 10px;
  color: white;
  right: 19px;
  width: 15px;
  text-align: center;
  font-size: 12px;
  white-space: nowrap;
}

</style>
