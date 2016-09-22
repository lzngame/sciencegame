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
			this.blocks = [[0,0,2404,410]];// [[0,0,1200,400],[0,455,140,250],[1143,386,36,152],[1166,542,37,146]];
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
				//game.switchScene(game.configdata.SCENE_NAMES.story);
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
					scene.ignoreTouch = false;
					scene.hero.visible = true;
					scene.fingerMouse.visible = true;
					scene.telPanel.visible = false;
				}
				scene.telPanel.reset();
			});
			
		},
		onUpdate:function(){
			this.x = (610 - this.hero.posx);
			if(this.x >= 0)
				this.x = 0;
			if(this.x <= -1202)
				this.x = -1202;
		},
	});
})(window.game);