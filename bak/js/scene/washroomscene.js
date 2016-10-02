(function(ns) {
	var WashroomScene = ns.WashroomScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.washroom,
		
		annihilator:null,
		doorhandler:null,
		basin:null,
		blocks:null,
		towel:null,
		passstep:0,
		waterbasin:null,
		waterbasinExit:null,
		
		passcondition:false,
		constructor: function(properties) {
			WashroomScene.superclass.constructor.call(this, properties);
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
		active: function(passdata) {
			console.log('%s active:', this.name);
			var scene = this;
			
			this.addTo(game.stage);
			game.stage.swapChildren(this, game.uiscene);
			this.alpha = 1;
			this.currentIndex = 0;
			this.layoutSceneData();
			this.blocks = [[0,0,1204,550],[0,0,30,686]];
			this.initBlocks(this.blocks);
			
			this.addHero(passdata[0],passdata[1],passdata[2]);
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
			game.toolspanel.show(false,0);
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				if(!this.checkFinger(-1)){
					return ;
				}
				this.hero.switchState('handon',10);
				var scene = this;
				game.sounds.play(7,false);
				new Hilo.Tween.to(this,{
					alpha:0.3
				},{
					duration:400,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.firecorridor,[770,400]);
					}
				});
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.basin)){
				this.hero.switchState('handon',10);
				var scene = this;
				if(!this.checkFinger(10)){
					return ;
				}
				if(this.fingerMouse.index == 10){
					new game.FlashStarEffect({
						x:this.basin.x,
						y:this.basin.y,
					}).addTo(this);
					this.basin.status = 2;
					this.waterbasin.visible = true;
					this.ignoreTouch = true;
					this.hero.visible = false;
					this.fingerMouse.visible = false;
					this.doorhandler.status = 1;
					this.fingerMouse.setDefault();
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.annihilator)){
				if(!this.checkFinger(-1)){
					return ;
				}
				this.annihilator.remove();
				this.hero.switchState('handon',10);
				game.toolspanel.addIcon(8);
				game.boydata.washroomdata.annihilator = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.towel)){
				if(!this.checkFinger(-1)){
					return ;
				}
				this.hero.switchState('handon',10);
				var scene = this;
				this.towel.removeFromParent();
				this.towel.status = 2;
				game.toolspanel.addIcon(10);
				game.boydata.washroomdata.towel = true;
			}
		},
		setPassData:function(){
			if(game.boydata.washroomdata.towel){
				this.towel.remove();
			}
			if(game.boydata.washroomdata.annihilator){
				this.annihilator.remove();
			}
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandler)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.annihilator)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.towel)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.basin)
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
				image: game.getImg('washroombg'),
			}).addTo(this);
			
			
			this.annihilator  = new game.ActiveObject({
				x:215,
				y:450,
				targetx:0,
				targety:140,
				readyImgUrl:'annihilator',
				finishedImgUrl:'annihilator',
				clickArea:[15,0,30,120],
				status:1
			}).addTo(this);

			this.doorhandler  = new game.ActiveObject({
				x:122,
				y:350,
				targetx:90,
				targety:240,
				status:2,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,40,60],
			}).addTo(this);
			
			this.basin  = new game.ActiveObject({
				x:1060,
				y:370,
				targetx:-40,
				targety:240,
				status:1,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,140,70],
			}).addTo(this);
			
			this.towel  = new game.ActiveObject({
				x:726,
				y:285,
				targetx:-20,
				targety:300,
				status:1,
				readyImgUrl:'towel',
				finishedImgUrl:'towel',
				clickArea:[0,0,65,100],
			}).addTo(this);
			
			this.waterbasin = new Hilo.Container({
				visible:false
			}).addTo(this);
			new Hilo.Bitmap({
				image:game.getImg('waterbasin')
			}).addTo(this.waterbasin);
			this.waterbasinExit = new Hilo.Bitmap({
				x:1000,
				y:620,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('backbtn','uimap')
			}).addTo(this.waterbasin);
			this.waterbasinExit.on(Hilo.event.POINTER_START, function(e) {
				scene.waterbasin.removeFromParent();
				scene.basin.status = 2;
				scene.ignoreTouch = false;
				scene.hero.visible = true;
				scene.fingerMouse.visible = true;				
			});
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