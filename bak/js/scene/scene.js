(function(ns) {
	var LoadScene = ns.LoadScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.load,
		coinInitXpos: 0,
		coinInitYpos: 0,
		totalLoadTaskNum: 0,
		currentLoadTaskIndex: 0,
		startTxtBtn: null,
		loadtxt: null,
		isflash: false,
		loadingline:null,
		inputtxt:null,
		
		constructor: function(properties) {
			LoadScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
		},
		active: function(data){
			console.log('%s active:', this.name);
			var obj = this;
			this.addTo(game.stage);
			this.startLoadQueue();

			new Hilo.Bitmap({
				image: 'img/bg01.png',
				width: game.screenWidth,
				height: game.screenHeight
			}).addTo(this);
			this.loadtxt = new Hilo.Text({
				text: 'loading...',
				color: '#FFFFFF',
				x: game.screenWidth / 2 - 40,
				y: game.screenHeight / 2 + 5,
			}).addTo(this);
			this.loadingline = new Hilo.Container({
				height:18,
				width:180,
				y: game.screenHeight / 2 + 10 + 14,
				x: game.screenWidth / 2 - 47,
			}).addTo(this);
			new Hilo.Bitmap({
				image: 'img/pipcoin.png',
				y:5,
				x:this.loadingline.width/2 - 218/2-2,
			}).addTo(this.loadingline);
			/*new Hilo.Bitmap({
				image: 'img/loadtitle2.png',
				y: game.screenHeight / 2 - 140,
				x: game.screenWidth / 2 - 240 / 2,
			}).addTo(this);*/
			var sumtime = 0;
			this.startTxtBtn = new Hilo.Bitmap({
				image: 'img/txt_start.png',
				y: game.screenHeight / 2 + 10,
				x: game.screenWidth / 2 - 210 / 2 + 40,
				visible:false,
				onUpdate: function(e) {
					if (!obj.isflash)
						return;
					if (sumtime < 600) {
						this.alpha = 0.8;
					} else {
						this.alpha = 0.1;
					}
					sumtime += game.clock.fpstick;
					if (sumtime >= 600 * 2) {
						sumtime = 0;
					}
				},
			}).addTo(this);
			new Hilo.Text({
				text: '科普知识制作.2016~2017',
				color: '#FFF200',
				x: game.screenWidth - 200,
				y: game.screenHeight - 22,
			}).addTo(this);
			var atlas = new Hilo.TextureAtlas({
				image: 'img/fire7.png',
				width: 256,
				height: 64,
				frames: {
					frameWidth: 32,
					frameHeight: 64,
					numFrames: 8
				},
				sprites: {
					fish: {
						from: 0,
						to: 7
					}
				}
			});

			var fire = new Hilo.Sprite({
				frames: atlas.getSprite('fish'),
				x: game.screenWidth / 2 - 100,
				y: game.screenHeight / 2 - 32 + 10,
				interval: 6,
				timeBased: false,
				loop: true,
			}).addTo(this);
			this.addLoadCoinbg();
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
		},
		startLoadQueue: function() {
			var list = this.getDownloadList(game.configdata.DOWNLOADLIST_PNGS, 'loadimgs');
			var total = list.length;
			var m = Math.floor(list.length / 10);
			var self = this;
			game.loadqueue.add(list);
			game.loadqueue.on('load', function(e) {
				self.loadtxt.text = 'Loading... %' + (Math.floor(this._loaded / total * 100)).toString();
				if (this._loaded % m == 0) {
					self.addLoadCoin();
				}
			});
			game.loadqueue.on('complete', function(e) {
				console.log('end');
				self.loadingline.removeFromParent();
				self.loadtxt.removeFromParent();
				self.startTxtBtn.visible = true;
				self.isflash = true;
				self.on(Hilo.event.POINTER_START, function(e) {
					game.switchScene(game.configdata.SCENE_NAMES.main);
				});
				game.loadqueue.off('complete');
				game.loadqueue.off('load');
				
				game.monsterdata.initAtlas();
				
				game.switchScene(game.configdata.SCENE_NAMES.main);
			});
			game.loadqueue.start();
		},
		getDownloadList: function(files, specific) {
			return _.map(files, function(item) {
				return {
					id: item.split('.')[0],
					src: game.configdata.RESOURCE_BASEDIR + '/' + specific + '/' + item
				};
			});
		},
		addLoadCoinbg: function(e) {
			var self = this;
			for(var i=0;i<10;i++){
				new Hilo.Bitmap({
					image: 'img/coin_01.png',
					x: i*18,
					alpha:0.2
				}).addTo(this.loadingline);
			}
		},
		addLoadCoin: function(e) {
			var self = this;
			new Hilo.Bitmap({
				image: 'img/coin_01.png',
				x:18*this.coinInitXpos,
			}).addTo(this.loadingline);
			this.coinInitXpos++;
		},
	});

	var MainScene = ns.MainScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.main,
		constructor: function(properties) {
			MainScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = -this.height;
			this.x = game.screenWidth/2 - this.width/2;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			this.alpha = 1;
			var img = game.getImg('uimap');
			var bg = new Hilo.Bitmap({
				width:this.width,
				height:this.height,
				image:game.getImg('mainbg'),
			}).addTo(this);
			var boy = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('boy','uimap'),
				x:170,
				y:70
			}).addTo(this);
			
			var btn01 = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('largepass01','uimap'),
				x:400,
				y:100
			}).addTo(this);
			var btnpass01 = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('largepass02','uimap'),
				x:700,
				y:100
			}).addTo(this);
 			var btnExit = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('quitbt','uimap'),
				x:700,
				y:450
			}).addTo(this);
			
			/*var lockpass = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('lockicon','uimap'),
				x:300,
				y:100
			}).addTo(this);*/
			
			var scene = this;
			btnpass01.on(Hilo.event.POINTER_START, function(e) {
				game.sounds.play(2,false);
				//game.switchScene(game.configdata.SCENE_NAMES.firecorridor,[200,600]);
				game.switchScene(game.configdata.SCENE_NAMES.attack,[200,600]);
				
			});
			btnExit.on(Hilo.event.POINTER_START, function(e) {
				window.close();
			});

			Hilo.Tween.to(this, {
				y: game.screenHeight/2 - this.height/2
			}, {
				duration: 800,
				ease: Hilo.Ease.Bounce.EaseOut,
				onComplete: function() {
					game.previousScene.destory();
				}
			});
			game.sounds.play(20,true);
		},
		deactive: function() {
			var scene = this;
			game.sounds.stop(20);
			Hilo.Tween.to(this, {
					y: -this.height,
				}, {
					duration: 500,
					ease: Hilo.Ease.Back.EaseIn,
					onComplete: function() {
						console.log('main scene destory');
						scene.destory();
					}
				});
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
		},
	});
	
	
	
	var PassChoiceScene = ns.PassChoiceScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.passchoice,
		storytxt:'',
		constructor: function(properties) {
			PassChoiceScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.x = game.screenWidth/2 - this.width/2;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			var scene = this;
			this.alpha = 1;
			new Hilo.Bitmap({
				image:game.getImg('mainbg'),
				width:1202,
				height:686
			}).addTo(this);
			
			var img = game.getImg('uimap');
			new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('boy','uimap'),
				x:110,
				y:180
			}).addTo(this);
			
			var passdata = game.boydata.passdata;
			for(var i=0;i<passdata.length;i++){
				var item = passdata[i];
				var passname = item[1];
				var initx = 354;
				var inity = 155;
				var offsetx = (i % 3) * 220;
				var offsety = Math.floor(i/3) * 250;
				var btn = new Hilo.Bitmap({
					image:img,
					rect:game.configdata.getPngRect(passname,'uimap'),
					x:initx + offsetx,
					y:inity + offsety
				}).addTo(this);
				btn.extendname = item[2];
				if(item[0] == -1){
					new Hilo.Bitmap({
						image:img,
						rect:game.configdata.getPngRect('suo','uimap'),
						x:btn.x + btn.width -45,
						y:btn.y + btn.height -68
					}).addTo(this);
				}
				if(item[0] == 0){
					btn.on(Hilo.event.POINTER_START, function(e) {
						game.switchScene(this.extendname,[200,600,'right']);
					});
				}
				
				if(item[0] == 1){
					btn.alpha = 0.5;
				}
			}
			
			new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('quitbt','uimap'),
				x:1000,
				y:50
			}).addTo(this);
			
			game.sounds.stop(14);
			game.sounds.play(20,true);
			
		},
		deactive: function() { 
			this.destory();
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
			game.sounds.stop(20);
		}
	});
	
	var GameoverScene = ns.GameoverScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.gameover,
		storytxt:'',
		constructor: function(properties) {
			GameoverScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.x = game.screenWidth/2 - this.width/2;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			//game.stage.swapChildren(this, game.previousScene);
			var scene = this;
			this.alpha = 1;
			new Hilo.Bitmap({
				image:game.getImg('gameover'),
				width:1202,
				height:686
			}).addTo(this);
			
			
			var btnback = new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('backbtn','uimap'),
				x:940,
				y:480
			}).addTo(this);
			
			
			btnback.on(Hilo.event.POINTER_START, function(e) {
				game.boydata.currentHp = 4;
				game.boydata.reset();
				game.toolspanel.refresh();
				game.headPanel.setHp(game.boydata.currentHp);
				game.switchScene(game.configdata.SCENE_NAMES.firecorridor,[200,500]);
				//game.switchScene(game.configdata.SCENE_NAMES.firecorridor,[200,600,'right']);
			});
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
		}
	});
	
	
})(window.game);