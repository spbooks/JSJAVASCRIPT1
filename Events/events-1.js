var myButton = document.getElementById("btnClickMe");

function handleClick() {
  alert("addEventListener clicked!");
}

myButton.addEventListener("click", handleClick, false);
