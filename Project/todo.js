(function () {
    var tasks, newTaskField, taskListForm, taskListEl, warningEl, warn, clearWarning, addForm, removeTask, setPriority,
        toggleComplete, addTask, renderTaskList, sortByNameAnchor, sortByLowHighAnchor, sortByHighLowAnchor, columnNames,
        HIGHPRIORITY, NORMALPRIORITY, LOWPRIORITY;

    // DOM elements
    sortByLowHighAnchor = document.getElementById("sortByLowHigh");
    sortByHighLowAnchor = document.getElementById("sortByHighLow");
    sortByNameAnchor = document.getElementById("sortByName");
    taskListForm = document.getElementById("tasks");
    taskListEl = taskListForm.getElementsByTagName("ul")[0];
    warningEl = document.getElementById("warning");
    newTaskField = document.getElementById("newTask");
    addForm = document.getElementById("add");
    columnNames =  [ "To Do", "Done" ];
    HIGHPRIORITY = '1';
    NORMALPRIORITY = '2';
    LOWPRIORITY = '3';
    tasks = [];
    
    renderTaskList = function () {
        var i, task, taskEl;

        clearList();
        for (i = 0; i < tasks.length; i += 1) {
            task = tasks[i];
            taskEl = newRow(i, task);
            taskListEl.appendChild(taskEl);
        }

        saveTasks(tasks);
        renderChart(tasks);
    };

    // Load tasks from local storage and render initial list
    if(hasLocalStorage() && localStorage.tasks)  {
        tasks = JSON.parse(localStorage.tasks);
        renderTaskList();
    }

    warn = function (msg) {
        warningEl.innerHTML = msg;
    };

    clearWarning = function () {
        warningEl.innerHTML = "";
    };

    addTask = function (task) {
        tasks.push({
            text: task,
            complete: false,
            priority: NORMALPRIORITY
        });
        renderTaskList();
        return task;
    };

    removeTask = function (idx) {
        tasks.splice(idx, 1);
        renderTaskList();
    };

    setPriority = function(idx, value) {
        tasks[idx].priority = value;
        renderTaskList();
    };


    toggleComplete = function (idx) {
        var val = tasks[idx].complete;
        tasks[idx].complete = !val;
        renderTaskList();
    };

    // Event handlers
    addForm.onsubmit = function (e) {
        var val;

        preventDefault(e);

        val = newTaskField.value;

        if (val === "") {
            warn("Please enter a task");
        } else {
            newTaskField.value = "";
            clearWarning();
            addTask(val);
        }
    };

    var sortByLowHigh = function(tasks) {
        return tasks.sort(function(task1, task2) { return task2.priority - task1.priority; });
        
    }

    var sortByHighLow = function(tasks) {
        return tasks.sort(function(task1, task2) { return task1.priority - task2.priority; });
        
    }

    var sortByName = function(tasks) {
        return tasks.sort(function(task1, task2) { return task1.text > task2.text;f });
        
    }
    sortByLowHighAnchor.onclick = function(e) {
        preventDefault(e);
        tasks = sortByLowHigh(tasks);
        renderTaskList();
    };

    sortByHighLowAnchor.onclick = function(e) {
        preventDefault(e);
        tasks = sortByHighLow(tasks);
        renderTaskList();
    };

    // Sort tasks by name
    sortByNameAnchor.onclick = function(e) {
        preventDefault(e);
        tasks = sortByName(tasks);
        renderTaskList();
    };


    taskListForm.onclick = function (e) {
        var target, idx, targetClass;
        preventDefault(e);
        target = getTarget(e);
        idx = getIndex(target);

        if (idx) {
            idx = Number(idx);
            targetClass = target.getAttribute('class');
            if (targetClass === 'highpriority' || targetClass === 'lowpriority' || targetClass === 'normalpriority') {
                setPriority(idx, target.getAttribute("value"));
            }  else if (target.className.match("delete-task")) {
                removeTask(idx);
            } else if (target.type === "checkbox") {
                toggleComplete(idx);
            }
        }
    };

    // Utility functions
    /**
     * Clones the template row from the HTML
     * @return {Node}
     */
    function newRow(index, task) {
        var template, newRow, textEl;
        template = document.getElementsByClassName("template-item")[0];
        newRow = template.cloneNode(true);
        newRow.setAttribute("data-idx", index.toString());

        // get task text el
        textEl = newRow.getElementsByClassName("task-text")[0];

        // set task priority
        if (task.priority == HIGHPRIORITY) {
            textEl.className += " label-important";
        } else if (task.priority == LOWPRIORITY) {
            textEl.className += " label-success";
        }

        // set task text
        textEl.appendChild(document.createTextNode(task.text));

        // mark complete
        if (task.complete) {
            newRow.getElementsByTagName("input")[0].setAttribute("checked", "checked");
            newRow.getElementsByTagName("span")[0].className += " complete";
        }
        newRow.className = "task";

        return newRow;
    }

    /**
     * Gets the task's index regardless of where inside the <li> the user clicked
     * @param el
     * @return {String}
     */
    function getIndex(el) {
        while (!el.getAttribute("data-idx")) {
            el = el.parentNode;
        }
        return el.getAttribute("data-idx");
    }

    function clearList() {
        while (taskListEl.hasChildNodes()) {
            taskListEl.removeChild(taskListEl.lastChild);
        }
    }

    // Local storage browser support
    function hasLocalStorage() {
        return typeof(Storage) !== "undefined";
    }



    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    function getTarget(e) {
        return e.srcElement || e.target;
    }

    function saveTasks(tasks) {
        if (hasLocalStorage()) {
            localStorage.tasks = JSON.stringify(tasks);
        }
    }

    function countComplete(tasks) {
        return tasks.filter(function(task) {return task.complete}).length;
    }

    function renderChart(tasks) {

        var done = countComplete(tasks);
        var todo = tasks.length - done;

        document.getElementById("numToDo").innerHTML = todo;
        document.getElementById("numDone").innerHTML = done;

        var dataValue = [todo, done];
        var maxVal = todo > done ? todo : done;

        var topMargin = 25;
        var bottomMargin = 1;
        var canvas = document.getElementById("canvas");
        canvas.width = canvas.width;

        if (canvas && canvas.getContext) {

            var context = canvas.getContext("2d");
            context.fillStyle   = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = '#000000';
            context.strokeRect  (0, 0, canvas.width, canvas.height);

            context.fillStyle = '#000000';
            context.save();
            var textX = 10;
            var textY = 190;
            context.translate(textX, textY);
            context.rotate(Math.PI * -90 / 180);
            context.fillText('Tasks Complete', 0, 0);
            context.restore();

            var yScaleFactor = (canvas.height - topMargin) / (maxVal);
            var count =  0;
            for (var yAxisValue = maxVal; yAxisValue >= 0; yAxisValue -= 1) {
                var yCoord = topMargin - bottomMargin + (yScaleFactor * count);
                context.fillText(yAxisValue, 40, yCoord);
                count++;
                context.moveTo(0, yCoord);
                context.lineTo(canvas.width, yCoord);
            }

            function drawRect(context) {
                for (i = 0; i < dataValue.length; i++) {
                    var startX = i+1, startY = bottomMargin/xScaleFactor, endX = 1, endY = dataValue[i], width = 0.5;
                    var gradient = context.createLinearGradient(startX, startY, endX, endY);
                    gradient.addColorStop(0.0,"#8ED6FF");
                    gradient.addColorStop(1.0,"#004CB3");

                    context.fillStyle = gradient;
                    context.fillRect(startX, startY, width, endY);
                }
            }

            context.lineWidth = 0.1;
            context.stroke();

            var xScaleFactor = canvas.width / (dataValue.length + 1);
            var dataName = [ "To Do", "Done" ];
            context.textBaseline = "bottom";
            for (i = 0; i < dataValue.length; i++) {
                var yCoord = canvas.height - dataValue[i] * yScaleFactor;
                context.fillText(dataName[i], xScaleFactor * (i + 1), yCoord);
            }
            context.translate(0, canvas.height);
            context.scale(xScaleFactor, -1 * yScaleFactor);
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 2;
            context.shadowColor = "rgba(0, 0, 0, 0.5)";
            drawRect(context);
            document.getElementById('printChart').href = canvas.toDataURL();

        }

    }

}());
