<template>
<!--  <div class="card  gradient gradient&#45;&#45;14  content small" style="display: flex;flex-direction: column;align-content: center;align-items: center">-->
<!--&lt;!&ndash;  <my-list id="my" > <slot></slot></my-list>&ndash;&gt;-->
<!--  </div>-->
  <HomeComponentSlot :options="options">
    <div style="align-items: center;align-content: center;width: 100%;height:100%;text-align: center">
      <a-button size="large" @click="this.panelVisible=true"  type="primary">配置卡片</a-button>
    </div>

  </HomeComponentSlot>
  <a-drawer v-model:visible="panelVisible">
    <div class="line">
      卡片地址： <a-input style="width:230px" placeholder="请输入远程地址，需带协议"></a-input>
    </div>
    <div class="line">卡片尺寸：</div>
    <div class="line">
      <a-input-number></a-input-number> x <a-input-number></a-input-number>
    </div>
    <div class="mt-10">
      <a-button type="primary" block>确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'

function loadScript(src,id, callback) {
  const s = document.createElement("script",id);
  s.type = "text/javascript";
  s.src = src;
  s.id=id
  s.onload = s.onreadystatechange = function () {
    if (  !this.readyState ||  this.readyState === "loaded" ||  this.readyState === "complete"  ) {
      callback && callback();
      s.onload = s.onreadystatechange = null;
    }
  };
  document.body.appendChild(s);
}
export default {
  name: 'Remote',
  components: { HomeComponentSlot },
  data(){
    return{
      panelVisible:false,
      id:Date.now().toString(),
      options: {
        className: 'card small',
        title: '',
        icon: '',
        type: 'remote',
        noTitle: true,
      },
    }
  },
  mounted () {
    // console.log('尝试载入')
    // const node = document.getElementById("my");
    // //我们将变量转换一下格式，就能传递给子组件
    // node.dataset.arr = JSON.stringify(["吃饭", "睡觉"]);
    // loadScript('https://a.apps.vip/cards/my-list.js',this.id,()=>{
    //   console.log('载入远程卡片')
    //
    //
    //   window.customElements.upgrade(document.getElementById('my'))
    // })
  },
  unmounted () {
    // document.getElementById(this.id).remove()
  }
}
</script>

<style scoped>

</style>
