(function(ns) {
	var SkyStartwindgeneratorscene = ns.SkyStartwindgeneratorscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.sky_startwindgenerator,
		helpnote:'img/notes/sky/sky4help.png',
		
		initPosx:700,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		isRotate:false,
		isOnfan:false,
		isOnstick:false,
		isButton:false,
		isOnladder:false,
		isFinishFan:false,
		isCleartwig:false,
		
		constructor: function(properties) {
			SkyStartwindgeneratorscene.superclass.constructor.call(this, properties);
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
            this.showDialog('img/sky/4/note.png');
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['singlefanonfloor'])){
				var obj = this.items['singlefanonfloor'];
				var scene = this;
				this.isOnfan = true;
				this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stick'])){
				if(!this.isButton){
					this.sayNo();
					return true;
				}
				var obj = this.items['stick'];
				var scene = this;
				this.isOnstick = true;
				this.pickSomething(obj,'pick',-59,-160,'img/sky/4/stickonhand.png',400);
				this.items['ladder'].status = 1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['ladder'])){
				if(!this.isOnfan && !this.isOnstick){
					this.sayNo();
					return true;
				}
				var obj = this.items['ladder'];
				var scene = this;
				scene.isOnladder = true;
				if(scene.currentOnhandImg){
					scene.currentOnhandImg.removeFromParent();
				}
				
				if(obj.state == 0){
					obj.state = 1;
					scene.isOnladder = true;
					if(this.isOnstick){
						this.items['fanstick'].status = 1;
					}
					this.gotoLadder(obj,1,150,'ladder','onladder',500,function(){
					
					},function(){
					
					});
				}else{
					obj.state = 0;
					scene.isOnladder = false;
					this.downLadder(obj,260,1,'ladder',1500,function(){
						
					});
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['singlefanobj'])){
				var obj = this.items['singlefanobj'];
				if(!this.isOnladder){
					this.sayNo();
					return true;
				}
				var scene = this;
				obj.status = 2;
				
				scene.isOnfan = true;
				scene.playboy.currentFrame = 0;
				scene.playboy._frames = scene.atlas.getSprite('fan');
				scene.playboy.loop = false;
				scene.playboy.play();
				this.items['hiatusfan'].visible = false;
				this.items['fan2'].visible = true;
				this.isFinishFan = true;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['twig'])){
				if(!this.isOnladder){
					this.sayNo();
					return true;
				}
				var obj = this.items['twig'];
				obj.status = 2;
				var scene = this;
				obj.visible = false;
				scene.playboy.currentFrame = 0;
				scene.playboy._frames = scene.atlas.getSprite('branch');
				scene.playboy.loop = false;
				scene.playboy.play();
				this.items['ladder'].status = 1;
				this.isCleartwig = true;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['fanstick'])){
				var obj = this.items['fanstick'];
				var scene = this;
				obj.status = 2;
				
				scene.playboy.currentFrame = 0;
				scene.playboy._frames = scene.atlas.getSprite('stick');
				scene.playboy.loop = false;
				scene.playboy.play();
				scene.isRotate = true;
				
				scene.passoverReady('img/nextpasspoint.png',2000,game.configdata.SCENE_NAMES.sky_startsungengerator);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['btngreen'])){
				if(!this.isFinishFan || !this.isCleartwig || this.isOnladder){
					this.sayNo();
					return true;
				}
				var obj = this.items['btngreen'];
				this.isButton = true;
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'turnon',800,function(){
					
				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.items['btnred'].visible = true;
					scene.showDialog('img/sky/4/note2.png');
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
[1, 'bg', 'sky4bg.jpg', 0, 0, 't'],
[1, 'fan1', 'fan_1.png', 58+126, 28+112, 't'],
[1, 'fan2', 'fan_1.png', 458+126, 33+112, 'f'],
[1, 'fan3', 'fan_1.png', 869+126, 33+112, 't'],
[1, 'btnred', 'buttonred.png', 697, 405, 'f'],
[1, 'hiatusfan', 'hiatusfan.png', 458, 33, 't'],
[2, 'btngreen', 'buttongreen.png', 1, 697, 405, -20, 150, [0, 0, 30, 30], 't'],
[2, 'singlefanobj', 'empty', 1, 593, 169, 70, 160, [0, 0, 130, 30], 't'],
[2, 'twig', 'twig.png', 1, 516, 174, 70, 150, [0, 0, 50, 70], 't'],
[2, 'singlefanonfloor', 'singlefanonfloor.png', 1, 764, 497, 30, 50, [0, 0, 120, 40], 't'],
[2, 'ladder', 'empty', 1, 550, 255, 30, 300, [0, 0, 70, 300], 't'],
[2, 'fanstick', 'empty', 2, 530, 50, 30, 300, [0, 0, 140, 140], 't'],
[2, 'stick', 'stick.png', 1, 996, 368, 10, 180, [0, 0, 40, 180], 't'],
			];
		
			this.layoutUIElement('img/sky/4/',data);
			this.items['fan1'].pivotX = 252/2;
			this.items['fan1'].pivotY = 224/2;
			this.items['fan2'].pivotX = 252/2;
			this.items['fan2'].pivotY = 224/2;
			this.items['fan3'].pivotX = 252/2;
			this.items['fan3'].pivotY = 224/2;
			//game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/sky/4/sky4boyatlas.png',
                width:1060,
                height:1248,
                frames:[[848, 312, 210, 310], [848, 0, 210, 310], [848, 312, 210, 310], [848, 312, 210, 310], [636, 936, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 936, 210, 310], [848, 312, 210, 310], [636, 0, 210, 310], [848, 0, 210, 310], [636, 0, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [848, 624, 210, 310], [424, 0, 210, 310], [212, 936, 210, 310], [636, 0, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [212, 0, 210, 310], [212, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [424, 312, 210, 310]],
                sprites: {
                	branch:{from:0,to:8},
                	fan:{from:9,to:11},
                	ladder:{from:12,to:17},
                	pick:{from:18,to:24},
                	stick:{from:25,to:27},
                	onladder:[11],
                	turnon:[19,20],
                }
            });
           
            this.playboy = this.createSprite(this.atlas,'branch',1023,211,6,this);
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
			if(this.isRotate){
				var obj1 = this.items['fan1'];
				var obj2 = this.items['fan2'];
				var obj3 = this.items['fan3'];
				obj1.rotation += 8;
				obj2.rotation += 8;
				obj3.rotation += 8;
			}
		},
	});
})(window.game);