<template>
  <div
    style="position: relative; overflow: hidden"
    :style="{ height: height + 'px' ,width:'100%'}"
  >
    <div class="sxd-square" name="绘制一个正方形">
      <div
        class="sxd-box"
        name="继承正方形高度并旋转"
        style="width: 100%"
      >
        <div class="sxd-rebox" name="旋转回原来的方向" v-bind="$attrs">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScrolX",
  props:{
    height:{
      type:Number,
      default:0
    }
  }
}
</script>

<style lang="scss" scoped>
.sxd-square {
  width: 100%;
  height: 0;
  padding-top: 100%;
  position: relative;
}
.sxd-box {
  transform: rotateZ(-90deg) rotateY(180deg);
  transform-origin: left top;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;

  .sxd-rebox {
    transform: rotateZ(90deg) rotateX(180deg);
    transform-origin: left top;
  }
}
</style>
