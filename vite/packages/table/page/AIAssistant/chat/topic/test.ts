const apiList: any = [];

for (let i = 0; i < 10; i++) {
  const currentDate = Date.now();
  const oneWeekAgo = currentDate - 7 * 24 * 60 * 60 * 1000;

  const item: any = {
    id: i,
    icon: {
      name: "message",
      id: 0,
    },
    name: `AI助手${i + 1}`,
    top: Math.random() < 0.3,
    chatId: null,
  };

  if (Math.random() < 0.5) {
    item.time = currentDate;
  } else {
    item.time = oneWeekAgo;
  }

  apiList.push(item);
}

export { apiList };
