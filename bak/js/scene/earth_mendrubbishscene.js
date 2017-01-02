(function(ns) {
	var EarthMendrubbishscene = ns.EarthMendrubbishscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earth_mendrubbishmachine,
		
		initPosx:720,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		glove:null,
		flasheffect:null,
		
		step1_onglove:false,
		step2_cutoff:false,
		step3_opendoor:false,
		step4_pickgear:false,
		step5_installgear:false,
		step6_offstick:false,
		step7_closedoor:false,
		
		constructor: function(properties) {
			EarthMendrubbishscene.superclass.constructor.call(this, properties);
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
			this.items = {};
			
			this.layoutBgMap();
			this.addHero(null,this.initPosx,this.initPosy);
			
			this.currentkey = 'empty';
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			
			this.layoutUI();
			
			game.sounds.play(14,true);
			this.step1_dialogover = false;
			this.step2_takewheel = false;
			this.step3_installwheel = false;
			this.step4_inshovel = false;
			
			
			this.glove = new Hilo.Bitmap({
				image:'img/earth/6/gloveonhand.png',
				visible:false,
			}).addTo(this);
			
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			for(var i in this.items){
				var obj = this.items[i];
				if(obj.status != null){
					if(this.checkActiveItemWithoutPos(mouseX,mouseY,obj)){
						return true;
					}
				}
			}
			return false;
		},
		
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		showGlove:function(ishide){
			var x= this.hero.posx-35;
			var y = this.hero.posy-109;
			this.glove.x = x;
			this.glove.y = y;
			this.glove.visible = ishide;
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['glove'])){
				var obj = this.items['glove'];
				var scene = this;
				scene.step1_onglove = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    scene.showGlove(true);
					    obj.visible = false;
					    obj.status = 2;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['gearonfloor'])){
				if(!this.step3_opendoor){
					this.sayNo();
					return true;
				}
				var obj = this.items['gearonfloor'];
				var scene = this;
				this.step4_pickgear = true;
				scene.showGlove(false);
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    scene.showGlove(true);
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/earth/6/gear.png',690,530);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['gearobj'])){
				if(!this.step4_pickgear){
					this.sayNo();
					return true;
				}
				var obj = this.items['gearobj'];
				var scene = this;
				this.step5_installgear = true;
				scene.showGlove(false);
				scene.items['stick'].status = 1;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    scene.showGlove(true);
					    obj.visible = true;
					    obj.status = 2;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stick'])){
				if(!this.step5_installgear){
					this.sayNo();
					return true;
				}
				var obj = this.items['stick'];
				var scene = this;
				this.step6_offstick = true;
				scene.showGlove(false);
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    scene.showGlove(true);
					    obj.status = 2;
					    obj.y = 430;
						obj.x = 860;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['cutoffup'])){
				if(!this.step1_onglove){
					this.sayNo();
					return true;
				}
				this.step2_cutoff = true;
				var obj = this.items['cutoffup'];
				var scene = this;
				scene.showGlove(false);
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.items['cutoffdown'].visible = true;
					    scene.items['cutoffdown'].status = 1;
						scene.showGlove(true);
						scene.flasheffect.visible = false;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['cutoffdown'])){
				if(!this.step7_closedoor){
					this.sayNo();
					return true;
				}
				var obj = this.items['cutoffdown'];
				var scene = this;
				scene.showGlove(false);
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.items['cutoffup'].visible = true;
						scene.showGlove(true);
						scene.flasheffect.visible = false;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['closedoor'])){
				if(!this.step2_cutoff){
					this.sayNo();
					return true;
				}
				this.step3_opendoor = true;
				var obj = this.items['closedoor'];
				var scene = this;
				scene.showGlove(false);
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.items['opendoor'].visible = true;
					    scene.items['opendoor'].status = 1;
						scene.showGlove(true);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['opendoor'])){
				if(!this.step6_offstick){
					this.sayNo();
					return true;
				}
				this.step7_closedoor = true;
				var obj = this.items['opendoor'];
				var scene = this;
				scene.showGlove(false);
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.items['closedoor'].visible = true;
					    scene.items['cutoffup'].status = 1;
						scene.showGlove(true);
					});
				return true;
			}
			
			
			return false;
		},
		
		pickSomething:function(obj,action,offsetx,offsety,onhandimg,time){
			var scene = this;
			scene.gotoDosomething(obj,1,0,0,action,time,function(){

					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.handonProp(onhandimg,scene.hero.posx+offsetx,scene.hero.posy+offsety);
					});
		},
		gotoDosomething:function(targetobj,scaleFact,x,y,playaction,delay,onCall1,onCall2){
			var scene = this;
			scene.ignoreTouch = true;
			var targetx = targetobj.x + targetobj.targetx;
			var targety = targetobj.y + targetobj.targety;
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
						scene.hero.visible = false;
						scene.playboy.visible = true;
						scene.playboy.loop = false;
						scene.playboy.x = scene.hero.posx -115;
						scene.playboy.y = scene.hero.posy -283;
						scene.playboy.currentFrame = 0;
						scene.playboy.scaleX = scaleFact;
						scene.playboy.scaleY = scaleFact;
						scene.playboy._frames = scene.atlas.getSprite(playaction);
						scene.playboy.play();
						if(onCall1){
							onCall1();
						}
						game.sounds.play(19,false);
					}
				}).link(
					new Hilo.Tween.to(scene,{
							alpha:1,
						},{
							duration:310,
							delay:delay,
							onComplete:function(){
								scene.hero.visible = true;
								scene.playboy.visible = false;
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
										if(onCall2)
											onCall2();
									}
								});
							}
						})
				);
		},
		receiveMsg: function(msg) {
			console.log('Not Remove');	
		},
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		createActiveObj:function(objname,x,y,targetx,targety,readyImgurl,clickrect,status,isvisible){
			return new game.ActiveObject({
				name:objname,
				x:x,
				y:y,
				targetx:targetx,
				targety:targety,
				readyImgUrl:readyImgurl,
				finishedImgUrl:readyImgurl,
				clickArea:clickrect,
				status:status,
				visible:isvisible,
			}).addTo(this);
		},
		layoutUIElement:function(baseurl,arraydata){
			for(var i=0;i<arraydata.length;i++){
				var item = arraydata[i];
				var itemtype = item[0];
				var type = game.configdata.LAYOUTTYPE.activeobj;
				if(itemtype == 1)
					type = game.configdata.LAYOUTTYPE.img;
				var obj = item[1];
				var img = item[2];
				img = baseurl+img;
				if(type == game.configdata.LAYOUTTYPE.activeobj){
					var status = item[3];
					var x = item[4];
					var y = item[5];
					var targetx = item[6];
					var targety = item[7];
					var clickrect = item[8];
					var isvisible = item[9]=='t';
					this.items[obj] = this.createActiveObj(obj,x,y,targetx,targety,img,clickrect,status,isvisible);
				}
				if(type == game.configdata.LAYOUTTYPE.img){
					var obj = item[1];
					var x = item[3];
					var y = item[4];
					var isvisible = item[5]=='t';
					this.items[obj] = new Hilo.Bitmap({image:img,x:x,y:y,visible:isvisible}).addTo(this);
				}
			}
		},
		layoutBgMap:function(){
			var scene = this;
			var data = [
[1, 'bg', 'earth6bg.jpg', 0, 0, 't'],
[1, 'block', 'block.png', 1076, 385, 't'],
[1, 'block1', 'block1.png', 1086, 364, 't'],
[1, 'block2', 'block2.png', 996, 389, 't'],
[1, 'block3', 'block3.png', 893, 333, 't'],
[2, 'stick', 'stick.png', 2,657, 245, 42,221,[0,0,120,60],'t'],
[2, 'gearobj', 'gear.png', 1,721, 281, 36,190,[0,0,60,60],'f'],
[2, 'gearonfloor', 'gear.png', 1,470, 426, 20,80,[0,0,60,60],'t'],
[2, 'closedoor', 'closedoor.png', 1,659, 229, 66,250,[0,0,130,160],'t'],
[2, 'opendoor', 'opendoor.png', 2,782, 208, 30,270,[0,0,80,200],'f'],
[2, 'cutoffup', 'cutoff1.png', 1,584, 284,28,198,[0,0,50,40],'t'],
[2, 'cutoffdown', 'cutoff2.png', 2,584, 305, 30,150,[0,0,50,40],'f'],
[2, 'glove', 'glove.png', 1,20, 492, 20,70,[0,0,140,60],'t'],

			];
		
			this.layoutUIElement('img/earth/6/',data);

			this.atlas = new Hilo.TextureAtlas({
                image:'img/earth/6/earth6boyatlas.png',
                width:848,
                height:936,
                frames:[[424, 312, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [636, 0, 210, 310], [212, 0, 210, 310], [212, 624, 210, 310], [424, 312, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [212, 312, 210, 310], [424, 624, 210, 310]],
                sprites: {
                	pick:{from:0,to:6},
                	turn:{from:7,to:11},
                }
            });

            var flashatlas = new Hilo.TextureAtlas({
                image:'img/earth/6/flasheffect.png',
                width: 252,
                height: 147,
                frames:[[63, 0, 61, 145], [126, 0, 61, 145], [189, 0, 61, 145], [0, 0, 61, 145]],
                sprites: {
                	idle:[0,1,2,3],
                }
            });
            this.flasheffect = this.createSprite(flashatlas,'idle',629,237,10,this);
            this.playboy = this.createSprite(this.atlas,'pick',1023,211,6,this);
            this.playboy.visible = false;
		},
		
		createSprite:function(sourceatlas,defaultaction,x,y,interval,parent){
			return new Hilo.Sprite({
				frames:sourceatlas.getSprite(defaultaction),
				interval:interval,
				x:x,
				y:y,
			}).addTo(parent);
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.currentOnhandObj == null){
				//this.hero.switchState('nocan',10);
			}
		},
		
		onUpdate:function(){
			
		},
	});
})(window.game);