<template>
  <div class="ts-grade flex justify-start align-center grade-icon " style="display: inline-block;white-space: nowrap;display: flex">
    <div class="ts-grade-crown" v-for="item in onlineGradeIcons.crown">
      <img :src="item.icon" alt="" style="width: 20px; height: 20px">
    </div>
    <div class="ts-grade-sun" v-for="item in onlineGradeIcons.sun">
      <img :src="item.icon" alt="" style="width: 20px; height: 20px">
    </div>
    <div class="ts-grade-moon" v-for="item in onlineGradeIcons.moon">
      <img :src="item.icon" alt="" style="width: 20px; height: 20px">
    </div>
    <div class="ts-grade-star" v-for="item in onlineGradeIcons.star">
      <img :src="item.icon" alt="" style="width: 20px; height: 20px">
    </div>
  </div>
</template>

<script>
export default {
  name: 'LevelIcon',
  props:['level'],
  data(){
    return{
      grade:{}
    }
  },
  computed:{
    onlineGradeIcons () {
      if (this.grade) {
        let icons = {}
        Object.keys(this.grade).forEach(v => {
          icons[v] = this.handleGrade(v)
        })
        return icons
      } else {
        return {}
      }
    }
  },
  mounted () {
    console.log(this.level)
    this.calcGrade(this.level)
    console.log(this.grade)
  },
  methods:{
    calcGrade(lv){
        if (Math.floor(lv / 64) > 0) {
          this.grade.crown = Math.floor(lv / 64);
          this.calcGrade(lv - 64 * this.grade.crown);
        } else if (Math.floor(lv / 16) > 0) {
          this.grade.sun = Math.floor(lv / 16);
          this.calcGrade(lv - 16 * this.grade.sun);
        } else if (Math.floor(lv / 4) > 0) {
          this.grade.moon = Math.floor(lv / 4);
          this.calcGrade(lv - 4 * this.grade.moon);
        } else {
          this.grade.star = lv;
        }
    },
    handleGrade (name) {
      let icons = []
      for (let i = 0; i < this.grade[name]; i++) {
        icons.push({ icon: 'file://' + window.globalArgs['app-dir_name'] + `/../../icons/grade/${name}.svg` })
      }
      return icons
    },

  }
}
</script>

<style scoped>

</style>
