(function(ns) {
	var CookieroomScene = ns.CookieroomScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.cookieroom,
		hero:null,
		headPanel:null,
		
		readyShakeTime:0,
		bgImg:null,
		shakeTime:0,
		shakeLevel:4,
		initx:0,
		inity:0,
		toFallTime:0,
		
		
		
		annihilator:null,
		annihilatorEffect:null,
		doorhandler:null,
		finger:null,
		notepanel:null,
		tvflash:null,
		
		blocks:null,
		
		passstep:0,
		constructor: function(properties) {
			CookieroomScene.superclass.constructor.call(this, properties);
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
			this.currentIndex = 0;
			
			this.layoutBgMap();
			//this.layoutUI();
			this.addHero();
			//this.layoutBottomUI();
			//this.initTouchAttack();
			//this.initData();
			//this.hideFlashHand();
			this.initkeyevent();
			this.initTouchEvent();
		},
		initkeyevent:function(){
			var scene = this;
			document.onkeydown=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode==17){ // ctrl
 					//console.log('Jum');
 					//scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herojump});
                }
              if(e && e.keyCode==18){ // alt 
 					console.log('squat');
 					//scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat});
 					//scene.shakeRoom();
 					//scene.fallfan.isFall = true;
                }            
              if(e && e.keyCode==13){ // enter 键
             }
         	}; 
         	document.onkeyup=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode==17){ // 松开 ctrl 
                  //要做的事情
 					//console.log('Jum');
                }
              if(e && e.keyCode==18){ // 松开 alt 
                  //要做的事情
 					//console.log('squat to idle');
 					//scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat2idle});
                }            
              if(e && e.keyCode==13){ // enter 键
                  //要做的事情
             }
         	}; 
		},
		initBlocks:function(){
			this.blocks = [[0,0,850,380],[0,350,155,60],[0,370,80,120],[810,310,40,175],[665,310,145,100]];
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
				g.lineStyle(1,"#998877").drawRect(0,0,w,h).endFill().addTo(this);
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
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.annihilator)){
				if(this.hero.scaleX == -1)
					return;
				
				this.hero.switchState('annihilator',10);
				this.annihilator.visible = false;
				this.annihilatorEffect.visible = true;
				this.annihilatorEffect.x = this.hero.posx + 80;
				this.annihilatorEffect.y = this.hero.posy - 120;
				this.ignoreTouch = true;
				
				this.notepanel.show(true,game.configdata.GAMETXTS.pass02_ok);
				this.passstep = 1;
				var scene = this;
				new Hilo.Tween.to(scene.tvflash,{
					alpha:0
				},{
					duration:3000,
					onComplete:function(){
						scene.ignoreTouch = false;
						scene.annihilator.visible = true;
						scene.annihilatorEffect.removeFromParent();
						scene.hero.switchState('idle',6);
						scene.annihilator.status = 2;
						scene.notepanel.show(true,game.configdata.GAMETXTS.pass02_ok);
						scene.finger.visible = true;
						scene.doorhandler.status = 1;
					}
				});
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				this.hero.switchState('handon',10);
				var scene = this;
				new Hilo.Tween.to(this,{
					alpha:0.3
				},{
					duration:400,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.choice);
					}
				});
			}
		},
		
		checkActiveItem:function(mouseX,mouseY,obj){
			var isClickIn = false;
			var x = obj.clickArea[0]+obj.x;
			var y = obj.clickArea[1]+obj.y;
			var w = obj.clickArea[2];
			var h = obj.clickArea[3];
			if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h && obj.status == 1){
				if(x - this.hero.posx <100 && y - this.hero.posy <250){
					isClickIn = true;
					
				}else{
					isClickIn = false;
					console.log('pls close');						
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
					this.topHeadPanel.setHealth(n);
					break;
			}
		},
		
		layoutBgMap:function(){
			var scene = this;
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('cookieroom'),
			}).addTo(this);
			
			this.initBlocks();
			
			this.annihilator  = new game.ActiveObject({
				x:564,
				y:270,
				readyImgUrl:'annihilator',
				finishedImgUrl:'annihilator',
				clickArea:[12,10,25,100],
				status:1
			}).addTo(this);

			this.doorhandler  = new game.ActiveObject({
				x:150,
				y:240,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
			}).addTo(this);
			
			this.headPanel = new game.TopHeadPanel({
				headImgUrl:'headicon2',
				healthIcon:'heart02',
			}).addTo(this);
			
			this.finger = new game.FingerPoint({
				x:180,
				y:240,
				visible:false,
			}).addTo(this);
			this.finger.turnleft();
			
			this.notepanel = new game.DrNote({
				txt:game.configdata.GAMETXTS.pass01_notestart,
				x:-700,
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
			this.tvflash = new Hilo.Sprite({
				frames: atlas.getSprite('tv'),
				x:620,
				y:295,
				interval:8,
			}).addTo(this);
			
			this.annihilatorEffect = new Hilo.Sprite({
				frames: atlas.getSprite('effect'),
				x:520,
				y:195,
				interval:8,
				visible:false,
			}).addTo(this);
			
			
			
			
		},
		addHero:function(){
			this.hero = new game.Hero({
				name: 'Hero',
				framename: 'idle',
				posx: 183,
				posy: 400,
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
			console.log('%s destory',this.name);
			this.hero.removeFromParent();
			this.removeAllChildren();
			this.removeFromParent();
			game.stage.off();
			this.hero = null;
		},
		initTouchEvent:function(){
			var scene = this;
			game.stage.off();
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
				this.notepanel.show(true,game.configdata.GAMETXTS.pass02_annihilator);
			}
			
			
			
			this.readyShakeTime++;
			
			
			
			
			this.checkBlocks();
		},
	});
})(window.game);