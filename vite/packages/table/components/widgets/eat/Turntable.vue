<template>
  <div id="app" v-cloak>
    <div class="box">
  		<div class="prize-list" ref="prizeWrap" :style="bgColor">
  			<div class="prize-item" v-for="(item, index) in eatList" :style="prizeStyle(index)">
  				<p :style="eatList.length > 2 ? 'transform:rotate(-90deg);': 'font-size: 18px;'">{{ item }}</p>
  			</div>
  		</div>
      <div class="box-btn" style="z-index:9;" @click.stop="start">GO</div>
    </div>
	</div>
</template>

<script>
import { createApp, onMounted, onUnmounted, ref, reactive, toRefs, computed, nextTick } from 'vue';
export default {
  props: ['eatList'],
  setup (props,ctx) {
    const eatList = props.eatList
    const state = reactive({
      isRunning: false, // 是否正在转动
      baseRunAngle: 360 * 5, // 总共转动角度 至少5圈
      prizeId: 0, // 选中id
    })
    const prizeWrap = ref(null)


    const rotateAngle = computed(() => {
      const _degree = 360 / eatList?.length
      return _degree
    })

    const totalRunAngle = computed(() => {
      return state.baseRunAngle + 360 - state.prizeId * rotateAngle.value - rotateAngle.value / 2
    })

    const bgColor = computed(() => {
      const _len = eatList?.length
      // const colorList = ['#F7D8A7', '#F2B1A2','#A9A9A9','#F2E8CF']
      const colorList = ['#5352b3', '#363589']
      let colorVal = ''
      for (let i = 0; i < _len; i++) {
        colorVal += `${colorList[i % 2]} ${rotateAngle.value * i}deg ${rotateAngle.value * (i + 1)}deg,`
      }
      return `
        background: conic-gradient(${colorVal.slice(0, -1)});
      `
    })
    const prizeStyle = computed(() => {
      const _degree = rotateAngle.value
      return (i) => {
        return `
          width: ${2 * 120 * Math.sin(_degree / 2 * Math.PI / 180)}px;
          height: 120px;
          transform: rotate(${_degree * i + _degree / 2}deg);
          transform-origin: 50% 100%;
        `
      }
    })

    onMounted(() => {
      prizeWrap.value.style = `${bgColor.value} transform: rotate(-${rotateAngle.value / 2}deg)`
    })

    onUnmounted(() => {
      prizeWrap.value?.removeEventListener('transitionend', stopRun)
    })

    const getRandomNum = () => {
      const num = Math.floor(Math.random() * eatList?.length)
      return num    		
    }

    const start = () => {
      if (!state.isRunning) {
        state.isRunning = true

        const prizeId = getRandomNum()
        // console.log('选中', prizeId, eatList[prizeId])
        state.prizeId = prizeId
        startRun()
      }
    }

    const startRun = () => {
      prizeWrap.value.style = `
        ${bgColor.value}
        transform: rotate(${totalRunAngle.value}deg);
        transition: all 4s ease;
      `
      prizeWrap.value.addEventListener('transitionend', stopRun)
    }

    const stopRun = (e) => {
      state.isRunning = false
      prizeWrap.value.style = `
        ${bgColor.value}
        transform: rotate(${totalRunAngle.value - state.baseRunAngle}deg);
      `
    }

    return {
      ...toRefs(state),
      bgColor,
      prizeStyle,
      prizeWrap,
      start
    }
  }
}
</script>
<style scoped lang="scss">
		* {  margin: 0; padding: 0; box-sizing: border-box; }
		[v-cloak] {
			display: none;
		}
		.box {
      margin: 50px auto 0;
			width: 240px;
			height: 240px;
      position: relative;
		}
    .prize-list {
      width: 100%;
      height: 100%;
      border-radius: 50%;
			// border: 10px solid #98d3fc;
      overflow: hidden;
    }
		.prize-item {
			/*border: 2px solid red;*/
			position: absolute;
      left: 0;
      right: 0;
      top: 0;
      margin: auto;
      font-size: 14px;
		}
		.prize-item p {
      // color: var(--primary-text);
			color: #fff;
			text-align: center;
			line-height: 20px;
      margin: 35px -26px;
      letter-spacing: 2px;
		}
    .box-btn {
      width: 50px;
      height: 50px;
      line-height: 50px;
      border-radius: 50%;
      background:var(--active-bg);
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      cursor: pointer;
      font-size: 20px;
      color: var(--primary-text);
      text-align: center;
      font-weight: 700;
    }
    .box-btn::before{
      content: "";
      position: absolute;
      left: 16px;
      right: 0;
      top: -20px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 24px solid var(--active-bg);
    }
	</style>