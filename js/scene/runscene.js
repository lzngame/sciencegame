(function(ns) {
	var RunawayScene = ns.RunawayScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.runaway,
		hero:null,
		headPanel:null,
		
		readyShakeTime:0,
		bgImg:null,
		shakeTime:0,
		shakeLevel:4,
		initx:0,
		inity:0,
		toFallTime:0,
		
		notepanel:null,
		
		blocks:null,
		activeObjects:null,
		
		//---run away
		defaultBgspeed:4,
		bgspeed:0,
		bg1:null,
		bg2:null,
		bglayer1:null,
		bglayer2:null,
		blockline:370,
		fallblockLayer:null,
		isProtect:false,
		protectTime:0,
		
		passstep:0,
		constructor: function(properties) {
			RunawayScene.superclass.constructor.call(this, properties);
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
			this.bgspeed = this.defaultBgspeed;
		},
		active: function(doorIndex) {
			console.log('%s active:', this.name);
			var scene = this;
			
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.layoutBgMap();
			this.addHero();
			this.headPanel.setHealth(this.hero.currentHealth);
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
 					console.log('Jum');
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herojump});
                }
              if(e && e.keyCode==18){ // alt 
 					console.log('squat');
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat});
 					scene.shakeRoom();
 					//scene.fallfan.isFall = true;
                }            
              if(e && e.keyCode==16){ // shift 键
              	   scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herorunstop});
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
              if(e && e.keyCode==16){ // shift 键
                  //要做的事情
                  scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.runstop2run});
             	}
         	}; 
		},
		initBlocks:function(){
			this.blocks = [[0,0,850,280]];
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
			var objs = this.bglayer1.children;
			for(var i=0;i<objs.length;i++){
				var item = objs[i];
				var rect = item.clickArea;
				if(rect){
					var x = rect[0]+item.x + this.bg1.x;
					var y = rect[1]+item.y;
					var w = rect[2];
					var h = rect[3];
					if(game.checkInRect(this.hero.posx,this.hero.posy,x,y,w,h)){
						this.hero.switchState('fallhit');
						if(!this.isProtect){
							this.isProtect = true;
							this.hero.currentHealth--;
							if(this.hero.currentHealth <= 0){
								this.hero.currentHealth = 0;
								this.showFailNote();
							}
							this.headPanel.setHealth(this.hero.currentHealth);
						}
					}
				}
			}
			var fallobjs = this.fallblockLayer.children;
			for(var i=0;i<fallobjs.length;i++){
				var item = fallobjs[i];
				var rect = item.clickArea;
				if(rect && item.onDanger){
					var x = rect[0]+item.x;
					var y = rect[1]+item.y;
					var w = rect[2];
					var h = rect[3];
					
					var x1 = this.hero.posx -50;
					var y1 = this.hero.posy - 200;
					var w1 = 100;
					var h1 = 200;
					if(game.checkTwoBox(x,y,w,h,x1,y1,w1,h1)){
						this.hero.switchState('fallhit');
						this.headPanel.setHealth(this.hero.currentHealth);
					}
				}
			}
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
					if(this.hero.framename != 'jump'){
						this.hero.jumpspeed = this.hero.jumpPower*1.5;
						this.hero.floory = this.hero.posy;
						this.hero.switchState('jump');
					}
					break;
				case game.configdata.MSAGE_TYPE.herorunstop:
					if(this.hero.framename != 'jump'){
						this.bgspeed = this.defaultBgspeed * 0.7;
						this.hero.switchState('runstop',6);
					}
					break;
				case game.configdata.MSAGE_TYPE.runstop2run:
					if(this.hero.framename == 'runstop'){
						this.hero.switchState('run',6);
						this.bgspeed = this.defaultBgspeed;
					}
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
		shakeRoom:function(){
			this.shakeTime = 200;
		},
		layoutBgMap:function(){
			var scene = this;
			
			this.bg1 = new Hilo.Container({
				width:850*6,
			}).addTo(this);
			for(var i=0;i<5;i++){
				new Hilo.Bitmap({
					image: game.getImg('corridorrbg'),
					x:i*850
				}).addTo(this.bg1);
			}
			
			this.bglayer1 = new Hilo.Container({
			}).addTo(this.bg1);
			this.addBlock();
			
			this.fallblockLayer = new Hilo.Container({
			}).addTo(this);
			
			this.initBlocks();
			
			this.headPanel = new game.TopHeadPanel({
				healthValue:game.configdata.DEFAULTHEROHP,
				headImgUrl:'headicon2',
				healthIcon:'heart02',
				healthIconBlack:'heart01',
			}).addTo(this);
			
			this.notepanel = new game.DrNote({
				txt:game.configdata.GAMETXTS.pass01_notestart,
				x:-700,
			}).addTo(this);
		},
		addHero:function(){
			this.hero = new game.Hero({
				name: 'Hero',
				framename: 'idle',
				posx: 443,
				posy: 420,
				atlas:game.monsterdata.soliderhero_atlas,
				once: false,
				interval: 5,
				alpha:1,
				isRunaway:true,
			}).addTo(this);
			this.hero.switchState('run',6);
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
			});
		},
		addBlock:function(){
			for(var i=0;i< 8;i++){
				var radX = Math.random() * 200 + i * 450;
				var block = new game.RunblockObj({
			 		img:'block02',
			 		clickArea:[40,0,100,90],
			 		x:radX,
			 		y:this.blockline
			 	}).addTo(this.bglayer1);
			}
		},
		addFallBlock:function(){
			if(Math.random() < 0.5){
				return;
			}
			var runspeed = this.bgspeed;
			 var radX2 = Math.random() * 700+100;
			 new game.FallObject({
				x:radX2,
				y:0,
				isFall:true,
				isRun:true,
				runspeed:runspeed,
				fallspeed:1,
				name:'fallfan',
				imgInity:0,
				floorline:400,
				wholeState:'ceilingfan',
				brokenState:'ceilingfan_piece',
				clickArea:[10,10,100,40],
			}).addTo(this.fallblockLayer);
		},
		onUpdate:function(){
			if(this.readyShakeTime == 100){
				this.notepanel.show(true,game.configdata.GAMETXTS.pass05_runaway);
			}
			
			if(this.readyShakeTime == 400){
				this.shakeRoom();
			}
			if(this.readyShakeTime == 530){
				this.notepanel.show(true,game.configdata.GAMETXTS.pass05_runaway_tile);
			}
			
			this.readyShakeTime++;
			this.shakeScene();
			
			this.toFallTime++;
			
			if(this.bg1.x >= -850*4){
				this.bg1.x -= this.bgspeed;
			}else{
				this.hero.isRunaway = false;
				this.hero.switchState('idle',7);
			}
			
			if(this.readyShakeTime % 100 == 0 && this.readyShakeTime < 500){
				this.addFallBlock();
			}
			this.checkBlocks();
			this.heroProtect();
		},
		showFailNote:function(){
			this.notepanel.show(true,game.configdata.GAMETXTS.pass04_fall,1300);
			var btnpass01 = new Hilo.Bitmap({
					image:game.getImg('uimap'),
					rect:game.configdata.getPngRect('backbtn','uimap'),
					x:500,
					y:100
				}).addTo(this);
 			btnpass01.on(Hilo.event.POINTER_START, function(e) {
					game.switchScene(game.configdata.SCENE_NAMES.main);
				});
			this.bgspeed = 0;
			this.fallblockLayer.removeFromParent();
			this.bglayer1.removeFromParent();
			this.hero.isRunaway = false;
			this.hero.switchState('idle',7);
			this.hero.visible = false;
			new Hilo.Bitmap({
					image:game.getImg('uimap'),
					rect:game.configdata.getPngRect('boy','uimap'),
					x:500,
					y:185,
			}).addTo(this);
		},
		heroProtect:function(){
			if(this.isProtect){
				this.protectTime++;
				if(this.protectTime > 50){
					this.isProtect = false;
					this.protectTime = 0;
				}
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
	});
})(window.game);