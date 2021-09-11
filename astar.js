var canvas = document.getElementById("window");
console.log(canvas)
var ctx = canvas.getContext('2d');

//drawing the grid 

var rows = 25;
var cols = 25;

var w = canvas.height/cols;
var h = canvas.width/rows;

var grid = new Array(cols);
var isStart = false;


function absdist(n, c){
    Math.abs(n.x - c.x) + Math.abs(n.y - c.y);
}

function getStart(){
    isStart = true;
}

function removeItem(arr,item){
    for(i = openList.length-1 ;i >= 0 ; i--){
        if(arr[i] === item){
            arr.splice(i, 1);
        }
    }
}

function minFscore(ol,lowest){
    for(i = ol.length-1; i>=0; i--){
        if(ol[i].f < ol[lowest].f){
            lowest = i;
        }
    }
    return lowest;
}

function spot(x, y){
    this.x = x;
    this.y = y;

    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.iswall = false;
    this.isSelected = false;
    this.neighbors = []
    this.previous = null;


    this.addNeighbor = function(grid){
        if(this.x > 0){
            this.neighbors.push(grid[this.x - 1][this.y])
        }
        if(this.x < cols){
            this.neighbors.push(grid[this.x + 1][this.y])
        }
        if(this.y > 0){
            this.neighbors.push(grid[this.x][this.y -1])
        }
        if(this.y < rows){
            this.neighbors.push(grid[this.x ][this.y +1]);
        }

    }

    this.show = function(col){
        ctx.beginPath();
        ctx.fillStyle = col;
        ctx.rect(this.x*w, this.y*h, w, h);
        ctx.stroke();
        ctx.fill();
    }

}


for(var i = 0; i<=cols; i++){
    grid[i] = new Array(rows);
    
}


for(var i = 0; i<=cols; i++){
    for(var j = 0; j<= rows; j++){
        grid[i][j] = new spot(i,j);
    }
}
for(var i = 0; i<=cols; i++){
    for(var j = 0; j<= rows; j++){
        grid[i][j].addNeighbor(grid);
    }
}

for(var i = 0; i<=cols; i++){
    for(var j = 0; j<= rows; j++){
        if(Math.random() < 0.2){
            grid[i][j].iswall = true;
        }
    }
}


var start;
var goal;


//algo variables 
var closedList = [];
var openList = [];




var counter = 0;

var isDone  = false;

function getMousePos(event){
    let rect = canvas.getBoundingClientRect();
    var xpos = event.clientX - rect.left;
    var ypos = event.clientY - rect.top;
    
    for(var i = 0; i<= rows; i++){
        for(var j = 0; j<=cols; j++){
            var g = grid[i][j];
            if((xpos >= g.x*w && xpos <= g.x*w + w) && (ypos >= g.y*h && ypos <= g.y*h + h)){
                grid[i][j].isSelected = !grid[i][j].isSelected;
                if(counter == 0){
                    start = grid[i][j];
                    openList.push(start);
                    counter ++;
                }
                else if(counter == 1) {
                    goal = grid[i][j];
                }
                
            }
        }
    }
    console.log(counter);
    console.log(start , goal);
}


function doAstar(){
    if(openList.length>0){
        
        current = openList[minFscore(openList, 0)];
        if (current === goal){
          
       
            console.log('Route Found!!!');
            return;
            
            
        }else{

        removeItem(openList, current);
        closedList.push(current);
        //current.show('red');
        var neighbors = current.neighbors;
        if(neighbors.length > 0){
            neighbors.forEach(nbor => {
                if(!closedList.includes(nbor) && !nbor.iswall){
                    var tempG = current.g + absdist(nbor, current);
                    
                    if(openList.includes(nbor)){
                        if(tempG < nbor.g){
                            nbor.g = tempG;
                            
                        }
                        
    
                    }else{
                        
                        nbor.g = tempG;
                        openList.push(nbor);
                        
                     
                    }
                    nbor.f =  nbor.g + Math.abs(nbor.x - goal.x) + Math.abs(nbor.y - goal.y);
                    nbor.previous = current;
                }
            });
        }
    }

    }
}
function showPath(){
    for(var i = 0; i< closedList.length; i++){
        closedList[i].show('red');
    }
    //open grid:
    for(var i = 0; i< openList.length; i++){
        openList[i].show('green');
    }

    var path = []
    var temp = current;
    path.push(temp);
    while(temp.previous){
        path.push(temp);
        temp = temp.previous;
    }

    path.forEach(spot =>{
        spot.show('purple');
    })
}
//animation loop
function draw() {
    //ctx.clearRect(0,0,canvas.height,canvas.width);
    //drawing the grid
  
    for(var i = 0; i<=cols; i++){
        for(var j = 0; j<= rows; j++){
            grid[i][j].show('white');
        }
    }

    //A* implementation
    if(isStart){
        doAstar();
        showPath();
    }


   


    //color grid :
    for(var i = 0; i<=rows; i++){
        for(var j = 0; j<=cols; j++){
            if(grid[i][j].isSelected){
                grid[i][j].show('blue');
                
            }
            else if (grid[i][j].iswall){
                grid[i][j].show('grey');
            }
        }
}

   
     
    
}

var fps = 20;
function loop(){
    
    setTimeout(()=>{
        requestAnimationFrame(loop)
    },1000/60);
    draw();
    
    
}

loop();

console.log(grid);