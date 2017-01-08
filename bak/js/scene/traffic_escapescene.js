(function(ns) {
	var Trafficescapebusscene = ns.Trafficescapebusscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.traffic_escapebus,
		skybg:null,
		hill1:null,
		hill2:null,
		road1:null,
		road2:null,
		bus:null,
		mbus:null,
		isPlaybump:false,
		isbang:false,
		bangimg:null,
		terrifiedhead:null,
		blackmask:null,
		dr:null,
		inbusbg:null,
		fireuse:null,
		jumpglass:null,
		openbtnbg:null,
		safehummer:null,
		killfire:null,
		pipe:null,
		breakwindow:null,
		busfire:null,
		bushandler:null,
		openbusdoor:null,
		
		killfireEmpty:null,
		pipeEmpty:null,
		hammerEmpty:null,
		windowEmpty:null,
		fireEmpty:null,
		initHerox:750,
		initHeroy:610,
		standKillfire01:null,
		standKillfire02:null,
		annihilatorEffect:null,
		hammeronhand:null,
		windowglass:null,
		hadbreak:null,
		corner1Empty:null,
		corner2Empty:null,
		corner3Empty:null,
		corner4Empty:null,
		handleEmpty:null,
		largeHandleEmpty:null,
		breakStep:0,
		busfront:null,
		busback:null,
		busdoor:null,
		largebtnbg:null,
		largehandle:null,
		fare1:null,
		fare2:null,
		constructor: function(properties) {
			Trafficescapebusscene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.x = 0;
			this.y = 0;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
			this.blocks =[];
		},
		active: function(passdata) {
			console.log('%s active:', this.name);
			var scene = this;
			this.addTo(game.stage);
			this.alpha = 1;
			
			this.layoutBgMap();
			this.isbang = false;
			this.isPlaybump = false;
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			
			this.breakStep = 0;
		},
		pickProp:function(picktype,obj){
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
								scene.hero.switchState(picktype,10);
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
								},{
									duration:120,
									delay:620,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.killfire.removeFromParent();
										scene.hero.visible = false;
										scene.standKillfire01.visible = true;
										scene.pipeEmpty.status =1;
										scene.ignoreTouch = false;
									}
								});
							}
						})
				);
		},
		pickProp2:function(picktype,obj){
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
							delay:100,
							onComplete:function(){
								scene.hero.switchState(picktype,10);
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
								},{
									duration:120,
									delay:120,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.safehummer.removeFromParent();
										scene.ignoreTouch = false;
										scene.handHammer();
									}
								});
							}
						})
				);
		},
		breakGlassStep:function(){
			if(this.breakStep >= 5){
				var scene = this;
				game.sounds.play(10,false);
				//this.windowglass.removeFromParent();
				this.windowglass1.removeFromParent();
				this.windowglass2.removeFromParent();
				this.windowglass3.removeFromParent();
				this.windowglass4.removeFromParent();
				this.hadbreak.visible = true;
				this.corner1Empty.status = 2;
				this.corner2Empty.status = 2;
				this.corner3Empty.status = 2;
				this.corner4Empty.status = 2;
				new Hilo.Tween.to(this,{
					alpha:1,
				},{
					duration:500,
					delay:500,
					onComplete:function(){
						scene.hero.visible = false;
						scene.hammeronhand.visible = false;
						scene.hadbreak.visible = false;
						scene.windowglass.removeFromParent();
						scene.boyjumpglass();
					}
				});
			}else{
				this.breakStep++;
				game.sounds.play(34,false);
			}
			if(this.breakStep == 1)
				this.windowglass1.visible = true;
			if(this.breakStep == 2)
				this.windowglass2.visible = true;
			if(this.breakStep == 3)
				this.windowglass3.visible = true;
			if(this.breakStep == 4)
				this.windowglass4.visible = true;
		},
		handHammer:function(){
			this.hammeronhand = new Hilo.Bitmap({
				image:'img/traffic/hammeronhand.png',
				x:704,
				y:500
			}).addTo(this);
		},
		herowalk:function(targetx,targety){
			//为空 覆盖父类行走
		},
		gotoPut:function(initX,initY,targetX,targetY,durationTime){
			this.ignoreTouch = true;
			var targetx = targetX;
			var targety = targetY;
			if(this.hero.posx == targetx && this.hero.posy == targety){
				return;
			}
			var scene = this;
			scene.hero.switchState('turn180',10);
			
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
				}, {
					duration: durationTime,
					onComplete: function() {
						scene.hero.switchState('idle',10);
						scene.ignoreTouch = false;
					}
				});
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.killfireEmpty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.fireEmpty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.hammerEmpty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.windowEmpty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.corner1Empty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.corner2Empty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.corner3Empty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.corner4Empty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.handleEmpty)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.largeHandleEmpty)||
				/*this.checkActiveItemWithoutPos(mouseX,mouseY,this.incarobj)||*/
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.pipeEmpty)
			){
				return true;
			}else{
				return false;
			}
		},
		receiveMsg: function(msg) {
			
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.corner1Empty)||
			this.checkActiveItemWithoutPos(mouseX,mouseY,this.corner2Empty)||
			this.checkActiveItemWithoutPos(mouseX,mouseY,this.corner3Empty)||
			this.checkActiveItemWithoutPos(mouseX,mouseY,this.corner4Empty)
			){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.breakGlassStep();
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.handleEmpty)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.handleEmpty.status = 2;
				this.showLargeHandle();
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.killfireEmpty)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.killfireEmpty.status = 2;
				this.pickProp('backpick',this.killfireEmpty);
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.hammerEmpty)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.hammerEmpty.status = 2;
				this.pickProp2('idleback',this.hammerEmpty);
				this.windowEmpty.status = 1;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.largeHandleEmpty)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.handleopenbusdoor();
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.windowEmpty)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.windowEmpty.status = 2;
				//this.hero.visible = false;
				//this.hammeronhand.removeFromParent();
				this.switchBreakWindow();
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.pipeEmpty)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.pipe.removeFromParent();
				this.pipeEmpty.status = 2;
				this.standKillfire01.visible = false;
				this.standKillfire02.visible = true;
				this.fireEmpty.status = 1;
				var scene = this;
				var initx = scene.standKillfire02.x;
				var targetx = scene.pipeEmpty.x;
				new Hilo.Tween.to(scene.standKillfire02,{
					x:targetx,
				},{
					duration:300,
					onComplete:function(){
						new Hilo.Tween.to(scene.standKillfire02,{
							x:initx,
						},{
							duration:300,
							onComplete:function(){
								
							}
						});
					}
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.fireEmpty)){
				if(!this.checkFinger(-1)){
					return false;
				}
				this.fireEmpty.status = 2;
				game.sounds.play(17,true);
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
				this.annihilatorEffect = new Hilo.Sprite({
					frames: atlas.getSprite('effect'),
					x:808,
					y:483,
					interval:8,
					visible:true,
				}).addTo(this);
				var scene = this;
				new Hilo.Tween.to(this.busfire,{
					alpha:0,
				},{
					duration:2000,
					onComplete:function(){
						scene.finishedKillfire();
						game.sounds.stop(17);
					}
				});
				
				return true;
			}
		},
		showLargeHandle:function(){
			this.largebtnbg = new Hilo.Bitmap({
				image:'img/traffic/largebtnbg.png',
			}).addTo(this);
			this.largehandle = new Hilo.Bitmap({
				image:'img/traffic/largehandle.png',
				x:424+148,
				y:167+91,
				pivotX:148,
				pivotY:91
			}).addTo(this);
			this.largeHandleEmpty  = new game.ActiveObject({
				name:'',
				x:436,
				y:200,
				targetx:0,
				targety:100,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,260,110],
				status:1,
			}).addTo(this);
			this.fingerMouse.removeFromParent();
			this.fingerMouse.addTo(this);
		},
		handleopenbusdoor:function(){
			game.sounds.play(33,false);
			this.largeHandleEmpty.status = 2;
			var scene = this;
			new Hilo.Tween.to(scene.largehandle,{
				rotation:90,
			},{
				duration:2000,
				onComplete:function(){
					scene.largebtnbg.removeFromParent();
					scene.largehandle.removeFromParent();
					scene.addBusRunmap();
					game.sounds.stop(33);
				}
			});
		},
		addBusRunmap:function(){
			this.busdoor.visible = false;
			this.hero.visible = false;
			var atlas = new Hilo.TextureAtlas({
                image:game.getImg('manrun'),
                width: 684,
                height: 891,
                frames: [
                	[228,297,226,295],
                	[456,297,226,295],
                	[456,0,226,295],
                	[228,594,226,295],
                	[456,594,226,295],
                	[228,0,226,295],
                	[0,594,226,295],
                	[0,297,226,295],
                	[0,0,226,295],
                ],
                sprites: {
                    effect:[0,1,2,3,4,5,6,7,8],
                }
            });
			this.runman1 = new Hilo.Sprite({
				frames: atlas.getSprite('effect'),
				x:200,
				y:208,
				interval:4,
			}).addTo(this);
			this.runman2 = new Hilo.Sprite({
				frames: atlas.getSprite('effect'),
				x:300,
				y:208,
				interval:4,
			}).addTo(this);
			this.swapChildren(this.runman1,this.busback);
			this.swapChildren(this.runman2,this.busback);
			var scene = this;
			new Hilo.Tween.to(this,{
				alpha:1
			},{
				delay:1000,
				duration:1000,
				onComplete:function(){
					scene.showOutTop();
				}
			});

		},
		switchBreakWindow:function(){
			this.windowglass.visible = true;
			this.corner1Empty.status = 1;
			this.corner2Empty.status = 1;
			this.corner3Empty.status = 1;
			this.corner4Empty.status = 1;
		},
		finishedKillfire:function(){
			this.standKillfire01.removeFromParent();
			this.standKillfire02.removeFromParent();
			this.hero.visible = true;
			this.annihilatorEffect.removeFromParent();
			this.hammerEmpty.status = 1;
		},
		layoutBgMap:function(){
			var scene = this;
			this.skybg = new Hilo.Bitmap({
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
				y:340,
			}).addTo(this);
			this.cloud3 = new Hilo.Bitmap({ 
				image:'img/cloud3.png',
				x:800,
				y:130,
			}).addTo(this);
			this.cloud4 = new Hilo.Bitmap({
				image:'img/cloud4.png',
				x:1200,
				y:50,
			}).addTo(this);
			this.hill1 = new Hilo.Bitmap({
				image:'img/traffic/hill01.png',
				x:500,
				y:191,
				alpha:0.4,
				scaleX:0.5,
				scaleY:0.5,
			}).addTo(this);
			this.hill2 = new Hilo.Bitmap({
				image:'img/traffic/hill02.png',
				x:600,
				y:165,
				scaleX:0.6,
				scaleY:0.6,
			}).addTo(this);
			this.road1 = new Hilo.Bitmap({
				image:game.getImg('road'),
			}).addTo(this);
			this.road2 = new Hilo.Bitmap({
				image:game.getImg('road'),
				x:1202,
			}).addTo(this);
			
			this.bus = new game.Runbus({
				y:220,
				x:-600,
				bodyname:'runbus',
				tyrename:'img/traffic/bustyre.png',
				tyre1x:224,
				tyre2x:564,
				tyrey:255,
				tyrepivotx:50,
				tyrepivoty:45,
				speed:10,
			}).addTo(this);
			this.mbus = new game.Runbus({
				y:286,
				x:890,
				bodyname:'mbus',
				tyrename:'img/traffic/mbustyre.png',
				tyre1x:74,
				tyre2x:396,
				tyrey:195,
				tyrepivotx:35,
				tyrepivoty:35,
			}).addTo(this);
			
			this.bangimg = new Hilo.Bitmap({
				image:'img/traffic/bang.png',
				x:760,
				y:273,
				visible:false,
			}).addTo(this);
			
			this.terrifiedhead = new Hilo.Bitmap({
				image:'img/traffic/terrifiedhead.png',
				visible:false,
			}).addTo(this);
			
			this.busfront = new Hilo.Bitmap({
					image:'img/traffic/busfront.png',
					x:650,
					y:126,
					visible:false
			}).addTo(this);
			this.busback = new Hilo.Bitmap({
					image:'img/traffic/busbackbody.png',
					x:88,
					y:131,
					visible:false
			}).addTo(this);
			this.busdoor = new Hilo.Bitmap({
					image:'img/traffic/busclossdoor.png',
					x:675,
					y:220,
					visible:false
			}).addTo(this);
			
			//game.sounds.play(31,false);
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
			this.hill1.x -= 0.45;
			this.hill2.x -= 0.9;
			this.road1.x -= 2;
			this.road2.x -= 2;
			
			if(this.hill1.x <-590){
				this.hill1.x = 1200;
			}
			if(this.hill2.x <-389){
				this.hill2.x = 1200;
			}
			if(this.road1.x <= -1202){
				this.road1.x = 1202;
			}
			if(this.road2.x <= -1202){
				this.road2.x = 1202;
			}
		},
		bang:function(){
			this.bus.pause = true;
			this.mbus.pause = true;
			this.bus.speed = 0;
			this.isbang = true;
			this.bangimg.visible = true;
			console.log('bang');
			
			var scene = this;
			new Hilo.Tween.to(this, {
				alpha:0,
			}, {
				duration: 700,
				delay:1400,
				//ease: Hilo.Ease.Bounce.EaseOut,
				onComplete: function() {
					scene.alpha = 1;
					scene.terrifiedhead.visible = true;
					
					new Hilo.Tween.to(scene.terrifiedhead,{
						alpha:0,
					},{
						delay:1000,
						duration:300,
						onComplete:function(){
							scene.showStepTwo();
						}
					});
				}
			});
		},
		boyjumpglass:function(){
			this.breakwindow.setImage('img/traffic/breakwindow.png',[145,0,141,163]);
			
			var atlas = new Hilo.TextureAtlas({
                image:game.getImg('jumpglass'),
                width: 848,
                height: 624,
                frames: [
                	[636,0,210,310],
                	[424,624,210,310],
                	[424,312,210,310],
                	[848,0,210,310],
                	
                	[212,624,210,310],
                	[212,312,210,310],
                	[212,0,210,310],
                	[0,624,210,310],
                	[0,312,210,310],
                	[0,0,210,310],
                	[424,0,210,310],
                	[636,624,210,310],
                	[636,312,210,310],
                ],
                sprites: {
                    effect:[5,6,7,8,9,10,11,12],
                    //effect:[0,1,2,3,0,1,2,3,0,1,2,3,4,5,6,7,8,9,10,11,12],
                }
            });
			this.jumpglass = new Hilo.Sprite({
				frames: atlas.getSprite('effect'),
				x:664,
				y:208,
				interval:10,
				loop:false
			}).addTo(this);
			var scene = this;
			new Hilo.Tween.to(this,{
				alpha:1,
			},{
				duration:2000,
				delay:2000,
				onComplete:function(){
					//scene.jumpglass.removeFromParent();
					//scene.jumpglass = null;
					scene.showOutOpen();
					scene.visible = true;
				}
			});
		},
		showStepTwo:function(){
			this.bangimg.removeFromParent();
			this.bus.removeFromParent();
			this.mbus.removeFromParent();
			this.terrifiedhead.removeFromParent();
			this.inbusbg = new Hilo.Bitmap({
				image:'img/traffic/inbusbg.png',
			}).addTo(this);
			this.breakwindow = new Hilo.Bitmap({
				image:'img/traffic/breakwindow.png',
				rect:[0,163,143,161],
				x:710,
				y:228,
			}).addTo(this);
			this.killfire = new Hilo.Bitmap({
				image:'img/traffic/killfire01.png',
				x:1110,
				y:450,
			}).addTo(this);
			this.pipe = new Hilo.Bitmap({
				image:'img/traffic/killfire02.png',
				x:1120,
				y:520,
			}).addTo(this);
			this.safehummer = new Hilo.Bitmap({
				image:'img/traffic/safehummer.png',
				x:806,
				y:230,
			}).addTo(this);
			
			this.fare1 = new Hilo.Bitmap({
				image:'img/traffic/fare.png',
				x:220,
				y:277,
			}).addTo(this);
			this.fare2 = new Hilo.Bitmap({
				image:'img/traffic/fare.png',
				x:30,
				y:277,
			}).addTo(this);
			
			var tmpx = 219;
			var tmpy = 84;
			this.windowglass = new Hilo.Bitmap({
				image:'img/traffic/glass001.png',
				x:0,
				y:0,
				//width:427,
				// height:244,
				visible:false,
			}).addTo(this);
			this.hadbreak = new Hilo.Bitmap({
				image:'img/traffic/hadbreak.png',
				x:tmpx,
				y:tmpy,
				//width:427,
				//height:244,
				visible:false,
			}).addTo(this);
			this.windowglass1 = new Hilo.Bitmap({
				image:'img/traffic/glass002.png',
				x:tmpx,
				y:tmpy,
				//width:427,
				//height:244,
				visible:false,
			}).addTo(this);
			this.windowglass2 = new Hilo.Bitmap({
				image:'img/traffic/glass003.png',
				x:tmpx,
				y:tmpy,
				//width:427,
				//height:244,
				visible:false,
			}).addTo(this);
			this.windowglass3 = new Hilo.Bitmap({
				image:'img/traffic/glass004.png',
				x:tmpx,
				y:tmpy,
				//width:427,
				//height:244,
				visible:false,
			}).addTo(this);
			this.windowglass4 = new Hilo.Bitmap({
				image:'img/traffic/glass005.png',
				x:tmpx,
				y:tmpy,
				//width:427,
				//height:244,
				visible:false,
			}).addTo(this);
			
			this.showFire();
			var scene = this;
			
			this.killfireEmpty  = new game.ActiveObject({
				name:'killfirenopie',
				x:1110,
				y:450,
				targetx:0,
				targety:100,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,160,80],
				status:1,
			}).addTo(this);
			
			this.hammerEmpty  = new game.ActiveObject({
				name:'killfirenopie',
				x:806,
				y:230,
				targetx:0,
				targety:260,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,40,60],
				status:2,
			}).addTo(this);
			
			this.pipeEmpty  = new game.ActiveObject({
				name:'pie',
				x:1120,
				y:520,
				targetx:0,
				targety:0,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,40,80],
				status:2,
			}).addTo(this);
			
			this.fireEmpty  = new game.ActiveObject({
				name:'pie',
				x:868,
				y:520,
				targetx:0,
				targety:0,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,80,50],
				status:2,
			}).addTo(this);
			
			this.corner1Empty  = new game.ActiveObject({
				name:'pie',
				x:237,
				y:38,
				targetx:0,
				targety:0,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,140,140],
				status:2,
			}).addTo(this);
			this.corner2Empty  = new game.ActiveObject({
				name:'pie',
				x:814,
				y:38,
				targetx:0,
				targety:0,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,100,100],
				status:2,
			}).addTo(this);
			this.corner3Empty  = new game.ActiveObject({
				name:'pie',
				x:277,
				y:403,
				targetx:0,
				targety:0,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,100,100],
				status:2,
			}).addTo(this);
			this.corner4Empty  = new game.ActiveObject({
				name:'pie',
				x:829,
				y:403,
				targetx:0,
				targety:0,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,100,100],
				status:2,
			}).addTo(this);
			
			
			this.windowEmpty  = new game.ActiveObject({
				name:'pie',
				x:710,
				y:228,
				targetx:0,
				targety:0,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,110,110],
				status:2,
			}).addTo(this);
			
			this.standKillfire01 = new Hilo.Bitmap({
				image:'img/traffic/standkillfire.png',
				x:this.initHerox-113,
				y:this.initHeroy-300,
				visible:false,
			}).addTo(this);
			this.standKillfire02 = new Hilo.Bitmap({
				image:'img/traffic/standkillfire02.png',
				x:this.initHerox-113,
				y:this.initHeroy-300,
				visible:false,
			}).addTo(this);
			this.addHero(this.initHerox,this.initHeroy);
			this.swapChildren(this.killfireEmpty,this.fingerMouse);
		},
		showKillfireNote:function(){
			game.drdialog.on(Hilo.event.POINTER_START, function(e) {
				game.drdialog.off();
				console.log('fire');
				//scene.inbusbg.removeFromParent();
				game.drdialog.hide();
				scene.busfire.removeFromParent();
				scene.fireuse = new Hilo.Bitmap({
					image:'img/traffic/fireuse.png',
				}).addTo(scene);
				scene.fireuse.on(Hilo.event.POINTER_START, function(e) {
					this.removeFromParent();
					game.drdialog.showTxt('img/traffic/glass.png');
					game.drdialog.on(Hilo.event.POINTER_START, function(e) {
						game.drdialog.hide();
						game.drdialog.off();
						scene.boyjumpglass();
						
						scene.safehummer.removeFromParent();
					});
				});
			});
			game.drdialog.showTxt('img/traffic/firetxt.png');
		},
		showOutOpen:function(){
			this.fare1.removeFromParent();
			this.fare2.removeFromParent();
			this.inbusbg.visible = false;
			this.breakwindow.removeFromParent();
			this.busfront.visible = true;
			this.busback.visible = true;
			this.busdoor.visible = true;
			var scene = this;
			this.hero.visible = true;
			//this.swapChildren(this.budsoor,this.hero);
			this.handleEmpty  = new game.ActiveObject({
				name:'pie',
				x:800,
				y:351,
				targetx:0,
				targety:0,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,40,40],
				status:1,
			}).addTo(this);
			game.drdialog.showTxt('img/traffic/openusetxt.png');
			game.drdialog.on(Hilo.event.POINTER_START, function(e) {
						game.drdialog.hide();
						game.drdialog.off();
						//scene.showOpenHandler();
				});
		},
		showOpenHandler:function(){
			this.bushandler = new Hilo.Bitmap({
					image:'img/traffic/bushandler.png',
					x:646,
					y:415,
					pivotX:36,
					pivotY:36
			}).addTo(this);
			this.openbusdoor = new Hilo.Bitmap({
					image:'img/traffic/openbusdoor.png',
					x:370,
					y:163,
					visible:false,
			}).addTo(this);
			var scene = this;
			game.sounds.play(33,false);
			new Hilo.Tween.to(scene.bushandler,{
				rotation:90,
			},{
				duration:1000,
				delay:1000,
				onComplete:function(){
					scene.openbusdoor.visible = true;
					game.sounds.stop(33);
					game.sounds.play(29,false);
					new Hilo.Tween.to(this,{
						alpha:1,
					},{
						delay:1000,
						duration:500,
						onComplete:function(){
							scene.showOutTop();
							
						}
					});
				}
			});
		},
		showOutTop:function(){
			new Hilo.Bitmap({
					image:'img/traffic/outtop.png',
			}).addTo(this);
			var scene = this;
			game.drdialog.showTxt('img/traffic/outtoptxt.png');
			game.drdialog.on(Hilo.event.POINTER_START, function(e) {
						game.drdialog.hide();
						game.drdialog.off();
						console.log('change---');
						scene.on(Hilo.event.POINTER_START, function(e) {
							scene.off();
							game.switchScene(game.configdata.SCENE_NAMES.passchoice);
						});
				});
		},
		showFire:function(){
			var atlas = new Hilo.TextureAtlas({
                image:game.getImg('busfire'),
                width: 1024,
                height: 1024,
                frames: [
                	[0,234,236,119],[238,0,236,119],[0,0,236,119],[0,121,236,119]
                ],
                sprites: {
                    tv: {from:0, to:3},
                }
            });
			this.busfire = new Hilo.Sprite({
				frames: atlas.getSprite('tv'),
				x:854,
				y:498,
				interval:8,
			}).addTo(this);
		},
		onUpdate:function(){
			if(!this.isbang){
				this.cloudMove();
			}
			
			if(this.bus.x+650>this.mbus.x){
				if(!this.isbang)
					this.bang();
			}
			if(!this.isPlaybump && this.bus.x+650>(this.mbus.x-800)){
				game.sounds.stop(31);
				game.sounds.play(32,false);
				this.isPlaybump = true;
			}
			if(this.runman1){
				this.runman1.x += 4;
				if(this.runman1.x >= 685){
					this.runman1.y = 250;
				}
			}
			if(this.runman2){
				this.runman2.x += 4;
				if(this.runman2.x >= 685){
					this.runman2.y = 250;
				}
			}
			//console.log(this.jumpglass.currentFrame );
			/*if(this.jumpglass && this.jumpglass.currentFrame == 20){
				this.jumpglass.removeFromParent();
				this.jumpglass = null;
				this.showOutOpen();
				console.log('opendoor');
			}
			if(this.jumpglass && this.jumpglass.currentFrame == 3){
				this.breakwindow.setImage('img/breakwindow.png',[0,0,141,163]);
				game.sounds.stop(23);
				game.sounds.play(10,false);
				console.log('breakwindow');
			}
			if(this.jumpglass && this.jumpglass.currentFrame == 8){
				this.breakwindow.setImage('img/breakwindow.png',[145,0,141,163]);
				console.log('breakwindow');
			}*/
			if(this.bushandler){
				//this.bushandler.rotation += 1;
			}
		},
	});
})(window.game);