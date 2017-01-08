(function(ns) {
	var SkySaveplantscene = ns.SkySaveplantscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.sky_saveplant,
		helpnote:'img/notes/sky/sky6help.png',
		
		initPosx:700,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		isOnScissor:false,
		isWateropen:false,
		isCarleft:false,
		isOnShovel:false,
		isCarfull:false,
		
		isOnladder:false,
		isFinishFan:false,
		isCleartwig:false,
		
		constructor: function(properties) {
			SkySaveplantscene.superclass.constructor.call(this, properties);
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
			
			this.isRotate = false;
			this.isOnfan=false;
			this.isOnstick=false;
			this.isButton=false;
			this.isOnladder=false;
			this.isFinishFan=false;
			this.isCleartwig=false;
			this.setHelp();
            this.showDialog('img/sky/6/sky6note.png');
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['boxclose'])){
				var obj = this.items['boxclose'];
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
					
				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.items['boxopen'].visible = true;
					scene.items['scissor'].status = 1;
					scene.items['scissor'].visible = true;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['scissor'])){
				var obj = this.items['scissor'];
				var scene = this;
				scene.isOnScissor = true;
				this.pickSomething(obj,'pick',-29,-108,'img/sky/6/scissoronhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['shovel'])){
				if(!this.isCarleft){
					this.sayNo();
					return true;
				}
				this.isOnShovel = true;
				var obj = this.items['shovel'];
				var scene = this;
				this.pickSomething(obj,'pick',-20,-120,'img/sky/6/shovelonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['grassobj1'])){
				if(!this.isOnScissor){
					this.sayNo();
					return;
				}
				var obj = this.items['grassobj1'];
				var scene = this;
				var tmp = 'grass1';
				if(obj.state == 1)
					tmp = 'grass4';
				scene.currentOnhandImg.visible = false;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
					
				},function(){
					scene.items[tmp].visible = false;
					scene.currentOnhandImg.visible = true;
					if(obj.state == 1){
						obj.status = 2;
					}
					if(obj.state == 0){
						obj.state = 1;
					}
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['grassobj2'])){
				if(!this.isOnScissor){
					this.sayNo();
					return;
				}
				var obj = this.items['grassobj2'];
				var scene = this;
				scene.currentOnhandImg.visible = false;
				var tmp = 'grass2';
				if(obj.state == 1)
					tmp = 'grass3';
				if(obj.state == 2)
					tmp = 'grass6';
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
					
				},function(){
					scene.items[tmp].visible = false;
					scene.currentOnhandImg.visible = true;
					if(obj.state == 2){
						obj.status = 2;
						scene.isOnScissor = false;
						scene.items['grassobj1'].status = 2;
						scene.items['pipeswitch'].status = 1;
						
						if(scene.currentOnhandImg){
							scene.currentOnhandImg.removeFromParent();
						}
					}else{
						obj.state ++;
					}
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['car'])){
				if(!this.isWateropen){
					this.sayNo();
					return tre;
				}
				this.isCarleft = true;
				var obj = this.items['car'];
				obj.status = 2;
				var scene = this;
				new Hilo.Tween.to(obj,{x:238},{duration:100});
				new Hilo.Tween.to(scene.hero,{posx:290,posy:665},{duration:100});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['manureobj'])){
				if(!this.isOnShovel){
					this.sayNo();
					return true;
				}
				var obj = this.items['manureobj'];
				obj.status = 1;
				var scene = this;
				this.isCarfull = true;
				this.currentOnhandImg.visible = false;
				scene.gotoDosomething(obj,1,0,0,'shovel',800,function(){
					
				},function(){
					scene.currentOnhandImg.visible = true;
					scene.items['manureincar'].visible = true;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pipeswitch'])){
				var obj = this.items['pipeswitch'];
				var scene = this;
				obj.status = 2;
				scene.isWateropen = true;
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
					
				},function(){
					scene.water.visible = true;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['tree'])){
				var obj = this.items['tree'];
				var car = this.items['car'];
				if(!this.isCarfull){
					this.sayNo();
					return true;
				}
				var scene = this;
				if(obj.state==0){
					scene.currentOnhandImg.visible = false;
					scene.items['manureincar'].visible = false;
					new Hilo.Tween.to(car,{x:1000},{duration:100});
					new Hilo.Tween.to(scene.hero,{posx:1030,posy:665},{duration:100,onComplete:function(){
						scene.currentOnhandImg.visible = true;
						scene.items['manureincar'].visible = true;
						scene.currentOnhandImg.x = 1010;
						scene.items['manureincar'].x = 993;
					}});
					obj.state = 1;
				}else{
					scene.currentOnhandImg.removeFromParent();
					scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						scene.items['manureincar'].y = 506;
						scene.items['manureincar'].x = 983;
					},function(){
						scene.transformTree();
					});
				}
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
		transformTree:function(){
			var scene = this;
			var tree = this.items['tree'];
			var greentree = this.items['greentree'];
			
			new Hilo.Tween.to(tree, {
					alpha:0
				}, {
					duration: 500,
					onComplete: function() {
						
					}
				});
			new Hilo.Tween.to(greentree, {
					alpha:1
				}, {
					duration: 500,
					onComplete: function() {
						scene.passoverReady('img/sky/4/happy.png',2000,game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.ecosystem);
					}
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
[1, 'bg', 'sky6bg.jpg', 0, 0, 't'],
[2, 'tree', 'tree.png', 1,861, 166, 140,360,[80,40,150,300],'t'],
[1, 'greentree', 'greentree.png', 841, 146, 't'],
[1, 'grass5', 'grass5.png',  225, 452,  't'],
[1, 'grass6', 'grass6.png', 527, 448, 't'],
[1, 'grass1', 'grass1.png', 196, 393, 't'],
[1, 'grass2', 'grass2.png',  506, 393,  't'],
[1, 'grass3', 'grass3.png',  532, 448,  't'],
[1, 'grass4', 'grass4.png', 213, 456,  't'],
[1, 'boxopen', 'box.png',  333, 509,'f'],


[2, 'boxclose', 'box2.png', 1, 331, 541, 50, 70, [0, 0, 100, 60], 't'],
[2, 'shovel', 'shovel.png', 1, 576, 581, 30, 45, [0, 0, 83, 35], 't'],
[2, 'scissor', 'scissor.png', 2, 360, 540, 30, 60, [0, 0, 83, 35], 'f'],
[2, 'car', 'car.png', 1, 820, 533, 180, 100, [0, 0, 160, 100], 't'],
[2, 'pipeswitch', 'empty', 1, 556, 412, 30, 200, [0, 0, 70, 70], 't'],
[2, 'manureobj', 'empty', 1, 7, 531, 283, 120, [0, 0, 230, 120], 't'],
[2, 'grassobj1', 'empty', 1, 234, 428, 70, 180, [0, 0, 200, 100], 't'],
[2, 'grassobj2', 'empty', 1, 544, 413, 70, 180, [0, 0, 200, 100], 't'],
[1, 'manureincar', 'manureincar.png',  260, 540,'f'],
			];
		
			this.layoutUIElement('img/sky/6/',data);
			this.items['greentree'].alpha = 0;
            
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
            var wateringatlas = new Hilo.TextureAtlas({
                image:'img/sky/6/watering.png',
                width:384,
                height:585,
                frames:[[0, 0, 382, 193], [0, 195, 382, 193], [0, 390, 382, 193]],
                sprites: {
                	idle:[0,1,2]
                }
            });
            this.water = this.createSprite(wateringatlas,'idle',312,348,10,this);
            this.water.visible = false;
           
            this.playboy = this.createSprite(this.atlas,'shovel',1023,211,6,this);
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