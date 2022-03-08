<template>
  <div class="content-info">
    <div style="margin-bottom: 10px">
      <a-image
        :width="200" style="max-height: 300px"
        :src="`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`"
      >
        <template #placeholder>
          <a-image
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
            :width="200"
            :preview="false"
          />
        </template>
      </a-image>
    </div>
    <div style="margin-bottom: 10px">
      <a-input v-model:value="selectedContentInfo.name" placeholder="标题标题"/>
      <a-select
        :options="options"
        mode="tags"
        placeholder="选择标签"
        style="width: 100%"
      ></a-select>
      <a-input v-model:value="selectedContentInfo.remark" placeholder="备注备注"/>
      <a-input style="margin-bottom: 0" v-model:value="selectedContentInfo.href" placeholder="网址网址"/>
      <a-rate style="margin-bottom: 10px" :value="4" allow-half/>
      <a-select
        :options="options"
        mode="tags"
        placeholder="标记为"
        style="width: 100%"
      ></a-select>
    </div>
    <div style="margin-bottom: 10px">
      <h4>基本信息</h4>
      <div>
        创建时间：{{ this.dateStr(selectedContentInfo.baseInfo.createTime) }}
        <br>
        添加时间：{{ this.dateStr(selectedContentInfo.baseInfo.addTime) }}
        <br>
        修改时间：{{ this.dateStr(selectedContentInfo.baseInfo.modifyTime) }}
        <br>
        文件路径：{{ selectedContentInfo.baseInfo.path }}/{{ selectedContentInfo.baseInfo.filename }}
      </div>
    </div>
    <div>
      <a-button block>导出文件</a-button>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'ContentInfo',
  props: {},
  data () {
    return {
      value3: ref(['a1', 'b2']),
      options: [
        { value: '稍后读' },
        { value: '代办' },
        { value: '待整理' },
        { value: '待标注' },
      ],
    }
  },
  methods: {
    dateStr (date) {
      //获取js 时间戳
      var time = new Date().getTime()
      //去掉 js 时间戳后三位，与php 时间戳保持一致
      time = parseInt((time - date * 1000) / 1000)

      //存储转换值
      var s
      if (time < 60 * 10) {//十分钟内
        return '刚刚'
      } else if ((time < 60 * 60) && (time >= 60 * 10)) {
        //超过十分钟少于1小时
        s = Math.floor(time / 60)
        return s + '分钟前'
      } else if ((time < 60 * 60 * 24) && (time >= 60 * 60)) {
        //超过1小时少于24小时
        s = Math.floor(time / 60 / 60)
        return s + '小时前'
      } else if ((time < 60 * 60 * 24 * 3) && (time >= 60 * 60 * 24)) {
        //超过1天少于3天内
        s = Math.floor(time / 60 / 60 / 24)
        return s + '天前'
      } else {
        //超过3天
        var date2 = new Date(parseInt(date) * 1000)
        return date2.getFullYear() + '/' + (date2.getMonth() + 1) + '/' + date2.getDate()
      }
    }
  },
  computed: {
    ...mapState(
      {
        selectedContentInfo: state => state.ui.selectedContentInfo
      })
  },
  setup () {
    return {
      random: ref(),
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" scoped>
.content-info {
  padding: 15px;
  background: #f1f1f1;
}

input {
  margin-bottom: 10px;
}

.ant-select {
  margin-bottom: 10px;
}
</style>
