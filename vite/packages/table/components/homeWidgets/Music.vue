<template>
  <div class="card" >
    <div class="title"><Icon icon="#icon-yinle1" style="height: 1.3em;width: 1.3em;margin-right: 0.1em"></Icon> 个性电台</div>
    <div style="text-align: center;padding:3em">
      <a-avatar :size="100" src="http://p2.music.126.net/34jpb4Gan4mBzF6h9gWdUQ==/109951167921090656.jpg?param=140y140"></a-avatar>
    </div>
    <a-row :gutter="10">
      <a-col :span="12">
        <div class="sub-card">
          我喜欢<br>
         <Icon icon="#icon-shoucang" style="width: 3em;height:3em;margin-top: 1em"></Icon>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="sub-card">
          歌单<br>
          <Icon icon="#icon-liebiaoshitu" style="width: 3em;height:3em;margin-top: 1em"></Icon>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Music'
}
</script>

<style scoped>

</style>
