var game = new Phaser.Game(319, 239, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('player', 'assets/ship.png');
    game.load.image('star', 'assets/star2.png');
    game.load.image('baddie', 'assets/space-baddie.png');
    game.load.atlas('lazer', 'assets/laser.png', 'assets/laser.json');

}

var stars;
var baddies;
var lazers;
var player;
var cursors;
var fireButton;
var escKey;
var bulletTime = 0;
var frameTime = 0;
var frames;
var prevCamX = 0;

function create() {

    game.world.setBounds(0, 0, 319 * 4, 239);

    frames = Phaser.Animation.generateFrameNames('frame', 2, 30, '', 2);
    frames.unshift('frame02');

    stars = game.add.group();

    for (var i = 0; i < 128; i++) {
        stars.create(game.world.randomX, game.world.randomY, 'star');
    }

    baddies = game.add.group();

    for (var i = 0; i < 16; i++) {
        baddies.create(game.world.randomX, game.world.randomY, 'baddie');
    }

    lazers = game.add.group();

    player = game.add.sprite(50, 200, 'player');
    player.anchor.x = 0.5;

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.J);
    escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    prevCamX = game.camera.x;

}

function update() {

    if (cursors.left.isDown) {
        player.x -= 8;
        player.scale.x = -1;
    } else if (cursors.right.isDown) {
        player.x += 8;
        player.scale.x = 1;
    }

    if (cursors.up.isDown) {
        player.y -= 8;
    } else if (cursors.down.isDown) {
        player.y += 8;
    }

    if (fireButton.isDown) {
        fireBullet();
    }

    if (escKey.isDown) {
        game.pendingDestroy = true;
        window.location.replace('../../../index.html');
    }

    lazers.forEachAlive(updateBullets, this);

    prevCamX = game.camera.x;

}

function updateBullets(lazer) {

    // if (game.time.now > frameTime)
    // {
    //     frameTime = game.time.now + 500;
    // }
    // else
    // {
    //     return;
    // }

    //  Adjust for camera scrolling
    var camDelta = game.camera.x - prevCamX;
    lazer.x += camDelta;

    if (lazer.animations.frameName !== 'frame30') {
        lazer.animations.next();
    } else {
        if (lazer.scale.x === 1) {
            lazer.x += 16;

            if (lazer.x > (game.camera.view.right - 224)) {
                lazer.kill();
            }
        } else {
            lazer.x -= 16;

            if (lazer.x < (game.camera.view.left - 224)) {
                lazer.kill();
            }
        }
    }

}

function fireBullet() {

    if (game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
        lazer = lazers.getFirstDead(true, player.x + 24 * player.scale.x, player.y + 8, 'lazer');

        lazer.animations.add('fire', frames, 60);
        lazer.animations.frameName = 'frame02';

        lazer.scale.x = player.scale.x;

        if (lazer.scale.x === 1) {
            // lazer.anchor.x = 1;
        } else {
            // lazer.anchor.x = 0;
        }

        //  Lazers start out with a width of 96 and expand over time
        // lazer.crop(new Phaser.Rectangle(244-96, 0, 96, 2), true);

        bulletTime = game.time.now + 250;
    }

}