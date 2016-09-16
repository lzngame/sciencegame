(function(ns) {
	var AttackScene = ns.AttackScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.attack,
		hero:null,
		headPanel:null,
		
		readyShakeTime:0,
		bgImg:null,
		shakeTime:0,
		shakeLevel:4,
		shakeSpeed:1,
		shakeOnce:false,
		initx:0,
		inity:0,
		toFallTime:0,
		
		fallfan:null,
		falllamp:null,
		fallfanShader:null,
		plug:null,
		pillow:null,
		phone:null,
		safeArea:null,
		doorhandler:null,
		finger:null,
		notepanel:null,
		toolippanel:null,
		tvflash:null,
		aftershake:false,
		
		blocks:null,
		
		passstep:0,
		
		testStart:null,
		
		star01:null,
		star02:null,
		star03:null,
		
		finerMouse:null,
		toolspanel:null,
		
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
			
			this.layoutBgMap();
			this.addHero();
			this.initkeyevent();
			this.initTouchEvent();
			this.headPanel.setHealth(this.hero.currentHealth);
			game.sounds.play(0,false);
			
			
			this.fingerMouse = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				visible:false,
				rect:game.configdata.getPngRect('hand_001','uimap')
			}).addTo(this);
			this.toolspanel = new game.ToolsIconPanel({
				initx:724,
				inity:-247,
			}).addTo(this);
		},
		
		initkeyevent:function(){
			var scene = this;
			document.onkeydown=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode===game.configdata.JumpKey){ 
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herojump});
                }
              if(e && e.keyCode===game.configdata.SquatKey){ 
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat});
                }            
         	}; 
         	document.onkeyup=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode===game.configdata.JumpKey){ 
                  //要做的事情
 					console.log('Jum');
                }
              if(e && e.keyCode==game.configdata.SquatKey){ 
                  //要做的事情
 					console.log('squat to idle');
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat2idle});
                }            
         	}; 
		},
		initBlocks:function(){
			this.blocks = [[0,0,1202,443],[0,443,500,80],[0,500,200,80],[0,580,80,100],[934,440,270,70],[980,506,223,70],[1115,506,84,96],[1175,593,27,88],[718,516,90,30]];
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				if(game.configdata.NOLINE){
					var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
					g.lineStyle(1,"#00f").drawRect(0,0,w,h).endFill().addTo(this);
				}
			}
		},
		checkInBlocks:function(mousex,mousey){
			var isIn = false;
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				if(mousex > x && mousex < x+w && mousey > y && mousey < y+h){
					isIn = true;
					break;
				}
			}
			return isIn;
		},
		checkBlocks:function(){
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				if(
					(this.hero.speedx < 0 && Math.abs(this.hero.posx -(x+w) ) < 20  && (this.hero.posy > y && this.hero.posy < y+h)) ||
					(this.hero.speedx > 0 && Math.abs(this.hero.posx - x)	  < 20  && (this.hero.posy > y && this.hero.posy < y+h)) ||
					(this.hero.speedy > 0 && Math.abs(this.hero.posy - y)     < 5  && (this.hero.posx > x && this.hero.posx < x+w))  ||
					(this.hero.speedy < 0 && Math.abs(this.hero.posy - (y+h))< 10  && (this.hero.posx > x && this.hero.posx < x+w))
				)
				{
					this.heroStopBlock();
				}
			}
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.pillow)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.plug)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.safeArea)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorhandler)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.phone)
			){
				return true;
			}else{
				return false;
			}
		},
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.phone)){
				//this.phone.removeFromParent();
				//this.phone.status = 2;
				this.toolippanel.show(true,'准备好通讯工具非常重要',200);
				this.toolspanel.show(true,500);
				this.toolspanel.addIcon();
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.pillow)){
				//this.hero.switchState('handup',10);
				//this.hero.ispillow = true;
				this.pillow.x = 300;
				this.pillow.status = 0;
				this.phone.status = 1;
				this.phone.visible = true;
				this.safeArea.visible = true;
				this.safeArea.status = 1;
				
				new game.FlashStarEffect({x:mouseX-100,y:mouseY-100}).addTo(this);
				this.notepanel.show(true,game.configdata.GAMETXTS.pass01_hide);
				this.finger.setpos(752,462);
				this.passstep = 1;
				this.star01 = new game.FlashStar({
					x:760,
					y:560
				}).addTo(this);
				this.toolippanel.show(true,'D 键 蹲下拾取星星',200);
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.plug)){
				this.hero.switchState('handon',10);
				this.tvflash.visible = false;
				this.plug.setEndImg(10,80);
				this.doorhandler.status = 1;
				this.notepanel.show(true,game.configdata.GAMETXTS.pass01_okend);
				this.finger.visible = true;
				this.finger.setpos(1103,437);
			}
			if(this.checkActiveItem(mouseX,mouseY,this.safeArea)){
				
			}
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				this.hero.switchState('handon',10);
				var scene = this;
				new Hilo.Tween.to(this,{
					alpha:0.3
				},{
					duration:300,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.cookieroom);
					}
				});
			}
		},
		checkStar:function(star){
			if(star){
				if(Math.abs(star.x - this.hero.posx) < 100 && Math.abs(star.y - this.hero.posy) < 100){
					star.hide();
				}
			}
		},
		checkActiveItemWithoutPos:function(mouseX,mouseY,obj){
			var isClickIn = false;
			var x = obj.clickArea[0]+obj.x;
			var y = obj.clickArea[1]+obj.y;
			var w = obj.clickArea[2];
			var h = obj.clickArea[3];
			if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h && obj.status == 1){
				isClickIn = true;
			}
			return isClickIn;
		},
		
		checkActiveItem:function(mouseX,mouseY,obj){
			var isClickIn = false;
			var x = obj.clickArea[0]+obj.x;
			var y = obj.clickArea[1]+obj.y;
			var w = obj.clickArea[2];
			var h = obj.clickArea[3];
			if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h && obj.status == 1){
				if(Math.abs(x+w/2 - this.hero.posx) <100 && Math.abs(y+h/2 - this.hero.posy) <200){
					isClickIn = true;
				}else{
					isClickIn = false;
					this.notepanel.show(true,'走近点...',50);					
				}
			}
			return isClickIn;
		},
		
		heroStopBlock:function(){
			this.hero.speedx = 0;
			this.hero.speedy = 0;
			this.hero.targetx = this.hero.posx;
			this.hero.targety = this.hero.posy;
		},
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.herosquat:
					console.log('hero squat');
					this.checkStar(this.star01);
					this.hero.speedx = this.hero.speedy = 0;
					if(this.hero.ispillow){
						this.hero.switchState('pillowsquat');
					}else{
						this.hero.switchState('squat');
					}
					
					var x = this.hero.posx;
					var y = this.hero.posy;
					var x1 = this.safeArea.clickArea[0] + this.safeArea.x;
					var y1 = this.safeArea.clickArea[1] + this.safeArea.y;
					var w1 = this.safeArea.clickArea[2];
					var h1 = this.safeArea.clickArea[3];
					if(game.checkInRect(x,y,x1,y1,w1,h1) && !this.aftershake && this.hero.ispillow){
						this.shakeRoom();
						this.changeBg();
						this.aftershake = true;
					}
					break;
				case game.configdata.MSAGE_TYPE.herojump:
					if(!this.hero.ispillow && this.hero.framename != 'jump'){
						this.hero.jumpspeed = -18;
						this.hero.floory = this.hero.posy;
						this.hero.switchState('jump');
					}
					break;
				case game.configdata.MSAGE_TYPE.herosquat2idle:
					if(this.hero.ispillow){
						this.hero.switchState('handup',5);
					}else{
						this.hero.switchState('idle',5);
					}
					break;
			}
		},
		shakeRoom:function(){
			this.shakeTime = 200;
		},
		changeBg:function(){
			var scene = this;
			this.finger.setpos(853,273);
			Hilo.Tween.to(this, {
				alpha:0
			}, {
				duration: 800,
				ease: Hilo.Ease.Bounce.EaseOut,
				onComplete: function() {
					Hilo.Tween.to(this, {
						alpha:1
					}, {
						duration: 200,
						ease: Hilo.Ease.Bounce.EaseOut,
						onComplete: function() {
							scene.alpha = 1;
							scene.bgImg.setImage(game.getImg('bedroomafter'));
							scene.step = 3;
							scene.safeArea.visible = false;
							scene.notepanel.show(true,game.configdata.GAMETXTS.pass01_tvflash);
							scene.tvflash.visible = true;
							scene.plug.status = 1;
							scene.hero.ispillow = false;
						}
					});
				}
			});
		},
		layoutBgMap:function(){
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
			
			this.initBlocks();
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

			this.doorhandler  = new game.ActiveObject({
				x:1162,
				y:422,
				readyImgUrl:'handler',
				finishedImgUrl:'handler',
				clickArea:[0,0,50,50],
			}).addTo(this);
			
			this.safeArea  = new game.ActiveObject({
				x:769,
				y:425,
				readyImgUrl:'safearea1',
				finishedImgUrl:'safearea1',
				clickArea:[29,5,100,60],
			}).addTo(this);
			this.safeArea.visible = true;
			
			            
            var frames = [
                    //[357,1267,292,171],
					//[0,1474,357,207],
					[357,1060,357,207],
					[0,1681,357,207],
					[0,1060,357,207],
					[0,1267,357,207], //0-5
                ];
			
			this.fallfan = new game.FallObject({
				x:200,
				y:-30,
				name:'fallfan',
				imgInity:-30,
				floorline:470,
				wholeState:'ceilingfan1',
				animaFrames:frames,
			}).addTo(this);
			
			this.fallfanShader = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('fanshader','uimap'),
				y:550,
				x:200
			}).addTo(this);
			/*this.falllamp = new game.FallObject({
				x:500,
				y:0,
				name:'falllamp',
				imgInity:0,
				floorline:400,
				wholeState:'ceilinglamp1',
				brokenState:'ceilinglamp_piece',
			}).addTo(this);*/
			
			this.headPanel = new game.TopHeadPanel({
				healthValue:game.configdata.DEFAULTHEROHP,
				headImgUrl:'headicon2',
				healthIcon:'heart02',
				healthIconBlack:'heart01',
				x:20,
				y:20,
			}).addTo(this);
			
			this.finger = new game.FingerPoint({
				x:328,
				y:408,
				visible:false,
			}).addTo(this);
			
			this.notepanel = new game.DrNote({
				txt:game.configdata.GAMETXTS.pass01_notestart,
				x:-700,
			}).addTo(this);
			
			this.toolippanel = new game.ToolipNote({
				x:1230,
				y:300,
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
		},
		addHero:function(){
			this.hero = new game.Hero({
				name: 'Hero',
				framename: 'idle',
				posx: 256,
				posy: 627,
				atlas:game.monsterdata.soliderhero_atlas,
				once: false,
				interval: 5,
				alpha:1,
			}).addTo(this);
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			this.hero.removeFromParent();
			this.removeAllChildren();
			this.removeFromParent();
			game.stage.off();
			this.hero = null;
		},
		initTouchEvent:function(){
			var scene = this;
			game.stage.off();
			game.stage.on(Hilo.event.POINTER_MOVE, function(e) {
				if(scene.ignoreTouch)
					return;
				var stagex = e.stageX;
				var stagey = e.stageY;
				var targetx = stagex - scene.x;
				var targety = stagey - scene.y;
				if(scene.checkShowFingerObjects(targetx,targety)){
					scene.fingerMouse.visible = true;
					scene.fingerMouse.x = targetx;
					scene.fingerMouse.y = targety;
				}else{
					scene.fingerMouse.visible = false;
				}
			});
			game.stage.on(Hilo.event.POINTER_START, function(e) {
				if(scene.ignoreTouch)
					return;
				var stagex = e.stageX;
				var stagey = e.stageY;
				var targetx = stagex - scene.x;
				var targety = stagey - scene.y;
				if(!scene.checkInBlocks(targetx,targety)){
					if(scene.hero.ispillow){
						scene.hero.switchState('pillowup',5);
					}else{
						scene.hero.switchState('walk',5);
					}
					
					var disX = targetx - scene.hero.posx;
					var disY = targety - scene.hero.posy;
					var angle = Math.atan2(disY,disX);
					scene.hero.speedx = Math.cos(angle) *  scene.hero.speed ;
					scene.hero.speedy = Math.sin(angle) *  scene.hero.speed ;
					scene.hero.targetx = targetx;
					scene.hero.targety = targety;
					if(disX < 0)
						scene.hero.turnleft();
					else
						scene.hero.turnright();
				}
				
				scene.checkActiveObjects(targetx,targety);
			});
		},
		onUpdate:function(){
			if(this.readyShakeTime == 100){
				this.notepanel.show(true,game.configdata.GAMETXTS.pass01_notestart,300);
			}
			
			if(this.readyShakeTime == 300){
				this.shakeRoom();
				this.changeBg();
			}
			if(this.readyShakeTime == 430){
				this.notepanel.show(true,game.configdata.GAMETXTS.pass01_pillow);
				this.finger.visible = true;
				this.pillow.status = 1;
			}
			
			this.readyShakeTime++;
			
			if(this.shakeTime > 0){
				this.x = this.initx;
				this.y = this.inity;
				var offsetx = Math.random()*this.shakeLevel;
				var offsety = Math.random()*this.shakeLevel;
				var d1 = Math.random();
				var d2 = Math.random();
				if(d1 > 0.5)
				  this.x += this.shakeSpeed;
				else
				  this.x -= this.shakeSpeed;
				if(d2 > 0.5)
				  this.y += this.shakeSpeed;
				else
				  this.y -= this.shakeSpeed;
				this.shakeTime -= 2;
			}else{
				this.shakeTime = 0;
				this.x = this.initx;
				this.y = this.inity;
			}
			this.toFallTime++;
			if(this.toFallTime == 580){
				this.fallfan.isFall = true;
			}
			if(this.toFallTime == 500){
				//this.falllamp.isFall = true;
			}
			if(this.fallfan.onDanger && this.fallfan.y >= this.fallfan.floorline){
				console.log('once check:'+this.fallfan.name);
				this.fallfanShader.removeFromParent();
				this.fallfan.onDanger = false;
				game.sounds.play(4,false);
				if(game.checkInRect(this.hero.posx,this.hero.posy,256,598,200,50)){
					this.hero.switchState('fallhit',6);
					this.hero.currentHealth--;
					this.headPanel.setHealth(this.hero.currentHealth);
				}
			}
			
			if(this.passstep ==1){
				if(this.checkActiveItem(this.hero.posx,this.hero.posy,this.safeArea)){
					this.notepanel.show(true,game.configdata.GAMETXTS.pass01_squat);
					//this.finger.visible = false;
					
					//this.safeArea.visible = false;
					this.passstep = 2;
				}
			}
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
	});
})(window.game);