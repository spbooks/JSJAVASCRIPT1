var taskEvent = new CustomEvent("TaskAdded", {
  detail: {
    message: "A task has been added",
  },
  bubbles: true,
  cancelable: true
});
var btnAdd = document.getElementById("btnAdd");

btnAdd.onclick = function(e) {
  document.dispatchEvent(taskEvent);
};
