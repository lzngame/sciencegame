(function(ns) {
	var CookieroomScene = ns.CookieroomScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.cookieroom,
		
		readyShakeTime:0,
		shakeTime:0,
		shakeLevel:4,
		initx:0,
		inity:0,
		toFallTime:0,
		
		
		annihilator:null,
		annihilatorEffect:null,
		doorhandler:null,
		tvflash:null,
		pan:null,
		boxkey:null,
		pipswitch:null,
		blocks:null,
		
		spanner:null,
		passstep:0,
		constructor: function(properties) {
			CookieroomScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.x = game.screenWidth / 2 - this.width / 2;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
			this.activeObjects = new Array();
		},
		active: function(doorIndex) {
			console.log('%s active:', this.name);
			var scene = this;
			
			this.addTo(game.stage);
			game.stage.swapChildren(this, game.uiscene);
			this.alpha = 1;
			this.currentIndex = 0;
			this.layoutSceneData();
			this.blocks = [[0,0,1202,550],[0,526,172,73],[1033,520,173,84],[0,600,53,85],[1154,605,53,85],[834,526,368,158]];
			this.initBlocks(this.blocks);
			
			this.addHero();
			this.initkeyevent();
			this.initTouchEvent();
			this.initFingerMouse();
			
			this.setPassData();
		},
		excuteIcon:function(index){
			if(index==3){
				game.toolspanel.removeIcon(index);
				game.boydata.addHp();
				game.headPanel.setHp(game.boydata.currentHp);
				new game.FlashStarEffect({
					x:this.hero.posx-50,
					y:this.hero.posy-250,
				}).addTo(this);
				game.toolippanel.show(true,'补充体力',200);
				this.fingerMouse.visible = true;
				this.fingerMouse.active = false; 
				this.fingerMouse.setDefault();
			}else{
				this.fingerMouse.visible = true;
				this.fingerMouse.active = true; 
				this.fingerMouse.setCurrent(index);
			}
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.annihilator)){
				if(this.hero.scaleX == -1 || this.hero.framename != 'idle')
					return;
				
				this.hero.switchState('annihilator',10);
				this.annihilator.visible = false;
				this.annihilatorEffect.visible = true;
				this.annihilatorEffect.x = this.hero.posx + 80;
				this.annihilatorEffect.y = this.hero.posy - 120;
				this.ignoreTouch = true;
				game.boydata.cookieroomData.annihilatorused = true;
				game.notepanel.show(true,game.configdata.GAMETXTS.pass02_ok);
				this.passstep = 1;
				var scene = this;
				new Hilo.Tween.to(scene.tvflash,{
					alpha:0
				},{
					duration:3000,
					onComplete:function(){
						scene.ignoreTouch = false;
						scene.annihilator.visible = true;
						scene.annihilatorEffect.removeFromParent();
						scene.hero.switchState('idle',6);
						scene.annihilator.status = 2;
						scene.blocks.pop();
						game.notepanel.show(true,game.configdata.GAMETXTS.pass02_ok);
					}
				});
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				this.hero.switchState('handon',10);
				var scene = this;
				new Hilo.Tween.to(this,{
					alpha:0.3
				},{
					duration:400,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.saloon);
					}
				});
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.pipswitch)){
				this.hero.switchState('handon',10);
				var scene = this;
				if(this.fingerMouse.index == 2){
					new game.FlashStarEffect({
						x:this.pipswitch.x,
						y:this.pipswitch.y,
					}).addTo(this);
					this.pipswitch.status = 2;
					game.boydata.cookieroomData.pipswitchused = true;
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.boxkey)){
				this.boxkey.removeFromParent();
				this.boxkey.status = 2;
				game.toolippanel.show(true,'这个工具会有用的',200);
				game.toolspanel.show(true,200);
				game.toolspanel.addIcon(5);
				this.star01 = new game.FlashStar({
					x:this.boxkey.x,
					y:this.boxkey.y
				}).addTo(this);
				game.boydata.cookieroomData.boxkeyused = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.pan)){
				this.hero.switchState('handon',10);
				var scene = this;
				this.pan.x = 400;
				this.pan.status = 2;
				this.boxkey.visible = true;
				this.boxkey.status = 1;
				game.boydata.cookieroomData.panused = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.spanner)){
				this.spanner.removeFromParent();
				this.spanner.status = 2;
				game.toolippanel.show(true,'这个工具会有用的',200);
				game.toolspanel.show(true,200);
				game.toolspanel.addIcon(2);
				this.star01 = new game.FlashStar({
					x:560,
					y:560
				}).addTo(this);
				game.boydata.cookieroomData.spannerused = true;
			}
		},
		setPassData:function(){
			if(game.boydata.cookieroomData.pipswitchused){
				this.pipswitch.status = 2;
			}
			if(game.boydata.cookieroomData.panused){
				this.pan.x  = 400;
				this.pan.status = 2;
				if(!game.boydata.cookieroomData.boxkeyused){
					this.boxkey.status = 1;
				}
			}
			if(game.boydata.cookieroomData.spannerused){
				this.spanner.removeFromParent();
			}
			if(game.boydata.cookieroomData.boxkeyused){
				this.boxkey.removeFromParent();
			}
			if(game.boydata.cookieroomData.annihilatorused){
				this.annihilator.status = 2;
				this.tvflash.removeFromParent();
				this.blocks.pop();
			}
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.spanner)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandler)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.annihilator)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.pan)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.boxkey)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.pipswitch)
			){
				return true;
			}else{
				return false;
			}
		},
		
		
		checkStar:function(star){
			if(star && star.parent){
				if(Math.abs(star.x - this.hero.posx) < 100 && Math.abs(star.y - this.hero.posy) < 100){
					star.hide();
					game.starscore.addScore();
				}
			}
		},
		
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.herosquat:
					console.log('hero squat');
					this.hero.speedx = this.hero.speedy = 0;
					this.hero.switchState('squat');
					this.checkStar(this.star01);
					break;
				case game.configdata.MSAGE_TYPE.herojump:
					this.hero.jumpspeed = -18;
					this.hero.floory = this.hero.posy;
					this.hero.switchState('jump');
					break;
				case game.configdata.MSAGE_TYPE.herosquat2idle:
					console.log('hero squat');
					this.hero.switchState('idle',5);
					break;
				case game.configdata.MSAGE_TYPE.herodead:
					game.stage.off();
					this.currentMonster.iswin = true;
					this.addFinialScore();
					break;
				case game.configdata.MSAGE_TYPE.changeHerohp:
					var n = msg.msgdata;
					if(n <= 0){
						game.stage.off();
					}
					this.topHeadPanel.setHealth(n);
					break;
			}
		},
		
		layoutSceneData:function(){
			var scene = this;
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('cookieroom'),
			}).addTo(this);
			
			this.annihilator  = new game.ActiveObject({
				x:755,
				y:417,
				readyImgUrl:'annihilator',
				finishedImgUrl:'annihilator',
				clickArea:[12,10,25,100],
				status:1
			}).addTo(this);

			this.doorhandler  = new game.ActiveObject({
				x:210,
				y:350,
				status:1,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
			}).addTo(this);
			
			this.pipswitch  = new game.ActiveObject({
				x:824,
				y:300,
				status:1,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
			}).addTo(this);
			
			this.spanner  = new game.ActiveObject({
				x:1000,
				y:590,
				status:1,
				readyImgUrl:'panspanner',
				finishedImgUrl:'panspanner',
				clickArea:[0,0,85,52],
			}).addTo(this);
			
			this.boxkey  = new game.ActiveObject({
				x:488,
				y:520,
				status:0,
				readyImgUrl:'pankey',
				finishedImgUrl:'pankey',
				clickArea:[0,0,85,52],
			}).addTo(this);
			
			this.pan  = new game.ActiveObject({
				x:488,
				y:480,
				status:1,
				readyImgUrl:'pan',
				finishedImgUrl:'pan',
				clickArea:[0,20,95,52],
			}).addTo(this);
			
			
			var atlasHfire = new Hilo.TextureAtlas({
                image:game.getImg('hfireeffect'),
                width: 512,
                height: 512,
                frames: [
                	[154,0,149,183],
                	[154,188,149,183],
                	[308,0,149,183],
                	[0,188,149,183],
                	[0,0,149,183],
                ],
                sprites: {
                    effect:{from:0,to:4}
                }
            });
			
			var atlas = new Hilo.TextureAtlas({
                image:game.getImg('effects'),
                width: 1024,
                height: 1024,
                frames: [
                	[380,834,128,69],
                	[380,903,128,69],
                	[508,834,128,69],
                	[526,0,128,69],
                	[508,903,128,69],//0-4 fire
                	
                	[0,0,234,160],
                	[0,800,234,160],
                	[0,640,234,160],
                	[0,160,234,160],
                	[0,320,234,160],//annihilator effect 5-9
                ],
                sprites: {
                    tv: {from:0, to:4},
                    effect:{from:5,to:9}
                }
            });
			this.tvflash = new Hilo.Sprite({
				frames: atlasHfire.getSprite('effect'),
				x:854,
				y:498,
				interval:8,
			}).addTo(this);
			
			this.annihilatorEffect = new Hilo.Sprite({
				frames: atlas.getSprite('effect'),
				x:520,
				y:205,
				interval:8,
				visible:false,
			}).addTo(this);
		},
		onUpdate:function(){
			if(this.readyShakeTime == 100){
				game.notepanel.show(true,'找到有用的物品');//game.configdata.GAMETXTS.pass02_annihilator);
			}
			this.readyShakeTime++;
			this.checkBlocks();
		},
	});
})(window.game);