<template>
  <a-breadcrumb>
    <a-breadcrumb-item>我的密码</a-breadcrumb-item>
    <a-breadcrumb-item><a href="">分组A</a></a-breadcrumb-item>
  </a-breadcrumb>
  <div style="float: right;">
    <a-button >自动填充</a-button>
    <a-dropdown>
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">
            <UserOutlined />
            1st menu item
          </a-menu-item>
          <a-menu-item key="2">
            <UserOutlined />
            2nd menu item
          </a-menu-item>
          <a-menu-item key="3">
            <UserOutlined />
            3rd item
          </a-menu-item>
        </a-menu>
      </template>
      <a-button type="text">
        …
        <DownOutlined />
      </a-button>
    </a-dropdown>
  </div>
  <div>
    <h3>禅道密码</h3>

  </div>
</template>

<script>
export default {
  name: 'PasswordDetail'
}
</script>

<style scoped>

</style>
