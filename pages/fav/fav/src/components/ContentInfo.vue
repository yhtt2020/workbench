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
      <a-input v-model:value="value" placeholder="标题标题" />
      <a-input v-model:value="value" placeholder="备注备注" />
      <a-input v-model:value="value" placeholder="网址网址" />
    </div>
    <div style="margin-bottom: 10px">
      <h4>基本信息</h4>

    </div>
    <div>
      <a-button block>导出文件</a-button>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent } from 'vue';
export default defineComponent({
  name: 'ContentInfo',
  props: {
    msg: String
  },
  setup() {
    return {
      random: ref(),
    };
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" scoped>
.content-info{
  padding: 15px;
  background: #f1f1f1;
}
</style>
