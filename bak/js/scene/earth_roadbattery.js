(function(ns) {
	var EarthRoadbatteryscene = ns.EarthRoadbatteryscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earth_roadbattery,
		
		initPosx:700,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		ispower:false,
		isopen:false,
		
		constructor: function(properties) {
			EarthRoadbatteryscene.superclass.constructor.call(this, properties);
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
			
			this.ispower = false;
			this.isopen = false;
			this.iskeyonhand = false;
			this.isopenbox = false;
			this.isscissor = false;
			this.step =0;
			
			
            this.showDialog('img/earth/1/note.png');
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
			var scene = this;
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['cabinet'])){
				var obj = this.items['cabinet'];
				if (scene.step===0) {
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=1;
					},function(){
						obj.visible = false
						new Hilo.Tween.to(scene.hero,{
							posx:317,
							posy:492,
							scaleX:1,
							scaleY:1,
						},{
							duration:120,
							delay:20,
							onComplete:function(){
								scene.hero.visible=false;
								scene.playboy.visible=true;
								scene.playboy.x = scene.hero.posx -115;
								scene.playboy.y = scene.hero.posy -283;
								scene.playboy.currentFrame = 0;
								scene.playboy._frames = scene.atlas.getSprite('lift');
								scene.playboy.loop = false;
								scene.playboy.play();
								scene.items['cabinet1'].visible=true;
								scene.items['cabinet1'].status=1;
							}
						});
						
					});
				}
				else{
					this.sayNo();
				}
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['cabinet1'])){
				var obj = this.items['cabinet1'];
				if (scene.step===1) {
					
					scene.playboy.x=obj.x-55;
					scene.playboy.y=obj.y-283;
					scene.step++;
				}
				else if(scene.step===4){
					
					obj.status = 2;
					obj.visible = false;
					scene.items['package'].visible=true;
					scene.items['knife'].visible=true;
					scene.items['knife'].status=1;
					scene.step++;
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['recyclingbox'])){
				var obj = this.items['recyclingbox'];
				if (scene.step===2) {
					scene.gotoDosomething(obj,1,0,0,'getbattery',800,function(){
						scene.step=3;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['recyclingbox1'].status = 1;
						scene.items['leaflet1'].visible = false;
						scene.items['leaflet'].status = 1;
						scene.items['leaflet1'].status = 2;
						
						new Hilo.Tween.to(scene.hero,{
							posx:413,
							posy:533,
							scaleX:1,
							scaleY:1,
						},{
							duration:120,
							delay:20,
							onComplete:function(){
								scene.hero.visible=false;
								scene.playboy.visible=true;
								scene.playboy.x = scene.hero.posx -115;
								scene.playboy.y = scene.hero.posy -283;
								scene.playboy.currentFrame = 0;
								scene.playboy._frames = scene.atlas.getSprite('unlift');
								scene.playboy.loop = false;
								scene.playboy.play();
							}
						});
						scene.items['recyclingbox1'].visible = true;
						scene.items['leaflet'].visible = true;
						//scene.items['leaflet'].visible = true;
						//scene.items['leaflet'].status = 2;
					});
				}
				else{
					this.sayNo();
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['hammer'])){
				var obj = this.items['hammer'];
				if(scene.step===3){
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=4;
					},function(){
						obj.status = 2;
						obj.visible = false;
						
						new Hilo.Tween.to(scene.hero,{
							posx:413,
							posy:563,
							scaleX:1,
							scaleY:1,
						},{
							duration:120,
							delay:20,
							onComplete:function(){
								scene.hero.visible=false;
								scene.playboy.visible=true;
								scene.playboy.x = scene.hero.posx -115;
								scene.playboy.y = scene.hero.posy -283;
								scene.playboy.currentFrame = 0;
								scene.playboy._frames = scene.atlas.getSprite('hammering');
								scene.playboy.loop = false;
								scene.playboy.play();
							}
						});
					});
				}
				else{
					this.sayNo();
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['knife'])){
				var obj = this.items['knife'];
				if(scene.step===5){
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=6;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['leaflet'].status=1;
						scene.items['leaflet'].visible=true;
						scene.hero.posx=311;
						scene.hero.posy=528;
						scene.handonProp('img/earth/1/knifeonhand.png',283,421);
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			//TODO
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['leaflet'])){
				var obj = this.items['leaflet'];
				if(scene.step===6){
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'tear',800,function(){
						scene.step=7;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['leaflet2'].status=1;
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['leaflet2'])){
				var obj = this.items['leaflet2'];
				if(scene.step===7){
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=8;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['leafletinput'].visible=true;
						scene.items['leafletinput'].status=1;
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['leafletinput'])){
				var obj = this.items['leafletinput'];
				if(scene.step===8){
					scene.gotoDosomething(obj,1,0,0,'putad',800,function(){
						scene.step=9;
						scene.passoverReady('img/earth/1/note.png',3500,game.configdata.SCENE_NAMES.earth_farmlandbattery);
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['leafletinput'].visible=false;
						scene.items['leaflet3'].visible=true;
						scene.items['leaflet3'].status=1;
					});
				}
				else{
					this.sayNo();
					
				}
				return true;
			}
			
			return false;
		},
		putinStrainer:function(){
			var obj = this.items['strainerobj'];
			obj.state++;
			var scene = this;
			this.currentOnhandImg.removeFromParent();
			scene.gotoDosomething(obj,1,0,0,'strainer',800,function(){
					
				},function(){
					scene.items['instrainer'+obj.state.toString()].visible = true;
				});
		},
		finishpass:function(){
			var scene = this;
			new Hilo.Tween.to(this,{
				alpha:1,
			},{
				duration:1000,
				delay:1000,
				onComplete:function(){
					game.drdialog.showTxt('img/water/6/note2.png');
            		game.drdialog.on(Hilo.event.POINTER_START,function(e){
            			game.drdialog.hide();
						game.switchScene(game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.ecosystem);
           			 });
				}
			})
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
		gotoLadder:function(targetobj,scaleFact,h,playaction,onladderaction,time,onCall1,onCall2){
			var scene = this;
			scene.ignoreTouch = true;
			targetobj.status = 2;
			var targetx = targetobj.x + targetobj.targetx;
			var targety = targetobj.y + targetobj.targety;
			var ladddery = targety - h;
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
						scene.playboy.loop = true;
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
					new Hilo.Tween.to(scene.playboy,{
							y:h,
						},{
							duration:time,
							//delay:delay,
							onComplete:function(){
								scene.playboy.stop();
								scene.playboy.currentFrame = 0;
								scene.playboy._frames = scene.atlas.getSprite(onladderaction);
								scene.ignoreTouch = false;
							}
						})
				);
		},
		downLadder:function(targetobj,h,scaleFact,playaction,time,onCall){
			var scene = this;
			scene.ignoreTouch = true;
			targetobj.status = 2;
			var targetx = targetobj.x + targetobj.targetx;
			var targety = targetobj.y + targetobj.targety;
			scene.playboy.currentFrame = 0;
			scene.playboy.loop = true;
			scene.playboy.scaleX = scaleFact;
			scene.playboy.scaleY = scaleFact;
			scene.playboy._frames = scene.atlas.getSprite(playaction);
			scene.playboy.play();
			new Hilo.Tween.to(scene.playboy, {
					y:h,
					scaleX:scaleFact,
					scaleY:scaleFact,
				}, {
					duration: time,
					onComplete: function() {
						scene.hero.visible = true;
						scene.playboy.visible = false;
						scene.playboy.loop = true;
						scene.ignoreTouch = false;
						if(onCall){
							onCall();
						}
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
			[1, 'bg', 'earth1bg.jpg', 0, 0, 't'],
			[2, 'recyclingbox', 'batteryrecyclingboxe.png', 1,300, 256,60, 230, [0, 0, 50, 80],  't'],
			[1, 'recyclingnote', 'reclaim.png',409, 399,'t'],
			[2, 'recyclingbox1', 'batteryrecyclingboxe.png', 1,409, 379,-20, 100, [0, 0, 50, 80],  'f'],
			[2, 'leaflet', 'leaflet3.png',1,409, 409,-20, 150, [0, 0, 40, 53],  'f'],
			[2, 'cabinet', 'cabinet.png', 1,33, 535,20, 100, [0, 0, 112, 49],  't'],
			[2, 'cabinet1', 'cabinet.png', 1,289, 449,-20, 150, [0, 0, 112, 49],  'f'],
			[2, 'hammer', 'hammer.png',1, 859,462, 20, 80, [0, 0, 76, 30], 't'],
			[2, 'leaflet1', 'leaflet3.png',2,300, 286,-20, 150, [0, 0, 40, 53],  't'],
			[2, 'leaflet2', 'leaflet2.png', 2, 575, 484, 20, 80, [0, 0, 118, 22], 't'],
			[2, 'leaflet3', 'leaflet1.png', 1, 409, 409, 20, 80, [0, 0,40, 55], 'f'],
			[2, 'package', 'package.png', 1, 289, 449, 70, 150, [0, 0, 112, 67], 'f'],
			[2, 'knife', 'knife.png',1, 319, 472, -20, 80, [0, 0, 42, 18], 'f'],
			[2, 'leafletinput', 'empty',1,409, 409,20, 80, [0, 0, 40, 53],  'f'],
			[2, 'cabinetput', 'empty', 1, 289, 429,-20, 150, [0, 0, 112, 67], 'f']
			];
		
			this.layoutUIElement('img/earth/1/',data);
			//game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/earth/1/action.png',
                width:1024,
                height:2048,
                frames:[[212, 312, 210, 310], [424, 312, 210, 310], [212, 312, 210, 310], [424, 0, 210, 310], [212, 1560, 210, 310], [212, 1248, 210, 310], [212, 936, 210, 310], [212, 624, 210, 310], [424, 624, 210, 310], [212, 0, 210, 310], [0, 1560, 210, 310], [0, 1248, 210, 310], [212, 0, 210, 310], [212, 624, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 312, 210, 310], [0, 312, 210, 310], [0, 624, 210, 310], [0, 936, 210, 310]],
                sprites: {
                	getbattery:{from:0,to:2},
                	hammering:{from:3,to:6},
                	lift:{from:7,to:13},
                	unlift:[13,12,11,10,9,8,7],
                	tear:{from:14,to:21},
                	onbox:[21],
                	putad:[21,20,19,18,17,16,15,14],
                	stepbox:[0]
                }
            });
           
            this.playboy = this.createSprite(this.atlas,'unlift',1023,211,6,this);
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