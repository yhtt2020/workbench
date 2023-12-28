import { taskStore } from "../../store";
import { useToast } from "vue-toastification";

// completeTask(xxxid)
// m0101
// button @click completeTask
export const completeTask = (id) => {
  const store: any = taskStore();
  const { startBranchTask, successBranchTask } = store;
  const toast = useToast();
  if (startBranchTask.includes(id)) {
    // console.log('"任务开始" :>> ', "任务开始");
    let startBranchTaskSet = new Set(startBranchTask.value);
    startBranchTaskSet.delete(id);
    startBranchTask.value = [...startBranchTaskSet];
    successBranchTask.push(id);
    toast.success("任务完成");

  }
};
