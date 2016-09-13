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
				x:70,
				y:70
			}).addTo(this);
			
			var btn01 = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('pass01','uimap'),
				x:300,
				y:100
			}).addTo(this);
			var btnpass01 = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('pass02','uimap'),
				x:550,
				y:100
			}).addTo(this);
 			var btnExit = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('quitbt','uimap'),
				x:700,
				y:400
			}).addTo(this);
			
			var lockpass = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('lockicon','uimap'),
				x:300,
				y:100
			}).addTo(this);
			
			var scene = this;
			btnpass01.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.story);
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
		},
		deactive: function() {
			var scene = this;
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
	
	var FailureScene = ns.FailureScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.main,
		width: 0,
		height: 0,
		constructor: function(properties) {
			FailureScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = game.screenHeight/2 - this.height/2;
			this.x = game.screenWidth/2 - this.width/2;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			var img = game.getImg('uimap');
			var bg = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('bg01q2'),
				width:this.width,
				height:this.height
			}).addTo(this);
			addDecorativeSide(img,this);
			
			var font = "14px arial";
			var gomap = new Hilo.Container({
				x:215,
				y:224,
				width:110,
				height:60
			}).addTo(this);
			
			var btn01 = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('overright'),
			}).addTo(gomap);
			var text1 = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: '返回地图',
               		lineSpacing: 10,
                	width: 100,
                	height: 50,
               		x: 10,
                	y: 15
           		 }).addTo(gomap);
			
			var reattack = new Hilo.Container({
				x:65,
				y:230,
				width:100,
				height:80
			}).addTo(this);
			
			var btn02 = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('overatk'),
			}).addTo(reattack);
			
           	var text2 = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: '再次挑战',
               		lineSpacing: 10,
                	width: 100,
                	height: 50,
               		x: 25,
                	y: 10
           		 }).addTo(reattack);
			
			gomap.on(Hilo.event.POINTER_START, function(e) {
				console.log('ok,go map');
				game.switchScene(game.configdata.SCENE_NAMES.map);
			});
			reattack.on(Hilo.event.POINTER_START, function(e) {
				console.log('ok,reattack');
			});
			
		},
		onUpdate: function() {
			
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
		},
	});
	
	
	var StoryScene = ns.StoryScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.story,
		storytxt:'',
		constructor: function(properties) {
			StoryScene.superclass.constructor.call(this, properties);
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
			game.stage.swapChildren(this, game.previousScene);
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
				rect:game.configdata.getPngRect('pass01btn','uimap'),
				x:360,
				y:10
			}).addTo(this);
			
			var bedroom = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('bedroompass','uimap'),
				x:330,
				y:100
			}).addTo(this);
			var cookieroom = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('cookiepass','uimap'),
				x:600,
				y:100
			}).addTo(this);
			var liftroom = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('liftpass','uimap'),
				x:330,
				y:300
			}).addTo(this);
			var corridor = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('corridorpass','uimap'),
				x:600,
				y:300
			}).addTo(this);
			
			var btnback = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('backbtn','uimap'),
				x:760,
				y:20
			}).addTo(this);
			
			
			
			var font = "14px arial";
            //text view
            var text = new Hilo.Text({
                font: font,
                color:'#333330',
                text:game.configdata.GAMETXTS.note01,
                lineSpacing: 10,
                width: 250,
                height: 100,
                x: 40,
                y: 100
            }).addTo(this);
            
            bedroom.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.attack);
			});
			
			cookieroom.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.cookieroom);
			});
			
			liftroom.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.choice);
			});
			
			corridor.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.runaway);
			});
			
			btnback.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.main);
			});

			/*this.on(Hilo.event.POINTER_START,function(e){
				new Hilo.Tween.to(this,{
					alpha:0.05
				},{
					duration:1000,
					onComplete:function(){
						if(localStorage.heroData){
							game.switchScene(game.configdata.SCENE_NAMES.map);
						}else{
							game.switchScene(game.configdata.SCENE_NAMES.coach);
						}
					}
				})
			});*/
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
	
	var ShopScene = ns.ShopScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.shop,
		goldtxt:null,
		goodslayer:null,
		weaponBtn:null,
		armourBtn:null,
		potionBtn:null,
		jewelryBtn:null,
		scene:null,
		okpanel:null,
		ignoretouch:false,
		constructor: function(properties) {
			ShopScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.x = game.screenWidth/2 - this.width/2;
			scene = this;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			var img = game.getImg('uimap');
			var h = this.width * 2/3;
			var saleman  = new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngSize('saleman01'),
				width:this.width,
				height:h
			}).addTo(this);
			var adjustH = 50;
			if(this.height < 480)
				adjustH = 100;
			
			var rect = game.configdata.getPngSize('image351');
			var topbg = new Hilo.Bitmap({
				image:img,
				rect:rect,
				width:this.width,
				height:this.height - saleman.height + adjustH,
				y:saleman.height-adjustH
			}).addTo(this);
			
			this.goodslayer = new Hilo.Container({
				x:25,
				y:topbg.y + 40,
			}).addTo(this);
		
			var exitBtn = new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngSize('btn_icon_08')
			}).addTo(this);
			exitBtn.on(Hilo.event.POINTER_START,function(e){
				if(scene.ignoretouch)
					return;
				game.switchScene(game.configdata.SCENE_NAMES.map);
			});
			
			var btnbg = 'image348';
			var btnypos = topbg.y-12;
			this.weaponBtn = new game.ImgTxtBtn({
				txt:'武器',
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:btnbg,
				disy:-2,
				x:10,
				y:btnypos,
				data:0,
			}).addTo(this);
			this.armourBtn =new game.ImgTxtBtn({
				txt:'护甲',
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:btnbg,
				disy:-2,
				x:70,
				y:btnypos,
				alpha:0.6,
				data:1,
			}).addTo(this);
			this.jewelryBtn = new game.ImgTxtBtn({
				txt:'饰品',
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:btnbg,
				disy:-2,
				x:130,
				y:btnypos,
				alpha:0.6,
				data:2
			}).addTo(this);
			this.potionBtn = new game.ImgTxtBtn({
				txt:'药水',
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:btnbg,
				disy:-2,
				x:190,
				y:btnypos,
				alpha:0.6,
				data:3
			}).addTo(this);
			
			this.addGoods(this.weaponBtn.data);
			
			this.weaponBtn.on(Hilo.event.POINTER_START,this.onHight);
			this.armourBtn.on(Hilo.event.POINTER_START,this.onHight);
			this.potionBtn.on(Hilo.event.POINTER_START,this.onHight);
			this.jewelryBtn.on(Hilo.event.POINTER_START,this.onHight);
			
			var goldtxtbg = new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngSize('image147'),
				x:this.width - 132,
			}).addTo(this);
			this.goldtxt = new game.NumFontBmp({
				txt:game.userData.userInfo.goldcoinNum,
				sourceImg: img,
				x:goldtxtbg.x + 30,
				y:goldtxtbg.y + 12
			}).addTo(this);
			new game.ImgTxtBtn({
				txt:'购买金币',
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'overleft',
				disy:-2,
				disx:20,
				x:this.width - 114,
				y:36,
				data:3
			}).addTo(this);
		},
		addGoods:function(shoptype){
			this.goodslayer.removeAllChildren();
			var scene = this;
			var n = 0;
			for(var i=0;i<shopdata.length;i++){
				var dataitem = shopdata[i];
				if(dataitem.shoptype != shoptype)
					continue;
				var goods_item = new game.GoodsIcon({
					name:dataitem.name,
					price:dataitem.price,
					img:dataitem.img,
					x:(n%3) * 90,
					y:Math.floor(n/3) * 140,
					index:dataitem.index,
					description:dataitem.description
				}).addTo(this.goodslayer);
				goods_item.on(Hilo.event.POINTER_START,function(e){
					if(scene.ignoretouch)
						return;
					scene.ignoretouch = true;
					scene.goodslayer.alpha = 0.2;
					var objdata = shopdata[this.index];
					var okpanel = new game.SurePanel({
						x:scene.width/2,
						y:scene.height/2,
						price:this.price,
						goodsimg:this.img,
						name:this.name,
						txt1:objdata.description,
						txt2:objdata.price+game.configdata.GAMETXTS.shopTxt+objdata.name+'?',
						titletxt:game.configdata.GAMETXTS.lockReady,
					}).addTo(scene);
					okpanel.index = this.index;
					okpanel.backbtn.on(Hilo.event.POINTER_START,function(e){
						scene.ignoretouch = false;
						scene.goodslayer.alpha = 1;
						okpanel.removeFromParent();
					});
					okpanel.okbtn.on(Hilo.event.POINTER_START,function(e){
						scene.ignoretouch = false;
						scene.goodslayer.alpha = 1;
						var storedata = game.userData.heroData.storedata;
						okpanel.removeFromParent();
						 var flashtxt = new game.FlashtxtPanel({
							x:scene.width/2,
							y:scene.height/2,
						}).addTo(scene);
						if(storedata.length < game.configdata.STORESIZE){
							if(okpanel.price <= game.userData.userInfo.goldcoinNum){
								storedata.push(okpanel.index);
								game.userData.userInfo.goldcoinNum -= okpanel.price;
								scene.goldtxt.setText(game.userData.userInfo.goldcoinNum);
								flashtxt.show('购买成功！','white',800);
							}else{
								flashtxt.show(game.configdata.GAMETXTS.notEnoughGold,'white',800);
							}
						}
						else{
							flashtxt.show('仓库容量不足！','white',1200);
						}
					});
				});
				n++;
			}
		},
		onHight:function(e){
			if(scene.ignoretouch)
				return;
			scene.weaponBtn.alpha = 0.6;
			scene.potionBtn.alpha = 0.6;
			scene.armourBtn.alpha = 0.6;
			scene.jewelryBtn.alpha = 0.6;
			this.alpha = 1;
			scene.addGoods(this.data);
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
		},
	});
})(window.game);