let config={
    render: Phaser.Auto,
    width :800,
    height :600,
    physics :{
        default: 'arcade',
        arcade:{
            y:400,
            debug:false,
        }
    },
    scene:{
        preload: preload,
        create: create,
        update: update,
    }


};
let game= new Phaser.Game(config);


function preload(){
this.load.image( "background", "assets/background.png");
this.load.image("road", "assets/road.png");
this.load.image("column", "assets/column.png");
this.load.spritesheet("bird", "assets/bird.png", {frameWidth:64 , frameHeight:96,});
}

let bird;
let hasLanded =false;
let cursors;

function create(){
const background= this.add.image(0, 0, "background").setOrigin(0,0);
const topColums= this.physics.add.staticGroup({
    key:"column",
    repeat:1,
    setXY: {x:200, y:0, stepX:300}

}
)

const buttomColums= this.physics.add.staticGroup({
    key:"column",
    repeat:1,
    setXY: {x:350, y:400, stepX:300}

}
)
const roads=this.physics.add.staticGroup();
const road= roads.create(400, 568, "road").setScale(2);

bird=this.physics.add.sprite(0,50,"bird").setScale(2);
bird.setBounce(0.2);
bird.setCollideWorldBounds(true)

this.physics.add.overlap(bird,road, ()=> hasLanded=true , null, this);
this.physics.add.collider(bird, road)

cursors = this.input.keyboard.createCursorKeys();
}


function update(){
if (cursors.up.isDown){
    bird.setVelocityY(-100);
}
}
