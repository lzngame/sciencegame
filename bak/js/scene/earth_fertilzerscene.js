(function(ns) {
	var EarthFertilizerscene = ns.EarthFertilizerscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earth_fertilizer,
		helpnote:'img/notes/earth/earth5help.png',
		
		initPosx:720,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		step1_dialogover:false,
		step2_takewheel:false,
		step3_installwheel:false,
		step4_inshovel:false,
		step4_carleft:false,
		
		constructor: function(properties) {
			EarthFertilizerscene.superclass.constructor.call(this, properties);
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
			this.setHelp();
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
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['farmer'])){
				var obj = this.items['farmer'];
				var scene = this;
				obj.status = 2;
				this.items['dialog1'].visible = true;
				this.items['dialog1'].status = 1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['dialog1'])){
				var obj = this.items['dialog1'];
				obj.status = 2;
				obj.visible = false;
				this.items['dialog2'].visible = true;
				this.items['dialog2'].status = 1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['dialog2'])){
				var obj = this.items['dialog2'];
				obj.status = 2;
				obj.visible = false;
				this.items['dialog3'].visible = true;
				this.items['dialog3'].status = 1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['dialog3'])){
				var obj = this.items['dialog3'];
				obj.status = 2;
				obj.visible = false;
				this.items['shovel'].status = 1;
				this.step1_dialogover = true;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['wheel'])){
				if(!this.step1_dialogover){
					this.sayNo();
					return true;
				}
				var obj = this.items['wheel'];
				var scene = this;
				this.step2_takewheel = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    scene.handonProp('img/earth/5/wheelonfloor.png',685,508);
					    obj.visible = false;
					    obj.status = 2;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['carwithnotwheel'])){
				if(!this.step2_takewheel){
					this.sayNo();
					return true;
				}
				var obj = this.items['carwithnotwheel'];
				var scene = this;
				scene.currentOnhandImg.removeFromParent();
				this.step3_installwheel = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.items['car'].visible = true;
					    scene.items['car'].status = 1;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['car'])){
				if(!this.step3_installwheel){
					this.sayNo();
					return true;
				}
				var obj = this.items['car'];
				obj.status = 2;
				var scene = this;
				this.step4_carleft = true;
				new Hilo.Tween.to(obj,{x:348},{duration:100});
				new Hilo.Tween.to(scene.hero,{posx:350,posy:545},{duration:100});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['field'])){
				var obj = this.items['field'];
				var car = this.items['car'];
				var scene = this;
				new Hilo.Tween.to(car,{x:719,y:246,scaleX:0.5,scaleY:0.5},{duration:100});
				new Hilo.Tween.to(scene.hero,{posx:834,posy:286,scaleX:0.5,scaleY:0.5},{duration:100,onComplete:function(){
					scene.items['block'].visible = false;
					scene.items['car'].visible = false;
					scene.items['carput'].visible = true;
					scene.passoverReady('img/nextpasspoint.png',2000,game.configdata.SCENE_NAMES.earth_mendrubbishmachine);
				}});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['shovel'])){
				if(!this.step4_carleft){
					this.sayNo();
					return true;
				}
				var obj = this.items['shovel'];
				var scene = this;
				obj.status = 2;
				obj.visible = false;
				this.step4_inshovel = true;
				scene.gotoDosomething(obj,1,0,0,'turn',300,function(){
						
					},function(){
					    scene.handonProp('img/earth/5/shovelonhand.png',333,427);
					    scene.items['fertilizerobj'].status = 1;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['fertilizerobj'])){
				var obj = this.items['fertilizerobj'];
				var scene = this;
				obj.status = 2;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'shovel',800,function(){
						
					},function(){
						scene.items['shovel'].visible = true;
						scene.items['block'].visible = true;
						scene.items['field'].status = 1;
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
[1, 'bg', 'earth5bg.jpg', 0, 0, 't'],
[1, 'rice1', 'rice1.png', 334, 240, 't'],
[1, 'rice2', 'rice2.png', 334, 240, 't'],
[1, 'carput', 'carput.png', 720, 207, 'f'],

[2, 'carwithnotwheel', 'carwithnotwheel.png', 1,784, 389, 98,130,[0,0,120,120],'t'],
[2, 'car', 'car.png', 2,785, 390, 20,80,[0,0,120,120],'f'],
[1, 'block', 'fertilizer1.png', 393, 400, 'f'],
[2, 'fertilizerobj', 'empty', 2,92, 414, 276,127,[0,0,230,120],'t'],
[2, 'field', 'empty', 2,0, 0, 276,127,[0,0,1180,370],'t'],
[2, 'farmer', 'farmer.png', 1,76, 410,0,0,[0,0,140,140],'t'],
[2, 'shovel', 'shovel.png', 1,278, 383, 30,150,[0,0,60,60],'t'],
[2, 'wheel', 'wheelonfloor.png', 1,489, 391, 20,70,[0,0,90,60],'t'],
[2, 'dialog1', 'dialog1.png', 2,283, 309, 40,70,[0,0,420,170],'f'],
[2, 'dialog2', 'dialog2.png', 2,153, 253, 40,70,[0,0,270,150],'f'],
[2, 'dialog3', 'dialog3.png', 2,279, 220, 40,70,[0,0,420,270],'f'],
			];
		
			this.layoutUIElement('img/earth/5/',data);
			this.items['carput'].scaleX = 0.5;
			this.items['carput'].scaleY = 0.5;

			this.atlas = new Hilo.TextureAtlas({
                image:'img/sky/6/sky6boyatlas.png',
                width:1060,
                height:936,
                frames:[[424, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 624, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [424, 312, 210, 310], [848, 0, 210, 310], [424, 312, 210, 310], [424, 312, 210, 310], [848, 0, 210, 310], [424, 312, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 0, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	shovel:[0,0,1,1,2,2,3,3,0,0,1,1,2,2,3,3],
                	pick:{from:4,to:14},
                	turn:{from:15,to:18},
                }
            });
           
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