(function(ns) {
	var LifeScene = ns.LifeScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.lift,
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
		doorhandler:null,
		finger:null,
		notepanel:null,
		
		blocks:null,
		
		passstep:0,
		fallspeed:5,
		
		liftbody:null,
		timeImgs:null,
		starttime:true,
		showTimeImg:null,
		showIndex:0,
		isfall:false,
		constructor: function(properties) {
			LifeScene.superclass.constructor.call(this, properties);
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
			this.timeImgs = ['iconnum09','iconnum08','iconnum07','iconnum06','iconnum05','iconnum04','iconnum03','iconnum02','iconnum01','iconnum00'];
		},
		active: function(doorIndex) {
			console.log('%s active:', this.name);
			var scene = this;
			
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.readyShakeTime = 0;
			this.fallspeed = 0;
			this.layoutBgMap();
			this.showIndex = 0;
			//this.layoutUI();
			this.addHero();
			//this.layoutBottomUI();
			//this.initTouchAttack();
			//this.initData();
			//this.hideFlashHand();
			//this.initkeyevent();
			this.initTouchEvent();
		},
		
		initBlocks:function(){
			this.blocks = [[0,0,850,420],[0,420,100,140],[700,420,150,50]];
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				//var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
				//g.lineStyle(1,"#998877").drawRect(0,0,w,h).endFill().addTo(this);
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
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				this.hero.switchState('handon',10);
				var scene = this;
				this.notepanel.show(true,game.configdata.GAMETXTS.pass03_right,200);
				new Hilo.Tween.to(this,{
					alpha:0.99
				},{
					duration:3000,
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
				image: game.getImg('liftbg'),
				width:1202,
				height:686,
			}).addTo(this);
			
			this.liftbody = new Hilo.Bitmap({
				image: game.getImg('lift'),
				x:12,
				y:-950,
			}).addTo(this);
			
			this.initBlocks();
			
			this.showTimeImg = new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.timeImgs[0],'uimap'),
				x:680,
				y:30
			}).addTo(this);

			this.doorhandler  = new game.ActiveObject({
				x:40,
				y:280,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,30,130],
				status:1,
			}).addTo(this);
			
			this.headPanel = new game.TopHeadPanel({
				headImgUrl:'headicon2',
				healthIcon:'heart02',
			}).addTo(this);
			
			this.finger = new game.FingerPoint({
				x:50,
				y:380,
				right:false
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
				posx: 283,
				posy: 480,
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
			if(this.readyShakeTime > 0 && this.readyShakeTime % 50 == 0){
				if(this.showIndex < 9){
					this.showIndex ++;
				}
				this.showTimeImg.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.timeImgs[this.showIndex],'uimap'));	
			}
			
			if(this.readyShakeTime == 50){
				this.notepanel.show(true,game.configdata.GAMETXTS.pass04_warn,80);
				this.finger.visible = true;
			}
			if(this.readyShakeTime == 150){
				//this.notepanel.show(true,game.configdata.GAMETXTS.pass04_fall,1300);
				//this.ignoreTouch = true;
				
			}
			if(this.showIndex == 9 && !this.isfall){
				this.fallspeed++;
				this.liftbody.y+=this.fallspeed;
				this.hero.posy+=this.fallspeed;
				this.finger.visible = false;
				this.doorhandler.visible = false;
			}
			if(this.liftbody.y > 800 && !this.isfall){
				this.isfall = true;
				this.liftbody.y = -950,
				this.liftbody.alpha = 0.2;
			}
			if(this.readyShakeTime ==510){
				this.notepanel.show(true,game.configdata.GAMETXTS.pass04_fall,5300);
				var btnpass01 = new Hilo.Bitmap({
					image:game.getImg('uimap'),
					rect:game.configdata.getPngRect('backbtn','uimap'),
					x:500,
					y:100
				}).addTo(this);
 				btnpass01.on(Hilo.event.POINTER_START, function(e) {
					game.switchScene(game.configdata.SCENE_NAMES.choice);
				});
			}
			this.checkBlocks();
			this.readyShakeTime++;
			
		},
	});
})(window.game);