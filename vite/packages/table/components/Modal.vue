<template>
<div class="fixed inset-0" :class="blurFlag?'home-blur':''" :style="{'z-index':zIndex}" style="z-index: 99" @click="closeModal">
  <div @click.stop class="s-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg " style="transform-origin: 0 0;background: var(--modal-bg);" :class="className">
    <slot></slot>
  </div>
</div>
</template>

<script>
export default {
  name: "Modal",
  data(){
    return {
      className: '',
      flag:false
    }
  },
  props:[ 'visible','blurFlag','animationName','maskNoClose','zIndex'],
  methods:{
    closeModal(){
      if(this.maskNoClose)return
      if(this.animationName){
        if(this.flag)return
        this.flag = true
        this.className +='-close'
        setTimeout(()=>{
          this.$emit('update:visible',false)
          this.$emit('close')
          this.className = this.animationName
          this.flag = false
        },500)
      }else{
        this.$emit('update:visible',false)
        this.$emit('close')
      }
    },
    Keyboard(e){  // 键盘关闭事件
      if(e.key === 'Escape'){
        this.closeModal()
      }
    }
  },
  mounted() {
    this.className = this.animationName
    window.addEventListener('keydown',this.Keyboard)
  },
}
</script>

<style scoped>
.t-b{
  animation:t-b .5s;
}
.t-b-close{
  animation:t-b-close .5s;
}
.b-t{
  animation:b-t .5s;
}
.b-t-close{
  animation:b-t-close .5s;
}
.l-r{
  animation:l-r .5s;
}
.l-r-close{
  animation:l-r-close .5s;
}
.r-l{
  animation:r-l .5s;
}
.r-l-close{
  animation:r-l-close .5s;
}
.bounce-in{
  animation: bounce-in .5s;
}
.bounce-in-close{
  animation: bounce-in-close .5s;
}
@keyframes t-b {
   0% {
     opacity: 0;
     transform: translateY(-150%) translateX(-50%);

   }

   60% {
     transform: translateY(-40%) translateX(-50%);
   }

   80% {
     transform: translateY(-60%) translateX(-50%);
   }

   100% {
     opacity: 1;
     transform: translateY(-50%) translateX(-50%);
   }
 }
@keyframes t-b-close {
  0% {
    opacity: 1;
    transform: translateY(-50%) translateX(-50%);

  }
  100% {
    opacity: 0;
    transform: translateY(50%) translateX(-50%);
  }
}
@keyframes b-t {
  0% {
    opacity: 0;
    transform: translateY(50%) translateX(-50%);

  }

  60% {
    transform: translateY(-60%) translateX(-50%);
  }

  80% {
    transform: translateY(-40%) translateX(-50%);
  }

  100% {
    opacity: 1;
    transform: translateY(-50%) translateX(-50%);
  }
}
@keyframes b-t-close {
  0% {
    opacity: 1;
    transform: translateY(-50%) translateX(-50%);

  }
  100% {
    opacity: 0;
    transform: translateY(-150%) translateX(-50%);
  }
}
@keyframes l-r {
  0% {
    opacity: 0;
    transform: translateY(-50%) translateX(-150%);

  }

  60% {
    transform: translateY(-50%) translateX(-40%);
  }

  80% {
    transform: translateY(-50%) translateX(-60%);
  }

  100% {
    opacity: 1;
    transform: translateY(-50%) translateX(-50%);
  }
}
@keyframes l-r-close {
  0% {
    opacity: 1;
    transform: translateY(-50%) translateX(-50%);

  }
  100% {
    opacity: 0;
    transform: translateY(-50%) translateX(50%);
  }
}
@keyframes r-l {
  0% {
    opacity: 0;
    transform: translateY(-50%) translateX(50%);

  }

  60% {
    transform: translateY(-50%) translateX(-60%);
  }

  80% {
    transform: translateY(-50%) translateX(-40%);
  }

  100% {
    opacity: 1;
    transform: translateY(-50%) translateX(-50%);
  }
}
@keyframes r-l-close {
  0% {
    opacity: 1;
    transform: translateY(-50%) translateX(-50%);

  }
  100% {
    opacity: 0;
    transform: translateY(-50%) translateX(-150%);
  }
}
@keyframes bounce-in {
  0% {
    transform: scale(0) translateY(-50%) translateX(-50%);
  }
  50% {
    transform: scale(1.25) translateY(-50%) translateX(-50%);
  }
  100% {
    transform: scale(1) translateY(-50%) translateX(-50%);
  }
}
@keyframes bounce-in-close {
  0% {
    transform: scale(1)  translateY(-50%) translateX(-50%);

  }
  50% {
    transform: scale(1.25) translateY(-50%) translateX(-50%) ;
  }
  100% {
    transform: scale(0) translateY(-50%) translateX(-50%);
  }
}
</style>
