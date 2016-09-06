(function(ns) {
	var AttackScene = ns.AttackScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.attack,
		
		hero:null,
		currentMonster:null,
		awardbox: null,
		pointdata:null,
		currentIndex: 2,
		
		heroCurrentExp:0,
		heroCurrentUpExp:0,
		
		
		shakeTime:0,
		shakeLevel:4,
		initx:0,
		inity:0,
		toFallTime:0,
		
		fallfan:null,
		falllamp:null,
		
		blocks:null,
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
			this.pointdata = game.pointdata.getPointData(game.pointdata.doors[doorIndex].pointDataIndex);
			var obj = _.map(this.pointdata.state,function(x){return 0;});
			this.pointdata.state = obj;
			game.userData.heroData.activeDoorIndex = doorIndex;
			
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
 					console.log('Jum');
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herojump});
                }
              if(e && e.keyCode==18){ // alt 
 					console.log('squat');
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat});
 					scene.shakeRoom();
 					//scene.fallfan.isFall = true;
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
			//this.blocks = [[214,405,303,123]];//,[97,513,108,64],[95,577,98,177],[0,0,893,437],[893,437,124,67]];
			
			this.blocks = [[214,405,303,123],[97,513,108,64],[95,577,98,177],[0,0,893,437],[893,437,124,67]];
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
				g.lineStyle(1,"#998877").beginFill("#0ff").drawRect(0,0,w,h).endFill().addTo(this);
			}
		},
		checkBlocks:function(){
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				if(this.hero.speedx < 0 && Math.abs(this.hero.posx -(x+w) ) < 20  && (this.hero.posy > y && this.hero.posy < y+h)){
					this.hero.blockStop();
				}
				if(this.hero.speedx > 0 && Math.abs(this.hero.posx - x)< 20  && (this.hero.posy > y && this.hero.posy < y+h)){
					this.hero.speedx = 0;
					this.hero.speedy = 0;
					this.hero.targetx = this.hero.posx;
					this.hero.targety = this.hero.posy;
				}
				if(this.hero.speedy > 0 && Math.abs(this.hero.posy - y)< 5  && (this.hero.posx > x && this.hero.posx < x+w)){
					this.hero.speedx = 0;
					this.hero.speedy = 0;
					this.hero.targetx = this.hero.posx;
					this.hero.targety = this.hero.posy;
				}
				if(this.hero.speedy < 0 && Math.abs(this.hero.posy - (y+h))< 10  && (this.hero.posx > x && this.hero.posx < x+w)){
					this.hero.speedx = 0;
					this.hero.speedy = 0;
					this.hero.targetx = this.hero.posx;
					this.hero.targety = this.hero.posy;
				}
			}
		},
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.herosquat:
					console.log('hero squat');
					this.hero.speedx = this.hero.speedy = 0;
					this.hero.switchState('squat');
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
				case game.configdata.MSAGE_TYPE.useItem:
					var index = msg.msgdata;
					var data = shopdata[index];
					if(index == 10 || index == 11){
						game.userData.heroData.hp++;
						this.topHeadPanel.setHealth(game.userData.heroData.hp);
					}
					break;
			}
		},
		shakeRoom:function(){
			this.shakeTime = 200;
		},
		layoutBgMap:function(){
			var bg = new Hilo.Bitmap({
				image: game.getImg('bedroom_before'),
			}).addTo(this);
			
			this.initBlocks();
			var plug01 = new Hilo.Bitmap({
				image:game.getImg('objects'),
				rect:game.configdata.getObjectSize('plug01'),
				x:838,
				y:230
			}).addTo(this);
			
			this.fallfan = new game.FallObject({
				x:200,
				y:0,
				imgInity:-15,
				floorline:500,
				wholeState:'ceilingfan01',
				brokenState:'ceilingfan02'
			}).addTo(this);
			
			this.falllamp = new game.FallObject({
				x:500,
				y:0,
				imgInity:-5,
				floorline:450,
				wholeState:'ceilinglamp01',
				brokenState:'ceilinglamp02'
			}).addTo(this);
			
			
		},
		layoutUI:function(){
			var img =  game.getImg('uimap');
			this.coinvaluebox = new game.Showbox({
				img: img,
				hidey:this.topHeadPanel.height - 68,
				showy:this.topHeadPanel.height -34,
			}).addTo(this);
			
			this.attentionPanel = new game.AttentionPanel({
				x:this.width/2 - 118,
				width:this.width
			}).addTo(this);
			this.attentionPanel.y = this.topHeadPanel.height -this.attentionPanel.height,
			this.attentionPanel.inity = this.attentionPanel.y;
			this.topHeadPanel.addTo(this);
			
			var scene = this;
			this.topHeadPanel.checkBag.on(Hilo.event.POINTER_START,function(e){
				scene.showBagInfo();
			});
			this.topHeadPanel.headImg.on(Hilo.event.POINTER_START, function(e) {
				//scene.addAbilityPanel();
				scene.shake();
			});
		},
		initData:function(){
			var monsterindex = this.pointdata.monsters[this.currentIndex];
			this.addCharacter(monsterindex,this.currentIndex);
			this.hero.y = this.currentIndex * this.attackStageHeight + 100;
			this.addAwardbox();
			this.coinvaluebox.setCoinValue(game.userData.userInfo.goldcoinNum);
			game.userData.heroData.hp = game.userData.heroData.totalhp;
			this.topHeadPanel.initData(game.userData.heroData);
			this.monsterHpline.setValue(this.currentMonster.hp,this.currentMonster.hp);
			this.heroCurrentExp = game.userData.heroData.exp;
			this.heroCurrentUpExp = game.userData.heroData.exp;
		},
		addCharacter:function(monsterIndex,passIndex){
			if(monsterIndex < 1000){
				this.addMonster(monsterIndex,passIndex);
			}else{
				this.addNpc(monsterIndex,passIndex);
			}
		},
		addHero:function(){
			this.hero = new game.Hero({
				name: 'Hero',
				framename: 'idle',
				posx: 328,
				posy: 605,
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
				scene.hero.switchState('walk',5);
				var stagex = e.stageX;
				var stagey = e.stageY;
				var targetx = stagex - scene.x;
				var targety = stagey - scene.y;
				console.log('targetx:%d   targety:%d',targetx,targety);
				var disX = targetx - scene.hero.posx;
				var disY = targety - scene.hero.posy;
				var angle = Math.atan2(disY,disX);
				console.log(angle+":"+angle/Math.PI * 180);
				console.log('disx:%d  disy:%d',disX,disY);
				scene.hero.speedx = Math.cos(angle) *  scene.hero.speed ;
				scene.hero.speedy = Math.sin(angle) *  scene.hero.speed ;
				scene.hero.targetx = targetx;
				scene.hero.targety = targety;
				if(disX < 0)
					scene.hero.turnleft();
				else
					scene.hero.turnright();
				console.log('speedx:%f  speedy:%f',scene.hero.speedx,scene.hero.speedy);
				
			});
		},
		onUpdate:function(){
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
			this.toFallTime++;
			if(this.toFallTime == 1000){
				this.fallfan.isFall = true;
			}
			if(this.toFallTime == 1200){
				this.falllamp.isFall = true;
			}
			
			this.checkBlocks();
		},
	});
})(window.game);