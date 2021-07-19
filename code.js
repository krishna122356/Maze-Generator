var createNewCanvas = document.getElementById("createNewCanvas");
var resetCreateNewCanvas = document.getElementById("resetCreateNewCanvas");
var userInputWindow = document.getElementById("userInputWindow");
var enterCanvasWidth = document.getElementById("enterCanvasWidth");
var speed = document.getElementById("speed");

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    var x = event.clientX - rect.left
    var y = event.clientY - rect.top
    x = Math.floor(x / 20)
    y = Math.floor(y / 20)
    console.log("x: " + x + " y: " + y)
}

// function to use quick-union to set true or false values to edges displayed on the screen. When union count
// reduces to 1, that means every part of the maze is connected. True = blocked, False = open.
function generatemaze(horizontallines, verticallines) {
    for (var i = 0; i < horizontallines.length; i++) {
        for (var j = 0; j < enterCanvasWidth.value; j++) {
            horizontallines[i][j] = true;
        }
    }
    for (var i = 0; i < verticallines.length; i++) {
        for (var j = 0; j < enterCanvasWidth.value; j++) {
            verticallines[i][j] = true;
        }
    }
    // vlines and hlines represents will be selected at random and 1 element will be yeeted
    var vlines = new Array(enterCanvasWidth.value * (enterCanvasWidth.value - 1))
    for (i = 0; i < vlines.length; i++) {
        vlines[i] = i
    }
    var hlines = new Array(enterCanvasWidth.value * (enterCanvasWidth.value - 1))
    for (i = 0; i < hlines.length; i++) {
        hlines[i] = i
    }
    // arr represents the Quick-Union datastructure
    noofsets = enterCanvasWidth.value * enterCanvasWidth.value
    var arr = new Array(noofsets)
    for (i = 0; i < noofsets; i++) {
        arr[i] = i
    }
    while (noofsets != 1) {
        rand = Math.floor(Math.random() * 2)
        if (rand == 0) { //vertical line detected. Now identify boxes on left and right of the line
            rand2 = Math.floor(Math.random() * vlines.length)
            item = vlines[rand2]
            vlines.splice(rand2, 1)
            var a = Math.floor(item / enterCanvasWidth.value)
            var b = item % enterCanvasWidth.value
            //a+1,b is one coordinate. a,b is other.
            box1 = b * enterCanvasWidth.value + a
            box2 = b * enterCanvasWidth.value + a + 1
            while (arr[box1] != box1) {
                box1 = arr[box1]
            }
            while (arr[box2] != box2) {
                box2 = arr[box2]
            }
            if (box1 != box2) {
                arr[box1] = arr[box2]
                noofsets -= 1
                verticallines[a][b] = false
            }
        } else { // horizontal line detected. Now identify boxes above and below the line
            rand2 = Math.floor(Math.random() * hlines.length)
            item = hlines[rand2]
            hlines.splice(rand2, 1)
            var a = item % enterCanvasWidth.value
            var b = Math.floor(item / enterCanvasWidth.value)
            // a,b and a,b+1
            box1 = enterCanvasWidth.value * b + a
            box2 = enterCanvasWidth.value * (b + 1) + a
            while (arr[box1] != box1) {
                box1 = arr[box1]
            }
            while (arr[box2] != box2) {
                box2 = arr[box2]
            }
            if (box1 != box2) {
                arr[box1] = arr[box2]
                noofsets -= 1
                horizontallines[b][a] = false
            }
        }
    }

    /* randomized (first test case)
    for (var i = 0; i < horizontallines.length; i++) { 
        for (var j = 0; j < enterCanvasWidth.value; j++) { 
            a = Math.floor(Math.random()*2);
            if(a==0) horizontallines[i][j] = true;
            else horizontallines[i][j] = false; 
        } 
    } 
    for (var i = 0; i < verticallines.length; i++) { 
        for (var j = 0; j < enterCanvasWidth.value; j++) { 
            a = Math.floor(Math.random()*2);
            if(a==0) verticallines[i][j] = true;
            else verticallines[i][j] = false; 
        } 
    } 
    */
}

