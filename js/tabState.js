const TaskList = require('tabState/task.js')

function initialize () {
  window.tasks = new TaskList()
  console.log(tasks)
  window.tabs = undefined
}

module.exports = { initialize }
