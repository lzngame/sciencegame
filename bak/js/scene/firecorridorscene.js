(function(ns) {
	var FirecorridorScene = ns.FirecorridorScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.firecorridor,
		
		wallpaper:null,
		firewarnBox:null,
		firelamp:null,
		telphone:null,
		stone:null,
		smokewall:null,
		doorhandler:null,
		telPanel:null,
		fireeffect:null,
		firreblock:null,
		annihilatorEffect:null,
		smokewall:null,
		
		isSmokeMove:false,
		
		crawlBtn:null,
		
		constructor: function(properties) {
			FirecorridorScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = 2404;
			this.height = game.configdata.mainStageSize.height;
			this.x = 0;
			this.y = 0;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
			this.activeObjects = new Array();
		},
		active: function(passdata) {
			console.log('%s active:', this.name);
			var scene = this;
			this.width = 2404;
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks = [[0,0,2404,365],[0,0,286,406],[0,0,177,484],[1554,0,840,420],[1560,396,180,275]];// [[0,0,1200,400],[0,455,140,250],[1143,386,36,152],[1166,542,37,146]];
			this.initBlocks(this.blocks);
			this.layoutBgMap();
			this.addHero(passdata[0],passdata[1]);
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.wallpaper)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.firewarnBox)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.telphone)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.stone)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.firreblock)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandler)
			){
				return true;
			}else{
				return false;
			}
		},
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.herosquat:
					console.log('hero squat');
					this.hero.speedx = this.hero.speedy = 0;
					this.hero.switchState('squat');
					this.changeBg();
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
					break;
			}
		},
		enterDoor:function(mouseX,mouseY,scenename){
			this.hero.switchState('handon',10);
			var scene = this;
			new Hilo.Tween.to(this,{
					alpha:0.3
				},{
					duration:300,
					onComplete:function(){
						game.switchScene(scenename);
					}
			});
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
			if(this.checkActiveItem(mouseX,mouseY,this.wallpaper)){
				this.hero.switchState('handon',10);
				this.wallpaper.setEndImg(0,0);
				this.wallpaper.status = 2;
				this.firewarnBox.status = 1;
			}
			if(this.checkActiveItem(mouseX,mouseY,this.stone)){
				this.hero.switchState('handon',10);
				game.toolspanel.addIcon(6);
				this.stone.removeFromParent();
				game.toolspanel.show(true,50);
			}
			if(this.checkActiveItem(mouseX,mouseY,this.telphone)){
				this.hero.switchState('handon',10);
				this.telPanel.visible = true;
				this.ignoreTouch = true;
				this.hero.visible = false;
				this.fingerMouse.visible = false;
				this.telPanel.y = 0;
				this.telPanel.x = (this.x*-1);
			}
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				this.hero.switchState('handon',10);
				game.switchScene(game.configdata.SCENE_NAMES.washroom,[167,590]);
			}
			if(this.checkActiveItem(mouseX,mouseY,this.firewarnBox)){
				this.hero.switchState('handon',10);
				game.headPanel.sayNo();
				var scene = this;
				if(this.fingerMouse.index == 6){
					this.firewarnBox.status = 2;
					this.firelamp.isplay = true;
					game.headPanel.sayYes();
				}
			}
			if(this.checkActiveItem(mouseX,mouseY,this.firreblock)){
				var scene = this;
				if(this.fingerMouse.index == 8){
					if(this.hero.scaleX == -1 || this.hero.framename != 'idle')
						return;
				
					this.hero.switchState('annihilator',10);
					this.annihilatorEffect.visible = true;
					this.annihilatorEffect.x = this.hero.posx + 80;
					this.annihilatorEffect.y = this.hero.posy - 120;
					this.ignoreTouch = true;
					var scene = this;
					new Hilo.Tween.to(scene.fireeffect,{
						alpha:0
					},{
						duration:3000,
						onComplete:function(){
							scene.ignoreTouch = false;
							scene.annihilatorEffect.removeFromParent();
							scene.fireeffect.removeFromParent();
							scene.firreblock.removeFromParent();
							scene.firreblock.status = 2;
							scene.blocks.pop();
							scene.isSmokeMove = true;
							scene.crawlBtn.visible = true;
							scene.crawlBtn.addTo(game.uiscene);
						}
					});
				}
			}
		},
		layoutBgMap:function(){
			var scene = this;
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('firecorridor'),
			}).addTo(this);
			
			this.firewarnBox  = new game.ActiveObject({
				x:129,
				y:280,
				readyImgUrl:'firewarnbtn',
				finishedImgUrl:'firewarnbtn',
				clickArea:[0,0,30,45],
				status:0,
			}).addTo(this);
			
			this.wallpaper  = new game.ActiveObject({
				x:-40,
				y:120,
				readyImgUrl:'wallpaper01',
				finishedImgUrl:'wallpaper02',
				clickArea:[90,40,110,240],
				status:1,
			}).addTo(this);
			
			this.telphone  = new game.ActiveObject({
				x:244,
				y:182,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[-10,0,50,70],
				status:1,
			}).addTo(this);
			
			this.stone  = new game.ActiveObject({
				x:550,
				y:218,
				readyImgUrl:'stoneicon',
				finishedImgUrl:'stoneicon',
				clickArea:[0,0,40,30],
				status:1,
			}).addTo(this);
			
			this.doorhandler  = new game.ActiveObject({
				x:816,
				y:183,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
				status:1,
			}).addTo(this);
			
			this.firreblock  = new game.ActiveObject({
				x:1540,
				y:396,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,200,275],
				status:1,
			}).addTo(this);
			
			this.firelamp = new game.AnimaEffect({
				x:290,
				y:150,
				fpstime:4,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('firelamp1','uimap'),
				sourceImg:'uimap',
				frames:['firelamp1','firelamp2'],
			}).addTo(this);
			
			
			this.telPanel = new game.TelPanel({
				x:0,
				y:0,
				visible:false,
			}).addTo(this);
			this.telPanel.exitBtnImg.on(Hilo.event.POINTER_START, function(e) {
				scene.telPanel.visible = false;
				scene.telPanel.reset();
				scene.ignoreTouch = false;
				scene.hero.visible = true;
				scene.fingerMouse.visible = true;
			});
			this.telPanel.callbtn.on(Hilo.event.POINTER_START, function(e) {
				if(scene.telPanel.checkLetter()){
					new game.FlashStarEffect({
						x:this.x,
						y:this.y,
					}).addTo(this.parent);
					new Hilo.Tween.to(this,{
						alpha:1
					},{
						duration:1300,
						onComplete:function(){
							scene.ignoreTouch = false;
							scene.hero.visible = true;
							scene.fingerMouse.visible = true;
							scene.telPanel.visible = false;
							scene.telPanel.reset();
						}
					});
				}else{
					scene.telPanel.reset();
				}
			});
			
            this.fireeffect = new Hilo.Sprite({
				frames: game.monsterdata.effect_atlas.getSprite('corridorfireeffect'),
				x:1654,
				y:290,
				interval:8,
			}).addTo(this);
			
			this.smokewall = new Hilo.Sprite({
				frames: game.monsterdata.effect_atlas.getSprite('smokewalleffect'),
				x:1654,
				y:190,
				interval:8,
			}).addTo(this);
			
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
			
			this.annihilatorEffect = new Hilo.Sprite({
				frames: atlas.getSprite('effect'),
				x:520,
				y:205,
				interval:8,
				visible:false,
			}).addTo(this);
			
			this.crawlBtn = new Hilo.Bitmap({
				x:115,
				y:515,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('crawlbtn','uimap'),
			});
			
			this.crawlBtn.on(Hilo.event.POINTER_START, function(e) {
				scene.hero.turnright();
				scene.hero.switchState('crawl',10);
				scene.hero.width = 315;
				scene.hero.height = 237;
				scene.hero.posy += 100;
				scene.hero.targety = scene.hero.posy;
				scene.hero.targetx = 2404;
				scene.hero.speedx = 2;
				scene.ignoreTouch = true;
			});
			
		},
		onUpdate:function(){
			this.x = (610 - this.hero.posx);
			this.checkBlocks();
			if(this.x >= 0)
				this.x = 0;
			if(this.x <= -1202)
				this.x = -1202;
				
			if(this.isSmokeMove){
				this.smokewall.x --;
			}
			if(this.hero.framename=='crawl' && this.hero.posx > 2000){
				this.crawlBtn.removeFromParent();
				this.hero.switchState('idle',6);
				game.switchScene(game.configdata.SCENE_NAMES.fireglass,[200,600]);
			}
		},
	});
})(window.game);