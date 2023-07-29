var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var score=0
var cloud, cloudsGroup, cloudImage;

var gamestate="play"

var newImage;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  ob1=loadImage('obstacle1.png')
  ob2=loadImage('obstacle2.png')
  ob3=loadImage('obstacle3.png')
  ob4=loadImage('obstacle4.png')
  ob5=loadImage('obstacle5.png')
  ob6=loadImage('obstacle6.png')
  gameOverImage=loadImage('gameOver.png')
  restartImage=loadImage('restart.png')

  dieSound=loadSound('die.mp3')
  checkpoint=loadSound('checkpoint.mp3')
  jump=loadSound('jump.mp3')
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  trex = createSprite(50,height-100,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.8;
  trex.debug=false
  trex.setCollider('circle',0,0,40)

  gameOver=createSprite(width/2,height/2-50)
  gameOver.addImage(gameOverImage)
  gameOver.scale=1.3

  restart=createSprite(width/2,height/2)
  restart.addImage(restartImage)
  restart.scale=0.6
  
  ground = createSprite(width/2,height-100,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(width/2,height-90,width,10);
  invisibleGround.visible = false;
  
  cactusGroup=new Group()
  cloudsGroup=new Group()
  
}

function draw() {
  background(180);
  
 
  trex.collide(invisibleGround);
  fill ('white')
  textSize(20)
  text ('Score:'+score,width-150,50)
  

  if(gamestate==="play"){
    ground.velocityX=-(4+score/100)
    gameOver.visible=false
    restart.visible=false

    if(touches.length>0||keyDown("space") && trex.y>=height-150) {
      trex.velocityY = -20;
      jump.play()
      touches=[]
    }
    
    trex.velocityY = trex.velocityY + 1
    
    if (ground.x < 350){
      ground.x = ground.width/2;
    }
    score=score+Math.round(getFrameRate()/60)
    //spawn the clouds
    spawnClouds();
    spawnObstacle();
   
    if(score>0&&score % 100 === 0){
      checkpoint.play()
    }
    console.log(getFrameRate())

    if(cactusGroup.isTouching(trex)){
      dieSound.play()
      gamestate="end"
      
     
    }
  }
  else if(gamestate==="end"){
    ground.velocityX=0
    cactusGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    cactusGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-5)
    trex.changeAnimation('collided')

    gameOver.visible=true
    restart.visible=true

    trex.velocityY=0
    if(mousePressedOver(restart)||touches.length>0){
      gamestate='play'
      trex.changeAnimation('running')
      cactusGroup.destroyEach()
      cloudsGroup.destroyEach()
      score=0
      touches=[]
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    cloud = createSprite(width,100,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(10,100))
    cloud.scale = 1;
    cloud.velocityX = -3;
    
    //adjust the depth
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud)
    cloud.lifetime=1000
    }
}

function spawnObstacle(){
  if (frameCount % 120 == 0){
    obstacle = createSprite (width,height-120,20,50);
    obstacle.velocityX= -(4+score/100)
    obstacle.scale=0.75
    obstacle.lifetime=1000
    cactusGroup.add(obstacle)

    var number=Math.round(random(1,6))

    switch(number){
      case 1:obstacle.addImage(ob1)
      break
      case 2:obstacle.addImage(ob2)
      break
      case 3:obstacle.addImage(ob3)
      break
      case 4:obstacle.addImage(ob4)
      break
      case 5:obstacle.addImage(ob5)
      break
      case 6:obstacle.addImage(ob6)
      break
      default:break
    }


  }
}
