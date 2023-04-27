<template>
  <div v-if="grade">
    <div>
      <a-row>
        <a-col>
          <strong style="font-size: 1em">{{ extra.level }} 级：</strong>
        </a-col>
        <a-col>
          <LevelIcon :level="extra.level"></LevelIcon>
        </a-col>
      </a-row>
    </div>
    <div class="mt-2">

      <span v-if="extra.rank < 300"
            style="border-radius: 6px;line-height: 18px;padding-bottom:7px"
      ><span>
                                   全球排名：<span style="font-size: 20px;"> {{ extra.rank }}</span>

</span></span>
      <span v-else> 超过{{ (extra.percentage).toFixed(2) }}%的用户</span> <span class="ml-3">累计在线：{{extra.hours}}小时</span>
    </div>
  </div>
</template>

<script>
import LevelIcon from '../small/LevelIcon.vue'

export default {
  name: 'GradeDisplay',
  components: { LevelIcon },
  props: ['grade', 'extra'],
  data () {
    return {

    }
  },
  computed: {
    percent () {

    },

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped>

</style>