function bfs(verticallines, horizontallines, start_x, start_y, end_x, end_y) {
    can = document.querySelector("canvas")
    ctx = can.getContext("2d")
    path = new Image();
    path.src = 'imgs/tile.png';
    
    if(speed.value=="fast") {
        ms=50;
    }
    else if(speed.value=="slow") {
        ms=250;
    }
    arr = new Array(enterCanvasWidth.value * enterCanvasWidth.value) // points each element to the previous locator
    for (i = 0; i < arr.length; i++) {
        arr[i] = i
    }
    boxes = [start_y * enterCanvasWidth.value + start_x]
    arr[start_y * enterCanvasWidth.value + start_x] = -1
    end = end_y * enterCanvasWidth.value + end_x
    path.onload = function () {
        var bfs = setInterval(function () {
            newBoxes = []
            for (i = 0; i < boxes.length; i++) {
                yCoor = Math.floor(boxes[i] / enterCanvasWidth.value)
                xCoor = Math.floor(boxes[i] % enterCanvasWidth.value)
                if (xCoor > 0) {
                    if ((!verticallines[xCoor - 1][yCoor]) && (arr[yCoor * enterCanvasWidth.value + xCoor - 1] == yCoor * enterCanvasWidth.value + xCoor - 1)) {
                        arr[yCoor * enterCanvasWidth.value + xCoor - 1] = boxes[i]
                        newBoxes.push(yCoor * enterCanvasWidth.value + xCoor - 1)
                    }
                }
                if (xCoor < enterCanvasWidth.value - 1) {
                    if ((!verticallines[xCoor][yCoor]) && (arr[yCoor * enterCanvasWidth.value + xCoor + 1] == yCoor * enterCanvasWidth.value + xCoor + 1)) {
                        arr[yCoor * enterCanvasWidth.value + xCoor + 1] = boxes[i]
                        newBoxes.push(yCoor * enterCanvasWidth.value + xCoor + 1)
                    }
                }
                if (yCoor > 0) {
                    if ((!horizontallines[yCoor - 1][xCoor]) && (arr[(yCoor - 1) * (enterCanvasWidth.value) + xCoor] == (yCoor - 1) * (enterCanvasWidth.value) + xCoor)) {
                        arr[(yCoor - 1) * (enterCanvasWidth.value) + xCoor] = boxes[i]
                        newBoxes.push((yCoor - 1) * (enterCanvasWidth.value) + xCoor)
                    }
                }

                if (yCoor < enterCanvasWidth.value - 1) {
                    if ((!horizontallines[yCoor][xCoor]) && (arr[(yCoor + 1) * (enterCanvasWidth.value) + xCoor] == (yCoor + 1) * (enterCanvasWidth.value) + xCoor)) {
                        arr[(yCoor + 1) * (enterCanvasWidth.value) + xCoor] = boxes[i]
                        newBoxes.push((yCoor + 1) * (enterCanvasWidth.value) + xCoor)
                    }
                }
            }

            for (i = 0; i < newBoxes.length; i++) {
                if (newBoxes[i] == end) continue;
                yCoor = Math.floor(newBoxes[i] / enterCanvasWidth.value)
                xCoor = Math.floor(newBoxes[i] % enterCanvasWidth.value)
                ctx.drawImage(path, 20 * xCoor + 4, 20 * yCoor + 4);
            }
            boxes = newBoxes
            if (arr[end] != end) {
                finalPath = []
                while (end != -1) {
                    finalPath.push(end)
                    end = arr[end]
                }
                finalPath.shift()
                finalPath.pop()
                finalPath.reverse()
                fPath = new Image();
                fPath.src = 'imgs/final-path.png';
                i = 0
                fPath.onload = function () {
                    var solution = setInterval(function () {
                        yCoor = Math.floor(finalPath[i] / enterCanvasWidth.value)
                        xCoor = Math.floor(finalPath[i] % enterCanvasWidth.value)
                        ctx.drawImage(fPath, 20 * xCoor + 4, 20 * yCoor + 4);
                        i += 1
                        if (i == finalPath.length) {
                            clearInterval(solution)
                            var h2 = document.createElement("h2")
                            h2.innerHTML = " Path length is " + finalPath.length
                            document.body.appendChild(h2)
                        }
                    }, ms);
                }
                console.log(finalPath)
                clearInterval(bfs)
            }
        }, ms);
    }
}
function aStar(verticallines, horizontallines, start_x, start_y, end_x, end_y) {
    can = document.querySelector("canvas")
    ctx = can.getContext("2d")
    path = new Image();
    path.src = 'imgs/tile.png';
    
    if(speed.value=="fast") {
        ms=50;
    }
    else if(speed.value=="slow") {
        ms=250;
    }
    arr = new Array(enterCanvasWidth.value * enterCanvasWidth.value) // points each element to the previous locator
    for (i = 0; i < arr.length; i++) {
        arr[i] = i
    }
    boxes = [start_y * enterCanvasWidth.value + start_x]
    arr[start_y * enterCanvasWidth.value + start_x] = -1
    end = end_y * enterCanvasWidth.value + end_x
    path.onload = function () {
        var bfs = setInterval(function () {
            newBoxes = []
            for (i = 0; i < boxes.length; i++) {
                yCoor = Math.floor(boxes[i] / enterCanvasWidth.value)
                xCoor = Math.floor(boxes[i] % enterCanvasWidth.value)
                if (xCoor > 0) {
                    if ((!verticallines[xCoor - 1][yCoor]) && (arr[yCoor * enterCanvasWidth.value + xCoor - 1] == yCoor * enterCanvasWidth.value + xCoor - 1)) {
                        arr[yCoor * enterCanvasWidth.value + xCoor - 1] = boxes[i]
                        newBoxes.push(yCoor * enterCanvasWidth.value + xCoor - 1)
                    }
                }
                if (xCoor < enterCanvasWidth.value - 1) {
                    if ((!verticallines[xCoor][yCoor]) && (arr[yCoor * enterCanvasWidth.value + xCoor + 1] == yCoor * enterCanvasWidth.value + xCoor + 1)) {
                        arr[yCoor * enterCanvasWidth.value + xCoor + 1] = boxes[i]
                        newBoxes.push(yCoor * enterCanvasWidth.value + xCoor + 1)
                    }
                }
                if (yCoor > 0) {
                    if ((!horizontallines[yCoor - 1][xCoor]) && (arr[(yCoor - 1) * (enterCanvasWidth.value) + xCoor] == (yCoor - 1) * (enterCanvasWidth.value) + xCoor)) {
                        arr[(yCoor - 1) * (enterCanvasWidth.value) + xCoor] = boxes[i]
                        newBoxes.push((yCoor - 1) * (enterCanvasWidth.value) + xCoor)
                    }
                }

                if (yCoor < enterCanvasWidth.value - 1) {
                    if ((!horizontallines[yCoor][xCoor]) && (arr[(yCoor + 1) * (enterCanvasWidth.value) + xCoor] == (yCoor + 1) * (enterCanvasWidth.value) + xCoor)) {
                        arr[(yCoor + 1) * (enterCanvasWidth.value) + xCoor] = boxes[i]
                        newBoxes.push((yCoor + 1) * (enterCanvasWidth.value) + xCoor)
                    }
                }
            }

            for (i = 0; i < newBoxes.length; i++) {
                if (newBoxes[i] == end) continue;
                yCoor = Math.floor(newBoxes[i] / enterCanvasWidth.value)
                xCoor = Math.floor(newBoxes[i] % enterCanvasWidth.value)
                ctx.drawImage(path, 20 * xCoor + 4, 20 * yCoor + 4);
            }
            boxes = newBoxes
            if (arr[end] != end) {
                finalPath = []
                while (end != -1) {
                    finalPath.push(end)
                    end = arr[end]
                }
                finalPath.shift()
                finalPath.pop()
                finalPath.reverse()
                fPath = new Image();
                fPath.src = 'imgs/final-path.png';
                i = 0
                fPath.onload = function () {
                    var solution = setInterval(function () {
                        yCoor = Math.floor(finalPath[i] / enterCanvasWidth.value)
                        xCoor = Math.floor(finalPath[i] % enterCanvasWidth.value)
                        ctx.drawImage(fPath, 20 * xCoor + 4, 20 * yCoor + 4);
                        i += 1
                        if (i == finalPath.length) {
                            clearInterval(solution)
                            var h2 = document.createElement("h2")
                            h2.innerHTML = " Path length is " + finalPath.length
                            document.body.appendChild(h2)
                        }
                    }, ms);
                }
                console.log(finalPath)
                clearInterval(bfs)
            }
        }, ms);
    }
}

