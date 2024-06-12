let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");
// let size = window.innerHeight - 10;
// let sizeX = size;
// let sizeY = size;
canvas.width = sizeX = window.innerWidth;
canvas.height = sizeY = window.innerHeight;
let mapX = sizeX*0.9;
canvas.style.backgroundColor = "blue";
let mapY = sizeY*0.9;
let mouseX, mouseY;
let mapPoints = [];
let mapLine = [];
let activeKeys = [];
let mapBorder = [];
let mapRadius = 2;
let wantedKeys = ['w','a','s','d',];
let zoom = 1.2;
let pointColor = '#4e3b00';
let pointRadius = 5;
let pointsMesh = 20;
let moveSpeed = 3;
let toLeft = toTop = 0;
let border = 2;
let wheelR = 0;
let density = 10;




canvas.addEventListener("wheel", (event) => {
    if(event.deltaY > wheelR){
        for (var i = 0; i < mapPoints.length; i++) {
            let pointX = mapPoints[i][0];
            let pointY = mapPoints[i][1];
            let radius = mapPoints[i][2];
            mapPoints[i][0] = (pointX  / zoom) - (sizeX/zoom - sizeX)/2 ;
            mapPoints[i][1] = (pointY / zoom)-  (sizeY/zoom - sizeY)/2 ;
            mapPoints[i][2] = radius / zoom
        }
            let x =  mapBorder[0];
            let y =  mapBorder[1];
            let x2 =  mapBorder[2];
            let y2 =  mapBorder[3];
            mapBorder[0] = (x / zoom) - (sizeX / zoom - sizeX)/2 ;
            mapBorder[1] = (y / zoom)-  (sizeY / zoom - sizeY)/2 ;
            mapBorder[2] = (x2 / zoom) - (sizeX / zoom - sizeX)/2 ;
            mapBorder[3] =(y2 / zoom)-  (sizeY / zoom - sizeY)/2 ;
            mapBorder[4] =  mapBorder[4] / zoom ;


    }else{
        for (var i = 0; i < mapPoints.length; i++) {
            let pointX = mapPoints[i][0];
            let pointY = mapPoints[i][1];
            let radius = mapPoints[i][2];
            mapPoints[i][0] = (pointX  * zoom) - (sizeX*zoom - sizeX)/2 ;
            mapPoints[i][1] = (pointY * zoom)-  (sizeY*zoom - sizeY)/2 ;
            mapPoints[i][2] = radius * zoom
        }
            let x =  mapBorder[0];
            let y =  mapBorder[1];
            let x2 =  mapBorder[2];
            let y2 =  mapBorder[3];
            mapBorder[0] = (x  * zoom) - (sizeX*zoom - sizeX)/2 ;
            mapBorder[1] = (y * zoom)-  (sizeY*zoom - sizeY)/2 ;
            mapBorder[2] = (x2  * zoom) - (sizeX*zoom - sizeX)/2 ;
            mapBorder[3] =(y2 * zoom)-  (sizeY*zoom - sizeY)/2 ;
            mapBorder[4] =  mapBorder[4] * zoom ;
    }
});

canvas.addEventListener('mousemove',mousePos);
 
// canvas.addEventListener('click',shot); 

document.addEventListener('keydown', (event)=> {
    console.log(event.key); 
    var correct = wantedKeys.indexOf(event.key);
    if (correct !== -1) {
        var index = activeKeys.indexOf(event.key);
        if (index == -1) {
            activeKeys.push(event.key);
            // console.log(activeKeys);
        }
    }

});
window.addEventListener('resize',()=>{
    canvas.width = sizeX = window.innerWidth;
    canvas.height = sizeY = window.innerHeight;
});
document.addEventListener('keyup', (event)=> { 
    var index = activeKeys.indexOf(event.key);
    if (index !== -1) {
        activeKeys.splice(index, 1);
    }
});
function playerMove(){
            let moveX = moveY = 0;
            for(let i=0; i< activeKeys.length; i++){
                switch(activeKeys[i]){
                    case 'w':
                        moveY =moveSpeed * zoom;
            
                        break
                    case 's':
                        moveY =-moveSpeed * zoom;
                        break
                    case 'a':
                        moveX =moveSpeed * zoom;
                        break
                    case 'd':
                        moveX =-moveSpeed * zoom;
                        break
                }
                for (var j = 0; j < mapPoints.length; j++) {
                    mapPoints[j][0] += moveX;
                    mapPoints[j][1] += moveY;
                    }
                mapBorder[0] += moveX;
                mapBorder[1] += moveY;
                mapBorder[2] += moveX;
                mapBorder[3] += moveY;
                    moveX = moveY = 0;
        
            }
        
        
        
        
        }

