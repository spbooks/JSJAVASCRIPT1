var myButton = document.getElementById("btnClickMe");

function handleClick() {
  alert("addEventListener clicked!");
}

function handleClick2() {
  alert("addEventListener2 clicked!");
}

myButton.addEventListener("click", handleClick, false);
myButton.addEventListener("click", handleClick2, false);

window.onmousemove = function(e) {
  console.log(e.x + ", " + e.y);
};

var txtArea = document.getElementById("myTextArea");

txtArea.onkeypress = function(e) {
  console.log(String.fromCharCode(e.keyCode));
};
