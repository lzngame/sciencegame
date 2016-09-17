(function(ns) {
	var ChoiceScene = ns.ChoiceScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.choice,
		hero:null,
		
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
		
		blocks:null,
		
		passstep:0,
		
		warnpaper:null,
		tasktxt:null,
		constructor: function(properties) {
			ChoiceScene.superclass.constructor.call(this, properties);
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
			game.stage.swapChildren(this, game.uiscene);
			this.currentIndex = 0;
			
			this.layoutBgMap();
			//this.layoutUI();
			this.addHero();
			//this.layoutBottomUI();
			//this.initTouchAttack();
			//this.initData();
			//this.hideFlashHand();
			this.initTouchEvent();
			
		},
		initBlocks:function(){
			this.blocks = [[0,0,1200,400],[0,455,140,250],[1143,386,36,152],[1166,542,37,146]];
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
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.annihilator)){
				this.hero.switchState('handon',10);
				var scene = this;
				game.notepanel.show(true,game.configdata.GAMETXTS.pass03_wrong,200);
				new Hilo.Tween.to(this,{
					alpha:0.99
				},{
					duration:2000,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.lift);
					}
				});
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.doorhandler)){
				this.hero.switchState('handon',10);
				var scene = this;
				game.notepanel.show(true,game.configdata.GAMETXTS.pass03_right,200);
				new Hilo.Tween.to(this,{
					alpha:0.99
				},{
					duration:3000,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.runaway);
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
					break;
			}
		},
		
		layoutBgMap:function(){
			var scene = this;
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('corridor'),
			}).addTo(this);
			
			this.initBlocks();
			//lift
			this.annihilator  = new game.ActiveObject({
				x:1173,
				y:380,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,70,50],
				status:1,
				//visible:false,
			}).addTo(this);
			

			this.doorhandler  = new game.ActiveObject({
				x:725,
				y:219,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[9,0,40,40],
				status:1,
			}).addTo(this);
			
			this.warnpaper = new Hilo.Bitmap({
				x:952,
				y:557,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('warnpaper02','uimap')
			}).addTo(this);
			
			this.tasktxt = new game.TaskLine({
				txt:'给标志牌钉钉子',
				x:932,
				y:112,
			}).addTo(this);
		},
		addHero:function(){
			this.hero = new game.Hero({
				name: 'Hero',
				framename: 'idle',
				posx: 383,
				posy: 420,
				atlas:game.monsterdata.soliderhero_atlas,
				once: false,
				interval: 5,
				alpha:1,
			}).addTo(this);
		},
		excuteIcon:function(index){
			if(index == 2){
				console.log('使用物品：%d',index);
				if(this.warnpaper.x != 1042){
					if(game.checkInRect(this.hero.posx,this.hero.posy,this.warnpaper.x,this.warnpaper.y,120,60)){
						game.toolspanel.show(false,0);
						this.warnpaper.x = 1042;
						this.warnpaper.y = 204;
						this.tasktxt.hide();
						this.warnpaper.setImage(game.getImg('uimap'),game.configdata.getPngRect('warnpaper01','uimap'));
					}else{
						game.notepanel.show(true,'请站在合适的位置',200);
					}
				}
			}
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
			if(this.readyShakeTime == 50){
				game.notepanel.show(true,game.configdata.GAMETXTS.pass03_ask,200);
			}
			
			
			
			this.readyShakeTime++;
			
			
			
			
			this.checkBlocks();
		},
	});
})(window.game);