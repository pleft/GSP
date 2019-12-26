var game = new Phaser.Game(320, 240, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.atlas('breakout', 'assets/breakout/breakout.png', 'assets/breakout/breakout.json');
    game.load.image('starfield', 'assets/breakout/starfield.jpg');

}

var ball;
var paddle;
var bricks;

var ballOnPaddle = true;

var lives = 3;
var score = 0;

var scoreText;
var livesText;
var introText;

var s;

var upKey;
var downKey;
var leftKey;
var rightKey;
var escKey;
var fireKey;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

    s = game.add.tileSprite(0, 0, 320, 240, 'starfield');

    bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 8; x++) {
            brick = bricks.create(10 + (x * 36), (y * 24), 'breakout', 'brick_' + (y + 1) + '_1.png');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }

    paddle = game.add.sprite(game.world.centerX, 220, 'breakout', 'paddle_big.png');
    paddle.anchor.setTo(0.5, 0.5);

    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    paddle.body.collideWorldBounds = true;
    paddle.body.bounce.set(1);
    paddle.body.immovable = true;

    ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
    ball.anchor.set(0.5);
    ball.checkWorldBounds = true;

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);

    ball.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);

    ball.events.onOutOfBounds.add(ballLost, this);

    scoreText = game.add.text(4, 210, 'score: 0', { font: "10px Arial", fill: "#ffffff", align: "left" });
    livesText = game.add.text(280, 200, 'lives: 3', { font: "10px Arial", fill: "#ffffff", align: "left" });
    introText = game.add.text(game.world.centerX, 100, '- Press A -', { font: "20px Arial", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);

    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.J);
    this.fireKey.onDown.add(releaseBall, this);

    //  Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.J, Phaser.Keyboard.ESC]);

}

function update() {

    //  Fun, but a little sea-sick inducing :) Uncomment if you like!
    // s.tilePosition.x += (game.input.speed.x / 2);

    if (this.leftKey.isDown) {
        paddle.body.velocity.x = -250;
    } else if (this.rightKey.isDown) {
        paddle.body.velocity.x = 250;
    } else {
        paddle.body.velocity.x = 0;
    }

    if (paddle.x < 24) {
        paddle.x = 24;
    } else if (paddle.x > game.width - 24) {
        paddle.x = game.width - 24;
    }

    if (ballOnPaddle) {
        ball.body.x = paddle.x;
    } else {
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
    }
    if (this.escKey.isDown) {
        game.pendingDestroy = true;
        window.location.replace('../../../index.html');
    }

}

function releaseBall() {

    if (ballOnPaddle) {
        ballOnPaddle = false;
        ball.body.velocity.y = -200;
        ball.body.velocity.x = -70;
        ball.animations.play('spin');
        introText.visible = false;
    }

}

function ballLost() {

    lives--;
    livesText.text = 'lives: ' + lives;

    if (lives === 0) {
        gameOver();
    } else {
        ballOnPaddle = true;

        ball.reset(paddle.body.x + 16, paddle.y - 16);

        ball.animations.stop();
    }

}

function gameOver() {

    ball.body.velocity.setTo(0, 0);

    introText.text = 'Game Over!';
    introText.visible = true;

}

function ballHitBrick(_ball, _brick) {

    _brick.kill();

    score += 10;

    scoreText.text = 'score: ' + score;

    //  Are they any bricks left?
    if (bricks.countLiving() == 0) {
        //  New level starts
        score += 1000;
        scoreText.text = 'score: ' + score;
        introText.text = '- Next Level -';

        //  Let's move the ball back to the paddle
        ballOnPaddle = true;
        ball.body.velocity.set(0);
        ball.x = paddle.x + 16;
        ball.y = paddle.y - 16;
        ball.animations.stop();

        //  And bring the bricks back from the dead :)
        bricks.callAll('revive');
    }

}

function ballHitPaddle(_ball, _paddle) {

    var diff = 0;

    if (_ball.x < _paddle.x) {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    } else if (_ball.x > _paddle.x) {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x - _paddle.x;
        _ball.body.velocity.x = (10 * diff);
    } else {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }

}