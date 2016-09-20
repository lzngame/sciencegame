(function(ns) {
	var SaloonScene = ns.SaloonScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.saloon,
		
		doorhandlerBedroom:null,
		doorhandlerCookie:null,
		doorhandlerCorridor:null,
		
		constructor: function(properties) {
			SaloonScene.superclass.constructor.call(this, properties);
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
			this.alpha = 1;
			game.stage.swapChildren(this, game.uiscene);
			this.currentIndex = 0;
			this.blocks = [[0,0,1200,400],[0,455,140,250],[1143,386,36,152],[1166,542,37,146]];
			this.initBlocks(this.blocks);
			this.layoutBgMap();
			this.addHero();
			this.initTouchEvent();
			this.initFingerMouse();
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandlerBedroom)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandlerCookie)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandlerCorridor)
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
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandlerBedroom)){
				this.enterDoor(mouseX,mouseY,game.configdata.SCENE_NAMES.attack);
			}
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandlerCookie)){
				this.enterDoor(mouseX,mouseY,game.configdata.SCENE_NAMES.cookieroom);
			}
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandlerCorridor)){
				this.hero.switchState('handon',10);
			}
		},
		layoutBgMap:function(){
			var scene = this;
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('corridor'),
			}).addTo(this);
			
			this.doorhandlerBedroom  = new game.ActiveObject({
				x:725,
				y:219,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
				status:1,
			}).addTo(this);
			
			this.doorhandlerCookie  = new game.ActiveObject({
				x:825,
				y:319,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
				status:1,
			}).addTo(this);
			
			this.doorhandlerCorridor  = new game.ActiveObject({
				x:925,
				y:519,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
				status:1,
			}).addTo(this);
		},
		excuteIcon:function(index){
		},
		onUpdate:function(){
			if(this.readyShakeTime == 50){
				game.notepanel.show(true,game.configdata.GAMETXTS.pass03_ask,200);
			}
		},
	});
})(window.game);