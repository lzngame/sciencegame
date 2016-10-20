(function(ns) {
	var RepairScene = ns.RepairScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.repairdepot,
		ladder:null,
		cloud1:null,
		cloud2:null,
		cloud3:null,
		cloud4:null,
		railing:null,
		ladderObj:null,
		car:null,
		bgHeight:1373,
		
		targets:[],
		currentTarget:null,
		
		warnpaper:null,
		passwordLock:null,
		lockPanel:null,
		doorhandlerCorridor:null,
		
		halfpic2:null,
		picpanel:null,
		
		
		constructor: function(properties) {
			RepairScene.superclass.constructor.call(this, properties);
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
			this.blocks = [];
			this.initBlocks(this.blocks);
			this.layoutBgMap();
			this.addHero(passdata[0],100,1300);
			this.hero.posx = 100;
			this.hero.posy = 1300;
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			this.setPassData();
			
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.ladderObj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.halfpic2)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.passwordLock)||
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
			}else if(index == 11 || index == 12){
				this.picpanel.x = 400 -this.x;
				this.picpanel.addPic(index);
				console.log('--------------------------');
			}
			else{
				this.fingerMouse.visible = true;
				this.fingerMouse.active = true; 
				this.fingerMouse.setCurrent(index);
			}
			game.toolspanel.show(false,0);
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.ladderObj)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.targets = [[100,300],[500,1000],[1000,200]];
				this.startTargetsWalk();
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.warnpaper)){
				if(!this.checkFinger(2)){
					return;
				}
				game.boydata.shakecorridordata.warnpaper = true;
				this.hero.switchState('pick',10);
				var scene = this;
				if(this.fingerMouse.index == 2){
					new game.FlashStarEffect({
						x:this.warnpaper.x,
						y:this.warnpaper.y,
					}).addTo(this);
					this.warnpaper.setEndImg(0,-200);
					this.warnpaper.status = 2;
					this.halfpic2.status = 1;
					game.toolspanel.removeIcon(2);
					this.fingerMouse.setDefault();
					game.notepanel.show(true,'科普知识：在地震中是不可以乘坐电梯的。',150);
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.passwordLock)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.lockPanel.visible = true;
				this.ignoreTouch = true;
				this.hero.visible = false;
				this.picpanel.exit();
				this.fingerMouse.visible = false;
				this.lockPanel.y = 0;
				this.lockPanel.x = (this.x*-1);
				game.sounds.play(19,false);
			}
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandlerCorridor)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.hero.switchState('handon',10);
				var scene = this;
				new Hilo.Tween.to(this,{
					alpha:0.3
				},{
					duration:400,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.saloon,[1049,570,'left']);
					}
				});
			}
		},
		setPassData:function(){
			if(game.boydata.shakecorridordata.warnpaper){
				this.warnpaper.setEndImg(0,-200);
				this.warnpaper.status = 2;
				this.halfpic2.status = 1;
			}
			if(game.boydata.shakecorridordata.halfpic){
				console.log('remove halfpic');
				this.halfpic2.remove();
			}
		},
		layoutBgMap:function(){
			var scene = this;
			new Hilo.Bitmap({
				image:game.getImg('skeybg')
			}).addTo(this);
			this.cloud1 = new Hilo.Bitmap({
				image:'img/cloud1.png',
				x:1100,
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
				y:430,
			}).addTo(this);
			this.cloud4 = new Hilo.Bitmap({
				image:'img/cloud4.png',
				x:1200,
				y:540,
			}).addTo(this);
			this.bgImg = new Hilo.Bitmap({
				image:game.getImg('repairdepotbg')
			}).addTo(this);
			
			this.ladder = new Hilo.Bitmap({
				image:'img/ladder.png',
				x:1075-182,
				y:983-277,
			}).addTo(this);
			
			this.railing = new Hilo.Bitmap({
				image:'img/railing.png',
				x:557,
				y:298,
			}).addTo(this);
			
			
			
			new Hilo.Bitmap({
				image:'img/car.png',
				x:80,
				y:900+83,
				//pivotX:0,
				//pivotY:83,
				//rotation:-30,
				alpha:0.3,
			}).addTo(this);
			
			this.car = new game.DepotCar({
				x:10,
				y:900+83
			}).addTo(this);
			//
			this.car.carimg.rotation = -40;
			this.car.isDescend = true;
			
			this.ladderObj  = new game.ActiveObject({
				x:1075-182,
				y:983-277,
				targetx:1050,
				targety:1350,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[30,30,130,530],
				status:1,
			}).addTo(this);
			
			this.halfpic2  = new game.ActiveObject({
				x:2100,
				y:453,
				targetx:-50,
				targety:120,
				readyImgUrl:'overhalfpic',
				finishedImgUrl:'overhalfpic',
				clickArea:[19,10,60,150],
				status:2,
			}).addTo(this);
			
			this.warnpaper  = new game.ActiveObject({
				x:2100,
				y:405,
				targetx:-70,
				targety:120,
				readyImgUrl:'warnpaper01',
				finishedImgUrl:'warnpaper01',
				clickArea:[19,10,60,150],
				status:1,
			}).addTo(this);
			
			this.doorhandlerCorridor  = new game.ActiveObject({
				x:169,
				y:384,
				targetx:70,
				targety:170,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
				status:1,
			}).addTo(this);
			
			this.lockPanel = new game.PasswordlockPanel({
				x:0,
				y:0,
				visible:false,
			}).addTo(this);
			
			this.lockPanel.sureBtnImg.on(Hilo.event.POINTER_START, function(e) {
				if(scene.lockPanel.checkLetter()){
					game.headPanel.sayYes(true);
					game.sounds.play(15,false);
					new Hilo.Tween.to(this,{
						alpha:1
					},{
						duration:1300,
						onComplete:function(){
							scene.lockPanel.visible =false;
							scene.ignoreTouch = false;
							scene.hero.visible = true;
							scene.fingerMouse.visible = true;
							game.boydata.passdata[0][0] = 1;
							game.boydata.passdata[1][0] = 0;
							scene.showNote();
							//game.switchScene(game.configdata.SCENE_NAMES.passchoice);
						}
					});
				}else{
					game.headPanel.sayNo();
				}
				scene.lockPanel.resetDefault();
			});
			this.lockPanel.exitBtnImg.on(Hilo.event.POINTER_START, function(e) {
				scene.lockPanel.visible =false;
				scene.hero.visible = true;
				scene.fingerMouse.visible = true;
				scene.lockPanel.resetDefault();
				scene.ignoreTouch = false;
			});
			
			this.picpanel = new game.PicPanel({
				visible:false,
			}).addTo(this);
		},
		showNote:function(){
			var scene = this;
			var x = -this.x;
			var img = new Hilo.Bitmap({
				image:'img/note01.png',
				x:x,
			}).addTo(this);
			img.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.passchoice);
			});
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
		startTargetsWalk:function(){
			this.currentTarget = this.targets.shift();
			this.herowalk(this.currentTarget[0],this.currentTarget[1]);
		},
		moveTargets:function(){
			if(this.currentTarget){
				if(Math.abs(this.hero.posx - this.currentTarget[0]) <= 3 && Math.abs(this.hero.posy - this.currentTarget[1]) <= 3){
					if(this.targets.length > 0){
						this.startTargetsWalk();
					}else{
						this.currentTarget = null;
					}
				}
			}
		},
		onUpdate:function(){
			this.y = (600 - this.hero.posy);
			if(this.y >= 0)
				this.y = 0;
			if(this.y < (game.configdata.MAXSIZE.maxHeight -this.bgHeight)){
				this.y = game.configdata.MAXSIZE.maxHeight -this.bgHeight;
			}
			this.checkBlocks();
			this.cloudMove();
			this.moveTargets();
			
			
			if(this.hero.posy < 800){
				this.hero.scaleX = this.hero.scaleY = 0.6;
			}
			if(this.hero.posy < 500){
				this.hero.scaleX = this.hero.scaleY = 0.4;
			}
			if(this.hero.posy > 500){
				this.hero.scaleX = this.hero.scaleY = 0.6;
			}
			if(this.hero.posy > 800){
				this.hero.scaleX = this.hero.scaleY = 0.8;
			}
			if(this.hero.posy > 1200){
				this.hero.scaleX = this.hero.scaleY = 1;
			}
		},
	});
})(window.game);