(function(ns) {
	var TyphoonRoomScene = ns.TyphoonRoomScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.typhoon_room,
		helpnote:'img/notes/typhoon/typhoon3help.png',
		
		flowerpot_s:null,
		flowerpot_m:null,
		flowerpot_l:null,
		flowerpot_pos_s:null,
		flowerpot_pos_m:null,
		flowerpot_pos_l:null,
		flowerImgm:null,
		flowerImgs:null,
		flowerImgl:null,
		bucket:null,
		fullbucket:null,
		hammer:null,
		board:null,
		thewindow:null,
		breakwindow:null,
		closewindow:null,
		scene:null,
		initPosx:650,
		initPosy:590,
		currentOnhandObj:null,
		currentOnhandImg:null,
		
		isFlower_s:false,
		isFlower_m:false,
		isFlower_l:false,
		isFullbucket:false,
		isClosewindow:false,
		isRepairwindow:false,
		boardState:0,
		boardTime:0,
		closeWindowMan:null,
		openWaterMan:null,
		atlas:null,
		constructor: function(properties) {
			TyphoonRoomScene.superclass.constructor.call(this, properties);
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
			this.scene = this;
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks = [];
			this.initBlocks(this.blocks);
			this.layoutBgMap();
			//this.addHero(passdata[0],this.initPosx,this.initPosy);
			this.addHero(null,this.initPosx,this.initPosy);
			
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			
			game.sounds.play(14,true);
			game.boydata.currentHp = 4;
			game.headPanel.setHp(game.boydata.currentHp);
			
			this.isFlower_s = false;
			this.isFlower_m =false;
			this.isFlower_l =false;
			this.isFullbucket=false;
			this.isClosewindow=false;
			this.isRepairwindow=false;
			this.boardState = 0;
			this.boardTime = 0;
			this.setHelp();
			
		},
		checkFinishedAllTask:function(){
			var scene = this;
			if(this.isFlower_l && this.isFlower_m && this.isFlower_s && this.isFullbucket && this.isClosewindow && this.isRepairwindow){
				new Hilo.Tween.to(this,{
					alpha:1,
				},{
					duration:100,
					delay:3000,
					onComplete:function(){
						//game.switchScene(game.configdata.SCENE_NAMES.passchoice);
            			scene.passoverReady('img/notes/typhoon/typhooninstroduce.png',100,game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.calamity);
					}
				})
			}
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_s)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_m)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_l)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_pos_s)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_pos_m)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_pos_l)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.bucket)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.hammer)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.board)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.breakwindow)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.thewindow)
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
			this.currentOnhandObj = null;
		},
		
		addLadderPart:function(){
			var scene = this;
			scene.hammer.status = 1;
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
										scene.boardState = 2;
									}
								});
							}
						})
				);
		},
		gotoClosewindow:function(obj,x,y){
			var scene = this;
			scene.ignoreTouch = true;
			//scene.hero.switchState('turn180',10);
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:1,
					scaleY:1,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.visible = false;
						scene.showClosewindow();
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:1200,
							onComplete:function(){
								scene.hero.visible = true;
								scene.closeWindowMan.visible = false;
								scene.thewindow.visible = false;
								scene.thewindow.status = 2;
								scene.closewindow.visible = true;
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
									scaleX:1,
									scaleY:1,
								},{
									duration:120,
									delay:120,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.ignoreTouch = false;
										scene.isClosewindow = true; 
										scene.checkFinishedAllTask();
										//scene.hero.takeProp(pickProp,x,y);
										//scene.handonProp(propimg,scene.hero.posx+x,scene.hero.posy+y);
										
										//obj.visible = false;
										//obj.status = 2;
										//if(onCall)
										//	onCall();
									}
								});
							}
						})
				);
		},
		gotoClosewindow2:function(obj,x,y){
			var scene = this;
			scene.ignoreTouch = true;
			game.sounds.play(35,true);
			//scene.hero.switchState('turn180',10);
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:1,
					scaleY:1,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.visible = false;
						scene.showOpenwater();
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:3200,
							onComplete:function(){
								scene.hero.visible = true;
								scene.openWaterMan.visible = false;
								scene.bucket.visible = false;
								scene.bucket.status = 2;
								scene.fullbucket.visible = true;
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
									scaleX:1,
									scaleY:1,
								},{
									duration:120,
									delay:1120,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.ignoreTouch = false;
										game.sounds.stop(35);
										scene.isFullbucket = true;
										scene.checkFinishedAllTask();
										//scene.hero.takeProp(pickProp,x,y);
										//scene.handonProp(propimg,scene.hero.posx+x,scene.hero.posy+y);
										
										//obj.visible = false;
										//obj.status = 2;
										//if(onCall)
										//	onCall();
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
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
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
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		putdownFlower:function(obj){
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var scene = this;
			scene.currentOnhandImg.removeFromParent();
			new Hilo.Tween.to(scene.hero,{
				posx:targetx,
				posy:targety
			},{
				duration:100,
				onComplete:function(){
					scene.putdownProp(obj,0,0,null);
					scene.showFlowerImg(obj);
					scene.currentOnhandObj = null;
				}
			});
		},
		showFlowerImg:function(obj){
			if(obj.name == 'flower_pos_s'){
				this.flowerImgs.visible = true;
				this.isFlower_s = true;
			}
			if(obj.name == 'flower_pos_m'){
				this.flowerImgm.visible = true;
				this.isFlower_m = true;
			}
			if(obj.name == 'flower_pos_l'){
				this.flowerImgl.visible = true;
				this.isFlower_l = true;
			}
			this.checkFinishedAllTask();
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
						game.sounds.play(6,false);
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
										scene.handonProp('img/typhoon/flowerl.png',scene.hero.posx-50,scene.hero.posy-158);
										scene.ignoreTouch = false;
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
		pickPropQuick:function(pickProp,propimg,obj,x,y,onCall){
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
						game.sounds.play(6,false);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:200,
							onComplete:function(){
								scene.hero.switchState('backpick',10);
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
									scaleX:1,
									scaleY:1,
									
								},{
									duration:120,
									delay:320,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.hero.takeProp(pickProp,x,y);
										scene.handonProp(propimg,scene.hero.posx+x,scene.hero.posy+y);
										scene.ignoreTouch = false;
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
		pickPropQuick2:function(pickProp,propimg,obj,x,y,onCall){
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
						game.sounds.play(6,false);
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
										scene.handonProp(propimg,scene.hero.posx+x,scene.hero.posy+y);
										scene.ignoreTouch = false;
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
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.thewindow)){
				if(this.currentOnhandObj){
					this.sayNo();
				}else{
					this.gotoClosewindow(this.thewindow,0,0);
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.bucket)){
				if(!this.currentOnhandObj){
					this.gotoClosewindow2(this.bucket,0,0);
				}else{
					this.sayNo();
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.breakwindow)){
				if(this.currentOnhandObj  && this.currentOnhandObj.name == 'board'){
					this.addLadderPart();
				}
				if(this.currentOnhandObj  && this.currentOnhandObj.name == 'hammer'){
					this.repairLadder();
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.board)){
				if(!this.currentOnhandObj){
					this.pickPropQuick2('board','img/typhoon/board.png',this.board,-40,-130);
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.hammer)){
				if(!this.currentOnhandObj){
					this.pickPropQuick('flowerpot_l','img/typhoon/hammer.png',this.hammer,-50,-120);
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_l)){
				if(!this.currentOnhandObj){
					this.pickPropQuick('flowerpot_l','img/typhoon/flowerl.png',this.flowerpot_l,-40,-130);
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_m)){
				if(!this.currentOnhandObj){
					this.pickPropQuick('flowerpot_m','img/typhoon/flowerm.png',this.flowerpot_m,-40,-130);
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_s)){
				if(!this.currentOnhandObj){
					this.pickPropQuick('flowerpot_s','img/typhoon/flowers.png',this.flowerpot_s,-40,-134);
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_pos_l)){
				if(this.currentOnhandObj && this.currentOnhandObj.name == 'flowerpot_l'){
					this.putdownFlower(this.flowerpot_pos_l);
				}else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_pos_m)){
				if(this.currentOnhandObj && this.currentOnhandObj.name == 'flowerpot_m'){
					this.putdownFlower(this.flowerpot_pos_m);
				}else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.flowerpot_pos_s)){
				if(this.currentOnhandObj && this.currentOnhandObj.name == 'flowerpot_s'){
					this.putdownFlower(this.flowerpot_pos_s);
				}else{
					this.sayNo();
				}
				return true;
			}
			
			return false;
		},
		createActiveObj:function(objname,x,y,targetx,targety,readyImgurl,finishedImgurl,clickrect,status){
			return new game.ActiveObject({
				name:objname,
				x:x,
				y:y,
				targetx:targetx,
				targety:targety,
				readyImgUrl:readyImgurl,
				finishedImgUrl:finishedImgurl,
				clickArea:clickrect,
				status:status,
			}).addTo(this);
		},
		layoutBgMap:function(){
			var scene = this;
			new Hilo.Bitmap({
				image:'img/typhoon/typhooninroom.png',
			}).addTo(this);
			
			this.flowerpot_s = this.createActiveObj('flowerpot_s',115,270,0,200,'img/typhoon/flowers.png','',[0,0,60,60],1);
			this.flowerpot_m = this.createActiveObj('flowerpot_m',50,260,0,200,'img/typhoon/flowerm.png','',[0,0,60,60],1);
			this.flowerpot_l = this.createActiveObj('flowerpot_l',169,230,0,200,'img/typhoon/flowerl.png','',[0,0,70,80],1);
			this.flowerpot_l.scaleFact = this.flowerpot_m.scaleFact = this.flowerpot_s.scaleFact = 0.8;
			this.flowerpot_pos_s = this.createActiveObj('flower_pos_s',926,470,0,120,'empty','empty',[0,0,60,60],1);
			this.flowerpot_pos_m = this.createActiveObj('flower_pos_m',1016,460,0,120,'empty','empty',[0,0,60,70],1);
			this.flowerpot_pos_l = this.createActiveObj('flower_pos_l',1106,450,0,120,'empty','empty',[0,0,60,80],1);
			this.flowerImgs = game.drawdata.drawBmpOfUrl('img/typhoon/flowers.png',926,460,this);
			this.flowerImgm = game.drawdata.drawBmpOfUrl('img/typhoon/flowerm.png',1016,450,this);
			this.flowerImgl = game.drawdata.drawBmpOfUrl('img/typhoon/flowerl.png',1086,420,this);
			this.flowerImgl.visible = this.flowerImgm.visible = this.flowerImgs.visible =false;
			
			
			this.bucket = this.createActiveObj('bucket',97,388,0,120,'img/typhoon/bucket_1.png','',[0,0,100,100],1);
			this.board  = this.createActiveObj('board',332,486,0,50,'img/typhoon/board.png','',[0,0,100,30],1);
			this.thewindow  = this.createActiveObj('window',450,206,55,316,'img/typhoon/window_1.png','',[0,0,100,150],1);
			this.hammer  = this.createActiveObj('hammer',253,550,0,30,'img/typhoon/hammer.png','',[0,0,80,30],2);
			this.fullbucket  = game.drawdata.drawBmpOfUrl('img/typhoon/bucket_2.png',97,400,this);
			this.closewindow = game.drawdata.drawBmpOfUrl('img/typhoon/window_2.png',454,211,this);
			this.breakwindow = this.createActiveObj('breakwindow',745,324,0,200,'empty','empty',[0,0,100,30],1);
			this.flowerpot_l.scaleX = this.flowerpot_l.scaleY = 0.8;
			this.flowerpot_m.scaleX = this.flowerpot_m.scaleY = 0.8;
			this.flowerpot_s.scaleX = this.flowerpot_s.scaleY = 0.8;
			this.board.scaleFact = 1;
			this.hammer.scaleFact = 1;
			this.fullbucket.visible = false;
			this.closewindow.visible = false;
			
			this.atlas = new Hilo.TextureAtlas({
                //image:game.getImg('typhoonaction'),
                image:'img/loadimgs/typhoonaction.png',
                width: 1024,
                height: 1024,
                frames: [[0, 0, 210, 310], [212, 312, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [636, 0, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 624, 210, 310], [0, 624, 210, 310]],
                sprites: {
                    closewindow: {from:0, to:5},
                    openwater:[6,7,8,9,7,6,6,6,6,6,6,6,6,6,6,6,6,7,8,9,6]
                }
            });
		},
		showClosewindow:function(){
			this.closeWindowMan = new Hilo.Sprite({
				frames:this.atlas.getSprite('closewindow'),
				interval:10,
				loop:false,
				x:449-67,
				y:304-67
			}).addTo(this);
		},
		showOpenwater:function(){
			this.openWaterMan = new Hilo.Sprite({
				frames:this.atlas.getSprite('openwater'),
				interval:10,
				loop:false,
				x:0,
				y:220
			}).addTo(this);
		},
		showNote:function(){
			var scene = this;
			var img = new Hilo.Bitmap({
				image:'img/note04.png',
				x:scene.passPaneleBg.x,
				y:scene.passPaneleBg.y,
			}).addTo(this);
			img.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.passchoice);
			});
		},
		
		startTargetsWalk:function(){
			this.currentTarget = this.targets.shift();
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
			if(this.boardState == 1){
				if(!this.currentOnhandObj || this.currentOnhandObj.name != 'hammer'){
					this.boardTime++;
					if(this.boardTime > 1000){
						this.board.y+=4;
					}
					if(this.board.y > 489){
						this.boardTime = 0;
						this.board.status = 1;
						this.boardState = 0;
					}
				}
			}
		},
		addLadderPart:function(){
			var scene = this;
			scene.putProp();
			scene.hero.switchState('turn180',10);
			scene.ignoreTouch = true;
			var targetx = this.breakwindow.x ;
			var targety = this.breakwindow.y + 236;
			scene.currentOnhandImg.removeFromParent();
			
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
				}, {
					duration: 120,
					onComplete: function() {
						scene.board.visible = true;
						scene.hero.switchState('idleback',10);
						scene.board.y = scene.breakwindow.y+40;
						scene.board.x = scene.breakwindow.x-10;
						scene.board.status = 2;
						scene.hammer.status = 1;
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:500,
							onComplete:function(){
								scene.hero.switchState('handup',10);
								scene.board.y = scene.breakwindow.y+10;
								scene.board.x = scene.breakwindow.x-10;
								scene.boardState = 1;
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
										scene.boardState = 1;
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
			var targetx = this.breakwindow.x;
			var targety = this.breakwindow.y + 236;
			scene.currentOnhandImg.removeFromParent();
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
										scene.boardState = 3;
										scene.ignoreTouch = false;
										scene.hammer.visible = true;
										scene.hammer.x = scene.hero.posx -30;
										scene.hammer.y = scene.hero.posy +30;
										scene.breakwindow.status = 2; 
										scene.isRepairwindow = true;
										scene.checkFinishedAllTask();
									}
								});
							}
						})
				);
		}
	});
})(window.game);