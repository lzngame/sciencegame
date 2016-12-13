(function(ns) {
	var WaterIntopipescene = ns.WaterIntopipescene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.confusion_cinema,
		hammer:null,
		boxobj:null,
		speaker:null,
		speakerobj:null,
		door:null,
		liedownman1:null,
		liedownman2:null,
		initPosx:650,
		initPosy:350,
		currentOnhandObj:null,
		currentOnhandImg:null,
		
		speakerinbox:null,
		glass:null,
		breakglass:null,
		glassonfloor:null,
		
		
		public1:null,
		public2:null,
		help1:null,
		help2:null,
		helpobj1:null,
		helpobj2:null,
		isHelp1:false,
		isHelp2:false,
		
		knockman:null,
		effectatlas:null,
		
		atlas:null,
		constructor: function(properties) {
			WaterIntopipescene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
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
			this.addHero(null,this.initPosx,this.initPosy);
			
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			this.isHelp1 = false;
			this.isHelp2 = false;
			game.sounds.play(14,true);
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.door)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.hammer)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.boxobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.speakerobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.liedownman1)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.helpobj1)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.helpobj2)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.liedownman2)
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
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
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
								//scene.hero.switchState('backpick',10);
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
										//scene.hero.takeProp(pickProp,x,y);
										if(obj.name != 'speakerobj')
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.hammer)){
				if(!this.currentOnhandObj){
					this.hammer.scaleFact = 1;
					this.currentOnhandObj = this.hammer;	
					this.pickPropQuick('hammer','img/confusion/extinguisherhand.png',this.hammer,-62+18,-145+34);
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.helpobj1)){
				var scene = this;
				this.gotoHelp(this.helpobj1,0,0,function(){
					scene.help1.currentFrame = 0;
					scene.help1.loop = false;
					scene.help1._frames = scene.helpatlas.getSprite('up');
					scene.isHelp1 = true;
					scene.isAllhelp();
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.helpobj2)){
				var scene = this;
				this.gotoHelp(this.helpobj2,0,0,function(){
					scene.help2.currentFrame = 0;
					scene.help2.loop = false;
					scene.help2._frames = scene.helpatlas.getSprite('up');
					scene.isHelp2 = true;
					scene.isAllhelp();
				});
				return true;
			}
			
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.speakerobj)){
				this.speakerobj.scaleFact = 0.8;
				var scene = this;
				this.pickPropQuick('speak','empty',this.speakerobj,-80,-103,function(){
					scene.putProp();
					scene.handonProp('img/confusion/speakeronhand.png',544,214);
					game.drdialog.showTxt('img/confusion/notecheli.png');
					game.drdialog.on(Hilo.event.POINTER_START, function(e) {
						game.drdialog.hide();
						scene.knockman.visible = true;
						scene.knockman.x = 529;
						scene.knockman.y = 66;
						scene.knockman.scaleX = 1;
						scene.knockman.scaleY = 1;
						scene.hero.visible = false;
						scene.speakerinbox.visible = false;
						scene.currentOnhandImg.removeFromParent();
						scene.callpublic();
					});
				});
				this.speakerobj.status = 2;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.boxobj)){
				if(this.currentOnhandObj && this.currentOnhandObj.name == 'hammer'){
					var scene = this;
					this.gotoOpenswitch(this.boxobj,0,0,function(){
						scene.hammer.visible = true;
						scene.hammer.x = 279;
						scene.hammer.y = 247;
						scene.hammer.scaleX = 0.8;
						scene.hammer.scaleY = 0.8;
						scene.hero.scaleX = 1;
						scene.hero.scaleY = 1;
						scene.speakerobj.status = 1;
						scene.glass.visible = false;
						scene.glassonfloor.visible = true;
						scene.breakglass.visible = true;
					});
					this.boxobj.status = 2;
				}else{
					this.sayNo();
				}
				return true;
			}
			
			
			return false;
		},
		isAllhelp:function(){
			if(this.isHelp1 && this.isHelp2){
				new Hilo.Tween.to(this,{
					alpha:1,
				},{
					duration:500,
					delay:2000,
					onComplete:function(){
						game.switchScene(game.configdata.SCENE_NAMES.confusion_doorway);
					}
				});
			}
		},
		callpublic:function(){
			var scene = this;
			new Hilo.Tween.to(scene.public1,{
				x:-100,
				y:200
			},{
				duration:2000,
				delay:1000
			});
			new Hilo.Tween.to(scene.public2,{
				x:-40,
				y:250
			},{
				duration:2500,
				delay:500,
				onComplete:function(){
					scene.knockman.visible = false;
					scene.hero.visible = true;
					scene.help1.visible = true;
					scene.help2.visible = true;
				}
			});
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
		layoutUIElement:function(arraydata){
			for(var i=0;i<arraydata.length;i++){
				var item = arraydata[i];
				var itemtype = item[0];
				if(itemtype == game.configdata.LAYOUTTEYP.activeobj){
					var obj = item[1];
					var name = item[2];
					var img = item[3];
					var x = item[4];
					var y = item[5];
					var targetx = item[6];
					var targety = item[7];
					var clickrect = item[8];
					var status = item[9];
					obj = this.createActiveObj(name,x,y,targetx,targety,img,img,clickrect,status);
				}
				if(itemtype == game.configdata.LAYOUTTEYP.img){
					var obj = item[1];
					var img = item[2];
					var x = item[3];
					var y = item[4];
					obj = new Hilo.Bitmap({image:img,x:x,y:y}).addTo(this);
				}
			}
		},
		layoutBgMap:function(){
			var scene = this;
			
			new Hilo.Bitmap({
				image:'img/confusion/dy.png',
			}).addTo(this);
			
			this.speakerinbox = new Hilo.Bitmap({
				image:'img/confusion/speakinbox.png',
				x:182,
				y:122
			}).addTo(this);
			
			this.glass = new Hilo.Bitmap({
				image:'img/confusion/glass01.png',
				x:178,
				y:104,
				alpha:0.8
			}).addTo(this);
			
			this.breakglass = new Hilo.Bitmap({
				image:'img/confusion/glassbreak.png',
				x:178,
				y:104,
				visible:false,
			}).addTo(this);
			
			this.glassonfloor = new Hilo.Bitmap({
				image:'img/confusion/glassonfloor.png',
				x:192,
				y:296,
				visible:false
			}).addTo(this);
			
			this.helpatlas = new Hilo.TextureAtlas({
                image:'img/confusion/help.png',
                width: 633,
                height: 622,
                frames:[[211, 0, 209, 309], [211, 311, 209, 309], [422, 0, 209, 309], [0, 311, 209, 309], [0, 0, 209, 309]],
                sprites: {
                	idle:[0,0],
                	up:[0,1,2,3,4]
                }
            });
            
			this.hammer  = this.createActiveObj('hammer',1093,176,0,140,'img/confusion/extinguisher.png','',[10,0,30,130],1);
            
            
            this.help1 = new Hilo.Sprite({
				frames:this.helpatlas.getSprite('idle'),
				interval:10,
				x:329,
				y:302-270,
				visible:false
			}).addTo(this);
			
			this.help2 = new Hilo.Sprite({
				frames:this.helpatlas.getSprite('idle'),
				interval:10,
				x:429,
				y:334-270,
				visible:false
			}).addTo(this);
			
			

			
			this.public1 = new Hilo.Bitmap({image:'img/confusion/public.png',x:0,y:360}).addTo(this);
			this.public2 = new Hilo.Bitmap({image:'img/confusion/public.png',x:700,y:360}).addTo(this);
			
			this.effectatlas = new Hilo.TextureAtlas({
                image:'img/confusion/effect.png',
                width: 718,
                height: 835,
                frames:[[247, 715, 245, 118], [0, 715, 245, 118], [349, 429, 245, 118], [349, 549, 245, 118], [596, 589, 110, 78], [596, 509, 110, 78], [596, 429, 110, 78], [494, 669, 110, 78], [494, 749, 110, 78], [606, 669, 110, 78], [0, 429, 347, 141], [349, 143, 347, 141], [349, 0, 347, 141], [0, 572, 347, 141], [349, 286, 347, 141], [0, 286, 347, 141], [0, 143, 347, 141], [0, 0, 347, 141]],
                sprites: {
                	boxfire:[0,1,2,3],
                	extinguisher:[4,5,6,7,8,9],
                	smoke:[10,11,12,13,14,15,16],
                }
            });
			
			this.atlas = new Hilo.TextureAtlas({
                image:'img/confusion/boyactions_cinema.png',
                width: 848,
                height: 936,
                frames:[[212, 624, 210, 310], [212, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [636, 0, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [636, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [424, 312, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	idle:[0,0],
                	openswitch:[0,1,2,3,4],
                	knockandopen:[0,1,2,3,4,5],
                	speak:[12,13,14],
                	help:[6,7,8,9,10,11]
                }
            });
            
            
            
            new Hilo.Bitmap({image:'img/confusion/chair2.png',x:376,y:467}).addTo(this);
            new Hilo.Sprite({
				frames:this.effectatlas.getSprite('smoke'),
				interval:10,
				x:0,
				y:200,
				scaleX:3,
				scaleY:3,
			}).addTo(this);
			new Hilo.Bitmap({image:'img/confusion/chair1.png',x:172,y:552}).addTo(this);
			
            
            this.knockman = new Hilo.Sprite({
				frames:this.atlas.getSprite('knockandopen'),
				interval:10,
				x:1023,
				y:211,
				visible:false,
			}).addTo(this);
			

			this.boxobj  = this.createActiveObj('box',180,110,50,180,'empty','empty',[0,0,40,40],1);
			this.helpobj1  = this.createActiveObj('help1',360,120,160,210,'empty','empty',[0,0,70,140],1);
			this.helpobj2 = this.createActiveObj('help2',456,210,160,160,'empty','empty',[0,0,70,140],1);
			this.speakerobj  = this.createActiveObj('speakerobj',180,110,0,130,'empty','empty',[0,-30,60,90],2);
			
			
			
		},
		gotoHelp:function(obj,x,y,onCall){
			var scene = this;
			obj.status = 2;
			scene.currentOnhandImg.removeFromParent();
			scene.ignoreTouch = true;
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
						scene.knockman.visible = true;
						scene.knockman.loop = false;
						scene.knockman.x = scene.hero.x -113;
						scene.knockman.y = scene.hero.y-285;
						scene.knockman.currentFrame = 0;
						scene.knockman._frames = scene.atlas.getSprite('help');
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:310,
							delay:110,
							onComplete:function(){
								scene.hero.visible = true;
								scene.knockman.visible = false;
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
										scene.knockman.currentFrame = 0;
										scene.knockman.loop = true;
										scene.knockman.play();
										scene.knockman._frames = scene.atlas.getSprite('speak');
										if(onCall)
											onCall();
									}
								});
							}
						})
				);
		},
		
		gotoOpenswitch:function(obj,x,y,onCall){
			var scene = this;
			scene.currentOnhandImg.removeFromParent();
			scene.ignoreTouch = true;
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:0.8,
					scaleY:0.8,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.visible = false;
						scene.knockman.visible = true;
						scene.knockman.loop = false;
						scene.knockman.x = scene.hero.x -153;
						scene.knockman.y = scene.hero.y-245;
						scene.knockman.currentFrame = 0;
						scene.knockman.scaleX = 0.8;
						scene.knockman.scaleY = 0.8;
						scene.knockman._frames = scene.atlas.getSprite('knockandopen');
						game.sounds.play(10,false);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:310,
							delay:1200,
							onComplete:function(){
								scene.hero.visible = true;
								scene.knockman.visible = false;
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
										scene.knockman.currentFrame = 0;
										scene.knockman.loop = true;
										scene.knockman.play();
										scene.knockman._frames = scene.atlas.getSprite('speak');
										if(onCall)
											onCall();
									}
								});
							}
						})
				);
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.currentOnhandObj == null){
				this.hero.switchState('nocan',10);
			}
		},
		
		
		onUpdate:function(){
			
		},
	});
})(window.game);