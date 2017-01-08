(function(ns) {
	var FireWashroomscene = ns.FireWashroomscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.fire_washroom,
		
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
		istaketowel:false,
		ticknum:0,
		
		constructor: function(properties) {
			FireWashroomscene.superclass.constructor.call(this, properties);
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
			
			
            //this.showDialog('img/earth/1/note.png');
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
		
		checkActiveObjects:function(mouseX,mouseY){
			var scene = this;
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['birdbath1'])){
				var obj = this.items['birdbath1'];
				scene.gotoDosomething(obj,1,0,0,'lift',820,function(){
					
				},function(){
					obj.status=2;
					obj.visible = false;
					scene.items['birdbathcover'].status = 1;
					scene.items['birdbathcover'].visible = true;
					scene.handonProp('img/fire/2/birdbath.png',660,510);
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['birdbathcover'])){
				var obj = this.items['birdbathcover'];
				if (!scene.istaketowel) {
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'putwashbasintotable',820,function(){
						
						obj.status=2;
						obj.visible = false;
					},function(){
						scene.items['birdbath'].status =2;
						scene.items['birdbath'].visible = true;
						scene.items['tap'].status =1;
						scene.items['tap'].visible = true;
					});
					
				}
				else{
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'puttowel',820,function(){
						
						obj.status=2;
						obj.visible = false;
					},function(){
						scene.items['washbasin'].status =1;
						scene.items['washbasin'].visible = true;
						scene.hero.visible=false;
						scene.playboy.visible=false;
						scene.istaketowel=false;
					});
				}
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['tap'])){
				var obj = this.items['tap'];
				scene.istap=true;
				scene.gotoDosomething(obj,1,0,0,'open',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['flow'].status =2;
					scene.items['flow'].visible = true;
				});
				//scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['birdbath'])){
				var obj = this.items['birdbath'];
				scene.gotoDosomething(obj,1,0,0,'open',820,function(){
				},function(){
					obj.status=2;
					obj.visible = false;
					scene.items['water'].status =2;
					scene.items['water'].visible = false;
					scene.handonProp('img/fire/2/birdbathonhand.png',660,510);
					scene.items['firecover'].status =1;
					scene.items['firecover'].visible = true;
					
				});
				//scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['firecover'])){
				var obj = this.items['firecover'];
				if (scene.currentOnhandImg) {
					scene.currentOnhandImg.visible = false;
					delete scene.currentOnhandImg;
				}
				scene.gotoDosomething(obj,1,0,0,'pullwater',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['stool'].status = 1;
					scene.items['stool'].visible = true;
					scene.stream.visible = false;
				});
				//scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stool'])){
				var obj = this.items['stool'];
				scene.gotoDosomething(obj,1,0,0,'lift',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['stool1'].status = 2;
					scene.items['stool1'].visible = true;
					scene.items['towel'].status = 1;
					scene.items['towel'].visible = true;
					scene.hero.posx = 700;
					scene.hero.posy = 504;
				});
				//scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['towel'])){
				var obj = this.items['towel'];
					scene.hero.posx = 700;
					scene.hero.posy = 630;
				scene.gotoDosomething(obj,1,0,0,'taketowel',820,function(){
					obj.status=2;
					obj.visible = false;
					scene.istaketowel=true;
				},function(){
					scene.items['birdbathcover'].status = 1;
					scene.items['birdbathcover'].visible = true;
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['washbasin'])){
				var obj = this.items['washbasin'];
				obj.status=2;
				obj.visible = false;
				scene.hero.visible=true;
				scene.playboy.visible=false;
				scene.items['door'].status = 1;
				scene.items['door'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['door'])){
				var obj = this.items['door'];
					obj.status=2;
					obj.visible = false;
					scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.fire_door);
					
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
			[1, 'bg', 'fire2bg.jpg', 0, 0, 't'],
			[2, 'birdbath', 'birdbath.png', 2,1073,409,-40, 223, [0, 0, 81, 48],  'f'],
			[2, 'birdbathcover', 'empty', 2,1073,409,-40, 223, [0, 0, 81, 48],  't'],
			[2, 'birdbath1', 'birdbath.png', 1,453,541,30, 60, [0, 0, 81, 48],  't'],
			[2, 'flow', 'flow.png', 2,1119, 384,-80, 235, [0, 0, 15,41],  'f'],
			[2, 'tap', 'empty', 2,1119, 380,-80, 245, [0, 0, 30,15],  't'],
			[2, 'towel', 'towel.png',2,750,217,20, 300, [0, 0,84, 28],  't'],
			[2, 'stool', 'stool.png', 2,278, 493,20,100, [0, 0, 139,74],  't'],
			[2, 'stool1', 'stool.png', 2,678, 493,20,100, [0, 0, 139,74],  'f'],
			[2, 'water', 'water.png', 2,1081, 416,20, 100, [0, 0, 60,12],  'f'],
			[2, 'firecover', 'empty', 2,4, 475,180, 150, [0, 0, 227,178],  'f'],
			[2, 'door', 'empty', 2,50, 150,80, 450, [0, 0, 100,500],  'f'],
			[2, 'washbasin', 'washbasin.jpg', 2,0, 0,20, 100, [0, 0, 1202,686],  'f']
			
			];
		
			this.layoutUIElement('img/fire/2/',data);
			this.atlas = new Hilo.TextureAtlas({
                image:'img/fire/2/action.png',
                width:2048,
                height:1024,
                frames:[[636, 624, 210, 310], [1484, 0, 210, 310], [1272, 624, 210, 310], [1272, 312, 210, 310], [1272, 0, 210, 310], [1272, 624, 210, 310], [636, 624, 210, 310], [1060, 624, 210, 310], [1060, 312, 210, 310], [1060, 312, 210, 310], [1060, 0, 210, 310], [848, 624, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [1484, 312, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [1060, 0, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [1060, 0, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [0, 0, 210, 310], [1060, 312, 210, 310], [1060, 0, 210, 310]],
                sprites: {
                	lift:{from:0,to:6},
                	open:{from:7,to:10},
                	pullwater:{from:11,to:16},
                	puttowel:{from:17,to:21},
                	putwashbasintotable:{from:22,to:26},
                	taketowel:{from:27,to:31},
                	holdwater:[23]
                }
           });
           
            this.playboy = this.createSprite(this.atlas,'puttowel',455,248,6,this);
            this.playboy.visible = false;
            
            var streamatlas = new Hilo.TextureAtlas({
                image:'img/fire/2/fire.png',
                width: 256,
                height: 1024,
                //x轴，y轴，宽，高
                frames:[[0, 180, 227, 178], [0, 0, 227, 178], [0, 360, 227, 178], [0, 540, 227, 178], [0, 720, 227, 178]],
                sprites: {
                	fire:[0,1,2,3,4]
                }
            });
            this.stream = this.createSprite(streamatlas,'fire',4,475,10,this);
            this.stream.visible = true;
            
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
			var scene=this;
			if (scene.istap) {
				scene.ticknum++;
				if (scene.ticknum>200) {
					scene.items['flow'].visible=false;
					scene.items['flow'].status=2;
					scene.items['water'].visible=true;
					scene.items['water'].status=1;
					scene.items['birdbath'].visible=true;
					scene.items['birdbath'].status=1;
					scene.istap=false;
				}
			}
		},
	});
})(window.game);