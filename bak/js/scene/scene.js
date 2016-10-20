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
			var list = this.getDownloadList(game.loaddata.DOWNLOADLIST_PNGS, 'loadimgs');
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
		fingerMouse:null,
		btnpass01:null,
		btnExit:null,
		cloud1:null,
		cloud2:null,
		cloud3:null,
		cloud4:null,
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
		initTouchEvent:function(){
			var scene = this;
			game.stage.off();
			game.stage.on(Hilo.event.POINTER_MOVE, function(e) {
				if(scene.ignoreTouch)
					return;
				var stagex = e.stageX;
				var stagey = e.stageY;
				var targetx = stagex - scene.x;
				var targety = stagey - scene.y;
				scene.fingerMouse.x = targetx-7;
				scene.fingerMouse.y = targety;
				scene.fingerMouse.visible = false;
				if(game.checkInRect(targetx,targety,scene.btnpass01.x,scene.btnpass01.y,scene.btnpass01.width,scene.btnpass01.height)||
				   game.checkInRect(targetx,targety,scene.btnExit.x,scene.btnExit.y,scene.btnExit.width,scene.btnExit.height)
				){
					scene.fingerMouse.visible = true;
				}else{
					scene.fingerMouse.visible = false;
				}
				
				if(game.checkInRect(targetx,targety,scene.btnpass01.x,scene.btnpass01.y,scene.btnpass01.width,scene.btnpass01.height)
				   )
				{
					scene.btnpass01.scaleX = scene.btnpass01.scaleY = 1.1;
				}else{
					scene.btnpass01.scaleX = scene.btnpass01.scaleY = 1;
				}
				
			});
			
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			this.initTouchEvent();
			this.alpha = 1;
			var img = game.getImg('uimap');
			var bg = new Hilo.Bitmap({
				width:this.width,
				height:this.height,
				image:game.getImg('mainbg'),
			}).addTo(this);
			this.cloud1 = new Hilo.Bitmap({
				image:'img/cloud1.png',
				x:100,
				y:230,
			}).addTo(this);
			this.cloud2 = new Hilo.Bitmap({
				image:'img/cloud2.png',
				x:500,
				y:140,
			}).addTo(this);
			this.cloud3 = new Hilo.Bitmap({
				image:'img/cloud3.png',
				x:800,
				y:30,
			}).addTo(this);
			this.cloud4 = new Hilo.Bitmap({
				image:'img/cloud4.png',
				x:200,
				y:60,
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
			this.btnpass01 = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('largepass02','uimap'),
				x:700,
				y:100
			}).addTo(this);
 			this.btnExit = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('quitbt','uimap'),
				x:700,
				y:450
			}).addTo(this);
			
			var lockpass = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('suo','uimap'),
				x:557,
				y:285
			}).addTo(this);
			
			var scene = this;
			this.btnpass01.on(Hilo.event.POINTER_START, function(e) {
				game.sounds.play(2,false);
				game.switchScene(game.configdata.SCENE_NAMES.passchoice);
				//game.switchScene(game.configdata.SCENE_NAMES.depot,[200,600]);
			});
			this.btnExit.on(Hilo.event.POINTER_START, function(e) {
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
			this.fingerMouse = new game.FingerMouse({
				visible:false,
				pointerEnabled:false,
			}).addTo(this);
			
			
			this.btnpass01.on(Hilo.event.POINTER_MOVE, function(e) {
				scene.fingerMouse.visible = true;
			});
			this.initTouchEvent();
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
		onUpdate:function(){
			this.cloudMove();
		},
		cloudMove:function(){
			this.cloud1.x -= 0.5;
			this.cloud2.x -= 1;
			this.cloud3.x -= 0.6;
			this.cloud4.x -= 0.8;
			if(this.cloud1.x <-415){
				this.cloud1.x = 1200;
			}
			if(this.cloud2.x <-341){
				this.cloud1.x = 1200;
			}
			if(this.cloud3.x <-590){
				this.cloud3.x = 1200;
			}
			if(this.cloud4.x <-389){
				this.cloud4.x = 1200;
			}
		},
	});
	
	
	
	var PassChoiceScene = ns.PassChoiceScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.passchoice,
		storytxt:'',
		fingerMouse:null,
		btnsPanel:null,
		cloud1:null,
		cloud2:null,
		cloud3:null,
		cloud4:null,
		overPasses:['passover01','passover02','passover03','passover04','passover05','passover06'],
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
			this.cloud1 = new Hilo.Bitmap({
				image:'img/cloud1.png',
				x:100,
				y:230,
			}).addTo(this);
			this.cloud2 = new Hilo.Bitmap({
				image:'img/cloud2.png',
				x:500,
				y:140,
			}).addTo(this);
			this.cloud3 = new Hilo.Bitmap({
				image:'img/cloud3.png',
				x:800,
				y:30,
			}).addTo(this);
			this.cloud4 = new Hilo.Bitmap({
				image:'img/cloud4.png',
				x:200,
				y:60,
			}).addTo(this);
			var img = game.getImg('uimap');
			new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('boy','uimap'),
				x:110,
				y:180
			});
			
			new Hilo.Sprite({
				frames:game.monsterdata.soliderhero_atlas.getSprite('idle'),
				x:110,
				y:180,
				interval:8,
			}).addTo(this);
			
			
			this.btnsPanel = new Hilo.Container({
				x:0,
				y:0,
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
				}).addTo(this.btnsPanel);
				btn.imgdex = i;
				btn.initname = passname;
				btn.extendname = item[2];
				btn.islock = item[0];
				if(item[0] == -1){
					new Hilo.Bitmap({
						image:img,
						rect:game.configdata.getPngRect('suo','uimap'),
						x:btn.x + btn.width -45,
						y:btn.y + btn.height -68
					}).addTo(this.btnsPanel);
				}
				if(item[0] == 0){
					btn.on(Hilo.event.POINTER_START, function(e) {
						game.switchScene(this.extendname,[200,600,'right']);
					});
				}
				
				if(item[0] == 1){
					new Hilo.Bitmap({
						image:game.getImg('uimap'),
						rect:game.configdata.getPngRect('right'),
						x:btn.x + btn.width -45,
						y:btn.y + btn.height -68
					}).addTo(this);
					btn.alpha = 0.5;
				}
			}
			
			
			
			game.sounds.stop(14);
			game.sounds.play(20,true);
			this.fingerMouse = new game.FingerMouse({
				visible:false,
				pointerEnabled:false,
			}).addTo(this);
			
			this.initTouchEvent();
		},
		initTouchEvent:function(){
			var scene = this;
			game.stage.off();
			game.stage.on(Hilo.event.POINTER_MOVE, function(e) {
				if(scene.ignoreTouch)
					return;
				var stagex = e.stageX;
				var stagey = e.stageY;
				var targetx = stagex - scene.x;
				var targety = stagey - scene.y;
				scene.fingerMouse.x = targetx-7;
				scene.fingerMouse.y = targety;
				scene.fingerMouse.visible = false;
				var btns = scene.btnsPanel.children;
				for(var i=0;i<btns.length;i++){
					var btn = btns[i];
					if(true){
					//if(btn.islock == 0){
						if(game.checkInRect(targetx,targety,btn.x,btn.y,btn.width,btn.height)){
							//btn.scaleX = btn.scaleY = 0.9;
							var rect = game.configdata.getPngRect(scene.overPasses[btn.imgdex],'uimap');
							btn.setImage(game.getImg('uimap'),rect);
							scene.fingerMouse.visible = true;
							break;
						}else{
							var rect = game.configdata.getPngRect(btn.initname,'uimap');
							btn.setImage(game.getImg('uimap'),rect);
						}
					}
				}
				
			});
		},
		deactive: function() { 
			this.destory();
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
			game.sounds.stop(20);
		},
		cloudMove:function(){
			this.cloud1.x -= 0.5;
			this.cloud2.x -= 1;
			this.cloud3.x -= 0.6;
			this.cloud4.x -= 0.8;
			if(this.cloud1.x <-415){
				this.cloud1.x = 1200;
			}
			if(this.cloud2.x <-341){
				this.cloud1.x = 1200;
			}
			if(this.cloud3.x <-590){
				this.cloud3.x = 1200;
			}
			if(this.cloud4.x <-389){
				this.cloud4.x = 1200;
			}
		},
		onUpdate:function(){
			this.cloudMove();
		},
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