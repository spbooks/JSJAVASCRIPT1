var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

context.strokeStyle = '#000000';
context.strokeRect(0, 0, canvas.width, canvas.height); 
context.fillRect(100, 100, 200, 100);
