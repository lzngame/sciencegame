(function(ns) {
	var AttackScene = ns.AttackScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.attack,
		
		readyShakeTime:0,
		shakeTime:0,
		shakeLevel:4,
		shakeSpeed:1,
		shakeOnce:false,
		initx:0,
		inity:0,
		toFallTime:0,
		
		fallfan1:null,
		fallfan2:null,
		fallfanShader1:null,
		fallfanShader2:null,
		plug:null,
		pillow:null,
		phone:null,
		drink:null,
		medicalkit:null,
		glim:null,
		objCount:0,
		doorhandler:null,
		
		tvflash:null,
		aftershake:false,
		
		passstep:0,
		
		testStart:null,
		
		star01:null,
		star02:null,
		star03:null,
		
		
		
		tasktxt:null,
		tasktxt1:null,
		constructor: function(properties) {
			AttackScene.superclass.constructor.call(this, properties);
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
		},
		active: function(doorIndex) {
			console.log('%s active:', this.name);
			var scene = this;
			
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			
			this.layoutSceneData();
			this.blocks = [[0,0,1202,443],[0,443,500,80],[0,500,200,80],[0,580,80,100],[934,440,270,70],[980,506,223,70],[1115,506,84,96],[1175,593,27,88],[718,516,90,30]];
			this.initBlocks(this.blocks);
			this.addHero();
			this.initkeyevent();
			this.initTouchEvent();
			game.boydata.currentHp = 4;
			game.headPanel.setHp(game.boydata.currentHp);
			game.sounds.play(0,false);
			this.initFingerMouse();
			this.setPassData();
		},
		
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.pillow)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.phone)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.plug)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandler)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.drink)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.glim)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.medicalkit)
			){
				return true;
			}else{
				return false;
			}
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
			if(this.checkActiveItem(mouseX,mouseY,this.phone)){
				this.phone.removeFromParent();
				this.phone.status = 2;
				this.checkEnough();
				game.toolippanel.show(true,'准备好通讯工具非常重要',200);
				game.toolspanel.addIcon(1);
				game.toolspanel.show(true,200);
				game.boydata.bedroomData.phone.used = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.drink)){
				this.drink.removeFromParent();
				this.drink.status = 2;
				this.checkEnough();
				game.toolippanel.show(true,'灾害中储备饮水',200);
				game.toolspanel.addIcon(3);
				game.toolspanel.show(true,200);
				game.boydata.bedroomData.drink.used = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.glim)){
				this.glim.removeFromParent();
				this.glim.status = 2;
				this.checkEnough();
				game.toolippanel.show(true,'拿到手电筒',200);
				game.toolspanel.addIcon(0);
				game.toolspanel.show(true,200);
				game.boydata.bedroomData.glim.used = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.medicalkit)){
				this.medicalkit.removeFromParent();
				this.medicalkit.status = 2;
				this.checkEnough();
				game.toolippanel.show(true,'拿到医疗箱',200);
				game.toolspanel.addIcon(4);
				game.toolspanel.show(true,200);
				game.boydata.bedroomData.medicalkit.used = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.pillow)){
				this.pillow.x = 300;
				this.pillow.status = 0;
				this.phone.status = 1;
				this.phone.visible = true;
				game.boydata.bedroomData.pillow.used = true;
				
				new game.FlashStarEffect({x:mouseX-100,y:mouseY-100}).addTo(this);
				game.notepanel.show(true,'找到手机');
				this.passstep = 1;
				this.star01 = new game.FlashStar({
					x:560,
					y:560
				}).addTo(this);
				game.toolippanel.show(true,'D 键 蹲下拾取星星',350);
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.plug)){
				this.hero.switchState('handon',10);
				this.tvflash.visible = false;
				this.plug.setEndImg(10,80);
				//this.tasktxt.hide();
				this.doorhandler.status = 1;
				game.notepanel.show(true,game.configdata.GAMETXTS.pass01_okend);
				this.star02 = new game.FlashStar({
					x:760,
					y:540
				}).addTo(this);
				game.toolippanel.show(true,'D 键 蹲下拾取星星',350);
				game.boydata.bedroomData.plug.used = true;
			}
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				this.hero.switchState('handon',10);
				var scene = this;
				new Hilo.Tween.to(this,{
					alpha:0.3
				},{
					duration:300,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.saloon);
					}
				});
			}
		},
		
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.herosquat:
					console.log('hero squat');
					this.checkStar(this.star01);
					this.checkStar(this.star02);
					this.hero.speedx = this.hero.speedy = 0;
					this.hero.switchState('squat');
					break;
				case game.configdata.MSAGE_TYPE.herojump:
					if(!this.hero.ispillow && this.hero.framename != 'jump'){
						this.hero.jumpspeed = -18;
						this.hero.floory = this.hero.posy;
						this.hero.switchState('jump');
					}
					break;
				case game.configdata.MSAGE_TYPE.herosquat2idle:
					this.hero.switchState('idle',5);
					break;
			}
		},
		shakeRoom:function(){
			this.shakeTime = 400;
		},
		changeBg:function(){
			var scene = this;
			Hilo.Tween.to(this, {
				alpha:0
			}, {
				duration: 2000,
				ease: Hilo.Ease.Bounce.EaseOut,
				onComplete: function() {
					Hilo.Tween.to(this, {
						alpha:1
					}, {
						duration: 1200,
						ease: Hilo.Ease.Bounce.EaseOut,
						onComplete: function() {
							scene.alpha = 1;
							scene.bgImg.setImage(game.getImg('bedroomafter'));
							scene.step = 3;
							scene.tvflash.visible = true;
							scene.plug.status = 1;
							scene.hero.ispillow = false;
							game.boydata.bedroomData.isshake.used = true;
							//scene.tasktxt.visible = true;
						}
					});
				}
			});
		},
		setPassData:function(){
			if(game.boydata.bedroomData.isshake.used){
				this.bgImg.setImage(game.getImg('bedroomafter'));
				this.hero.posx = 900;
				this.hero.turnleft();
				this.fallfan1.removeFromParent();
				this.fallfan2.removeFromParent();
				this.fallfanShader1.removeFromParent();
				this.fallfanShader2.removeFromParent();
				var fan1 = new Hilo.Bitmap({
					image: game.getImg('fallobjs'),
					rect:[0,1267,357,207],
					x:200,
					y:460
				}).addTo(this);
				var fan2 = new Hilo.Bitmap({
					image: game.getImg('fallobjs'),
					rect:[0,1267,357,207],
					x:720,
					y:460
				}).addTo(this);
				this.swapChildren(fan2,this.hero);
			}
			var pillowdata = game.boydata.bedroomData.pillow;
			if(pillowdata.used){
				this.pillow.x = 300;
			}
			var plugdata   = game.boydata.bedroomData.plug;
			if(plugdata.used){
				this.tvflash.removeFromParent();
				this.plug.setEndImg(10,80);
				this.doorhandler.status = 1;
			}
			var glimdata   = game.boydata.bedroomData.glim;
			if(glimdata.used){
				this.glim.removeFromParent();
			}
			if(game.boydata.bedroomData.drink.used){
				this.drink.removeFromParent();
			}
			if(game.boydata.bedroomData.phone.used){
				this.phone.removeFromParent();
			}
			if(game.boydata.bedroomData.medicalkit.used){
				this.medicalkit.removeFromParent();
			}
		},
		layoutSceneData:function(){
			var scene = this;
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('bedroombefore'),
			}).addTo(this);
			
			new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('chuanglian','uimap'),
				x:592-170,
				y:119-55
			}).addTo(this);
			
			this.plug  = new game.ActiveObject({
				x:906,
				y:262,
				readyImgUrl:'plug1',
				finishedImgUrl:'plug2',
				clickArea:[19,0,40,40],
			}).addTo(this);
			
			this.phone  = new game.ActiveObject({
				x:434,
				y:410,
				status:0,
				readyImgUrl:'iphone',
				finishedImgUrl:'iphone',
				clickArea:[9,0,40,40],
			}).addTo(this);
			
			this.pillow  = new game.ActiveObject({
				x:414,
				y:410,
				readyImgUrl:'pillow',
				finishedImgUrl:'pillow',
				clickArea:[9,0,130,50],
			}).addTo(this);
			
			this.glim  = new game.ActiveObject({
				x:994,
				y:484,
				status:1,
				readyImgUrl:'glim',
				finishedImgUrl:'glim',
				clickArea:[0,0,43,35],
			}).addTo(this);
			
			this.drink  = new game.ActiveObject({
				x:166,
				y:430,
				status:1,
				readyImgUrl:'waterdrink',
				finishedImgUrl:'waterdrink',
				clickArea:[0,0,28,56],
			}).addTo(this);
			
			this.medicalkit  = new game.ActiveObject({
				x:829,
				y:414,
				status:1,
				readyImgUrl:'safebox',
				finishedImgUrl:'safebox',
				clickArea:[0,0,65,56],
			}).addTo(this);

			this.doorhandler  = new game.ActiveObject({
				x:1162,
				y:422,
				readyImgUrl:'handler',
				finishedImgUrl:'handler',
				clickArea:[0,0,50,50],
			}).addTo(this);
			
            var frames = [
                    [357,1267,292,171],
					[0,1474,357,207],
					[357,1060,357,207],
					[0,1681,357,207],
					[0,1060,357,207],
					[0,1267,357,207], //0-5
                ];
			
			this.fallfan1 = new game.FallObject({
				x:200,
				y:-30,
				name:'fallfan',
				imgInity:-30,
				floorline:470,
				wholeState:'ceilingfan1',
				animaFrames:frames,
			}).addTo(this);
			
			this.fallfanShader1 = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('fanshader','uimap'),
				y:550,
				x:200
			}).addTo(this);
			
			this.fallfan2 = new game.FallObject({
				x:720,
				y:-30,
				name:'fallfan',
				imgInity:-30,
				floorline:470,
				wholeState:'ceilingfan1',
				animaFrames:frames,
			}).addTo(this);
			
			this.fallfanShader2 = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('fanshader','uimap'),
				y:550,
				x:720
			}).addTo(this);
			
			game.uiscene = new Hilo.Container({}).addTo(game.stage);
			game.headPanel = new game.TopHeadPanel({
				healthValue:game.configdata.DEFAULTHEROHP,
				headImgUrl:'headicon2',
				healthIcon:'heart02',
				healthIconBlack:'heart01',
				x:20,
				y:20,
			}).addTo(game.uiscene);
			game.starscore = new game.StarScore({
				x:500,
				y:20,
			}).addTo(game.uiscene);
			game.notepanel = new game.DrNote({
				txt:game.configdata.GAMETXTS.pass01_notestart,
				x:-700,
			}).addTo(game.uiscene);
			game.toolippanel = new game.ToolipNote({
				x:1230,
				y:300,
			}).addTo(game.uiscene);
			game.toolspanel = new game.ToolsIconPanel({
				initx:724,
				inity:-247,
			}).addTo(game.uiscene);
			
			
			var atlas = new Hilo.TextureAtlas({
                image:game.getImg('effects'),
                width: 1024,
                height: 1024,
                frames: [
                	[636,174,84,71],
                	[636,316,84,71],
                	[636,458,84,71],
                	[636,387,84,71],
                	[636,245,84,71],
                	[636,529,84,71],
                ],
                sprites: {
                    tv: {from:0, to:5}
                }
            });
			this.tvflash = new Hilo.Sprite({
				frames: atlas.getSprite('tv'),
				x:880+93,
				y:285+55,
				interval:8,
				visible:false,
			}).addTo(this);
			
			/*this.tasktxt = new game.TaskLine({
				txt:'消除危险的电火花',
				x:932,
				y:112,
				visible:false,
			}).addTo(this);
			this.tasktxt1 = new game.TaskLine({
				txt:'搜集有用的物品',
				x:700,
				y:112,
				visible:false,
			}).addTo(this);*/
		},
		checkEnough:function(){
			this.objCount++;
			if(this.objCount >= 4){
				this.tasktxt1.hide();
			}
		},
		onUpdate:function(){
			if(this.readyShakeTime == 100){
				game.notepanel.show(true,'灾难逃离解谜游戏，鼠标点击走动，D键蹲下（拾取物品）',350);
			}
			
			if(this.readyShakeTime == 450){
				this.shakeRoom();
				this.changeBg();
				//this.tasktxt1.visible = true;
			}
			if(this.readyShakeTime == 350){
				game.notepanel.show(true,'地震中要小心头顶的掉落物，及时躲开',100);
				this.pillow.status = 1;
			}
			
			this.readyShakeTime++;
			this.shakeScene();
			
			this.toFallTime++;
			if(this.toFallTime == 545){
				this.fallfan1.isFall = true;
			}
			if(this.toFallTime == 515){
				this.fallfan2.isFall = true;
			}
			this.checkFallObj(this.fallfan1,this.fallfanShader1);
			this.checkFallObj(this.fallfan2,this.fallfanShader2);
			
			this.checkBlocks();
			
			if(this.readyShakeTime == 100){
				this.testStart = new game.FlashStar({
					x:300,
					y:200
				}).addTo(this);
			}
			if(this.readyShakeTime == 200){
				this.testStart.hide();
			}
		},
		shakeScene:function(){
			if(this.shakeTime > 0){
				this.x = this.initx;
				this.y = this.inity;
				var offsetx = Math.random()*this.shakeLevel;
				var offsety = Math.random()*this.shakeLevel;
				var d1 = Math.random();
				var d2 = Math.random();
				if(d1 > 0.5)
				  this.x += offsetx;
				else
				  this.x -= offsetx;
				if(d2 > 0.5)
				  this.y += offsety;
				else
				  this.y -= offsety;
				this.shakeTime -= 2;
			}else{
				this.shakeTime = 0;
				this.x = this.initx;
				this.y = this.inity;
			}
		},
		checkFallObj:function(ceilingobj,objshader){
			if(ceilingobj.onDanger && ceilingobj.y >= ceilingobj.floorline){
				console.log('once check:'+ceilingobj.name);
				objshader.removeFromParent();
				ceilingobj.onDanger = false;
				game.sounds.play(4,false);
				if(game.checkInRect(this.hero.posx,this.hero.posy,objshader.x,objshader.y,objshader.width,objshader.height)){
					this.hero.switchState('fallhit',6);
					game.boydata.currentHp--;
					game.headPanel.setHp(game.boydata.currentHp);
				}
			}
		}
	});
})(window.game);