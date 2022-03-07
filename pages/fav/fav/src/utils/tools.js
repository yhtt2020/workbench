
const tools={
  getAppProtocolUrl (pkg, url) {
    return `tsb://app/redirect/?package=${pkg}&url=${url}`
  },
  getComProtocolUrl (url) {
    return tools.getAppProtocolUrl('com.thisky.com', url)
  }
}

export default tools
