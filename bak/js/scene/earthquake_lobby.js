(function(ns) {
	var EarthQuakelobbyscene = ns.EarthQuakelobbyscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earthquake_lobby,
		
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
			EarthQuakelobbyscene.superclass.constructor.call(this, properties);
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
		
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		checkActiveObjects:function(mouseX,mouseY){
			var scene = this;
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['door1'])){
				var obj = this.items['door1'];
				scene.gotoDosomething(obj,1,0,0,'downtake',820,function(){
					
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['door2'].status = 2;
					scene.items['door2'].visible = true;
					scene.items['hammer'].status = 1;
					scene.items['hammer'].visible = true;
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['door3'])){
				var obj = this.items['door3'];
				
				scene.gotoDosomething(obj,1,0,0,'downtake',820,function(){
					
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['door4'].status = 2;
					scene.items['door4'].visible = true;
					scene.items['passwordpiece2'].status = 1;
					scene.items['passwordpiece2'].visible = true;
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['hammercover'])){
				var obj = this.items['hammercover'];
				if (scene.currentOnhandImg) {
					scene.currentOnhandImg.visible = false;
					delete scene.currentOnhandImg;
				}
				scene.gotoDosomething(obj,1,0,0,'downtake',820,function(){
					
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['hammer'].status = 1;
					scene.items['hammer'].visible = true;
					if(scene.items['placard1'].status===2)
					{
						scene.items['placard2'].status = 1;
						scene.items['placard2'].visible = true;
					}
				});
				//scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['hammer'])){
				var obj = this.items['hammer'];
				scene.gotoDosomething(obj,1,0,0,'downtake',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['hammercover'].status = 1;
					scene.items['hammercover'].visible = true;
					scene.handonProp('img/earthquake/3/hammeronhand.png',660,510);
				});
				//scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['placard2'])){
				var obj = this.items['placard2'];
				if (!scene.currentOnhandImg){
					scene.gotoDosomething(obj,1,0,0,'downtakeputthewall',820,function(){
						obj.status=2;
						obj.visible = false;
					},function(){
						scene.items['placard1'].status = 1;
						scene.items['placard1'].visible = true;
					});
				}
				else{
					scene.sayNo();
				}
				//scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['placard1'])){
				var obj = this.items['placard1'];
				if (scene.currentOnhandImg){
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.items['hammercover'].status = 2;
					scene.items['hammercover'].visible = false;
					scene.gotoDosomething(obj,1,0,0,'nail',820,function(){
					},function(){
						scene.items['passwordpiece1'].status = 1;
						scene.items['passwordpiece1'].visible = true;
					});
				}
				else{
					scene.sayNo();
				}
				//scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['passwordpiece1'])){
				var obj = this.items['passwordpiece1'];
				scene.gotoDosomething(obj,1,0,0,'downtake',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['passwordpiece1'].status = 2;
					scene.items['passwordpiece1'].visible = false;
					scene.items['door3'].status = 1;
					scene.items['door3'].visible = true;
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['passwordpiece2'])){
				var obj = this.items['passwordpiece2'];
				scene.gotoDosomething(obj,1,0,0,'downtake',820,function(){
					obj.status=2;
					obj.visible = false;
				},function(){
					scene.items['tips'].status = 1;
					scene.items['tips'].visible = true;
					scene.items['codecover'].status = 1;
					scene.items['codecover'].visible = true;
				});
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['codecover'])){
				var obj = this.items['codecover'];
				obj.status=2;
				obj.visible = false;
				scene.items['tips'].status = 2;
				scene.items['tips'].visible = false;
				scene.items['door4'].status = 2;
				scene.items['door4'].visible = false;
				scene.items['door2'].status = 2;
				scene.items['door2'].visible = false;
				scene.items['placard1'].status = 2;
				scene.items['placard1'].visible = false;
				scene.hero.visible=false;
				scene.playboy.visible = false;
				
				scene.items['key1'].status = 1;
				scene.items['key1'].visible = true;
				scene.items['key2'].status = 1;
				scene.items['key2'].visible = true;
				scene.items['key3'].status = 1;
				scene.items['key3'].visible = true;
				scene.items['key4'].status = 1;
				scene.items['key4'].visible = true;
				scene.items['key5'].status = 1;
				scene.items['key5'].visible = true;
				scene.items['key6'].status = 1;
				scene.items['key6'].visible = true;
				scene.items['key7'].status = 1;
				scene.items['key7'].visible = true;
				scene.items['key8'].status = 1;
				scene.items['key8'].visible = true;
				scene.items['key9'].status = 1;
				scene.items['key9'].visible = true;
				scene.items['confirm'].status = 1;
				scene.items['confirm'].visible = true;
				scene.items['codecontainer'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key1cover'])){
				var obj = this.items['key1cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key1'].status = 1;
				scene.items['key1'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key2cover'])){
				var obj = this.items['key2cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key2'].status = 1;
				scene.items['key2'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key3cover'])){
				var obj = this.items['key3cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key3'].status = 1;
				scene.items['key3'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key4cover'])){
				var obj = this.items['key4cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key4'].status = 1;
				scene.items['key4'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key5cover'])){
				var obj = this.items['key5cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key5'].status = 1;
				scene.items['key5'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key6cover'])){
				var obj = this.items['key6cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key6'].status = 1;
				scene.items['key6'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key7cover'])){
				var obj = this.items['key7cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key7'].status = 1;
				scene.items['key7'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key8cover'])){
				var obj = this.items['key8cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key8'].status = 1;
				scene.items['key8'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key9cover'])){
				var obj = this.items['key9cover'];
				obj.status=2;
				obj.visible = false;
				scene.items['key9'].status = 1;
				scene.items['key9'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key1'])){
				var obj = this.items['key1'];
				obj.status=2;
				obj.visible = false;
				scene.items['key1cover'].status = 1;
				scene.items['key1cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key2'])){
				var obj = this.items['key2'];
				obj.status=2;
				obj.visible = false;
				scene.items['key2cover'].status = 1;
				scene.items['key2cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key3'])){
				var obj = this.items['key3'];
				obj.status=2;
				obj.visible = false;
				scene.items['key3cover'].status = 1;
				scene.items['key3cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key4'])){
				var obj = this.items['key4'];
				obj.status=2;
				obj.visible = false;
				scene.items['key4cover'].status = 1;
				scene.items['key4cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key5'])){
				var obj = this.items['key5'];
				obj.status=2;
				obj.visible = false;
				scene.items['key5cover'].status = 1;
				scene.items['key5cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key6'])){
				var obj = this.items['key6'];
				obj.status=2;
				obj.visible = false;
				scene.items['key6cover'].status = 1;
				scene.items['key6cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key7'])){
				var obj = this.items['key7'];
				obj.status=2;
				obj.visible = false;
				scene.items['key7cover'].status = 1;
				scene.items['key7cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key8'])){
				var obj = this.items['key8'];
				obj.status=2;
				obj.visible = false;
				scene.items['key8cover'].status = 1;
				scene.items['key8cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key9'])){
				var obj = this.items['key9'];
				obj.status=2;
				obj.visible = false;
				scene.items['key9cover'].status = 1;
				scene.items['key9cover'].visible = true;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['confirm'])){
				var obj = this.items['confirm'];
				if(scene.items['key1cover'].visible&&scene.items['key2cover'].visible&&scene.items['key3cover'].visible
				&&scene.items['key4cover'].visible&&scene.items['key5cover'].visible&&scene.items['key7cover'].visible
				&&scene.items['key8cover'].visible&&!scene.items['key6cover'].visible&&!scene.items['key9cover'].visible
				){
					
				obj.status=2;
				obj.visible = false;
				scene.items['door'].status = 1;
				scene.items['door'].visible = true;
				scene.items['door4'].status = 2;
				scene.items['door4'].visible = true;
				scene.items['door2'].status = 2;
				scene.items['door2'].visible = true;
				scene.items['placard1'].status = 2;
				scene.items['placard1'].visible = true;
				scene.hero.visible=true;
				
				scene.items['key1'].status = 2;
				scene.items['key1'].visible = false;
				scene.items['key2'].status = 2;
				scene.items['key2'].visible = false;
				scene.items['key3'].status = 2;
				scene.items['key3'].visible = false;
				scene.items['key4'].status = 2;
				scene.items['key4'].visible = false;
				scene.items['key5'].status = 2;
				scene.items['key5'].visible = false;
				scene.items['key6'].status = 2;
				scene.items['key6'].visible = false;
				scene.items['key7'].status = 2;
				scene.items['key7'].visible = false;
				scene.items['key8'].status = 2;
				scene.items['key8'].visible = false;
				scene.items['key9'].status = 2;
				scene.items['key9'].visible = false;
				scene.items['key1cover'].status = 2;
				scene.items['key1cover'].visible = false;
				scene.items['key2cover'].status = 2;
				scene.items['key2cover'].visible = false;
				scene.items['key3cover'].status = 2;
				scene.items['key3cover'].visible = false;
				scene.items['key4cover'].status = 2;
				scene.items['key4cover'].visible = false;
				scene.items['key5cover'].status = 2;
				scene.items['key5cover'].visible = false;
				scene.items['key6cover'].status = 2;
				scene.items['key6cover'].visible = false;
				scene.items['key7cover'].status = 2;
				scene.items['key7cover'].visible = false;
				scene.items['key8cover'].status = 2;
				scene.items['key8cover'].visible = false;
				scene.items['key9cover'].status = 2;
				scene.items['key9cover'].visible = false;
				scene.items['confirm'].status = 2;
				scene.items['confirm'].visible = false;
				scene.items['codecontainer'].visible = false;
				}
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['door'])){
				var obj = this.items['door'];
					obj.status=2;
					obj.visible = false;
					scene.gotoDosomething(obj,1,0,0,'click',820,function(){
					},function(){
						scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
					});
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
			[1, 'bg', 'earthquake3bg.jpg', 0, 0, 't'],
			[2, 'door1', 'door1.png', 1,512,340,20, 100, [0, 0, 42, 72],  't'],
			[2, 'door2', 'door2.png', 2,489, 326,20, 115, [0, 0, 26,95],  'f'],
			[2, 'door3', 'door3.png',2,554,340,20, 100, [0, 0,42, 72],  't'],
			[2, 'door4', 'door4.png', 2,596, 333,-64,238, [0, 0, 26,86],  'f'],
			[2, 'hammer', 'hammer.png', 2,512, 341,20, 100, [0, 0, 45, 101],  'f'],
			[2, 'hammercover', 'empty', 2,512, 341,20, 100, [0, 0, 45, 101],  'f'],
			[2, 'passwordpiece1', 'passwordpiece1.png', 2,734, 382,20, 80, [0, 0,38, 61],  'f'],
			[2, 'passwordpiece2', 'passwordpiece2.png',2,555,364,20, 80, [0, 0, 29, 47],  'f'],
			[2, 'placard1', 'placard1.png',2,729,245,20, 210, [0, 0, 76, 89],  'f'],
			[2, 'placard2', 'placard2.png',2,729,359,20, 100, [0, 0, 76, 89],  't'],
			[2, 'tips', 'tips.png', 2,555,306,20, 70, [0, 0, 87, 103],  'f'],
			[2, 'codecover', 'empty',2,1090,346,20, 420, [0, 0,28,40],  'f'],
			[2, 'door', 'empty',2,1118,266,20, 320, [0, 0, 99,292],  'f'],
			[1, 'codecontainer', 'codecontainer.png', 0, 0, 'f'],
			[2, 'key1cover', 'key1.png', 2,412,166,20, 70, [0, 0, 99,62],  'f'],
			[2, 'key2cover', 'key1.png', 2,709, 375,110, 115, [0, 0, 99,72],  'f'],
			[2, 'key3cover', 'key1.png',2,560,375,150, 120, [0, 0, 99,72],  'f'],
			[2, 'key4cover', 'key1.png', 2,413,378,-64,238, [0, 0,  99,72],  'f'],
			[2, 'key5cover', 'key1.png', 2,559,266,20, 80, [0, 0,  99,72],  'f'],
			[2, 'key6cover', 'key1.png', 2,412,269,20, 80, [0, 0,  99,72],  'f'],
			[2, 'key7cover', 'key1.png',2,708,165,120, 170, [0, 0, 99,72],  'f'],
			[2, 'key8cover', 'key1.png',2,559,165,80, -63, [0, 0, 99,72],  'f'],
			[2, 'key9cover', 'key1.png',2,708,266,20, 420, [0, 0, 99,72],  'f'],
			[2, 'key1', 'key2.png', 2,412,166,20, 70, [0, 0, 99,62],  'f'],
			[2, 'key2', 'key2.png', 2,709, 375,110, 115, [0, 0, 99,72],  'f'],
			[2, 'key3', 'key3.png',2,560,375,150, 120, [0, 0, 99,72],  'f'],
			[2, 'key4', 'key4.png', 2,413,378,-64,238, [0, 0,  99,72],  'f'],
			[2, 'key5', 'key5.png', 2,559,266,20, 80, [0, 0,  99,72],  'f'],
			[2, 'key6', 'key6.png', 2,412,269,20, 80, [0, 0,  99,72],  'f'],
			[2, 'key7', 'key7.png',2,708,165,120, 170, [0, 0, 99,72],  'f'],
			[2, 'key8', 'key8.png',2,559,165,80, -63, [0, 0, 99,72],  'f'],
			[2, 'key9', 'key9.png',2,708,266,20, 420, [0, 0, 99,72],  'f'],
			[2, 'confirm', 'confirm.png',2,578,463,20, 420, [0, 0, 76,78],  'f']
			
			];
		
			this.layoutUIElement('img/earthquake/3/',data);
			this.atlas = new Hilo.TextureAtlas({
                image:'img/earthquake/3/action.png',
                width:1024,
                height:2048,
                frames:[[424, 1248, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 624, 210, 310], [424, 624, 210, 310], [424, 936, 210, 310], [424, 936, 210, 310], [424, 1248, 210, 310], [424, 1248, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 1560, 210, 310], [212, 1248, 210, 310], [212, 936, 210, 310], [424, 1560, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [212, 624, 210, 310], [0, 1560, 210, 310], [0, 1248, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 1248, 210, 310], [212, 624, 210, 310], [212, 624, 210, 310], [212, 624, 210, 310], [0, 1560, 210, 310], [0, 1248, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 1248, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 312, 210, 310]],
                sprites: {
                	click:{from:0,to:8},
                	nail:{from:9,to:12},
                	open:{from:13,to:16},
                	pick:{from:17,to:23},
                	downtake:{from:24,to:30},
                	putthewall:{from:30,to:33},
                	downtakeputthewall:{from:24,to:33},
                	holdwater:[23]
                }
           });
           
            this.playboy = this.createSprite(this.atlas,'putthewall',455,248,6,this);
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