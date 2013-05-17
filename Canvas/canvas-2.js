var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var message = "Hello world";
var xCoord = canvas.width / 2;
var yCoord = canvas.height / 2;

context.font = "italic 30pt Times New Roman";
context.fillStyle = "blue";
context.textAlign = "center";
context.textBaseline = "middle";
context.fillText(message, xCoord, yCoord);
