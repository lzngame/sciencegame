(function(ns) {
	var ConfusionDoorwayscene = ns.ConfusionDoorwayscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.confusion_cinema,
		guardobj:null,
		guardsprite:null,
		doorcard:null,
		doorimg_1:null,
		doorimg_2:null,
		doorobj:null,
		curtainobj:null,
		curtainimg:null,
		doorswitch:null,
		door:null,
		besom:null,
		besomimg:null,
		besomimg2:null,
		
		
		initPosx:750,
		initPosy:590,
		currentOnhandObj:null,
		currentOnhandImg:null,
		
		isdoorflash:false,
		flashtime:0,
		ischange:false,
		
		public1:null,
		public2:null,
		public3:null,
		
		atlas:null,
		constructor: function(properties) {
			ConfusionDoorwayscene.superclass.constructor.call(this, properties);
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
			this.isdoorflash = false;
			this.flashtime = 0;
			
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
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.guardobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorcard)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.curtainobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorswitch)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.besom)
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.guardobj)){
				var scene = this;
				this.dosomethingAndback(this.guardobj,this.herobody,'havehand',540,340-53,function(){
					scene.guardsprite.currentFrame = 0;
					scene.guardsprite.loop = false;
					scene.guardobj.status = 2;
					scene.doorcard.status = 1;
					
					scene.guardsprite._frames = scene.atlas.getSprite('guardstandup');
				},function(){
					scene.guardsprite.x += 80;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorcard)){
				var scene = this;
				this.dosomethingAndback(this.doorcard,this.herobody,'havehand',630,340-53,function(){
					scene.guardsprite.currentFrame = 0;
					scene.guardsprite._frames = scene.atlas.getSprite('guardstandupnocard');
					scene.doorcard.status = 2;
					scene.doorswitch.state = 1;
				},function(){
					scene.handonProp('img/confusion/cardonhand.png',700,491);
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorswitch)){
				if(this.doorswitch.state == 0){
					this.sayNo();
					return true;
				}
				var scene = this;
				this.dosomethingAndback(this.doorswitch,this.herobody,'backput',630-160,340-98,function(){
					scene.currentOnhandImg.removeFromParent();
					scene.doorswitch.status = 2;
				},function(){
					scene.isdoorflash = true;
					scene.doorobj.status = 1;
					scene.curtainobj.state = 1;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.curtainobj)){
				if(this.curtainobj.state == 0){
					this.sayNo();
					return true;
				}
				var scene = this;
				this.dosomethingAndback(this.curtainobj,this.herobody,'backput',228,261,function(){
					
				},function(){
					scene.curtainimg.x -= 50;
					scene.besom.status = 1;
					scene.curtainobj.status = 2;
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.besom)){
				var scene = this;
				this.dosomethingAndback(this.curtainobj,this.herobody,'backput',228,261,function(){
					scene.besomimg.removeFromParent();
				},function(){
					scene.besom.status = 2;
					scene.doorobj.state = 1;
					scene.handonProp('img/confusion/besomonhand.png',607,450);
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorobj)){
				if(this.doorobj.state == 0){
					this.sayNo();
					return true;
				}
				var scene = this;
				this.dosomethingAndback(this.doorobj,this.herobody,'backput',228+166,261,function(){
					scene.currentOnhandImg.removeFromParent();
				},function(){
					scene.doorobj.status = 2;
					scene.isdoorflash = false;
					scene.doorimg_1.visible = false;
					scene.doorimg_2.visible = true;
					scene.besomimg2.visible = true;
					new Hilo.Tween.to(this,{
						alpha:1,
					},{
						delay:2000,
						duration:300,
						onComplete:function(){
							scene.publicgoaway();
						}
					});
				});
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
				image:'img/confusion/doorwaybg.png',
			}).addTo(this);
			
			
			this.besomimg =  new Hilo.Bitmap({image:'img/confusion/besom1.png',x:310,y:320}).addTo(this);
			this.doorimg_1 = new Hilo.Bitmap({image:'img/confusion/doorone.png',x:907-526,y:140-87}).addTo(this);
			this.doorimg_2 = new Hilo.Bitmap({image:'img/confusion/doorone2.png',x:907-526,y:140-87,visible:false}).addTo(this);
			this.curtainimg = new Hilo.Bitmap({image:'img/confusion/curtain.png',x:907-717+66,y:-15}).addTo(this);
			this.besomimg2 =  new Hilo.Bitmap({image:'img/confusion/besom2.png',x:460,y:400,visible:false}).addTo(this);
			
			this.atlas = new Hilo.TextureAtlas({
                image:'img/confusion/doorwayatlas.png',
                width: 961,
                height:936,
                frames:[[0, 312, 210, 310], [212, 624, 210, 310], [212, 0, 210, 310], [212, 0, 210, 310], [212, 0, 210, 310], [212, 624, 210, 310], [0, 312, 210, 310], [212, 312, 210, 310], [0, 624, 210, 310], [0, 0, 210, 310], [212, 312, 210, 310], [424, 0, 177, 351], [603, 353, 177, 351], [782, 0, 177, 351], [424, 353, 177, 351], [603, 0, 177, 351]],
                sprites: {
                	idle:[0],
                	guardsitdown:[11],
                	guardstandup:[11,12,13],
                	guardstandupnocard:[15],
                	backput:[0,1,2,3,4,5,6],
                	havehand:[7,8,9,10]
                }
            });
            
            var menatlas = new Hilo.TextureAtlas({
                image:'img/confusion/publicmen.png',
                width: 768,
                height:852,
                frames:[[0,426,382,424],[0,0,382,424],[384,0,382,424]],
                sprites: {
                	idle:[0,1,2],
                }
            });
            
            this.guardsprite = new Hilo.Sprite({
				frames:this.atlas.getSprite('guardsitdown'),
				interval:10,
				x:510,
				y:225,
			}).addTo(this);
			
			this.herobody = new Hilo.Sprite({
				frames:this.atlas.getSprite('idle'),
				interval:10,
				x:510,
				y:225,
				visible:false,
			}).addTo(this);
			
			this.guardobj =    this.createActiveObj('guard',this.guardsprite.x,this.guardsprite.y,224,342,'empty','empty',[30,80,100,200],1);
			this.doorcard =    this.createActiveObj('card',655,382,103,190,'empty','empty',[0,0,40,40],2);
			this.doorswitch =  this.createActiveObj('doorswitch',590,315,29,250,'empty','empty',[0,0,40,40],1);
			this.curtainobj =  this.createActiveObj('curtain',292,0,29,550,'empty','empty',[0,0,80,500],1);
			this.besom =  this.createActiveObj('besom',339,357,29,150,'empty','empty',[0,0,50,120],2);
			this.doorobj =  this.createActiveObj('doorobj',408,85,77,446,'empty','empty',[0,0,150,420],2);
			
			this.public1 = new Hilo.Sprite({
				frames:menatlas.getSprite('idle'),
				interval:10,
				x:0,
				y:425,
				scaleX:0.8,
				scaleY:0.8,
			}).addTo(this);
			this.public2 = new Hilo.Sprite({
				frames:menatlas.getSprite('idle'),
				interval:15,
				x:830,
				y:425,
				scaleX:0.8,
				scaleY:0.8,
			}).addTo(this);
			this.public3 = new Hilo.Sprite({
				frames:menatlas.getSprite('idle'),
				interval:15,
				x:930,
				y:425,
				scaleX:0.8,
				scaleY:0.8,
			}).addTo(this);
		},
		publicgoaway:function(){
			new Hilo.Tween.to(this.public1,{
				x:445,
				y:242,
				alpha:0,
			},{
				duration:2200,
			});
			new Hilo.Tween.to(this.public2,{
				x:445,
				y:242,
				alpha:0,
			},{
				duration:2220,
			});
			new Hilo.Tween.to(this.public3,{
				x:445,
				y:242,
				alpha:0,
			},{
				duration:2230,
				onComplete:function(){
					game.switchScene(game.configdata.SCENE_NAMES.passchoice);
				}
			});
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
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:310,
							delay:100,
							onComplete:function(){
								scene.hero.visible = true;
								spriteObj.visible = false;
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
										spriteObj.currentFrame = 0;
										spriteObj.loop = true;
										spriteObj.play();
										if(onCall2)
											onCall2();
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
			if(this.isdoorflash){
				this.flashtime ++;
				if(this.flashtime > 30){
					this.flashtime = 0;
					this.ischange = !this.ischange;
				}
				if(this.ischange){
					this.doorimg_1.visible = true;
					this.doorimg_2.visible = false;
				}else{
					this.doorimg_1.visible = false;
					this.doorimg_2.visible = true;
				}
			}
		},
	});
})(window.game);