export const getConfig = async () => {
  let token;
  const res = await window.tsbApi.user.get()
  token = res.data.token

  return {
    headers: {
      'Authorization': token
    }
  }
}
