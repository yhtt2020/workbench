export const useInstallTTApp = async () => {
  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile", "multiSelections"],
  });

  if (!path[0]) return;

  const res: any = await new Promise((resolve) => {
    await tsbApi.ttapp.install(path[0], (data) => {
      resolve(data);
    });
  });

  return res;
};
