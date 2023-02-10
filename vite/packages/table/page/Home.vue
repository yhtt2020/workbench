<template>


  <div>
    <div>
      <div>
        <div class="card-wrapper" >
          <div class="card" style="flex: 1;width:20em">
            <div class="title">个性电台</div>
          </div>
          <div class="card" style="flex: 1;width:20em">
            <div class="title">个性电台</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped lang="scss">
.card-wrapper {
  display: flex;
  height: calc(100vh - 12em)
}

.card {
  padding: 1em;
  margin-right: 1em;
  .title {

  }
}
</style>
