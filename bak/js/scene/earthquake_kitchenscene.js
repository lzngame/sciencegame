(function(ns) {
	var Earthquakekitchenscene = ns.Earthquakekitchenscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earthquake_kitchen,
		helpnote:'img/notes/earthquake/earthquake2help.png',
		
		initPosx:550,
		initPosy:573,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		step1_extinguisher:false,
		step2_pickspanner:false,
		step3_closegas:false,
		step4_pickrag:false,
		
		step4_pickstool:false,
		step5_putstool:false,
		step6_takerubber:false,
		step7_putrubber:false,
		
		constructor: function(properties) {
			Earthquakekitchenscene.superclass.constructor.call(this, properties);
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
			
			this.step1_extinguisher = false;
			this.step2_pickspanner = false;
			this.step3_closegas = false;
			this.step4_pickrag = false;
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['extinguisher'])){
				var obj = this.items['extinguisher'];
				var scene = this;
				this.step1_extinguisher = true;
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/earthquake/2/extinguisher.png',521,475);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['ragdown'])){
				var obj = this.items['ragdown'];
				var scene = this;
				this.step4_pickrag  = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/earthquake/2/ragup.png',521,475);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['fireobj'])){
				if(!this.step1_extinguisher){
					this.sayNo();
					return true;
				}
				var obj = this.items['fireobj'];
				var scene = this;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'extinguisher',2300,function(){
						scene.extinguishereffect.visible = true;
						new Hilo.Tween.to(scene.fireeffect,{alpha:0},{duration:2000,onComplete:function(){
							scene.extinguishereffect.removeFromParent();
						}});
					},function(){
					    obj.status = 2;
						scene.items['extinguisher'].visible = true;
						scene.items['extinguisher'].x = 749;
						scene.items['extinguisher'].y = 536;
						scene.items['wrench'].status  = 1;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['wrench'])){
				var obj = this.items['wrench'];
				var scene = this;
				this.step2_pickspanner = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/earthquake/2/wrenchonhand.png',501,443);
					});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['switch'])){
				if(!this.step2_pickspanner){
					this.sayNo();
					return true;
				}
				var obj = this.items['switch'];
				var scene = this;
				this.step3_closegas = true;
				scene.currentOnhandImg.removeFromParent();
				obj.status = 2;
				scene.gotoDosomething(obj,1,0,0,'spanner',1000,function(){
						
					},function(){
						scene.gaseffect.visible = false;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['handler'])){
				if(!this.step4_pickrag){
					this.sayNo();
					return true;
				}
				var obj = this.items['handler'];
				var scene = this;
				scene.currentOnhandImg.removeFromParent();
				obj.status = 2;
				scene.gotoDosomething(obj,1,0,0,'door',500,function(){
						
					},function(){
						scene.handonProp('img/earthquake/2/ragup.png',237,400);
						scene.passoverReady('img/nextpasspoint.png',1500,game.configdata.SCENE_NAMES.earthquake_lobby);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['breadmaker'])){
				if(!this.step3_closegas){
					this.sayNo();
					return true;
				}
				var obj = this.items['breadmaker'];
				obj.status = 2;
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
						var bread = scene.items['bread'];
						var rag = scene.items['ragup'];
						new Hilo.Tween.to(bread,{y:260},{duration:300,onComplete:function(){
							bread.visible = false;
							new Hilo.Tween.to(rag,{y:516},{duiration:1000,onComplete:function(){
								rag.visible = false;
								scene.items['ragdown'].status =1;
								scene.items['ragdown'].visible = true;
							}});
						}});
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
[1, 'bg', 'earthquake2bg.jpg', 0, 0, 't'],
[1, 'bread', 'bread.png', 385, 327, 't'],
[1, 'ragup', 'ragup.png', 379, 252, 't'],
[2, 'breadmaker', 'breadmaker.png', 1,367, 340, 29,183,[0,0,50,50],'t'],
[2, 'wrench', 'wrench.png', 2,868, 580, 22,41,[0,0,80,40],'t'],
[2, 'handler', 'empty', 1,232,400, 80,160,[0,0,30,30],'t'],
[2, 'extinguisher', 'extinguisher.png', 1,335, 447, 20,100,[0,0,50,90],'t'],
[2, 'ragdown', 'ragdown.png', 2,335, 526, 20,50,[0,0,67,36],'f'],
[2, 'switch', 'empty', 1,828, 317, -40,220,[0,0,40,40],'t'],
[2, 'fireobj', 'empty', 1,870, 502, -80,120,[0,0,140,120],'t'],
			];
		
			this.layoutUIElement('img/earthquake/2/',data);

			this.atlas = new Hilo.TextureAtlas({
                image:'img/earthquake/2/earthquake2boyatlas.png',
                width:848,
                height:1248,
                frames:[[636, 0, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [636, 936, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [636, 936, 210, 310], [424, 312, 210, 310], [212, 0, 210, 310], [212, 0, 210, 310], [0, 936, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [212, 936, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310]],
                sprites: {
                	extinguisher:[16],
                	door:[0,1,2],
                	turn:[17,18,19,20],
                	pick:{from:3,to:9},
                	spanner:{from:10,to:15}
                }
            });
            
            this.workeratlas = new Hilo.TextureAtlas({
                image:'img/earthquake/2/effect.png',
                width:559,
                height:519,
                frames:[[247, 346, 154, 171], [403, 0, 154, 171], [247, 0, 154, 171], [247, 173, 154, 171], [0, 360, 245, 118], [0, 120, 245, 118], [0, 0, 245, 118], [0, 240, 245, 118], [403, 333, 110, 78], [403, 413, 110, 78], [403, 173, 110, 78], [403, 253, 110, 78]],
                sprites: {
                	gas:[0,1,2,3],
                	fireeffect:[4,5,6,7],
                	extinguisher:[8,9,10,11]
                }
            });
			this.gaseffect = this.createSprite(this.workeratlas,'gas',704,303,6,this);
			this.fireeffect =  this.createSprite(this.workeratlas,'fireeffect',840,502,6,this);
			this.extinguishereffect =  this.createSprite(this.workeratlas,'extinguisher',850,502,6,this);
            this.extinguishereffect.visible = false;
            
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