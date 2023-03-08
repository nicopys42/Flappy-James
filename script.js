//board variables
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird variables
let birdWidth = 58;//34; //  ratios neye kamainano khngde
let birdHeight = 48;//24; //   png is 408/228 ie 17/12 kamai na 34/24 oidoino ?
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //ok the ratio thing actual img ratio are  384/3072 => 1/8
let pipeHeight = 512; // 64/512 is also 1/8
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;


//physis stuff
let velocityX = -2; //pipe speed
let velocityY =0; //bird jump speed
let gravity =  0.4;

let gameOver = false;
let score = 0;
let text = ["Life is Pain", "heitehey ngdi", "wow", "adu tng?",
                "Cjakho", "gayjao" , "single forever" , "dunadi mi oiroi"
            ];
let randomText;



window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    context = board.getContext("2d"); //draws on board

    //draw the damn bird
    //context.fillStyle = "green";
    //context.fillRect(bird.x ,bird.y,bird.width,bird.height);

    //load img
    birdImg = new Image();
   //birdImg.src = "./img/flappybird.png";
    birdImg.src = "./img/james.png";
    birdImg.onload =function(){
        context.drawImage(birdImg,bird.x ,bird.y,bird.width,bird.height);
    }

    topPipeImg= new Image();
    topPipeImg.src = "./img/toppipe.png";    
    bottomPipeImg= new Image();
    bottomPipeImg.src = "./img/bottompipe.png";    


    requestAnimationFrame(update);
    setInterval(placePipes,1500); //every 1.5sec
    document.addEventListener("keydown",moveBird);

}


function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height); //clear
    context.drawImage(birdImg,bird.x ,bird.y,bird.width,bird.height); //redraw


    if(bird.y > board.height){
        gameOver = true;
    }
    //pipes
    velocityY += gravity;
    //bird.y += velocityY; 
    bird.y =  Math.max(bird.y + velocityY,0); // 0 is the limit ie top of canvas

    for(let i = 0 ;i< pipeArray.length; i++){
        let pipe =  pipeArray[i];
        pipe.x +=velocityX;
        context.drawImage(pipe.img, pipe.x,pipe.y,pipe.width,pipe.height);
        
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; // 0.5 cuz 0.5+0.5 is 1 two score cuz two pipes
            pipe.passed = true;
        }

        if(detectCollision(bird,pipe)){
            gameOver=true;
            
        }
    }

    //clear pipe after passing
    while( pipeArray.length>0 && pipeArray[0].x <-pipeWidth ){
        pipeArray.shift(); //remove first element of the array
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);
    randomText =text[Math.floor(Math.random()*text.length)];
    if(gameOver){
        context.fillText(randomText ,5, 90 ); 
    }
}

function placePipes(){
    if(gameOver){
        return;
    }

    //(0-1)*pipeheight/2
    //0 - -128 (pipeheight/4)
    //1 - -128-256 (pipeheight/4 - pipeheight/2) = -3/4 height
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;
    
    let topPipe = {
        img: topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace ,
        width: pipeWidth,
        height: pipeHeight,
        passed : false

    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if(e.code == "Space"|| e.code == "ArrowUp"){
        //jump 
        velocityY = -6;
    }

    //reset game
    if(gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a,b){
    return  a.x < b.x + b.width && 
            a.x  + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}