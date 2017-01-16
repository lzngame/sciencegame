(function(ns) {
	var PlaneOutsidescene = ns.PlaneOutsidescene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.plane_outside,
		helpnote:'img/notes/plane/plane3help.png',
		
		pinkbox:null,
		safetybelt:null,
		doorimg:null,
		doormask:null,
		beltbg:null,
		shoesobj:null,
		exitobj:null,
		aobj:null,
		bobj:null,
		cobj:null,
		beltatlas:null,
		atlas:null,
		sitman:null,
		
		initPosx:974,
		initPosy:580,
		currentOnhandObj:null,
		currentOnhandImg:null,
		
		duigouWrongimg:null,
		duigouRightimg:null,
		
		sumtime:0,
		constructor: function(properties) {
			PlaneOutsidescene.superclass.constructor.call(this, properties);
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
			this.hero.visible = false;
			this.sumtime = 0;
			
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			
			game.sounds.play(14,true);
			this.beltbg = new Hilo.Bitmap({image:'img/plane/beltbg.png',visible:false}).addTo(this);
			this.beltsprite = new Hilo.Sprite({
				frames:this.beltatlas.getSprite('closefail'),
				interval:10,
				visible:false,
			}).addTo(this);
			this.setHelp();
			
            this.showDialog('img/plane/plane3showfirst.png');
			
			
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.aobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.bobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.cobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.pinkbox)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.safetybelt)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doormask)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.shoesobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.exitobj)
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
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.safetybelt)){
				var scene = this;
				this.beltbg.visible = true;
				this.beltsprite.visible = true;
				this.beltsprite.loop = false;
				this.beltsprite.currentFrame = 0;
				this.beltsprite._frames = this.beltatlas.getSprite('takeout');
				this.safetybelt.status = 2;
				
				new Hilo.Tween.to(this,{alpha:1},{duration:100,delay:1500,onComplete:function(){
					scene.hero.visible = true;
					scene.beltbg.removeFromParent();
					scene.beltsprite.removeFromParent();
					scene.sitman.visible = false;
				}});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.pinkbox)){
				if(this.safetybelt.status == 1){
					this.sayNo();
					return true;
				}
				var scene = this;
				this.pinkbox.scaleFact = 1;
				scene.pickProp('pinkbox',this.pinkbox,297,567,function(){
					scene.pinkbox.x += 200;
					scene.pinkbox.status = 2;
				});
				return true;
			}
			
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.doormask)){
				if(this.safetybelt.status == 1 || this.pinkbox.status == 1){
					this.sayNo();
					return true;
				}
				var scene = this;
				if(this.doormask.state == 0){
					scene.dosomethingAndback(this.doormask,this.sitman,'opendoor',183,283,function(){
						scene.ignoreTouch = false;
						scene.doormask.state = 2;
						scene.maskimg.scaleY = -1;
					},function(){
					
					});
				}else{
					scene.dosomethingAndback(this.doormask,this.sitman,'opendoor',183,283,function(){
						scene.doormask.status = 2;
						scene.doorimg.removeFromParent();
						scene.maskimg.removeFromParent();
						scene.shoesobj.status = 1;
						scene.ignoreTouch = false;
						scene.exitobj.status = 1;
					},function(){
					
					});
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.shoesobj)){
				if(this.safetybelt.status == 1){
					this.sayNo();
					return true;
				}
				var scene = this;
				scene.sitman.currentFrame = 0;
				scene.sitman._frames = scene.atlas.getSprite('takeoutshoes');
				scene.sitman.play();
				scene.shoesobj.status = 2;
				
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.exitobj)){
				if(this.safetybelt.status == 1 || this.shoesobj.status == 1){
					this.sayNo();
					return true;
				}else{
					var scene = this;
					game.drdialog.showTxt('img/plane/noteexit.png');
					this.aobj.visible = true;
					this.aobj.status = 1;
					this.bobj.visible = true;
					this.bobj.status = 1;
					this.cobj.visible = true;
					this.cobj.status = 1;
				}
				
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.aobj)){
				var scene = this;
				this.duigouWrongimg.visible = true;
				this.duigouWrongimg.x = this.aobj.x-50;
				this.duigouWrongimg.y = this.aobj.y-50;
				this.duigouRightimg.visible = false;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.bobj)){
				var scene = this;
				this.duigouWrongimg.visible = true;
				this.duigouWrongimg.x = this.bobj.x-50;
				this.duigouWrongimg.y = this.bobj.y-50;
				this.duigouRightimg.visible = false;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.cobj)){
				var scene = this;
				this.duigouWrongimg.removeFromParent();
				this.duigouRightimg.x = this.cobj.x-50;
				this.duigouRightimg.y = this.cobj.y-100;
				this.duigouRightimg.visible = true;
				this.aobj.status = 2;
				this.bobj.status = 2;
				new Hilo.Tween.to(this,{alpha:1},{
					duration:500,
					delay:500,
					onComplete:function(){
						game.drdialog.hide();
						scene.aobj.removeFromParent();
						scene.bobj.removeFromParent();
						scene.cobj.removeFromParent();
						scene.duigouRightimg.removeFromParent();
						scene.sitman.currentFrame = 0;
						scene.sitman._frames = scene.atlas.getSprite('dunxia');
						scene.sitman.play();
						new Hilo.Tween.to(scene.sitman,
							{
								alpha:0.1,
								scaleX:0.4,
								scaleY:0.4,
								x:263,
								y:404
							},{
							duration:500,
							delay:1000,
							onComplete:function(){
								scene.passoverReady('img/notes/plane/planeintroduce.png',500,game.configdata.SCENE_NAMES.main);
								//scene.passoverReady('img/notes/plane/planeintroduce.png',500,game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.calamity);
								//game.switchScene(game.configdata.SCENE_NAMES.passchoice);
							}
						});
					}
				});
				return true;
			}
			return false;
		},
		pickProp:function(pickProp,obj,x,y,onCall){
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
									posx:x,
									posy:y,
									scaleX:1,
									scaleY:1,
									
								},{
									duration:120,
									delay:620,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.ignoreTouch = false;
										if(onCall)
											onCall();
									}
								});
							}
						})
				);
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
				image:'img/plane/planeoutsidebg.png',
			}).addTo(this);
			
			
			this.doorimg =  new Hilo.Bitmap({image:'img/plane/planedoor.png',x:228,y:222}).addTo(this);
			this.maskimg =  new Hilo.Bitmap({image:'img/plane/masktop1.png',x:272,y:241,alpha:0.8}).addTo(this);
			
			this.atlas = new Hilo.TextureAtlas({
                image:'img/plane/plane3atlas.png',
                width: 1060,
                height:936,
                frames:[[424, 624, 210, 310], [424, 312, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [636, 624, 210, 310], [848, 0, 210, 310], [848, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [848, 624, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	idle:[0],
                	opendoor:[12,13,14,15,16,17,12],
                	takeoutshoes:[1,2,3,4,5,6,7,8,9],
                	dunxia:[9,11,10],
                }
            });
            
            
            this.beltatlas = new Hilo.TextureAtlas({
                image:'img/plane/beltatlas.png',
                width: 2408,
                height:2752,
				frames:[[0, 0, 1202, 686], [0, 2064, 1202, 686], [1204, 1376, 1202, 686], [0, 2064, 1202, 686], [1204, 1376, 1202, 686], [1204, 688, 1202, 686], [1204, 0, 1202, 686], [1204, 2064, 1202, 686], [0, 1376, 1202, 686], [0, 688, 1202, 686]],
                sprites: {
                	closefail:[0,0,0,0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,5],
                	closeok:[5,6,7,8,9],
                	takeout:[9,9,9,8,7,6,5],
                	step1:[6,6],
                	step2:[6,7,8]
                }
            });
            
            this.sitman = new Hilo.Sprite({
				frames:this.atlas.getSprite('idle'),
				interval:10,
				x:640-150+405,
				y:376-94-10,
			}).addTo(this);
			
			this.pinkbox =     this.createActiveObj('pinkbox',220,480,76,80,'img/plane/pinkbox.png','empty',[0,0,170,60],1);
			this.doormask =    this.createActiveObj('doormask',282,249,13,318,'empty','empty',[0,0,60,40],1);
			this.safetybelt =  this.createActiveObj('safetybelt',1002,424,29,250,'img/plane/belt2.png','empty',[0,0,60,60],1);
			this.shoesobj =    this.createActiveObj('shoesobj',266,534,13,318,'empty','empty',[0,0,90,40],2);
			this.exitobj =     this.createActiveObj('exitobj',240,240,13,318,'empty','empty',[0,0,150,290],2);
			
			this.aobj =     this.createActiveObj('aobj',565,404-338,76,80,'img/plane/aobj.png','empty',[0,0,90,90],2);
			this.aobj.visible = false;
			this.bobj =     this.createActiveObj('bobj',565+110,404-338,76,80,'img/plane/bobj.png','empty',[0,0,90,90],2);
			this.bobj.visible = false;
			this.cobj =     this.createActiveObj('cobj',565+220,404-338,76,80,'img/plane/cobj.png','empty',[0,0,90,90],2);
			this.cobj.visible = false;
			this.duigouRightimg =  new Hilo.Bitmap({image:'img/plane/duigou2.png',x:228,y:222,visible:false}).addTo(this);
			this.duigouWrongimg =  new Hilo.Bitmap({image:'img/plane/duigou1.png',x:228,y:222,visible:false}).addTo(this);
			new Hilo.Bitmap({image:'img/plane/handrail.png',x:1002,y:426}).addTo(this);
		},
		
		dosomethingAndback:function(obj,spriteObj,spriteAction,x,y,onCall1,onCall2){
			var scene = this;
			//scene.currentOnhandImg.removeFromParent();
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
						if(onCall1){
							onCall1();
						}
						scene.hero.visible = false;
						spriteObj.visible = true;
						spriteObj.loop = false;
						spriteObj.x = x;
						spriteObj.y = y;
						spriteObj.currentFrame = 0;
						spriteObj._frames = scene.atlas.getSprite(spriteAction);
						spriteObj.play();
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:310,
							delay:100,
							onComplete:function(){
								
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