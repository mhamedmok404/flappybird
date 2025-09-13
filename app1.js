let config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);

function preload() {
  this.load.image("background", "assets/background.png");
  this.load.image("road", "assets/road.png");
  this.load.image("column", "assets/column.png");
  this.load.spritesheet("bird", "assets/bird.png", {
    frameWidth: 64,
    frameHeight: 96,
  });
}

var bird;
let hasLanded = false;
let cursors;
let hasBumped = false;
let gameStarted= false;
let instructions;
let background;
let topColumns, bottomColumns;
let score=0, highScore=0;
let space, playButton;

function getRandInt(min, max){
  return Math.floor(Math.random()*(max-min+1))+min;
}
function create() {
  background = this.add.tileSprite(0, 0,800,600, "background").setOrigin(0, 0);
  const roads = this.physics.add.staticGroup();
  space=getRandInt(50,70);
  topColumns = this.physics.add.staticGroup({
    key: "column",
    repeat: 3,
    setXY: { x: 200, y: 0-space, stepX: 200 },
  });

  bottomColumns = this.physics.add.staticGroup({
    key: "column",
    repeat: 3,
    setXY: { x: 200, y: 500+space, stepX: 200 },
  });

  const road = roads.create(400, 567, "road").setScale(2).refreshBody();

  bird = this.physics.add.sprite(50, 50, "bird").setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  this.physics.add.overlap(bird, road, () => (hasLanded = true), null, this);
  this.physics.add.collider(bird, road);
  cursors =this.input.keyboard.createCursorKeys();


  this.physics.add.overlap(bird, topColumns, ()=> (hasBumped =true), null, this);
  this.physics.add.overlap(bird, bottomColumns, ()=> (hasBumped =true), null, this);
  this.physics.add.collider(bird, topColumns);
  this.physics.add.collider(bird, bottomColumns);

  
  score=0;
  scoreText= this.add.text(600,0 ,score+"    high score: "+ highScore,  { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", } )

  playButton= this.add.text(400, 300, "Play", { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "50px", color: "white", backgroundColor: "black", border:"2px solid red", border_radius: "50px"}).setOrigin(0.5).setInteractive();


}

function update() {
  playButton.on("pointerdown", () => {
        gameStarted=true ;
        playButton.setVisible(false);

    });
    if(!gameStarted){
      bird.x=50;
      bird.y=50;
      bird.setVelocity(0);
    }
    this.input.on("pointerdown", () =>{
      if(  !hasLanded && !hasBumped && gameStarted){
        bird.setVelocityY(-160);
    }
    });
    

    if(hasLanded || hasBumped){
        gameStarted=false;
        hasLanded=false;
        hasBumped=false;
        bird.setVelocityX(0);
        this.scene.restart();
        
        if (score>highScore){
          highScore=score;
        }
        
    }
  let speed=1+ score/20
  if (gameStarted){
    background.tilePositionX+=speed;
    topColumns.children.iterate(function(column){
      column.x -=speed;
      if (column.x <-20){
        column.x=820;
        space=getRandInt(-50,50);
        column.y +=space;}
      column.refreshBody();
    });
    bottomColumns.children.iterate(function(column){
      column.x -=speed;
      if (column.x <-20){
        score+=1;
        scoreText.text= score +"  high score: "+ highScore;
        column.x=820;
        column.y +=space;}
      column.refreshBody();
      
    });
  }
};