<template>
  <div v-if="grade">
    <div>
      <a-row>
        <a-col>
          <strong style="font-size: 1em">{{ extra.level }} 级：</strong>
        </a-col>
        <a-col>
          <div class="ts-grade flex justify-start align-center grade-icon ">
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
        </a-col>
      </a-row>
    </div>
    <div class="mt-2">

      <span v-if="extra.rank < 300"
            style="border-radius: 6px;line-height: 18px;padding-bottom:7px"
      ><span>
                                   全球排名：<span style="font-size: 20px;"> {{ extra.rank }}</span>
</span></span>
      <span v-else> 超过{{ (extra.percentage).toFixed(2) }}%的用户</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GradeDisplay',
  props: ['grade', 'extra'],
  data () {
    return {
      onlineGradeIcons: {}
    }
  },
  computed: {
    percent () {

    },
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

  },
  methods: {
    handleGrade (name) {
      let icons = []
      for (let i = 0; i < this.grade[name]; i++) {
        icons.push({ icon: 'file://' + window.globalArgs['app-dir_name'] + `/../../icons/grade/${name}.svg` })
      }
      return icons
    }
  }
}
</script>

<style scoped>

</style>
