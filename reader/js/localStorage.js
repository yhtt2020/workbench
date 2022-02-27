export function setLocal(markData) {
  const data = getLocal();
  const hitIndex = data.findIndex((item) => item.uid == markData.uid);
  if(hitIndex>-1){
    data[hitIndex] = {...data[hitIndex],...markData}
  }else{
    data.push(markData);
  }

  localStorage.setItem("data", JSON.stringify(data));
}

export function getLocal() {
  return JSON.parse(localStorage.getItem("data")) || [];
}

export function clearItemLocal(id) {
  let data = getLocal();
  data = data.filter((item) => item.uid !== id);
  localStorage.setItem("data", JSON.stringify(data));
}
