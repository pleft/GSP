var game = new Phaser.Game(319, 239, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var menu;
var upKey;
var downKey;
var startKey;
var escKey;
var yKey;
var menuItem;
var menuPreviousItem;
var menuNextItem;
var menuPosition = 0;
var titleFont;
var previousItemFont;
var currentItemFont;
var nextItemFont;
var footerFont;
var image;
var module;

const fontChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ._0123456789<|>';

function preload() {
    game.load.script('protracker', '_plugins/ProTracker.js');
    game.load.image('070', 'assets/fonts/070.png');
    game.load.image('floor', 'assets/checker-floor.png');
    game.load.binary('elysium', 'assets/elysium.mod', modLoaded, this);
    game.load.json('menu', '../GSPGames/menu.json');
}

function modLoaded(key, data) {
    var buffer = new Uint8Array(data);
    return buffer;
}


function create() {
    menu = game.cache.getJSON('menu');
    game.stage.backgroundColor = '#000042';

    var floor = game.add.image(0, game.height, 'floor');
    floor.width = 319;
    floor.anchor.y = 1;

    titleFont = game.add.retroFont('070', 15, 15, fontChars, 20, 1, 1);
    previousItemFont = game.add.retroFont('070', 15, 15, fontChars, 20, 1, 1);
    currentItemFont = game.add.retroFont('070', 15, 15, fontChars, 20, 1, 1);
    nextItemFont = game.add.retroFont('070', 15, 15, fontChars, 20, 1, 1);
    footerFont = game.add.retroFont('070', 15, 15, fontChars, 20, 1, 1);

    titleFont.text = "GSP LAUNCHER";
    image = game.add.image(game.world.centerX, 20, titleFont);
    image.anchor.set(0.5);
    image.scale = { type: 25, x: 1.4, y: 1.4 };

    footerFont.setText("MENU>EXIT       START>PLAY");
    var footerImage = game.add.image(4, 220, footerFont);
    footerImage.scale = { type: 25, x: 0.8, y: 0.8 };

    if (menu === null || menu === undefined || menu['games'].length === 0) {
        menu = { "games": [{ title: '...empty...', directory: null }] };
    }

    previousItemFont.text = '';
    menuPreviousItem = game.add.image(game.world.centerX, 80, previousItemFont);
    menuPreviousItem.anchor.set(0.5);

    currentItemFont.text = '> ' + menu['games'][menuPosition].title + ' <';
    menuItem = game.add.image(game.world.centerX, 100, currentItemFont);
    menuItem.anchor.set(0.5);
    if (menu['games'].length > 1) {
        nextItemFont.text = menu['games'][menuPosition + 1].title;
        menuNextItem = game.add.image(game.world.centerX, 120, nextItemFont);
        menuNextItem.anchor.set(0.5);
    }

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    yKey = game.input.keyboard.addKey(Phaser.Keyboard.I);


    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.ENTER, Phaser.Keyboard.ESC, Phaser.Keyboard.I]);

    module = new Protracker();

    //module.play() has to be called from a callback
    module.onReady = function() {
        module.play();
    };

    module.buffer = game.cache.getBinary('elysium');
    module.parse();
}

function update() {
    if (downKey.justDown && menuPosition < menu['games'].length - 1) {
        currentItemFont.text = '> ' + menu['games'][++menuPosition].title + ' <';
        previousItemFont.text = menu['games'][menuPosition - 1].title;
        if (menuPosition < menu['games'].length - 1) {
            nextItemFont.text = menu['games'][menuPosition + 1].title;
        } else {
            nextItemFont.text = '';
        }
    }
    if (upKey.justDown && menuPosition > 0) {
        currentItemFont.text = '> ' + menu['games'][--menuPosition].title + ' <';
        if (menuPosition > 0) {
            previousItemFont.text = menu['games'][menuPosition - 1].title;
        } else {
            previousItemFont.text = '';
        }
        nextItemFont.text = menu['games'][menuPosition + 1].title;
    }
    if (startKey.justDown) {
        console.log('selected: ' + menu['games'][menuPosition].title);
        // var gameDirectory = menu['games'][menuPosition].directory;
        // console.log(gamesDir + menu['games'][menuPosition].directory);
        window.location.replace('../GSPGames/' + menu['games'][menuPosition].directory + '/index.html');
        // if (gameDirectory != null) {
        //     game.pendingDestroy = true;
        //     var exec = require('child_process').exec;
        //     var deleteTemp = function() {
        //         exec('rm -rf ./tmp/', function(err, data) {
        //             console.log(err);
        //             var copyGameToTemp = function() {
        //                 exec('cp -R ' + gamesDir + gameDirectory + ' ./tmp/', function(err, data) {
        //                     console.log(err);
        //                     window.location.replace('tmp/index.html');
        //                 });
        //             }();
        //         });
        //     }();
    }

    if (escKey.isDown) {
        // nwjs related code to close the application
        nw.App.closeAllWindows();
    }
    if (yKey.justDown) {
        window.location.replace('index.html');
        // var exec = require('child_process').exec;
        // var fun = function() {
        //     exec('git checkout menu', function(err, data) {
        //         console.log(err)
        //         console.log(data.toString());
        //         alert(data);
        //     });
        // }
        // fun();
    }
}