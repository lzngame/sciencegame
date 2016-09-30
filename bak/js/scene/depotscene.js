(function(ns) {
	var DepotScene = ns.DepotScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.depot,
		bgImg:null,
		interludetxt:null,
		depotTime:0,
		
		shakeTime:0,
		shakeLevel:0,
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
			DepotScene.superclass.constructor.call(this, properties);
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
		active: function(passdata) {
			console.log('%s active:', this.name);
			var scene = this;
			
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks =[];
			this.layoutSceneData();
			this.initTouchEvent();
			game.sounds.play(14,true);
			this.initFingerMouse();
			//this.setPassData();
			this.layoutUI();
			game.boydata.currentHp = 4;
			game.headPanel.setHp(game.boydata.currentHp);
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
			game.toolspanel.show(false,0);
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.phone)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.phone.remove();
				game.toolippanel.show(true,'准备好通讯工具非常重要',100);
				game.toolspanel.addIcon(1);
				game.toolspanel.show(true,100);
				game.boydata.bedroomData.phone.used = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.drink)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.drink.remove();
				game.toolippanel.show(true,'灾害中储备饮水',100);
				game.toolspanel.addIcon(3);
				game.toolspanel.show(true,100);
				game.boydata.bedroomData.drink.used = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.glim)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.glim.remove();
				game.toolippanel.show(true,'拿到手电筒',100);
				game.toolspanel.addIcon(0);
				game.toolspanel.show(true,100);
				game.boydata.bedroomData.glim.used = true;
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.medicalkit)){
				if(this.medicalkit.state == 1){
					if(!this.checkFinger(-1)){
						return;
					}
					this.medicalkit.state = 2;
					this.medicalkit.img.setImage(game.getImg('uimap'),game.configdata.getPngRect('emptybox','uimap'));
					this.medicalkit.status = 2;
					game.toolspanel.addIcon(11);
					game.toolspanel.show(true,100);
					new game.FlashStarEffect({
							x:this.medicalkit.x,
							y:this.medicalkit.y,
					}).addTo(this);
					game.boydata.bedroomData.medicalkit.state = 2;
					game.headPanel.sayYes();
					this.fingerMouse.setDefault();
				}
				
				if(this.fingerMouse.index == 5){
					if(this.medicalkit.state == 0){
						this.medicalkit.state = 1;
						this.medicalkit.img.setImage(game.getImg('uimap'),game.configdata.getPngRect('openbox','uimap'));
						game.boydata.bedroomData.medicalkit.state = 1;
						game.headPanel.sayYes();
						this.fingerMouse.setDefault();
						game.toolspanel.removeIcon(5);
					}
				}else{
					if(this.medicalkit.status != 2){
						this.fingerMouse.setDefault();
						game.headPanel.sayNo();
					}
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.pillow)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.pillow.x = 300;
				this.pillow.status = 2;
				this.phone.status = 1;
				this.phone.visible = true;
				game.boydata.bedroomData.pillow.used = true;
				
				new game.FlashStarEffect({x:mouseX-100,y:mouseY-100}).addTo(this);
				game.notepanel.show(true,'找到手机',70);
				this.passstep = 1;
				this.star01 = new game.FlashStar({
					x:560,
					y:560
				}).addTo(this);
				game.toolippanel.show(true,'S 键 蹲下拾取星星',200);
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.plug)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.hero.switchState('handon',10);
				this.tvflash.visible = false;
				this.plug.setEndImg(10,80);
				
				this.doorhandler.status = 1;
				game.notepanel.show(true,game.configdata.GAMETXTS.pass01_okend);
				this.star02 = new game.FlashStar({
					x:760,
					y:540
				}).addTo(this);
				game.toolippanel.show(true,'S 键 蹲下拾取星星',200);
				game.boydata.bedroomData.plug.used = true;
				game.sounds.play(12,false);
				game.sounds.stop(16);
			}
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.hero.switchState('handon',10);
				game.sounds.play(7,false);
				game.sounds.stop(16);
				var scene = this;
				new Hilo.Tween.to(this,{
					alpha:0.3
				},{
					duration:300,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.saloon,[100,600,'right']);
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
		shakeRoom:function(sumtime){
			this.shakeTime = sumtime;
			this.shakeLevel = 3;
		},
		changeBg:function(){
			var scene = this;
			Hilo.Tween.to(this, {
				alpha:0.01
			}, {
				duration: 2000,
				//ease: Hilo.Ease.Bounce.EaseOut,
				onComplete: function() {
					Hilo.Tween.to(this, {
						alpha:1
					}, {
						duration: 1500,
						//ease: Hilo.Ease.Bounce.EaseOut,
						onComplete: function() {
							scene.alpha = 1;
							scene.bgImg.setImage(game.getImg('depot'));
						}
					});
				}
			});
		},
		setPassData:function(){
			
		},
		layoutSceneData:function(){
			var scene = this;
			var img = game.getImg('uimap');
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('interlude'),
			}).addTo(this);
			this.interludetxt = new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngRect('boy','uimap'),
				x:1202,
				y:200,
			}).addTo(this);
			/*this.plug  = new game.ActiveObject({
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
				status:0,
				clickArea:[9,0,90,40],
			}).addTo(this);
			
			this.glim  = new game.ActiveObject({
				x:974,
				y:474,
				status:0,
				readyImgUrl:'bedroomglim',
				finishedImgUrl:'bedroomglim',
				clickArea:[0,0,43,35],
			}).addTo(this);
			
			this.drink  = new game.ActiveObject({
				x:160,
				y:420,
				status:0,
				readyImgUrl:'bedroomdrink',
				finishedImgUrl:'bedroomdrink',
				clickArea:[0,0,28,56],
			}).addTo(this);
			
			this.medicalkit  = new game.ActiveObject({
				x:535,
				y:354,
				status:0,
				readyImgUrl:'lockbox',
				finishedImgUrl:'lockbox',
				clickArea:[10,40,90,65],
			}).addTo(this);

			this.doorhandler  = new game.ActiveObject({
				x:1162,
				y:422,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
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
			
			if(game.boydata.bedroomData.isshake.used){
				this.glim.status = 1;
				this.phone.status =1;
				this.plug.status = 1;
				this.drink.status = 1;
				this.medicalkit.status =1;
			}*/
		},
		onUpdate:function(){
			this.depotTime++;
			if(this.depotTime == 100){
				var scene = this;
				new Hilo.Tween.to(scene.interludetxt,{
						x:-210,
					},{
						duration:5000,
						onComplete:function(){
							scene.changeBg();
						}
					});
			}
			/*if(!game.boydata.bedroomData.isshake.used){
				this.shaking();
				this.shakeScene();
			}
			this.checkBlocks();*/
		},
		shaking:function(){
			if(this.readyShakeTime == 50){
				game.notepanel.show(true,'小心地震',100);
			}
			if(this.readyShakeTime == 200){
				this.shakeRoom(200,3);
			}
			
			if(this.readyShakeTime == 350){
				game.notepanel.show(true,'微震是强震的前兆，务必小心掉落物',150);
			}
			
			if(this.readyShakeTime == 700){
				game.sounds.play(13,false);
				this.shakeRoom(700,10);
			}
			if(this.readyShakeTime == 900){
				this.changeBg();
				//this.tasktxt1.visible = true;
			}
			if(this.readyShakeTime == 1200){
				this.glim.status = 1;
				this.pillow.status = 1;
				this.drink.status = 1;
				this.plug.status = 1;
				this.medicalkit.status = 1;
				game.notepanel.show(true,'逃离险境，S键拾取星星，鼠标行走',150);
				game.boydata.bedroomData.isshake.used = true;
				game.sounds.play(16,true);
			}
			this.toFallTime++;
			if(this.toFallTime == 725){
				this.fallfan1.isFall = true;
			}
			if(this.toFallTime == 745){
				this.fallfan2.isFall = true;
			}
			this.checkFallObj(this.fallfan1,this.fallfanShader1);
			this.checkFallObj(this.fallfan2,this.fallfanShader2);
			
			if(this.readyShakeTime == 100){
				this.testStart = new game.FlashStar({
					x:300,
					y:200
				}).addTo(this);
			}
			if(this.readyShakeTime == 200){
				this.testStart.hide();
			}
			this.readyShakeTime++;
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
				game.sounds.play(10,false);
				if(game.checkInRect(this.hero.posx,this.hero.posy,objshader.x,objshader.y,objshader.width,objshader.height)){
					this.hero.switchState('fallhit',6);
					game.boydata.currentHp--;
					game.headPanel.setHp(game.boydata.currentHp);
				}
			}
		}
	});
})(window.game);