const si = require('systeminformation')

async function getRealtimeNetworkBandwidth () {

  async function getNetworkStats () {
    const networkStats = await si.networkStats()
    return networkStats
  }

  let networkStats1 = getSum(await getNetworkStats())
  await new Promise((resolve) => setTimeout(resolve, 1000)) // 等待1秒钟
  let networkStats2 = getSum(await getNetworkStats())

  function getSum (data) {
    let rx_bytes = 0
    let tx_bytes = 0
    if (Array.isArray(data)) {
      for (const line of data) {
        rx_bytes += line.rx_bytes
        tx_bytes += line.tx_bytes
      }
    } else {
      rx_bytes = data.rx_bytes
      tx_bytes = data.tx_bytes
    }
    return {
      rx_bytes,
      tx_bytes
    }
  }

  console.log(networkStats1, networkStats2)

  const receivedBytesPerSecond = networkStats2.rx_bytes - networkStats1.rx_bytes
  const sentBytesPerSecond = networkStats2.tx_bytes - networkStats1.tx_bytes

  const receivedBandwidth = receivedBytesPerSecond
  const sentBandwidth = sentBytesPerSecond

  return { receivedBandwidth, sentBandwidth }
}

async function getCpuTemperature () {
  const data = await si.cpuTemperature();
  return data.main;
}

const inspector={
  si:si,
  getRealtimeNetworkBandwidth: getRealtimeNetworkBandwidth,
  getCpuTemperature,
  getCpuUsage:async function getCpuUsage() {
    const data = await si.currentLoad();
    return data.currentLoad;
  }
}


module.exports=inspector
