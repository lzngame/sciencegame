(function(ns) {
	var RepairScene = ns.RepairScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.repairdepot,
		ladder:null,
		cloud1:null,
		cloud2:null,
		cloud3:null,
		cloud4:null,
		railing:null,
		ladderObj:null,
		car:null,
		bgHeight:1373,
		ladderpartOnwall:null,
		ladderpart:null,
		ladderState:0,
		tyreOnfloor:null,
		hammeronfloor:null,
		jack:null,
		jackcover:null,
		workjack:null,
		isworkjack:false,
		workjackObj:null,
		clickTyreobj:null,
		crowfoot:null,
		isUpladder:false,
		isDownladder:false,
		isSecondfloor:false,
		isHammeronhand:false,
		isLadderpartonhand:false,
		isCrowfootonhand:false,
		carForjack:null,
		ladderfloorY:0,
		ladderFloorX:0,
		topladderX:973,
		topladderY:812,
		topMoveladderX:943,
		topMoveladderY:830,
		targets:[],
		currentTarget:null,
		dog:null,
		dogangrytime:0,
		dogstate:'dogidle',
		snail:null,
		snailtime:0,
		snailstate:'',
		bee:null,
		beeclickobj:null,
		ropebone:null,
		beefly:false,
		currentOnhandObj:null,
		initHerox:100,
		initHeroy:1300,
		picbg:null,
		picclickobj:null,
		incarobj:null,
		
		passPaneleBg:null,
		btns:null,
		tyrelamp:null,
		passPanel:null,
		leftLamp:null,
		rightLamp:null,
		carfinger:null,
		constructor: function(properties) {
			RepairScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = 2404;
			this.height = game.configdata.mainStageSize.height;
			this.x = 0;
			this.y = 0;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
		},
		active: function(passdata) {
			console.log('%s active:', this.name);
			var scene = this;
			this.width = 2404;
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks = [];
			this.initBlocks(this.blocks);
			this.layoutBgMap();
			this.addHero(passdata[0],this.initHerox,this.initHeroy);
			this.hero.posx = this.initHerox;
			this.hero.posy = this.initHeroy;
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			this.layoutPassPanel();
			game.boydata.currentHp = 4;
			game.headPanel.setHp(game.boydata.currentHp);
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.ladderObj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.ladderpartOnwall)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.hammeronfloor)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.crowfoot)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.jack)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.carForjack)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.workjackObj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.clickTyreobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.beeclickobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.picclickobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.incarobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.tyreOnfloor)
			){
				return true;
			}else{
				return false;
			}
		},
		receiveMsg: function(msg) {
			
		},
		putProp:function(){
			this.hero.putProp();
			this.isHammeronhand = false;
			this.isLadderpartonhand = false;
			this.currentOnhandObj = null;
		},
		gotoLadder:function(){
			this.ignoreTouch = true;
			var targetx = this.ladderObj.x + 60;
			var targety = this.ladderObj.y + 576;
			if(this.hero.posx == targetx && this.hero.posy == targety){
				return;
			}
			var scene = this;
			scene.hero.switchState('turn180',10);
			//scene.putProp();
			var targetx = this.ladderObj.x + 60;
			var targety = this.ladderObj.y + 576;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.switchState('idle',10);
						scene.ignoreTouch = false;
					}
				});
		},
		addLadderPart:function(){
			var scene = this;
			scene.hero.switchState('turn180',10);
			scene.ignoreTouch = true;
			scene.putProp();
			var targetx = this.ladderObj.x + 60;
			var targety = this.ladderObj.y + 576;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.switchState('idleback',10);
						scene.ladderpart.visible = true;
						scene.ladderpart.y = 983+177;
						scene.ladderpart.x = 1075-182+50;
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:500,
							onComplete:function(){
								scene.hero.switchState('handup',10);
								scene.ladderpart.y = 983+100;
								scene.ladderState = 1;
								new Hilo.Tween.to(scene.hero,{
									posx:targetx,
									posy:targety,
									scaleX:1,
									scaleY:1,
								},{
									duration:120,
									delay:620,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.ignoreTouch = false;
									}
								});
							}
						})
				);
		},
		addTyre:function(){
			var scene = this;
			scene.hero.switchState('turn180',10);
			scene.ignoreTouch = true;
			scene.putProp();
			var targetx = this.clickTyreobj.x + 10;
			var targety = this.clickTyreobj.y + 166;
			scene.car.isTyreOncar = true;
			scene.rightLamp.setImage(game.getImg('uimap'),game.configdata.getPngRect('meter02','uimap'));
			
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.switchState('idleback',10);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:500,
							onComplete:function(){
								
								scene.car.tyreimg.visible = true;
								new Hilo.Tween.to(scene.hero,{
									posx:355,
									posy:1260,
									scaleX:1,
									scaleY:1,
								},{
									duration:120,
									delay:620,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.ignoreTouch = false;
									}
								});
							}
						})
				);
		},
		repairLadder:function(){
			var scene = this;
			scene.hero.switchState('turn180',10);
			scene.ignoreTouch = true;
			scene.putProp();
			var targetx = this.ladderObj.x + 60;
			var targety = this.ladderObj.y + 576;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
				}, {
					duration: 50,
					onComplete: function() {
						scene.hero.switchState('idleback',10);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:500,
							onComplete:function(){
								scene.hero.switchState('knockladder',10);
								game.sounds.play(23,true);
								new Hilo.Tween.to(scene.hero,{
									posx:targetx,
									posy:targety,
									scaleX:1,
									scaleY:1,
								},{
									duration:1120,
									delay:2000,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										game.sounds.stop(23);
										scene.ladderState = 2;
										scene.isHammeronhand = false;
										scene.ignoreTouch = false;
										new Hilo.Bitmap({
											image:game.getImg('uimap'),
											rect:game.configdata.getPngRect('hammeronfloor','uimap'),
											x:scene.hero.posx + 100,
											y:scene.hero.posy + 50,
											
										}).addTo(scene);
									}
								});
							}
						})
				);
		},
		putdownProp:function(obj,x,y,onCall){
			var scene = this;
			scene.putProp();
			scene.ignoreTouch = true;
			scene.hero.switchState('turn180',10);
			//var targetx = obj.x + obj.targetx;
			//var targety = obj.y + obj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					//posx:targetx,
					//posy:targety,
					scaleX:1,
					scaleY:1,
				}, {
					duration: 60,
					onComplete: function() {
						scene.hero.switchState('idleback',5);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:200,
							onComplete:function(){
								scene.hero.switchState('backpick',8);
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
									scaleX:1,
									scaleY:1,
									
								},{
									duration:60,
									delay:320,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.ignoreTouch = false;
										scene.putProp();
										obj.visible = true;
										obj.status = 1;
										obj.x = x;
										obj.y = y;
										if(onCall)
											onCall();
									}
								});
							}
						})
				);
		},
		pickProp:function(pickProp,obj,x,y,onCall){
			var scene = this;
			scene.ignoreTouch = true;
			scene.hero.switchState('turn180',10);
			scene.currentOnhandObj = obj;
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:obj.scaleFact,
					scaleY:obj.scaleFact,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.switchState('idleback',10);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:500,
							onComplete:function(){
								scene.hero.switchState('backpick',10);
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
									scaleX:1,
									scaleY:1,
									
								},{
									duration:120,
									delay:620,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.hero.takeProp(pickProp,x,y);
										scene.ignoreTouch = true;
										obj.visible = false;
										obj.status = 2;
										if(onCall)
											onCall();
									}
								});
							}
						})
				);
		},
		takeJack:function(scaleFact,pickProp,obj,x,y,onCall){
			var scene = this;
			scene.hero.switchState('takeRightobj',6);
			new Hilo.Tween.to(scene.hero, {
					alpha:1,
				}, {
					duration: 120,
					delay:300,
					onComplete: function() {
						scene.hero.takeProp('jackonhand',50,170);
						scene.jack.setEndImg();
						scene.jack.status = 2;
						scene.hero.switchState('idle',10);
					}
				}).link(
					new Hilo.Tween.to(scene.hero, {
						scaleX:1,
						scaleY:1,
						posx:355,
						posy:1260,
					}, {
						duration: 120,
						delay:400,
						onComplete: function() {
							
						}
					})
				);
		},
		pryBox:function(scaleFact,pickProp,obj,x,y,onCall){
			var scene = this;
			scene.ignoreTouch = true;
			scene.hero.switchState('turn180',10);
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:scaleFact,
					scaleY:scaleFact,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.switchState('idleback',10);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:500,
							onComplete:function(){
								scene.hero.switchState('prybox',20);
								scene.jackcover.isOpen = true;
								new Hilo.Tween.to(scene.hero,{
									alpha:1,
								},{
									duration:1220,
									delay:720,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.jack.state = 2;
										scene.crowfoot.x = 500;
										scene.crowfoot.y = 1000;
										scene.crowfoot.visible = true;
										scene.crowfoot.status = 1;
										scene.ignoreTouch = false;
										if(onCall)
											onCall();
									}
								});
							}
						})
				);
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.ladderObj)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.ignoreTouch = true;
				if(this.hero.posx < 470){
					if(this.isLadderpartonhand){
						this.addLadderPart();
					}else{
						if(this.currentOnhandObj){
							if(this.currentOnhandObj.name != 'hammer'){
								this.sayNo();
							}else{
								this.gotoLadder();
								this.ignoreTouch = false;
							}
						}else{
							this.gotoLadder();
						}
					}
				}else{
					if(!this.isSecondfloor){
						if(this.currentOnhandObj !== null){
							if(this.currentOnhandObj.name == 'hammer'){
								if(this.ladderState == 1){
									this.repairLadder();
								}else{
									this.sayNo();
								}
							}else if(this.currentOnhandObj.name == 'ladderpart'){
								this.addLadderPart();
							}else if(this.currentOnhandObj.name == 'crowfoot'){
								this.currentOnhandObj.scaleFact = 1;
								this.putdownProp(this.currentOnhandObj,this.hero.posx-70,this.hero.posy-40);
							}else if(this.currentOnhandObj.name == 'tyre'){
								this.currentOnhandObj.scaleFact = 1;
								this.putdownProp(this.currentOnhandObj,this.hero.posx-200,this.hero.posy-120);
							}
						}else{
							if(this.ladderState ==2 && this.hero.posx > 570){
								this.isUpladder = true;
								this.hero.switchState('upladder',6);
							}else if(this.hero.posx > 570){
								this.hero.switchState('fallladder',10);
								if(this.ladderState == 1){
									this.ladderpart.visible = false;
									this.ladderpartOnwall.x = 1080;
									this.ladderpartOnwall.y = 1200;
									this.ladderpartOnwall.status = 1;
									this.ladderpartOnwall.visible = true;
									this.ladderpartOnwall.scaleFact = 0.9;
									this.ladderpartOnwall.setEndImg();
									this.ladderState = 0;
									this.swapChildren(this.dog,this.ladderpartOnwall);
								}
							}
						}
					}else{
						this.isDownladder = true;
						this.hero.posx = this.topMoveladderX;
						this.hero.posy = this.topMoveladderY;
						this.hero.switchState('downTopladder',6);
						if(this.currentOnhandObj){
							this.hero.hand.visible = false;
							this.hero.prop.y = 60;
							this.hero.swapChildren(this.hero.body,this.hero.prop);
						}
					}
				}
				
					
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.tyreOnfloor)){
				if(!this.checkFinger(-1)){
					return false;
				}
				if(this.dogstate != 'dogeat'){
					this.setDogstate('dogangry');
					game.sounds.play(22,true);
					this.sayNo();
				}else{
					if(!this.currentOnhandObj){
						this.pickProp('tyreoncar',this.tyreOnfloor,30,120);
					}else{
						this.sayNo();
					}
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.carForjack)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.carForjack.status = 2;
				this.putProp();
				this.hero.switchState('takebackput',6);
				var scene = this;
				new Hilo.Tween.to(this, {
					alpha:1
					}, {
					duration: 120,
					delay:300,
					onComplete: function() {
						scene.workjack.visible = true;
					},
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.crowfoot)){
				if(!this.checkFinger(-1)){
					return false;
				}
				if(this.hero.posx > 700){
					this.swapChildren(this.hero,this.railing);
					this.pickProp('crowfootonhand',this.crowfoot,50,184,function(){scene.swapChildren(scene.railing,scene.hero);});
				}else{
					this.pickProp('crowfootonhand',this.crowfoot,50,184);
				}
				var scene = this;
				this.isCrowfootonhand = true;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.workjackObj)){
				if(!this.checkFinger(-1)){
					return false;
				}
				if(this.hero.posx > 570){
					this.sayNo();
					return true;
				}
				
				if(this.workjackObj.state == 1){
					if(this.currentOnhandObj && this.currentOnhandObj.name == 'crowfoot'){
						this.ignoreTouch = true;
						this.hero.switchState('upjack',10);
						this.car.isUp = true;
						this.workjack.isUp = true;
						this.workjackObj.state = 2;
						this.isworkjack = false;
						this.putProp();
						this.crowfoot.status = 1;
						this.crowfoot.scaleFact = 1;
					}else{
						this.sayNo();
					}
				}else if(this.workjackObj.state == 2){
					var scene = this;
					if(this.currentOnhandObj && this.currentOnhandObj.name == 'crowfoot'){
						//this.hero.prop.visible = this.hero.hand.visible = false;
						this.putProp();
						this.crowfoot.visible = true;
						this.crowfoot.x = this.hero.posx -120;
						this.crowfoot.y = this.hero.posy - 40;
						this.crowfoot.status = 1;
					}
					this.hero.switchState('takebackputjack',6);
					this.car.isDescend = true;
					this.workjack.isUp = false;
					this.workjackObj.state = 1;
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.clickTyreobj)){
				if(!this.checkFinger(-1)){
					return false;
				}
				if(this.currentOnhandObj && this.currentOnhandObj.name =='tyre' && this.car.index == 8){
					this.addTyre();
					this.clickTyreobj.status = 2;
				}else{
					this.sayNo();
				}
				
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.hammeronfloor)){
				if(!this.checkFinger(-1)){
					return false;
				}
				if(this.currentOnhandObj != null){
					var putx = 40;
					var puty = -40;
					if(this.currentOnhandObj.name == 'ladderpart'){
						this.currentOnhandObj.setEndImg();
						this.currentOnhandObj.scaleFact = 1;
					}
					if(this.hero.posx > 700){
						putx = 125;
						puty = -60;
					}
					this.putdownProp(this.currentOnhandObj,this.hero.posx+putx,this.hero.posy+puty);
					return true;
				}
				this.pickProp('hammeronhand',this.hammeronfloor,43,170);
				this.isHammeronhand = true;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.ladderpartOnwall)){
				if(!this.checkFinger(-1)){
					return false;
				}
				if(this.currentOnhandObj != null){
					var putx = 0;
					var puty = -80;
					this.currentOnhandObj.scaleFact = 1;
					
					if(this.hero.posx > 700){
						putx = 110;
						puty = -20;
					}
					this.putdownProp(this.currentOnhandObj,this.hero.posx+putx,this.hero.posy+puty);
					return true;
				}
				this.isLadderpartonhand = true;
				this.pickProp('ladderpart',this.ladderpartOnwall,32,170);
				
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.jack)){
				if(!this.checkFinger(-1)){
					return false;
				}
				if(this.jack.state== 0 && (!this.currentOnhandObj || this.currentOnhandObj.name != 'crowfoot')){
					this.sayNo();
					return true;
				}
				if(this.jack.state !=2){
					if(this.isCrowfootonhand){
						this.putProp();
						this.pryBox(0.7,'jackonhand',this.jack,43,170);
						this.crowfoot.status = 1;
					}else{
						this.hero.switchState('nocan',8);
					}
				}else{
					this.takeJack();
					this.currentOnhandObj = this.workjack;
					this.crowfoot.status = 1;
					this.carForjack.status = 1;
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.beeclickobj)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.targets = [[661,205],[640,305],[600,405],[640,524]];
				this.currentTarget = [661,205];
				
				console.log('click bee');
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.picclickobj)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.picbg.visible = true;	
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.incarobj)){
				if(!this.checkFinger(-1)){
					return false;
				}
				
				this.passPaneleBg.visible = true;	
				this.ignoreTouch = true;
				return true;
			}
			
			
			return false;
		},
		setDogstate:function(statename){
			var dogframe = game.monsterdata.soliderhero_atlas.getSprite(statename);
			this.dog._frames = dogframe;
			this.dogstate = statename;
		},
		layoutBgMap:function(){
			var scene = this;
			new Hilo.Bitmap({
				image:game.getImg('skeybg')
			}).addTo(this);
			this.cloud1 = new Hilo.Bitmap({
				image:'img/cloud1.png',
				x:1100,
				y:230,
			}).addTo(this);
			this.cloud2 = new Hilo.Bitmap({
				image:'img/cloud2.png',
				x:500,
				y:140,
			}).addTo(this);
			this.cloud3 = new Hilo.Bitmap({ 
				image:'img/cloud3.png',
				x:800,
				y:430,
			}).addTo(this);
			this.cloud4 = new Hilo.Bitmap({
				image:'img/cloud4.png',
				x:1200,
				y:540,
			}).addTo(this);
			this.bgImg = new Hilo.Bitmap({
				image:game.getImg('repairdepotbg')
			}).addTo(this);
			
			this.ladder = new Hilo.Bitmap({
				image:'img/ladder.png',
				x:1075-182,
				y:983-257,
			}).addTo(this);
			
			this.ladderpart = new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('ladderpart','uimap'),
				x:1075-182+50,
				y:983+87,
				visible:false,
			}).addTo(this);
			
			this.crowfoot  = new game.ActiveObject({
				name:'crowfoot',
				x:640,
				y:680,
				targetx:30,
				targety:10,
				readyImgUrl:'crowfootonhand',
				finishedImgUrl:'crowfootonhand',
				clickArea:[0,0,90,20],
				status:1,
			}).addTo(this);
			this.crowfoot.scaleFact = 0.8;
			
			this.railing = new Hilo.Bitmap({
				image:'img/railing.png',
				x:557,
				y:298,
			}).addTo(this);
			
			
			this.workjack = new game.WorkJack({
				x:376,
				y:1204,
				visible:false,
			}).addTo(this);
			this.workjackObj  = new game.ActiveObject({
				x:376,
				y:1204,
				targetx:0,
				targety:40,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[30,0,40,40],
				state:1,
				status:1,
			}).addTo(this);
			
			this.picclickobj  = new game.ActiveObject({
				x:1078,
				y:480,
				targetx:0,
				targety:40,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,40,40],
				status:1,
			}).addTo(this);
			
			this.incarobj  = new game.ActiveObject({
				x:210,
				y:1083,
				targetx:0,
				targety:40,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,60,60],
				status:1,
			}).addTo(this);
			
			this.beeclickobj  = new game.ActiveObject({
				x:661,
				y:205,
				targetx:0,
				targety:40,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,40,40],
				status:1,
			}).addTo(this);
			
			this.clickTyreobj  = new game.ActiveObject({
				x:436,
				y:1094,
				targetx:0,
				targety:40,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[30,30,80,80],
				status:1,
			}).addTo(this);
			
			this.car = new game.DepotCar({
				x:10,
				y:900+83
			}).addTo(this);
			
			
			
			
			this.ladderObj  = new game.ActiveObject({
				x:1075-182,
				y:983-277,
				targetx:1050,
				targety:1350,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[30,30,130,530],
				status:1,
			}).addTo(this);
			
			this.carForjack  = new game.ActiveObject({
				x:325,
				y:1166,
				targetx:230,
				targety:350,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,130,40],
				status:2,
			}).addTo(this);
			
			this.ladderpartOnwall  = new game.ActiveObject({
				name:'ladderpart',
				x:600-223,
				y:453+468,
				targetx:10,
				targety:40,
				readyImgUrl:'ladderpart01',
				finishedImgUrl:'ladderpart',
				clickArea:[0,0,80,20],
				status:1,
			}).addTo(this);
			this.ladderpartOnwall.scaleFact = 0.7;
			
			this.tyreOnfloor  = new game.ActiveObject({
				name:'tyre',
				x:690,
				y:1100,
				targetx:30,
				targety:80,
				readyImgUrl:'tyreonfloordog',
				finishedImgUrl:'tyreonfloordog',
				clickArea:[30,0,80,50],
				status:1,
			}).addTo(this);
			this.tyreOnfloor.scaleFact = 0.9;
			
			this.jack  = new game.ActiveObject({
				x:500,
				y:950,
				targetx:30,
				targety:80,
				readyImgUrl:'jackinbox',
				finishedImgUrl:'jackemptybox',
				clickArea:[40,20,80,50],
				status:1,
			}).addTo(this);
			
			this.jackcover = new game.JackBoxCover({
				x:536,
				y:960,
			}).addTo(this);
			
			this.hammeronfloor  = new game.ActiveObject({
				name:'hammer',
				x:90,
				y:1230,
				targetx:30,
				targety:30,
				readyImgUrl:'hammeronfloor',
				finishedImgUrl:'hammeronfloor',
				clickArea:[10,0,80,20],
				status:1,
			}).addTo(this);
			this.hammeronfloor.scaleFact = 0.9;
			
			this.ladderFloorX = this.ladderObj.x + 60;
			this.ladderFloorY = this.ladderObj.y + 576;
			
			this.dog = new Hilo.Sprite({
				frames: game.monsterdata.soliderhero_atlas.getSprite('dogidle'),
				x:553,
				y:953,
				interval:8,
			}).addTo(this);
			
			this.snail = new Hilo.Sprite({
				frames: game.monsterdata.soliderhero_atlas.getSprite('snailidle'),
				x:850,
				y:953,
				interval:148,
				pivotY:38
			}).addTo(this);
			this.snail.on(Hilo.event.POINTER_START, function(e) {
				this._frames = game.monsterdata.soliderhero_atlas.getSprite('snailtouch');
				this.loop = false;
				this.speed = 0;
			});
			this.snail.speed = 0.09;
			this.snail.sumtime = 0;
			this.snail.direct = -1;
			
			this.bee = new game.Bee({
				frames: game.monsterdata.soliderhero_atlas.getSprite('bee'),
				posx:553,
				posy:833,
				interval:4,
			}).addTo(this);
			
			this.bee.on(Hilo.event.POINTER_START, function(e) {
				console.log('click bee');
			});
			
			this.targets = [[553,833],[500,900],[30,220],[661,205]];
			this.currentTarget = [553,833];
			
			this.ropebone = new game.Ropebone({
				x:662,
				y:434
			}).addTo(this);
		},
		layoutPassPanel:function(){
			this.picbg = new Hilo.Bitmap({ 
				image:'img/picbg.png',
				visible:false,
			}).addTo(this);
			this.picbg.on(Hilo.event.POINTER_START, function(e) {
				this.visible = false;
			});
			this.passPaneleBg = new Hilo.Container({
				visible:false,
			}).addTo(this);
			new Hilo.Bitmap({ 
				image:'img/incarbg.png',
			}).addTo(this.passPaneleBg);
			new Hilo.Bitmap({ 
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('meter04','uimap'),
				x:260,
				y:336,
			}).addTo(this.passPaneleBg);
			this.rightLamp = new Hilo.Bitmap({ 
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('meter01','uimap'),
				x:410,
				y:330,
			}).addTo(this.passPaneleBg);
			this.btns = new Hilo.Container({
				x:839,
				y:517
			}).addTo(this.passPaneleBg);
			for(var i=0;i<12;i++){
				var index = Math.floor(Math.random()*3);
				var space = 33;
				var btn = new game.PasslampBtn({
					index:index,
					x:i%3 * space,
					y:Math.floor(i/3)*space
				}).addTo(this.btns);
			}
			this.carfinger = new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('hand_001','uimap'),
				visible:false,
			}).addTo(this.passPaneleBg);
			
			this.passPaneleBg.on(Hilo.event.POINTER_START, function(e) {
				if(e.stageY < 300 && this.visible){
					this.visible = false;
					this.parent.ignoreTouch = false;
				}
				var stagex = e.stageX;
				var stagey = e.stageY;
				if(game.checkInRect(stagex,stagey,690,526,60,100)){
					if(this.parent.checkPass() && this.parent.car.isTyreOncar && this.parent.car.index ==0){
						game.headPanel.sayYes();
					}else{
						game.headPanel.sayNo();
					}
				}
			});
			var scene = this;//690,526,747,605
			this.passPaneleBg.on(Hilo.event.POINTER_MOVE, function(e) {
				var stagex = e.stageX;
				var stagey = e.stageY;
				var targetx = stagex - scene.x;
				var targety = stagey - scene.y;
				if(game.checkInRect(stagex,stagey,690,526,60,100)){
					console.log('---------------------------');
					scene.carfinger.visible = true;
					scene.carfinger.x = stagex+10;
					scene.carfinger.y = stagey+10;
				}else{
					scene.carfinger.visible = false;
				}
				
			});
		},
		checkPass:function(){
			var answer = [1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 0, 2];
			var btns = this.btns.children;
			for(var i=0;i<btns.length;i++){
				var num = btns[i].index;
				if(num != answer[i]){
					return false;
				}
			}
			return true;
		},
		cloudMove:function(){
			this.cloud1.x -= 0.5;
			this.cloud2.x -= 1;
			this.cloud3.x -= 0.6;
			this.cloud4.x -= 0.8;
			if(this.cloud1.x <-415){
				this.cloud1.x = 1200;
			}
			if(this.cloud2.x <-341){
				this.cloud1.x = 1200;
			}
			if(this.cloud3.x <-590){
				this.cloud3.x = 1200;
			}
			if(this.cloud4.x <-389){
				this.cloud4.x = 1200;
			}
		},
		startTargetsWalk:function(){
			this.currentTarget = this.targets.shift();
			this.beewalk(this.currentTarget[0],this.currentTarget[1]);
		},
		beewalk:function(targetx,targety){
			var disX = targetx - this.bee.posx;
			var disY = targety - this.bee.posy;
			var angle = Math.atan2(disY,disX);
			this.bee.speedx = Math.cos(angle) *  this.bee.speed ;
			this.bee.speedy = Math.sin(angle) *  this.bee.speed ;
			this.bee.targetx = targetx;
			this.bee.targety = targety;
			if(disX < 0)
				this.bee.turnleft();
			else
				this.bee.turnright();
		},
		moveTargets:function(){
			if(this.currentTarget){
				if(Math.abs(this.bee.posx - this.currentTarget[0]) <= 3 && Math.abs(this.bee.posy - this.currentTarget[1]) <= 3){
					if(this.targets.length > 0){
						this.startTargetsWalk();
					}else{
						this.currentTarget = null;
					}
				}
			}
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.currentOnhandObj ==null){
				this.hero.switchState('nocan',10);
			}
		},
		onUpdate:function(){
			this.y = (600 - this.hero.posy);
			if(this.y >= 0)
				this.y = 0;
			if(this.y < (game.configdata.MAXSIZE.maxHeight -this.bgHeight)){
				this.y = game.configdata.MAXSIZE.maxHeight -this.bgHeight;
			}
			this.checkBlocks();
			this.cloudMove();
			this.moveTargets();
			
			if(this.isUpladder){
				if(this.hero.posy <= 856){
					this.isUpladder = false;
					this.hero.switchState('onTopladder',10);
					this.isSecondfloor = true;
					this.hero.posx = this.topladderX;
					this.hero.posy = this.topladderY;
					console.log('%d : %d',this.hero.posx,this.hero.posy);
					this.ignoreTouch = false;
				}
			}
			if(this.isDownladder){
				if(this.hero.posy >= this.ladderFloorY){
					this.isDownladder = false;
					this.hero.switchState('idle',10);
					this.hero.posx = this.ladderFloorX;
					this.hero.posy = this.ladderFloorY;
					this.isSecondfloor = false;
					this.ignoreTouch = false;
					this.hero.prop.y = 184;
					if(this.currentOnhandObj){
						this.hero.hand.visible = true;
						this.hero.swapChildren(this.hero.body,this.hero.prop);
					}
				}
			}
			
			if(this.car.index == 8 && !this.isworkjack){
				this.isworkjack = true;
				
				this.hero.switchState('idle',10);
				this.crowfoot.x = this.hero.posx-100;
				this.crowfoot.y = this.hero.posy -30;
				this.crowfoot.visible = true;
			}
			
			
			if(this.bee.posx ==640 && this.bee.posy == 524 && !this.ropebone.change){
				this.ropebone.addbee = true;
				this.ropebone.bee.visible = true;
				this.bee.visible = false;
			}
			if(this.ropebone.y >800 && !this.bee.visible){
				game.sounds.play(24,false);
				this.bee.visible = true;
				this.bee.posx = 640;
				this.bee.posy = 800;
				this.targets = [[640,800],[500,900],[30,220],[661,205]];
				this.currentTarget = [640,800];
				this.setDogstate('dogeat');
			}
			
			if(this.dogstate=='dogangry'){
				this.dogangrytime++;
				if(this.dogangrytime > 100){
					this.dogangrytime = 0;
					this.setDogstate('dogidle');
					game.sounds.stop(22);
				}
			}
			
			this.picbg.y = (this.y * -1);
			this.passPaneleBg.y = (this.y * -1);
			
			if(this.hero.framename == 'idle' && !this.passPaneleBg.visible){
				this.ignoreTouch = false;
			}
			
			if(this.snail.y < 900){
				this.snail.scaleY = -1;
				this.snail.direct = 1;
			}
			if(this.snail.y > 1000){
				this.snail.scaleY = 1;
				this.snail.direct = -1;
			}
			if(this.snail.speed == 0){
				this.snail.sumtime++;
				if(this.snail.sumtime > 50){
					this.snail.sumtime = 0;
					this.snail.speed = 0.09;
					this.snail.loop = true;
					this.snail._frames = game.monsterdata.soliderhero_atlas.getSprite('snailidle');
				}
			}
			this.snail.y += (this.snail.speed * this.snail.direct);
		},
	});
})(window.game);