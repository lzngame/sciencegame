(function(ns) {
	var EarthQuakebedroomscene = ns.EarthQuakebedroomscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earthquake_bedroom,
		helpnote:'img/notes/earthquake/earthquake1help.png',
		
		
		initPosx:700,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		lighting:null,
		atlas1:null,
		
		ispower:false,
		isopen:false,
		
		constructor: function(properties) {
			EarthQuakebedroomscene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.x = 0;
			this.y = 0;
			this.pointerflag = 0;
			this.pointer1flag = 0;
			this.pointer2flag = 0;
			this.pointer3flag = 0;
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
			this.step =0;
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
			var scene = this;
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['water'])){
				var obj = this.items['water'];
				scene.gotoDosomething(obj,1,0,0,'takewater',820,function(){
					
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['bottle'].status = 1;
					scene.items['bottle'].visible = true;
					scene.playboy.visible=true;
					scene.hero.visible=false;
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bottle'])){
				var obj = this.items['bottle'];
				obj.y+=210;
				scene.gotoDosomething(obj,1,0,0,'drinkwater',820,function(){
					
				},function(){
					obj.status=2;
					obj.visible = false;
					scene.items['pillow'].status = 1;
					scene.items['pillow'].visible = true;
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pillow'])){
				var obj = this.items['pillow'];
				scene.gotoDosomething(obj,1,0,0,'remove',820,function(){
					
				},function(){
					obj.status=2;
					obj.visible = false;
					scene.items['mobilephone'].status = 1;
					scene.items['mobilephone'].visible = true;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['mobilephone'])){
				var obj = this.items['mobilephone'];
				scene.gotoDosomething(obj,1,0,0,'pickphone',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['plug1'].status = 1;
					scene.items['plug1'].visible = true;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['plug1'])){
				var obj = this.items['plug1'];
				scene.gotoDosomething(obj,1,0,0,'pullandplug',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['plug2'].status = 2;
					scene.items['plug2'].visible = true;
					scene.items['electricity'].status = 2;
					scene.items['electricity'].visible = false;
					scene.items['door'].status = 1;
					scene.items['door'].visible = true;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['door'])){
				var obj = this.items['door'];
				scene.gotoDosomething(obj,1,0,0,'pullandplug',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['plug2'].status = 2;
					scene.items['plug2'].visible = true;
					scene.passoverReady('img/nextpasspoint.png',500,game.configdata.SCENE_NAMES.earthquake_kitchen);
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
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
		/*finishpass:function(){
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
		},*/
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
			[1, 'bg', 'earthquake1bg.png', 0, 0, 't'],
			[2, 'electricity', 'electricity.png', 2,963,286,20, 70, [0, 0, 102, 105],  't'],
			[2, 'mobilephone', 'mobilephone.png', 2,456, 413,110, 115, [0, 0, 43,26],  'f'],
			[2, 'pillow', 'pillow.png',2,403,409,150, 120, [0, 0,83, 42],  't'],
			[2, 'plug1', 'plug1.png', 2,925, 243,-64,238, [0, 0, 54,115],  't'],
			[2, 'plug2', 'plug2.png', 2,903, 351,20, 80, [0, 0, 76, 58],  'f'],
			[2, 'water', 'water.png',1,148,426,120, 170, [0, 0, 20, 58],  't'],
			[2, 'bottle', 'bottle.png',2,210,436,80, -63, [0, 0, 58, 58],  'f'],
			[2, 'door', 'empty',2,1110,209,20, 420, [0, 0, 87, 430],  'f']
			
			];
		
			this.layoutUIElement('img/earthquake/1/',data);
			this.atlas = new Hilo.TextureAtlas({
                image:'img/earthquake/1/action.png',
                width:1024,
                height:2048,
                frames:[[424, 0, 210, 310], [212, 1560, 210, 310], [212, 1248, 210, 310], [212, 936, 210, 310], [424, 1248, 210, 310], [212, 312, 210, 310], [424, 0, 210, 310], [212, 0, 210, 310], [0, 1560, 210, 310], [0, 1248, 210, 310], [0, 1248, 210, 310], [0, 1248, 210, 310], [0, 1560, 210, 310], [0, 1560, 210, 310], [212, 0, 210, 310], [212, 0, 210, 310], [424, 0, 210, 310], [212, 1560, 210, 310], [212, 1248, 210, 310], [0, 936, 210, 310], [424, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [212, 624, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 624, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310]],
                sprites: {
                	pickphone:{from:0,to:6},
                	pullandplug:{from:7,to:15},
                	remove:{from:16,to:20},
                	takewater:{from:21,to:23},
                	drinkwater:{from:24,to:29},
                	holdwater:[23]
                }
           });
           
            this.playboy = this.createSprite(this.atlas,'pickphone',455,248,6,this);
            this.playboy.visible = false;
            
           	//scene.hero.visible=false;
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