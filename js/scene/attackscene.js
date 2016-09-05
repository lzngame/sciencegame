(function(ns) {
	var AttackScene = ns.AttackScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.attack,
		topHeadPanel:null,
		coinvaluebox: null,
		attackContainer: null,
		bottomContainer: null,
		monsterHpline:null,
		attackBtn: null,
		shieldBtn: null,
		
		hero:null,
		currentMonster:null,
		awardbox: null,
		pointdata:null,
		currentIndex: 2,
		
		monsterName:null,
		topHeight:null,
		attackStageHeight:null,
		lastmask:null,
		attentionPanel:null,
		
		windelayTime:0,
		isWin:false,
		
		isShowHand:false,
		showHandTime:0,
		flashHand:null,
		
		heroCurrentExp:0,
		heroCurrentUpExp:0,
		
		
		shakeTime:0,
		shakeLevel:4,
		initx:0,
		inity:0,
		toFallTime:0,
		
		fallfan:null,
		falllamp:null,
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
		shake:function(){
			var target = this;//this.attackContainer;
			var inity = target.y;
			var initx = target.x;
			Hilo.Tween.to(target, {
				y: inity + 10,
				//x:initx + 10,
			}, {
				duration: 30,
				ease: Hilo.Ease.Bounce.EaseOut,
				onComplete: function() {
					Hilo.Tween.to(target, {
						y: inity - 10,
						//x:initx - 10,
					}, {
						duration: 250,
						onComplete: function() {
							target.y = inity;
							//target.x = initx;
						}
					});
				}
			});
		},
		layoutBgMap:function(){
			var bg = new Hilo.Bitmap({
				image: game.getImg('bedroom_before'),
			}).addTo(this);
			var plug01 = new Hilo.Bitmap({
				image:game.getImg('objects'),
				rect:game.configdata.getObjectSize('plug01'),
				x:838,
				y:230
			}).addTo(this);
			
			this.fallfan = new game.FallObject({
				x:200,
				y:5,
				wholeState:'ceilingfan01',
				brokenState:'ceilingfan02'
			}).addTo(this);
			
			this.falllamp = new game.FallObject({
				x:500,
				y:-30,
				wholeState:'ceilinglamp01',
				brokenState:'ceilinglamp02'
			}).addTo(this);
			/*this.topHeadPanel = new game.TopHeadPanel({	
				width:this.width,
			});
			this.topHeight = this.topHeadPanel.height;
			this.attackStageHeight = 212;//this.height - this.topHeight;
			var img = game.getImg('bedroom_before');
			var imgs = this.pointdata.bgs;
			var maskGraphics = new Hilo.Graphics({
				width: this.width,
				height: this.attackStageHeight,
				y: this.topHeight
			});
			maskGraphics.lineStyle(1, "#000").beginFill("#000").drawRect(0, 0, maskGraphics.width, maskGraphics.height).endFill();

			this.attackContainer = new Hilo.Container({ 
				width: this.width,
				height: imgs.length * this.attackStageHeight,
				y:this.topHeight - this.currentIndex * this.attackStageHeight,
			}).addTo(this);
			for (var i = 0; i < imgs.length; i++) {
				var rect = game.configdata.getPngSize(imgs[i]);
				new Hilo.Bitmap({
					image: img,
					rect:rect,
					width:this.width,
					height:rect[3]*2,
					y: this.attackStageHeight * i
				}).addTo(this.attackContainer);
			}
			this.attackContainer.mask = maskGraphics;*/
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
		showBagInfo:function(){
			var scene = this;
			this.ignoreTouch = true;
			this.hideFlashHand();
			
			this.stop();
			this.ignoreTouch = true;
			var panel = new game.BagPanel({
				isinstore:false
			}).addTo(this);
			panel.refresh(game.userData.heroData.bagdata);
			panel.backBtn.on(Hilo.event.POINTER_START, function(e){
				this.removeFromParent();
				scene.ignoreTouch = false;
				scene.topHeadPanel.setTopItembox(game.userData.heroData);
				scene.play();
			});
		},
		hideFlashHand:function(){
			if(this.flashHand){
				this.flashHand.visible = false;
			}
			this.isShowHand = false;
			this.showHandTime = 0;
		},
		stop:function(){
			this.hero.stop();
			this.currentMonster.stop();
		},
		play:function(){
			this.hero.play();
			this.currentMonster.play();
		},
		layoutBottomUI:function(){
			var img = game.getImg('uimap');
			var rect = game.configdata.getPngSize('monstername');
			var h = this.height - this.topHeight;
			var y = h + this.currentIndex * h;
			this.bottomContainer = new Hilo.Container({
				width: rect[2],
				height: rect[3],
				y: this.height+36,
			}).addTo(this);
			var monsternamebg = new Hilo.Bitmap({
				image: img,
				rect: rect,
				width:rect[2],
				height:rect[3]
			}).addTo(this.bottomContainer);
			
			this.bottomContainer.x = this.width / 2 - this.bottomContainer.width / 2;
			
			this.monsterHpline = new game.HpBorderLine({
				w:this.bottomContainer.width/2,
				h:15,
				x:this.bottomContainer.width/4,
				y:-17,
			}).addTo(this.bottomContainer);
			
			
			var font = "14px arial";
			this.monsterName = new Hilo.Text({
				font: font,
                color:'white',
               	lineSpacing: 10,
                width:rect[2],
                height:rect[3],
				text: '',
				textAlign:'center'
			}).addTo(this.bottomContainer);
			this.monsterName.y = 3;//this.bottomContainer.height / 2;
			this.bottomContainer.visible = true;
			this.bottomContainer.y = this.height - 36;
			this.monsterName.text = this.pointdata.monsternames[this.currentIndex];

			var btndis = 100;
			this.shieldBtn = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('defend'),
			}).addTo(this);
			this.shieldBtn.y = this.topHeight + this.attackStageHeight + 10;
			this.shieldBtn.x = this.width / 2 - this.shieldBtn.width - btndis;

			this.attackBtn = new game.AttackBtn({
				img: img,
				cdtime:game.userData.heroData.attackCd,
			}).addTo(this);
			this.attackBtn.y = this.shieldBtn.y;
			this.attackBtn.x = this.width / 2 - this.attackBtn.width / 2 + btndis;
			
			this.lastmask = new Hilo.Bitmap({
				width:this.width,
				height:this.height,
				image:img,
				rect:game.configdata.getPngSize('bg022'),
				alpha:0.3,
				visible:false
			}).addTo(this);
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
		addFinialScore:function(){
			var rect = game.configdata.getPngSize('image308');
			var scene = this;
			var img = game.getImg('uimap');
			var score = new Hilo.Container({
				x:this.width/2 - rect[2]/2,
				y:-128,
			}).addTo(this);
			new Hilo.Bitmap({
				image:img,
				rect:rect
			}).addTo(score);
			var scorenum = game.userData.heroData.exp - this.heroCurrentExp;
			new game.NumFontBmp({
				txt: scorenum,
				sourceImg: img,
				prefix:'bitwhitenum',
				y: 95,
				x: 98,
			}).addTo(score);
			new Hilo.Tween.to(score,{
				y:108
			},{
				delay:500,
				duration:500,
				onComplete:function(){
					scene.lastmask.visible = true;
					new Hilo.Tween.to(scene.lastmask,{
						alpha:0.9
					},{
						delay:500,
						duration:1500,
						onComplete:function(){
							game.switchScene(game.configdata.SCENE_NAMES.failure);
						}
					});
				}
			});
		},
		addCharacter:function(monsterIndex,passIndex){
			if(monsterIndex < 1000){
				this.addMonster(monsterIndex,passIndex);
			}else{
				this.addNpc(monsterIndex,passIndex);
			}
		},
		addNpc:function(monsterIndex,passIndex){
			game.stage.off();
			this.currentMonster = new game.Npc({
				name: 'npc',
				x: 180,
				y: passIndex * this.attackStageHeight + 30,
				frames: game.configdata.getEffectFrames('hpman'),
				interval: 5,
			}).addTo(this.attackContainer);
			this.attentionPanel.show(game.configdata.GAMETXTS.touchme);
		},
		addAwardbox:function(){
			this.awardbox = new game.Goldbox({
				x: 290,
				y: this.currentIndex * this.attackStageHeight+132,
				frames: game.configdata.getEffectFrames('boxclose'),
			}).addTo(this.attackContainer);
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
		initTouchAttack:function(){
			var scene = this;
			game.stage.off();
			game.stage.on(Hilo.event.POINTER_START, function(e) {
				if(scene.ignoreTouch)
					return;
				console.log('touch state:attack');
				var stagex = e.stageX;
				var stagey = e.stageY;
				var posx = stagex - scene.x;
				var posy = stagey - scene.y;
				if (scene.checkoutrange(stagex, stagey)) {
					console.log('out range-- onstart:ignore move and moveend');
				} else {
					if (posx < scene.width / 2) {
						scene.hero.shield();
						scene.attackBtn.pause();
					} else {
						if (!scene.attackBtn.iscd) {
							scene.hero.attack();
							scene.attackBtn.startCd();
						} else {
							scene.attackBtn.warning();
						}
					}
				}
			});
		},
		initToucheventScroll:function(){
			var inity = 0;
			var scene = this;
			game.stage.off();
			game.stage.on(Hilo.event.POINTER_START, function(e) {
				if(scene.ignoreTouch)
					return;
				console.log('touch state: scroll');
				var stagex = e.stageX;
				var stagey = e.stageY;
				if (scene.checkoutrange(stagex, stagey,scene)) {
					console.log('out range-- onstart:ignore move and moveend');
				} else {
					var posx = stagex - scene.x;
					var posy = stagey - scene.y;
					inity = posy;
				}
			});
			var sumdy = 0;
			game.stage.on(Hilo.event.POINTER_MOVE, function(e) {
				if(scene.ignoreTouch)
					return;
				scene.hideFlashHand();
					
				var stagey = e.stageY;
				var posy = stagey - scene.y;
				var dy = posy - inity;
				sumdy += dy;
				if (Math.abs(sumdy) < 100) {
					scene.attackContainer.y += dy;
				}
				inity = posy;
			});
			game.stage.on(Hilo.event.POINTER_END, function(e) {
				if(scene.ignoreTouch)
					return;
				var stagey = e.stageY;
				
				
				
				var imgs = scene.pointdata.bgs;
				if (sumdy > 0 && scene.currentIndex > 0) {
					scene.currentIndex--;
					scene.hideFlashHand();
				} else if (sumdy < 0 && scene.currentIndex < imgs.length - 1) {
					scene.currentIndex++;
					scene.hideFlashHand();
				}
				
				var targety = scene.topHeight - scene.currentIndex * scene.attackStageHeight;
				Hilo.Tween.to(scene.attackContainer, {
					y: targety
				}, {
					duration: 1000,
					ease: Hilo.Ease.Cubic.EaseOut,
					onStart:function(e){
						game.stage.off();
					},
					onComplete: function(e) {
						scene.hero.y = scene.currentIndex * scene.attackStageHeight + 100;
						var monsterindex = scene.pointdata.monsters[scene.currentIndex];
						var state = scene.pointdata.state[scene.currentIndex];
						
						if(scene.flashHand){
							scene.flashHand.visible = false; 
						}
						if(state == 0){
							scene.initTouchAttack();
							scene.addCharacter(monsterindex,scene.currentIndex);
							scene.addAwardbox();
							var h = scene.height - this.topHeight;
							var y = h + scene.currentIndex * h -36;
							scene.bottomContainer.visible = true;
							scene.monsterName.text = scene.pointdata.monsternames[scene.currentIndex];
							Hilo.Tween.to(scene.bottomContainer, {
								y: scene.height - 36
							}, {
								duration: 500,
								ease: Hilo.Ease.Cubic.EaseOut,
								onComplete: function() {
									scene.attackBtn.visible = true;
									scene.shieldBtn.visible = true;
								}
							});
						}else{
							scene.initToucheventScroll();
						}
					}
				});
				sumdy = 0;
			});
		},
		checkoutrange:function(stagex, stagey) {
			return (stagey < (this.y + this.topHeight) || stagey > (this.y + this.height) || stagex < this.x || stagex > (this.x + this.width));
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
			
			if(this.isShowHand){
				this.showHandTime += game.clock.fpstick;
				if(this.showHandTime > 4500){
					//this.isShowHand = false;
					this.showHandTime = 0;
					var scene = this;
					scene.flashHand = new game.FlashHand({
						visible:true
					}).addTo(this);
				}
			}
		},
	});
})(window.game);