function createNewCanvass() {
    document.body.removeChild(userInputWindow);
    var enterCanvasWidthh = enterCanvasWidth.value * 20 + "px";
    var newCanvas = document.createElement("canvas");
    newCanvas.classList.add("canvasDesign");
    newCanvas.height = enterCanvasWidth.value * 20;
    newCanvas.width = enterCanvasWidth.value * 20

    newCanvas.style.height = enterCanvasWidthh;
    newCanvas.style.width = enterCanvasWidthh;
    document.body.appendChild(newCanvas);
    var ctx = newCanvas.getContext("2d");
    ctx.beginPath();
    // create 2d Arrays representing the horizontal and vertical lines. 
    var verticallines = new Array(enterCanvasWidth.value - 1);
    var horizontallines = new Array(enterCanvasWidth.value - 1);
    for (var i = 0; i < horizontallines.length; i++) {
        horizontallines[i] = new Array(enterCanvasWidth.value);
    }
    for (var i = 0; i < verticallines.length; i++) {
        verticallines[i] = new Array(enterCanvasWidth.value);
    }

    // Randomaly allots true or false, creates an okay-okay maze
    generatemaze(horizontallines, verticallines)

    // Displays lines based on true or false value of that line.
    // True for blocked, false for open

    for (i = 0; i < verticallines.length; i++) {
        for (j = 0; j < enterCanvasWidth.value; j++) {
            if (!verticallines[i][j]) continue;
            else {
                ctx.moveTo(20 + i * 20, 20 * j);
                ctx.lineTo(20 + i * 20, 20 + 20 * j);
                ctx.stroke();
            }
        }
    }
    for (i = 0; i < horizontallines.length; i++) {
        for (j = 0; j < enterCanvasWidth.value; j++) {
            if (!horizontallines[i][j]) continue;
            else {
                ctx.moveTo(j * 20, 20 + 20 * i);
                ctx.lineTo(j * 20 + 20, 20 + 20 * i);
                ctx.stroke();
            }
        }
    }
    // todo make start and end not same
    var start_x, start_y, end_x, end_y
    flagCounter = 1
    const canvas2 = document.querySelector('canvas')
    canvas2.addEventListener('mousedown', function (e) {
        if (flagCounter == 1) {
            const rect = canvas2.getBoundingClientRect()
            var x = event.clientX - rect.left
            var y = event.clientY - rect.top
            x = Math.floor(x / 20)
            y = Math.floor(y / 20)
            start_x = x
            start_y = y
            console.log("x: " + x + " y: " + y)
            startFlag = new Image();
            startFlag.src = 'imgs/start-flag.png';
            startFlag.onload = function () {
                ctx.drawImage(startFlag, x * 20 + 1, y * 20 + 1);
            }
        } else if (flagCounter == 2) {
            const rect = canvas2.getBoundingClientRect()
            var x = event.clientX - rect.left
            var y = event.clientY - rect.top
            x = Math.floor(x / 20)
            y = Math.floor(y / 20)
            end_x = x
            end_y = y
            console.log("x: " + x + " y: " + y)
            endFlag = new Image();
            endFlag.src = 'imgs/end-flag.png';
            endFlag.onload = function () {
                ctx.drawImage(endFlag, (x) * 20 + 1, (y) * 20 + 1);
                var btn = document.createElement("BUTTON");   // Create a <button> element
                btn.innerHTML = "Generate Solution";                   // Insert text
                if(speed.value==="Astar"){
                    btn.onclick = function () { aStar(verticallines, horizontallines, start_x, start_y, end_x, end_y); }
                }
                else {
                btn.onclick = function () { bfs(verticallines, horizontallines, start_x, start_y, end_x, end_y); }
                }
                document.body.appendChild(btn);               // Append <button> to <body>
            }
        }
        flagCounter += 1
    })
}

createNewCanvas.addEventListener('click', createNewCanvass);