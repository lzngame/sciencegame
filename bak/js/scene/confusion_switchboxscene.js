(function(ns) {
	var ConfusionSwitchboxscene = ns.ConfusionSwitchboxscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.confusion_switchbox,
		leftdoor:null,
		rightdoor:null,
		leftdoor_open:null,
		rightdoor_open:null,
		doorobj:null,
		boxojb:null,
		switchobj_lamp:null,
		switchobj_all:null,
		lampswitch_up:null,
		allswtich_up:null,
		lampswitch_down:null,
		allswtich_down:null,
		extinguisher:null,
		extinguisherimg:null,
		extinguisherman:null,
		sumtime:0,
		initPosx:650,
		initPosy:590,
		atlas:null,
		effectatlas:null,
		switchman:null,
		fireeffect:null,
		fireobj:null,
		smoke:null,
		extinguishereffect:null,
		boxbg:null,
		blue1:null,
		red1:null,
		red2:null,
		red3:null,
		yellow1:null,
		yellow2:null,
		yellow3:null,
		blue1:null,
		blue2:null,
		blue3:null,
		blue01:null,
		blue02:null,
		blue03:null,
		red01:null,
		red02:null,
		red03:null,
		yellow01:null,
		yellow02:null,
		yellow03:null,
		redobj:null,
		yellowobj:null,
		blueobj:null,
		boxpanel:null,
		exitboxobj1:null,
		exitboxobj2:null,
		drawerobj:null,
		drawerbg:null,
		mackintoshImg:null,
		mackintoshImg2:null,
		mackintoshObj1:null,
		mackintoshObj2:null,
		redmackintoshobj:null,
		bluemackintoshobj:null,
		yellowmackintoshobj:null,
		isflow:false,
		isallfinished:false,
		bgdark:null,
		bglamp:null,
		exitdoor:null,
		constructor: function(properties) {
			ConfusionSwitchboxscene.superclass.constructor.call(this, properties);
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
			this.sumtime = 0;
			this.isflow = false;
			
			this.bgdark = new Hilo.Bitmap({
				image:'img/confusion/lampbg.png',
			}).addTo(this);
			this.bglamp = new Hilo.Bitmap({
				//image:'img/confusion/lampbg.png',
				visible:false,
			}).addTo(this);
			game.sounds.play(14,true);
			game.drdialog.showTxt('img/confusion/note.png');
			
			
		},
		checkFinishedAllTask:function(){
			return (this.isFlower_l && this.isFlower_m && this.isFlower_s && this.isFullbucket && this.isClosewindow && this.isRepairwindow);
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.boxojb)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.fireobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.redobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.yellowobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.blueobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.switchobj_all)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.extinguisher)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.exitboxobj1)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.exitboxobj2)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.drawerobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.mackintoshObj1)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.mackintoshObj2)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.redmackintoshobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.bluemackintoshobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.yellowmackintoshobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.exitdoor)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.switchobj_lamp)
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
		putdownFlower:function(obj,oncall,oncall2){
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
					scene.putdownProp(obj,0,0,oncall2);
					scene.showFlowerImg(obj);
					scene.currentOnhandObj = null;
					if(oncall){
						oncall();
					}
				}
			});
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
								if(obj.name == 'bench'|| obj.name=='warnplate')
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
										if(propimg != 'empty'){
											if(propimg == 'img/confusion/extinguisherhand.png'){
												scene.handonProp(propimg,scene.hero.posx+x,scene.hero.posy+y);
											}else{
												scene.hero.takeProp(pickProp,x,y);
												scene.handonProp(propimg,scene.hero.posx+x,scene.hero.posy+y);
											}
										}
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
		checkall:function(){
			return (this.redmackintoshobj.state == 2 && this.bluemackintoshobj.state ==2 && this.yellowmackintoshobj.state == 2);
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorobj)){
				this.doorobj.scaleFact = 1;
				var scene = this;
				this.pickPropQuick('door','empty',this.doorobj,-80,-103,function(){
					scene.leftdoor.visible = scene.rightdoor.visible = false;
					scene.leftdoor_open.visible = scene.rightdoor_open.visible = true;
					scene.putProp();
				});
				this.fireobj.status = 1;
				this.doorobj.status = 2;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.drawerobj) && !this.boxpanel.visible){
				if(this.doorobj.status == 2 && !this.smoke.visible && this.redobj.state == 2 && this.blueobj.state == 2 && this.yellowobj.state == 2){
					this.drawerobj.scaleFact = 1;
					var scene = this;
					this.pickPropQuick('drawerobj','empty',this.drawerobj,-80,-103,function(){
						scene.drawerbg.visible = true;
						scene.hero.visible = false;
						scene.boxojb.status = 2;
						scene.mackintoshObj1.status = 1;
						scene.drawerobj.status = 2;
					});
					return true;
				}else{
					this.sayNo();
					return true;
				}
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.boxojb)){
				this.boxpanel.visible = true;
				this.hero.visible = false;
				this.boxojb.status = 2;
				if(this.redobj.state == 0)
					this.redobj.status = 1;
				if(this.blueobj.state == 0)
					this.blueobj.status = 1;
				if(this.yellowobj.state == 0)
					this.yellowobj.status = 1;
				this.exitboxobj1.status = 1;
				this.exitboxobj2.status = 1;
				
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.fireobj)){
				if(!this.currentOnhandObj){
					this.sayNo();
					return true;
				}
				var scene = this;
				this.hero.visible = false;
				this.extinguisherman.visible = true;
				this.extinguishereffect.visible = true;
				var scene = this;
				game.sounds.play(17,true);
				scene.currentOnhandImg.removeFromParent();
				new Hilo.Tween.to(scene.fireeffect,{
					alpha:0,
				},{
					duration:3000,
					
					onComplete:function(){
						scene.extinguisherman.visible = false;
						scene.extinguishereffect.visible = false;
						scene.smoke.visible = false;
						
						scene.extinguisherimg.x = scene.hero.posx + 50;
						scene.extinguisherimg.y = scene.hero.posy -120;
						scene.extinguisherimg.visible = true;
						scene.hero.visible = true;
						scene.fireobj.status = 2;
						scene.boxojb.status = 1;
						game.sounds.stop(17);
					}
				});
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.switchobj_all)){
				if(this.switchobj_all.state == 0){
					var scene = this;
					this.gotoOpenswitch(this.switchobj_all,0,0,function(){
						scene.allswtich_down.visible = true;
						scene.allswtich_up.visible = false;
						scene.switchobj_all.state = 1;
						scene.switchobj_all.status = 2;
					});
					return true;
				}
				if(this.switchobj_all.state == 1){
					var scene = this;
					this.gotoOpenswitch(this.switchobj_all,0,0,function(){
						scene.allswtich_down.visible = false;
						scene.allswtich_up.visible = true;
						scene.switchobj_all.state = 3;
						scene.switchobj_all.status = 2;
						scene.checkswitch(scene);
					});
				}
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.switchobj_lamp)){
				if(this.switchobj_lamp.state == 0){
					this.sayNo();
				}else{
					var scene = this;
					this.gotoOpenswitch(this.switchobj_lamp,0,0,function(){
						scene.lampswitch_down.visible = false;
						scene.lampswitch_up.visible = true;
						scene.switchobj_lamp.state = 3;
						scene.switchobj_lamp.status = 2;
						scene.checkswitch(scene);
					});
					return true;
				}
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.extinguisher)){
				if(this.doorobj.status == 1 || this.switchobj_all.state == 0){
					this.sayNo();
					return true;
				}
				this.extinguisher.scaleFact = 1;
				this.extinguisher.state = 2;
				var scene = this;
				this.pickPropQuick('extinguisher','img/confusion/extinguisherhand.png',this.extinguisher,-43,-103,function(){
					
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.redobj)){
				this.red01.visible = false;
				this.red02.visible = true;
				this.red1.visible = false;
				this.red2.visible = true;
				this.redobj.status = 2;
				this.redobj.state = 2;
				this.redmackintoshobj.status = 1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.blueobj)){
				this.blue01.visible = false;
				this.blue03.visible = true;
				this.blue1.visible = false;
				this.blue2.visible = true;
				this.blueobj.status = 2;
				this.blueobj.state = 2;
				this.bluemackintoshobj.status = 1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.yellowobj)){
				this.yellow01.visible = false;
				this.yellow03.visible = true;
				this.yellow1.visible = false;
				this.yellow3.visible = true;
				this.yellowobj.status = 2;
				this.yellowobj.state = 2;
				this.yellowmackintoshobj.status = 1;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.redmackintoshobj)){
				if(this.isflow){
					this.red01.visible = false;
					this.red02.visible = false;
					this.red03.visible = true;
					this.redmackintoshobj.status = 2;
					this.redmackintoshobj.state = 2;
					if(this.checkall()){
						this.switchobj_lamp.state = 1;
						this.switchobj_all.status = 1;
					}
					return true;
				}else{
					this.sayNo();
					return true;
				}
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.bluemackintoshobj)){
				if(this.isflow){
					this.blue01.visible = false;
					this.blue02.visible = true;
					this.blue03.visible = false;
					this.bluemackintoshobj.status = 2;
					this.bluemackintoshobj.state = 2;
					if(this.checkall()){
						this.switchobj_lamp.state = 1;
						this.switchobj_all.status = 1;
					}
					return true;
				}else{
					this.sayNo();
					return true;
				}
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.yellowmackintoshobj)){
				if(this.isflow){
					this.yellow01.visible = false;
					this.yellow02.visible = true;
					this.yellow03.visible = false;
					this.yellowmackintoshobj.status = 2;
					this.yellowmackintoshobj.state = 2;
					if(this.checkall()){
						this.switchobj_lamp.state = 1;
						this.switchobj_all.status = 1;
					}
					return true;
				}else{
					this.sayNo();
					return true;
				}
			}
			
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.exitboxobj1) || this.checkActiveItemWithoutPos(mouseX,mouseY,this.exitboxobj2)){
				this.boxpanel.visible = false;
				this.hero.visible = true;
				this.boxojb.status = 1;
				this.exitboxobj1.status = 2;
				this.exitboxobj2.status = 2;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.mackintoshObj1)){
				this.mackintoshImg.visible = false;
				this.mackintoshObj1.status = 2;
				this.mackintoshObj2.status = 1;
				this.mackintoshImg2.visible = true;
				var scene = this;
				scene.boxojb.status = 1;
				//if(this.boxojb.status == 1){
					//this.boxojb.status = 2;
				//}
				new Hilo.Tween.to(this,{
					alpha:1,
				},{
					duration:50,
					delay:150,
					onComplete:function(){
						scene.drawerbg.visible = false;	
						scene.hero.visible = true;
					}
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.mackintoshObj2)){
				this.isflow = true;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.exitdoor)){
				if(this.exitdoor.state == 0){
					this.sayNo();
				}else{
					game.switchScene(game.configdata.SCENE_NAMES.confusion_cinema);
				}
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
		checkswitch:function(scene){
			if(this.switchobj_all.state == 3 && this.switchobj_lamp.state == 3){
				this.bgdark.removeFromParent();
				this.bglamp.visible = true;
				this.exitdoor.state = 1;
			}
		},
		layoutBgMap:function(){
			var scene = this;
			this.atlas = new Hilo.TextureAtlas({
                image:'img/confusion/boyactions.png',
                width: 636,
                height: 624,
                frames:[[0, 0, 210, 310], [424, 312, 210, 310], [212, 0, 210, 310], [424, 0, 210, 310], [212, 312, 210, 310], [424, 312, 210, 310], [0, 312, 210, 310]],
                sprites: {
                	idle:[0,0],
                	openswitch:[0,1,2,3,4],
                }
            });
            
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
			new Hilo.Bitmap({
				image:'img/confusion/confusionbg.png',
			}).addTo(this);
			
			var redx = 584;
			var redy = 290;
			this.red1 = new Hilo.Bitmap({
				image:'img/confusion/red1.png',
				x:redx,
				y:redy,
			}).addTo(this);
			this.red2 = new Hilo.Bitmap({
				image:'img/confusion/red2.png',
				x:redx,
				y:redy,
				visible:false
			}).addTo(this);
			this.red3 = new Hilo.Bitmap({
				image:'img/confusion/red3.png',
				x:redx,
				y:redy,
				visible:false
			}).addTo(this);
			var bluex = 660;
			var bluey = 300;
			this.blue1 = new Hilo.Bitmap({
				image:'img/confusion/blue1.png',
				x:bluex,
				y:bluey,
			}).addTo(this);
			this.blue2 = new Hilo.Bitmap({
				image:'img/confusion/blue2.png',
				x:bluex,
				y:bluey,
				visible:false
			}).addTo(this);
			this.blue3 = new Hilo.Bitmap({
				image:'img/confusion/blue3.png',
				x:bluex,
				y:bluey,
				visible:false
			}).addTo(this);
			var yellowx = 580;
			var yellowy = 300;
			this.yellow1 = new Hilo.Bitmap({
				image:'img/confusion/yellow1.png',
				x:yellowx,
				y:yellowy,
			}).addTo(this);
			this.yellow2 = new Hilo.Bitmap({
				image:'img/confusion/yellow2.png',
				x:yellowx,
				y:yellowy,
				visible:false
			}).addTo(this);
			this.yellow3 = new Hilo.Bitmap({
				image:'img/confusion/yellow3.png',
				x:yellowx,
				y:yellowy,
				visible:false
			}).addTo(this);
			
			
			
			this.fireeffect = new Hilo.Sprite({
				frames:this.effectatlas.getSprite('boxfire'),
				interval:10,
				x:550,
				y:350,
			}).addTo(this);
			
			this.smoke = new Hilo.Sprite({
				frames:this.effectatlas.getSprite('smoke'),
				interval:10,
				x:550,
				y:150,
			}).addTo(this);
			
			this.extinguishereffect = new Hilo.Sprite({
				frames:this.effectatlas.getSprite('extinguisher'),
				interval:10,
				x:700,
				y:450,
				visible:false,
			}).addTo(this);
			
			this.leftdoor = new Hilo.Bitmap({
				image:'img/confusion/leftdoor.png',
				x:543,
				y:230,
				
			}).addTo(this);
			this.rightdoor = new Hilo.Bitmap({
				image:'img/confusion/rightdoor.png',
				x:657,
				y:232,
			}).addTo(this);
			
			this.leftdoor_open = new Hilo.Bitmap({
				image:'img/confusion/leftopendoor.png',
				x:543-113+26,
				y:230-26,
				visible:false,
			}).addTo(this);
			this.rightdoor_open = new Hilo.Bitmap({
				image:'img/confusion/rightopendoor.png',
				x:657+117,
				y:232-26,
				visible:false,
			}).addTo(this);
			
			this.extinguisherimg = new Hilo.Bitmap({
				image:'img/confusion/extinguisher.png',
				x:982,
				y:400,
				visible:false,
			}).addTo(this);
			
			this.lampswitch_up = new Hilo.Bitmap({
            	image:'img/confusion/lampswitchup.png',
            	x:32,
            	y:315,
            	visible:false,
            }).addTo(this);
            this.lampswitch_down = new Hilo.Bitmap({
            	image:'img/confusion/lampswitchdown.png',
            	x:32,
            	y:315,
            }).addTo(this);
            
            this.allswtich_up = new Hilo.Bitmap({
            	image:'img/confusion/switchup.png',
            	x:89,
            	y:318,
            }).addTo(this);
            this.allswtich_down = new Hilo.Bitmap({
            	image:'img/confusion/switchdown.png',
            	x:89,
            	y:318,
            	visible:false,
            }).addTo(this);
            
            
            this.extinguisherman = new Hilo.Bitmap({
            	image:'img/confusion/bakextinguisher.png',
            	x:530,
            	y:308,
            	visible:false,
            }).addTo(this);
           
            
            this.switchman = new Hilo.Sprite({
				frames:this.atlas.getSprite('idle'),
				interval:10,
				visible:false,
			}).addTo(this);
			
			this.doorobj = this.createActiveObj('door',550,224,86,314,'empty','empty',[0,0,200,200],1);
			this.boxojb = this.createActiveObj('box',550,224,86,314,'empty','empty',[0,0,200,200],2);
			this.fireobj = this.createActiveObj('fire',550,224,86,314,'empty','empty',[0,0,200,200],2);
			this.switchobj_lamp = this.createActiveObj('switchlamp',45,337,106,234,'empty','empty',[0,0,50,50],1);
			this.switchobj_all = this.createActiveObj('switchall',120,337,86,214,'empty','empty',[0,0,60,60],1);
			this.extinguisher = this.createActiveObj('extinguisher',982,400,0,150,'img/confusion/extinguisher.png','',[0,0,60,100],1);
			this.redobj = this.createActiveObj('redobj',411,357,86,314,'empty','empty',[0,0,60,60],2);
			this.blueobj = this.createActiveObj('blueobj',684,428,86,314,'empty','empty',[0,0,60,60],2);
			this.yellowobj = this.createActiveObj('yellowobj',500,440,86,314,'empty','empty',[0,0,80,50],2);
			this.exitboxobj1 = this.createActiveObj('exitboxobj1',0,40,86,314,'empty','empty',[0,0,180,600],2);
			this.exitboxobj2 = this.createActiveObj('exitboxobj2',994,40,86,314,'empty','empty',[0,0,180,600],2);
			this.drawerobj = this.createActiveObj('drawobj',238,400,86,134,'empty','empty',[0,0,140,40],1);
			
			this.redmackintoshobj = this.createActiveObj('redmackintoshobj',438,355,86,134,'empty','empty',[0,0,30,30],2);
			this.bluemackintoshobj = this.createActiveObj('bluemackintoshobj',762,386,86,134,'empty','empty',[0,0,40,40],2);
			this.yellowmackintoshobj = this.createActiveObj('yellowmackintoshobj',480,400,86,134,'empty','empty',[0,0,30,30],2);
			
			this.mackintoshObj1 = this.createActiveObj('mackintoshObj1',590,350,86,134,'empty','empty',[0,0,240,140],2);
			this.mackintoshObj2 = this.createActiveObj('mackintoshObj2',798,46,86,134,'empty','empty',[0,0,50,50],2);
			
			this.exitdoor = this.createActiveObj('exitdoor',1117,205,86,134,'empty','empty',[0,0,80,550],1);
			
			this.boxpanel = new Hilo.Container({
				visible:false,
			}).addTo(this);
			this.boxbg = new Hilo.Bitmap({
				image:'img/confusion/switchbox.png',
			}).addTo(this.boxpanel);
			var redx = 394;
			var redy = 267;
			this.red01 = new Hilo.Bitmap({
				image:'img/confusion/lred1.png',
				x:redx,
				y:redy,
			}).addTo(this.boxpanel);
			this.red02 = new Hilo.Bitmap({
				image:'img/confusion/lred2.png',
				x:redx,
				y:redy,
				visible:false
			}).addTo(this.boxpanel);
			this.red03 = new Hilo.Bitmap({
				image:'img/confusion/lred3.png',
				x:redx,
				y:redy,
				visible:false
			}).addTo(this.boxpanel);
			var bluex = 628;
			var bluey = 267;
			this.blue01 = new Hilo.Bitmap({
				image:'img/confusion/lblue1.png',
				x:bluex,
				y:bluey,
			}).addTo(this.boxpanel);
			this.blue02 = new Hilo.Bitmap({
				image:'img/confusion/lblue2.png',
				x:bluex,
				y:bluey,
				visible:false
			}).addTo(this.boxpanel);
			this.blue03 = new Hilo.Bitmap({
				image:'img/confusion/lblue3.png',
				x:bluex,
				y:bluey,
				visible:false
			}).addTo(this.boxpanel);
			var yellowx = 355;
			var yellowy = 267;
			this.yellow01 = new Hilo.Bitmap({
				image:'img/confusion/lyellow1.png',
				x:yellowx,
				y:yellowy,
			}).addTo(this.boxpanel);
			this.yellow02 = new Hilo.Bitmap({
				image:'img/confusion/lyellow2.png',
				x:yellowx,
				y:yellowy,
				visible:false
			}).addTo(this.boxpanel);
			this.yellow03 = new Hilo.Bitmap({
				image:'img/confusion/lyellow3.png',
				x:yellowx,
				y:yellowy,
				visible:false
			}).addTo(this.boxpanel);
			this.mackintoshImg2 = new Hilo.Bitmap({
				image:'img/confusion/mackintosh2.png',
				x:800,
				y:40,
				visible:false,
			}).addTo(this.boxpanel);
			
			this.drawerbg = new Hilo.Container({
				visible:false,
			}).addTo(this);
			new Hilo.Bitmap({
				image:'img/confusion/drawer.png'
			}).addTo(this.drawerbg);
			this.mackintoshImg = new Hilo.Bitmap({
				image:'img/confusion/mackintosh1.png',
				x:527,
				y:334
			}).addTo(this.drawerbg);
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.currentOnhandObj == null){
				this.hero.switchState('nocan',10);
			}
		},
		
		gotoOpenswitch:function(obj,x,y,onCall){
			var scene = this;
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
						scene.switchman.visible = true;
						scene.switchman.loop = false;
						scene.switchman.x = scene.hero.x -113;
						scene.switchman.y = scene.hero.y-285;
						scene.switchman.currentFrame = 0;
						scene.switchman._frames = scene.atlas.getSprite('openswitch');
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:800,
							onComplete:function(){
								scene.hero.visible = true;
								scene.switchman.visible = false;
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
										scene.switchman.currentFrame = 0;
										scene.switchman.loop = true;
										scene.switchman.play();
										scene.switchman._frames = scene.atlas.getSprite('idle');
										if(onCall)
											onCall();
									}
								});
							}
						})
				);
		},
		onUpdate:function(){
			this.sumtime++;
			if(this.sumtime == 100){
				game.drdialog.hide();
			}
			if(this.isflow){
				this.mackintoshImg2.x = this.fingerMouse.x;
				this.mackintoshImg2.y = this.fingerMouse.y;
			}
		},
	});
})(window.game);