function mousePos(e){
    var rect = canvas.getBoundingClientRect(); 
    mouseX = e.clientX - rect.left; 
    mouseY = e.clientY - rect.top; 
}
function randomint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateMap(){
    let translateX = canvas.width/2 - mapX/2;
    let translateY = canvas.height/2 - mapY/2;
    let distX = mapX /  pointsMesh;
    let distY = mapY / pointsMesh;
    let radius = 4;
    for (var y = distY/2; y <= mapY; y += distY) {
        for (var x = distX/2; x <= mapX; x += distX) {
            if(randomint(1,100) <= density){
                mapPoints.push([x,y,radius, pointColor,1 , border]);
            }
        }
    }
    for (var j = 0; j < mapPoints.length; j++) {
        mapPoints[j][0] += translateX;
         mapPoints[j][1] += translateY;
        }
    mapBorder.push(translateX, translateY, mapX+translateX, mapY + translateY), mapRadius;
    // for(let j = 0; j < mapPoints.length; j++){
    //     let x = mapPoints[j][0];
    //     let y = mapPoints[j][1];
    //     if(x <= (distX * pointsMesh) - distX ){
    //         if(randomint(1,3) != 1){
    //             mapLine.push(new Line(x, y, x + distX , y, 4, 'blue'));
    //         }
    //     }
    //     if(y <= (distY * pointsMesh) - distY ){
    //         if(randomint(1,3) != 1){
    //             mapLine.push(new Line(x, y, x, y + distY, 4, 'blue'));
    //         }
    //     }
    // }
}
function generateLines(x,color,alpha,width){
    for(let j = 0; j<= x; j++){
        for(let i = 0; i< mapPoints.length; i++){
            let coordinates = closest(mapPoints[i][0],mapPoints[i][1],j);
            c.beginPath();
            c.moveTo(mapPoints[i][0],mapPoints[i][1])
            c.lineTo(coordinates[0] , coordinates[1]);
            c.strokeStyle = color;
            c.globalAlpha = alpha;
            c.lineWidth = width;
            c.stroke()
            c.globalAlpha = 1;
            
        }
    }
}
function drawToClosest(x,y,number,color,alpha,width){
    c.beginPath();
    c.moveTo(x , y)
    let coordinates = closest(x,y,number);
    c.lineTo(coordinates[0] ,coordinates[1]);
    c.strokeStyle = color;
    c.globalAlpha = alpha;
    c.lineWidth = width;
    c.stroke()
    c.globalAlpha = 1;

}


// }
// function Line(x, y, x2, y2, size, color) {
//     this.x = x;
//     this.y = y;
//     this.x2 = x2;
//     this.y2 = y2;
//     this.size = size;
//     this.color = color;
//     this.draw = () => {
//         c.beginPath();
//         c.moveTo(x, y);
//         c.lineTo(x2, y2);
//         c.strokeStyle = color;
//         c.lineWidth = size;
//         c.stroke();
//     };
//     this.update = () => {
//         // this.x=this.x+5;
//         this.draw();
//     };
// }


function drawPoint(x, y, radius, color, opacity, border) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
        c.beginPath();
        c.arc(x, y, radius, 0, 2*Math.PI);
        c.fillStyle = color;
        c.strokeStyle = 'black';
        c.globalAlpha = opacity;
        c.lineWidth = border;
        c.fill();
        c.stroke();
        c.globalAlpha = 1;
        
}

   
function drawMap(){
    // for (var i = 0; i < mapPoints.length; i++) {
    //     let pointX = mapPoints[i][0];
    //     let pointY = mapPoints[i][1];
    //     let dist = Math.sqrt(Math.pow((pointX - sizeX/2),2) + Math.pow((pointY - sizeY/2), 2));
    //     let opacity = 1 - dist / render_dist;
    //     if(dist <= render_dist){
    //         drawPoint(pointX, pointY , 5, pointColor, opacity);
    //     }
    // }
    for (var i = 0; i < mapPoints.length; i++) {
        let pointX = mapPoints[i][0];
        let pointY = mapPoints[i][1];
        let radius = mapPoints[i][2];
        let color = mapPoints[i][3];
        let opacity = mapPoints[i][4];
        let border = mapPoints[i][5];
        if(
            pointX - radius< sizeX
            && 
            pointX + radius > 0
            &&
            pointY - radius < sizeY
            && 
            pointY + radius > 0     
        ){
            pointX = (pointX ) - (sizeX - sizeX)/2 ;
            pointY = (pointY)-  (sizeY - sizeY)/2 ;
            drawPoint(pointX, pointY, radius, color, opacity, border)
                
        }
    }

}
function drawBorder(){
    let x =  mapBorder[0];
    let y =  mapBorder[1];
    let x2 =  mapBorder[2];
    let y2 =  mapBorder[3];
    let mapRadius = mapBorder[4];
    c.beginPath();
    c.rect(x,y, x2-x, y2-y);
    c.lineWidth = mapRadius;
    c.strokeStyle = 'red';
    c.fillStyle = 'green';
    c.stroke();
    c.fill();

}
function closest(x, y, number){
        let tempLen = 0;
        let closestArr = [];
    for(let i = 0; i < mapPoints.length; i++){
        let tempX = mapPoints[i][0];
        let tempY = mapPoints[i][1];
        if(tempX != x || tempY != y){

            tempLen = Math.sqrt(Math.pow((tempX - x),2) + Math.pow((tempY - y),2))
            closestArr.push([tempLen, tempX, tempY]);
            }
        // c.beginPath();
        // c.moveTo(x,y);
        // c.lineTo( mapPoints[i][0],mapPoints[i][1]);
        // c.strokeStyle= "red";
        // c.globalAlpha = 0.2;
        // c.stroke();
        // c.globalAlpha = 1;  
    }
    closestArr.sort(function([a,b],[c,d]){return c - a || b - d})
    closestArr.reverse();
    return([closestArr[number][1] , closestArr[number][2]])

}


function animation(){
    c.clearRect(0,0,innerWidth,innerHeight);
    playerMove();
    drawBorder();
    generateLines(1,"blue",1,3);
    // drawToClosest(mouseX,mouseY,0,"yellow",1,3);
    // drawToClosest(mouseX,mouseY,1,"yellow",0.8,3);
    // drawToClosest(mouseX,mouseY,2,"yellow",0.6,3)
    // drawToClosest(mouseX,mouseY,3,"yellow",0.4,3);
    // for(let i = 0; i< mapPoints.length; i++){
    //     drawToClosest(mouseX,mouseY,i,"yellow",0.4,3);
    // }
    drawMap();
    // for(let i = 0; i< mapPoints.length; i++)[
    //     closest(mapPoints[i][0],mapPoints[i][1],"red", 0.3)
    // ]

}
generateMap();
animation();
setInterval(animation, 60);
