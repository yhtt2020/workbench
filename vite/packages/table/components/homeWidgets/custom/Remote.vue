<template>
这是一个自定义card
  <my-list id="my" > <slot>web component</slot></my-list>
</template>

<script>
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
  data(){
    return{
      id:Date.now().toString()
    }
  },
  mounted () {
    console.log('尝试载入')
    const node = document.getElementById("my");
    //我们将变量转换一下格式，就能传递给子组件
    node.dataset.arr = JSON.stringify(["吃饭", "睡觉"]);
    loadScript('https://a.apps.vip/cards/my-list.js',this.id,()=>{
      console.log('载入远程卡片')


      window.customElements.upgrade(document.getElementById('my'))
    })
  },
  unmounted () {
    document.getElementById(this.id).remove()
  }
}
</script>

<style scoped>

</style>
