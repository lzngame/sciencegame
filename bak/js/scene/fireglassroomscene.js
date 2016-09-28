(function(ns) {
	var FireGlassScene = ns.FireGlassScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.fireglass,
		bgImg2:null,
		
		carkey:null,
		doorhandler:null,
		doorcard:null,
		drawer:null,
		blocks:null,
		flower:null,
		
		constructor: function(properties) {
			FireGlassScene.superclass.constructor.call(this, properties);
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
			this.blocks = [[0,0,1202,525],[0,526,172,73],[1033,520,173,84],[0,600,53,85],[1154,605,53,85]];
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
				game.toolspanel.show(false,0);
			}
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.drawer)){
				if(!this.checkFinger(-1)){
					return ;
				}
				this.showDrawer();
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				this.hero.switchState('handon',10);
				var scene = this;
				if(!this.checkFinger(7)){
					return ;
				}
				if(this.fingerMouse.index == 7){
					new game.FlashStarEffect({
						x:this.doorhandler.x,
						y:this.doorhandler.y,
					}).addTo(this);
				}else{
					game.headPanel.sayNo();
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.doorcard,true,true)){
				if(!this.checkFinger(-1)){
					return ;
				}
				this.doorcard.remove();
				game.headPanel.sayYes();
				game.toolspanel.addIcon(7);
				game.toolspanel.show(true,50);
				
				this.doorhandler.status = 1;
				this.carkey.status = 1;
				new game.FlashStarEffect({
					x:this.doorcard.x,
					y:this.doorcard.y,
				}).addTo(this);
				var scene = this;
				new Hilo.Tween.to(this,{
					alpha:1
				},{
					duration:1300,
					onComplete:function(){
						scene.bgImg2.removeFromParent();
						scene.hero.visible = true;
						scene.carkey.visible = true;
						scene.flower.visible = true;
						
					}
				});
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.carkey)){
				if(!this.checkFinger(-1)){
					return ;
				}
				this.carkey.remove();
				game.toolspanel.addIcon(9);
				game.toolspanel.show(true,50);
				new game.FlashStarEffect({
					x:this.carkey.x,
					y:this.carkey.y,
				}).addTo(this);
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.flower)){
				if(!this.checkFinger(-1)){
					return ;
				}
				this.flower.status = 2;
				this.flower.x = 350;
				this.carkey.status = 1;
			}
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.carkey)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandler)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.drawer)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.flower)||
			   this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorcard)
			){
				return true;
			}else{
				return false;
			}
		},
		setPassData:function(){
			
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
		showDrawer:function(){
			this.bgImg2.visible = true;
			this.doorcard.visible = true;
			this.doorcard.status = 1;
			this.hero.visible = false;
			this.doorhandler.status = 0;
			this.carkey.visible = false;
			this.drawer.status = 2;
			this.flower.visible = false;
			//this.ignoreTouch = true;
			//this.fingerMouse.visible = false;
		},
		layoutSceneData:function(){
			var scene = this;
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('fireglassbg'),
			}).addTo(this);
			
			this.bgImg2 = new Hilo.Bitmap({
				image: game.getImg('drawer'),
				visible:false,
			}).addTo(this);
			
			this.drawer  = new game.ActiveObject({
				x:489,
				y:441,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,54,16],
				status:1
			}).addTo(this);
			
			this.doorcard  = new game.ActiveObject({
				x:500,
				y:330,
				readyImgUrl:'doorcard',
				finishedImgUrl:'doorcard',
				clickArea:[0,0,150,86],
				status:0,
				visible:false,
			}).addTo(this);

			this.doorhandler  = new game.ActiveObject({
				x:915,
				y:326,
				status:1,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,40,40],
			}).addTo(this);
			
			this.carkey  = new game.ActiveObject({
				x:313,
				y:519,
				status:0,
				readyImgUrl:'carkey',
				finishedImgUrl:'carkey',
				clickArea:[0,0,20,20],
			}).addTo(this);
			
			this.flower  = new game.ActiveObject({
				x:270,
				y:329,
				status:1,
				readyImgUrl:'flower',
				finishedImgUrl:'flower',
				clickArea:[20,20,53,193],
			}).addTo(this);
			
		},
		onUpdate:function(){
			this.checkBlocks();
		},
	});
})(window.game);