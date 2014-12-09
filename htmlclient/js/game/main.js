
var userName = 'user' + Math.floor((Math.random()*1000)+1);
var socket =  io.connect('http://localhost:9092');

var output = console.log;


function sendLocation(x, y) {
    var jsonObject = {
        userName: userName,
        x: x,
        y: y
    };
    socket.emit('locationevent', jsonObject);
}

socket.on('connect', function() {
    output("connected");
});

socket.on('locationevent', function(data) {
    output(data);
});

socket.on('disconnect', function() {
    output("disconnected");
});

function sendDisconnect() {
    socket.disconnect();
}


// http://www.gamedevacademy.org/html5-phaser-tutorial-top-down-games-with-tiled/
var TopDownGame = TopDownGame || {};

TopDownGame.game = new Phaser.Game(1000, 1000, Phaser.AUTO, '');

TopDownGame.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
TopDownGame.Boot.prototype = {
    preload: function() {
        //assets we'll use in the loading screen
        //this.load.image('preloadbar', 'assets/images/preloader-bar.png');
    },
    create: function() {
        //loading screen will have a white background
        this.game.stage.backgroundColor = '#fff';

        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //screen size will be set automatically
        this.scale.setScreenSize(true);

        //physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('Preload');
    }
};

//loading the game assets
TopDownGame.Preload = function(){};

TopDownGame.Preload.prototype = {
    preload: function() {
        //show loading screen
        //this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
        //this.preloadBar.anchor.setTo(0.5);

        //this.load.setPreloadSprite(this.preloadBar);

        //load game assets
        this.load.tilemap('level1', '/js/game/demo/desert.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', '/js/game/demo/tmw_desert_spacing.png');
        //this.load.image('greencup', 'assets/images/greencup.png');
        //this.load.image('bluecup', 'assets/images/bluecup.png');
        this.load.image('player', '/js/game/chars/player.png');
        this.load.image('enemy', '/js/game/chars/enemy.png');
        //this.load.image('browndoor', 'assets/images/browndoor.png');

    },
    create: function() {
        this.state.start('Game');
    }
};

//title screen
TopDownGame.Game = function(){};

TopDownGame.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap('level1');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('desert', 'gameTiles');

        //create layer
        this.ground = this.map.createLayer('background');
        this.hitboxes = this.map.createLayer('collision');

        //collision on blockedLayer
        this.map.setCollisionBetween(1, 1000, true, 'collision');

        //resizes the game world to match the layer dimensions
        this.ground.resizeWorld();

        this.createItems();

        this.player = this.game.add.sprite(32, 32, 'player');
        this.game.physics.arcade.enable(this.player);


        //the camera will follow the player in the world
        //this.game.camera.follow(this.player);

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    createItems: function() {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        //var item;
        //result = this.findObjectsByType('item', this.map, 'objectsLayer');
        //result.forEach(function(element){
        //    this.createFromTiledObject(element, this.items);
        //}, this);
    },
    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element){
            if(element.properties.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact position as in Tiled
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },
    //create a sprite from an object
    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
    },

    update: function() {
        //player movement
        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        if(this.cursors.up.isDown) {
            this.player.body.velocity.y -= 50;
        }
        else if(this.cursors.down.isDown) {
            this.player.body.velocity.y += 50;
        }
        if(this.cursors.left.isDown) {
            this.player.body.velocity.x -= 50;
        }
        else if(this.cursors.right.isDown) {
            this.player.body.velocity.x += 50;
        }

        //collision
        this.game.physics.arcade.collide(this.player, this.hitboxes);
        //this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        //this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

        //console.log("sprite: x: " + this.player.x + " y: " + this.player.y);
        sendLocation(this.player.x, this.player.y);
    }
}

TopDownGame.game.state.add('Boot', TopDownGame.Boot);
TopDownGame.game.state.add('Preload', TopDownGame.Preload);
TopDownGame.game.state.add('Game', TopDownGame.Game);

TopDownGame.game.state.start('Boot');
