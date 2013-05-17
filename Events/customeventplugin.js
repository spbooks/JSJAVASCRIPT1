function handleTaskAdded(e) {
  alert(e.detail.message);
}

document.addEventListener("TaskAdded", handleTaskAdded, false);
