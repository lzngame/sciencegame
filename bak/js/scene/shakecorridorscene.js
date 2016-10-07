(function(ns) {
	var ShakecorridorScene = ns.ShakecorridorScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.shakecorridor,
		
		warnpaper:null,
		passwordLock:null,
		lockPanel:null,
		doorhandlerCorridor:null,
		
		halfpic2:null,
		picpanel:null,
		
		
		constructor: function(properties) {
			ShakecorridorScene.superclass.constructor.call(this, properties);
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
			this.blocks = [[0,0,2404,410],[0,0,120,686],[120,410,90,165],[0,0,360,480],[2304,0,100,686],[2104,0,200,570],[557,507,370,180]];// [[0,0,1200,400],[0,455,140,250],[1143,386,36,152],[1166,542,37,146]];
			this.initBlocks(this.blocks);
			this.layoutBgMap();
			this.addHero(passdata[0],passdata[1],passdata[2]);
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			this.setPassData();
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.warnpaper)||
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
			if(this.checkActiveItem(mouseX,mouseY,this.halfpic2)){
				if(!this.checkFinger(-1)){
					return;
				}
				game.boydata.shakecorridordata.halfpic = true;
				this.hero.switchState('pick',10);
				var scene = this;
				game.sounds.play(19,false);
				this.halfpic2.remove();
				game.toolspanel.show(true,100);
				game.toolspanel.addIcon(12);
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
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('shakecorridor'),
			}).addTo(this);
			
			this.passwordLock  = new game.ActiveObject({
				x:1561,
				y:217,
				targetx:43,
				targety:240,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,60,40],
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
		onUpdate:function(){
			this.x = (610 - this.hero.posx);
			if(this.x >= 0)
				this.x = 0;
			if(this.x <= -1202)
				this.x = -1202;
			this.checkBlocks();
		},
	});
})(window.game);