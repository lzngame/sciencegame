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
		plug:null,
		pillow:null,
		safeArea:null,
		doorhandler:null,
		finger:null,
		notepanel:null,
		tvflash:null,
		aftershake:false,
		
		blocks:null,
		
		passstep:0,
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
		},
		
		initkeyevent:function(){
			var scene = this;
			document.onkeydown=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode==17){ // ctrl
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herojump});
                }
              if(e && e.keyCode==18){ // alt 
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat});
                }            
              if(e && e.keyCode==13){ // enter 键
              }
         	}; 
         	document.onkeyup=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode==17){ // 松开 ctrl 
                  //要做的事情
 					console.log('Jum');
                }
              if(e && e.keyCode==18){ // 松开 alt 
                  //要做的事情
 					console.log('squat to idle');
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat2idle});
                }            
              if(e && e.keyCode==13){ // enter 键
                  //要做的事情
             }
         	}; 
		},
		initBlocks:function(){
			this.blocks = [[0,0,850,310],[0,310,355,60],[0,370,80,120],[810,310,40,175],[665,310,145,100]];
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
			if(this.checkActiveItem(mouseX,mouseY,this.pillow)){
				this.hero.switchState('handup',10);
				this.pillow.removeFromParent();
				this.safeArea.visible = true;
				this.safeArea.status = 1;
				this.hero.ispillow = true;
				this.notepanel.show(true,game.configdata.GAMETXTS.pass01_hide);
				this.finger.setpos(500,300);
				this.passstep = 1;
			}
			if(this.checkActiveItem(mouseX,mouseY,this.plug)){
				this.hero.switchState('handon',10);
				this.tvflash.visible = false;
				this.plug.setEndImg(10,80);
				this.doorhandler.status = 1;
				this.notepanel.show(true,game.configdata.GAMETXTS.pass01_okend);
				this.finger.visible = true;
				this.finger.setpos(720,310);
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
					if(!this.hero.ispillow){
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
			
			this.initBlocks();
			this.plug  = new game.ActiveObject({
				x:654,
				y:183,
				readyImgUrl:'plug1',
				finishedImgUrl:'plug2',
				clickArea:[9,0,20,40],
			}).addTo(this);
			
			this.pillow  = new game.ActiveObject({
				x:164,
				y:270,
				readyImgUrl:'pillow',
				finishedImgUrl:'pillow',
				clickArea:[9,0,130,50],
			}).addTo(this);

			this.doorhandler  = new game.ActiveObject({
				x:822,
				y:300,
				readyImgUrl:'handler',
				finishedImgUrl:'handler',
				clickArea:[9,0,40,40],
			}).addTo(this);
			
			this.safeArea  = new game.ActiveObject({
				x:535,
				y:305,
				readyImgUrl:'safearea1',
				finishedImgUrl:'safearea1',
				clickArea:[29,5,70,40],
			}).addTo(this);
			this.safeArea.visible = false;
			
			this.fallfan = new game.FallObject({
				x:200,
				y:0,
				name:'fallfan',
				imgInity:0,
				floorline:400,
				wholeState:'ceilingfan',
				brokenState:'ceilingfan_piece',
			}).addTo(this);
			
			this.falllamp = new game.FallObject({
				x:500,
				y:0,
				name:'falllamp',
				imgInity:0,
				floorline:400,
				wholeState:'ceilinglamp',
				brokenState:'ceilinglamp_piece',
			}).addTo(this);
			
			this.headPanel = new game.TopHeadPanel({
				headImgUrl:'headicon2',
				healthIcon:'heart02',
			}).addTo(this);
			
			this.finger = new game.FingerPoint({
				x:70,
				y:278,
				visible:false,
			}).addTo(this);
			
			this.notepanel = new game.DrNote({
				txt:game.configdata.GAMETXTS.pass01_notestart,
				x:-700,
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
				x:680,
				y:235,
				interval:8,
				visible:false,
			}).addTo(this);
		},
		addHero:function(){
			this.hero = new game.Hero({
				name: 'Hero',
				framename: 'idle',
				posx: 443,
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
				this.notepanel.show(true,game.configdata.GAMETXTS.pass01_notestart);
			}
			
			if(this.readyShakeTime == 300){
				this.shakeRoom();
			}
			if(this.readyShakeTime == 530){
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
			if(this.toFallTime == 400){
				this.fallfan.isFall = true;
			}
			if(this.toFallTime == 500){
				this.falllamp.isFall = true;
			}
			if(this.fallfan.onDanger && this.fallfan.y >= this.fallfan.floorline){
				console.log('once check:'+this.fallfan.name);
				this.fallfan.onDanger = false;
				if(Math.abs(this.hero.posx -270) < 30   &&  Math.abs(this.hero.posy -447)<30){
					
				}
				if(game.checkInRect(this.hero.posx,this.hero.posy,200,400,100,50)){
					this.hero.switchState('fallhit',6);
				}
			}
			if(this.fallfan.onDanger && this.fallfan.y >= this.fallfan.floorline){
				console.log('once check:'+this.fallfan.name);
				this.fallfan.onDanger = false;
				if(Math.abs(this.hero.posx -270) < 30   &&  Math.abs(this.hero.posy -447)<30){
					this.hero.switchState('fallhit',6);
				}
			}
			
			if(this.passstep ==1){
				if(this.checkActiveItem(this.hero.posx,this.hero.posy,this.safeArea)){
					this.notepanel.show(true,game.configdata.GAMETXTS.pass01_squat);
					this.finger.visible = false;
					
					//this.safeArea.visible = false;
					this.passstep = 2;
				}
			}
			this.checkBlocks();
		},
	});
})(window.game);