

export const kdniaoHandler = {
  on({event, data}) {
    switch (event) {
      case 'callback':
        console.error('执行快递鸟对应的操作',event,data)
    }
  }
}
