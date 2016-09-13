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
		
		
		notepanel:null,
		blocks:null,
		
		//---run away
		defaultBgspeed:5,
		bgspeed:0,
		bg1:null,
		bg2:null,
		blockLayer:null,
		bglayer2:null,
		blockline:390,
		fallblockLayer:null,
		isProtect:false,
		protectTime:0,
		iswin:false,
		startRun:false,
		passstep:0,
		basefloor:520,
		runlength:6,
		
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
			this.initkeyevent();
			this.ignoreTouch = true;
			this.bgspeed = this.defaultBgspeed;
			this.iswin = false;
			this.startRun = false;
			this.fallblockLayer.visible= true;
			this.readyShakeTime = 0;
			this.notepanel.show(true,game.configdata.GAMETXTS.pass05_runaway,200);
			game.sounds.play(0,false);
			Hilo.Tween.to(this, {
				alpha: 1
			}, {
				duration: 2800,
				onComplete: function() {
				   scene.startRun = true;
				   scene.hero.switchState('run',6);
				}
			});
		},
		initkeyevent:function(){
			var scene = this;
			if(!this.hero)
			{
				console.log('hero gua le');
				return;
			}
			document.onkeydown=function(event){
            	 var e = event || window.event || arguments.callee.caller.arguments[0];
             	if(e && e.keyCode===game.configdata.JumpKey){  
 					console.log('Jum');
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herojump});
               	 }
              	if(e && e.keyCode===game.configdata.StopKey){  
              	   scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herorunstop});
              	 }
         	}; 
         	document.onkeyup=function(event){
             	var e = event || window.event || arguments.callee.caller.arguments[0];
             	if(e && e.keyCode===game.configdata.JumpKey){  
                  //要做的事情
                }
              	if(e && e.keyCode===game.configdata.StopKey){  
                  //要做的事情
                  scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.runstop2run});
             	}
         	}; 
		},
		checkBlocks:function(){
			var objs = this.blockLayer.children;
			for(var i=0;i<objs.length;i++){
				var item = objs[i];
				var rect = item.clickArea;
				if(rect){
					var x = rect[0]+item.x + this.bg1.x;
					var y = rect[1]+item.y;
					var w = rect[2];
					var h = rect[3];
					if(game.checkInRect(this.hero.posx,this.hero.posy,x,y,w,h) && this.hero.currentHealth > 0){
						this.hero.switchState('fallhit');
						game.sounds.play(6,false);
						if(!this.isProtect){
							this.isProtect = true;
							this.hero.currentHealth--;
							if(this.hero.currentHealth <= 0){
								this.hero.currentHealth = 0;
								this.bgspeed = 0;
								this.fallblockLayer.visible= false;
								var scene = this;
								Hilo.Tween.to(this.hero, {
									alpha: 0
									}, {
									duration: 2800,
									ease: Hilo.Ease.Bounce.EaseOut,
									onComplete: function() {
										scene.showEndNote(game.configdata.GAMETXTS.pass05_fail);
									}
								});
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
					var x = rect[0]+item.x+this.bg1.x;
					var y = rect[1]+item.y;
					var w = rect[2];
					var h = rect[3];
					
					var x1 = this.hero.posx -50;
					var y1 = this.hero.posy - 200;
					var w1 = 100;
					var h1 = 200;
					if(game.checkTwoBox(x,y,w,h,x1,y1,w1,h1)){
						this.hero.switchState('fallhit');
						game.sounds.play(6,false);
						this.hero.posy = this.basefloor;
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
				case game.configdata.MSAGE_TYPE.herojump:
					if(this.hero.framename != 'jump'){
						this.hero.floory = this.hero.posy;
						this.hero.jumpspeed = this.hero.jumpPower*1.4;
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
			}
		},
		shakeRoom:function(){
			this.shakeTime = 200;
		},
		layoutBgMap:function(){
			var scene = this;
			this.bg1 = new Hilo.Container({
				width:1202*this.runlength,
			}).addTo(this);
			for(var i=0;i<5;i++){
				new Hilo.Bitmap({
					image: game.getImg('corridorrbg'),
					x:i*1202
				}).addTo(this.bg1);
			}
			
			this.blockLayer = new Hilo.Container({
			}).addTo(this.bg1);
			this.addBlock();
			
			this.fallblockLayer = new Hilo.Container({
			}).addTo(this.bg1);
			
			
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
				posy: this.basefloor,
				atlas:game.monsterdata.soliderhero_atlas,
				once: false,
				interval: 5,
				alpha:1,
				isRunaway:true,
			}).addTo(this);
			//this.hero.switchState('run',6);
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			console.log('%s destory',this.name);
			//this.hero.removeFromParent();
			this.removeAllChildren();
			this.removeFromParent();
			game.stage.off();
			this.hero = null;
		},
		addBlock:function(){
			var objPoses =[800,1500,1900,2100,2700,2950,3500,3800,4200,4800,5500,5800,6500];
			for(var i=0;i< objPoses.length;i++){
				var radX = objPoses[i];
				var t = Math.random();
				var blockname = 'block3';
				if(t > 0.4)
					blockname = 'block4';
				var block = new game.RunblockObj({
			 		img:blockname,
			 		clickArea:[40,0,70,90],
			 		x:radX,
			 		y:this.blockline+120,
			 	}).addTo(this.blockLayer);
			}
		},
		addFallBlock:function(){
			if(Math.random() < 0.5){
				return;
			}
			 var frames = [
                    //[357,1267,292,171],
					//[0,1474,357,207],
					[357,1060,357,207],
					[0,1681,357,207],
					[0,1060,357,207],
					[0,1267,357,207], //0-5
                ];
			
			var runspeed = this.bgspeed;
			 var radX2 = Math.random() * 500+400 - this.bg1.x;
			 new game.FallObject({
				x:radX2,
				y:0,
				isFall:true,
				isRun:false,
				animaFrames:frames,
				runspeed:0,
				fallspeed:0.5,
				name:'fallfan',
				imgInity:0,
				floorline:450,
				wholeState:'ceilingfan1',
				brokenState:'ceilingfan_piece',
				clickArea:[10,10,100,40],
			}).addTo(this.fallblockLayer);
		},
		onUpdate:function(){
			if(!this.startRun){
				return;
			}
			
			if(this.readyShakeTime == 400){
				this.shakeRoom();
			}
			
			this.readyShakeTime++;
			this.shakeScene();
			
			
			if(this.bg1.x >= -1202*(this.runlength-2)){
				this.bg1.x -= this.bgspeed;
			}else if(!this.iswin){
				this.hero.posx += 5;
			}
			
			if(this.hero.posx >900 && !this.iswin){
				this.iswin = true;
				this.hero.isRunaway = false;
				this.hero.switchState('idle',7);
				this.showEndNote(game.configdata.GAMETXTS.pass05_success);
				this.hero.visible =false;
				console.log('game win end');
			}
			
			if(this.bg1.x % 1000 == 0 && this.bg1.x > -6000){
				this.addFallBlock();
			}
			this.checkBlocks();
			this.heroProtect();
		},
		showEndNote:function(txt){
			this.notepanel.show(true,txt,300);
			var btnpass01 = new Hilo.Bitmap({
					image:game.getImg('uimap'),
					rect:game.configdata.getPngRect('backbtn','uimap'),
					x:680,
					y:400
				}).addTo(this);
 			btnpass01.on(Hilo.event.POINTER_START, function(e) {
					game.switchScene(game.configdata.SCENE_NAMES.main);
				});
			this.fallblockLayer.removeFromParent();
			this.blockLayer.removeFromParent();
			
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