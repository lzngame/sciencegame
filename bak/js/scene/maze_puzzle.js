(function(ns) {
	var MazePuzzlescene = ns.MazePuzzlescene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.maze_puzzle,
		
		initPosx:40,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		ispower:false,
		isopen:false,
		
		constructor: function(properties) {
			MazePuzzlescene.superclass.constructor.call(this, properties);
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
			//this.addHero(null,this.initPosx,this.initPosy);
			
			this.currentkey = 'empty';
			//this.hero.posx = this.initPosx;
			//this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			
			this.layoutUI();
			
			game.sounds.play(14,true);
			this.touchnum = 0;
			this.isopen = false;
			this.ismap1 = false;
			this.ismap2 = false;
			this.ismap3 = false;
			this.ismap4 = false;
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['map1cover'])){
				var obj = this.items['map1cover'];
					scene.ismap1=true;
					obj.status=2;
					obj.visible = false;
					
					scene.showlist();
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['map2cover'])){
				var obj = this.items['map2cover'];
					scene.ismap2=true;
					obj.visible = false;
					obj.status=2;
					scene.showlist();
					//scene.items['glass1'].status = 1;
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['map3cover'])){
				var obj = this.items['map3cover'];
					scene.ismap3=true;
					obj.visible = false;
					obj.status=2;
					scene.showlist();
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['map4cover'])){
				var obj = this.items['map4cover'];
					scene.ismap4=true;
					obj.visible = false;
					obj.status=2;
					scene.showlist();
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['map1tiny'])){
				var obj = this.items['map1tiny'];
				if(scene.ismap1){
					obj.visible = false;
					obj.status=2;
					scene.items['map1'].status = 2;
					scene.items['map1'].visible = true;
					scene.hidelist();
					scene.ismap1=false;
					if (scene.items['map4'].visible&&scene.items['map3'].visible&&scene.items['map2'].visible&&scene.items['map1'].visible) {
						
						scene.passoverReady('img/nextpasspoint.png',500,game.configdata.SCENE_NAMES.maze_maze);
					}
				}
				else{
					this.sayNo();
				}
				
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['map2tiny'])){
				var obj = this.items['map2tiny'];
				if (scene.ismap2) {
					obj.visible = false;
					obj.status=2;
					scene.items['map2'].status = 2;
					scene.items['map2'].visible = true;
					scene.hidelist();
					scene.ismap2=false;
					if (scene.items['map4'].visible&&scene.items['map3'].visible&&scene.items['map2'].visible&&scene.items['map1'].visible) {
						
						scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
					}
					
				}
				else{
					this.sayNo();
				}
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['map3tiny'])){
				var obj = this.items['map3tiny'];
				if (scene.ismap3) {
					obj.visible = false;
					obj.status=2;
					scene.items['map3'].status = 2;
					scene.items['map3'].visible = true;
					scene.hidelist();
					scene.ismap3=false;
					if (scene.items['map4'].visible&&scene.items['map3'].visible&&scene.items['map2'].visible&&scene.items['map1'].visible) {
						
						scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
					}
					
				}
				else{
					this.sayNo();
				}
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['map4tiny'])){
				var obj = this.items['map4tiny'];
				if (scene.ismap4) {
					obj.visible = false;
					obj.status=2;
					scene.items['map4'].status = 2;
					scene.items['map4'].visible = true;
					scene.hidelist();
					scene.ismap4=false;
					if (scene.items['map4'].visible&&scene.items['map3'].visible&&scene.items['map2'].visible&&scene.items['map1'].visible) {
						
						scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.maze_maze);
					}
					
				}
				else{
					this.sayNo();
				}
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
		showlist:function(){
			var scene = this;
			scene.items['list'].status = 2;
			scene.items['list'].visible = true;
			scene.items['map1tiny'].status = 1;
			scene.items['map1tiny'].visible = true;
			scene.items['map2tiny'].status = 1;
			scene.items['map2tiny'].visible = true;
			scene.items['map3tiny'].status = 1;
			scene.items['map3tiny'].visible = true;
			scene.items['map4tiny'].status = 1;
			scene.items['map4tiny'].visible = true;
			scene.items['map1cover'].status = 2;
			scene.items['map2cover'].status = 2;
			scene.items['map3cover'].status = 2;
			scene.items['map4cover'].status = 2;
		},
		hidelist:function(){
			var scene = this;
			scene.items['list'].status = 2;
			scene.items['list'].visible = false;
			scene.items['map1tiny'].status = 2;
			scene.items['map1tiny'].visible = false;
			scene.items['map2tiny'].status = 2;
			scene.items['map2tiny'].visible = false;
			scene.items['map3tiny'].status = 2;
			scene.items['map3tiny'].visible = false;
			scene.items['map4tiny'].status = 2;
			scene.items['map4tiny'].visible = false;
			scene.items['map1cover'].status = 1;
			scene.items['map2cover'].status = 1;
			scene.items['map3cover'].status = 1;
			scene.items['map4cover'].status = 1;
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
			[1, 'bg', 'maze1bg.png', 0, 0, 't'],
			[2, 'map1cover', 'empty', 1,55,248,20, 70, [0, 0, 437, 290],  't'],
			[2, 'map2cover', 'empty', 1,763, 106,40, 80, [0, 0, 335, 301],  't'],
			[2, 'map3cover', 'empty',1,638, 376,20, 280, [0, 0,397, 281],  't'],
			[2, 'map4cover', 'empty', 1,411, 8,20, 80, [0, 0, 316, 212],  't'],
			[2, 'map1', 'map1.png', 2,55,248,20, 70, [0, 0, 437, 290],  'f'],
			[2, 'map2', 'map2.png', 2,763, 106,40, 80, [0, 0, 335, 301],  'f'],
			[2, 'map3', 'map3.png',2,638, 376,20, 280, [0, 0,397, 281],  'f'],
			[2, 'map4', 'map4.png', 2,411, 8,20, 80, [0, 0, 316, 212],  'f'],
			[2, 'list', 'tips.png', 2,110,110,20, 80, [0, 0, 710, 160],  'f'],
			[2, 'map1tiny', 'empty', 2,110,110,20, 70, [0, 0,150, 160],  'f'],
			[2, 'map2tiny', 'empty', 2,310,110,40, 80, [0, 0, 160, 160],  'f'],
			[2, 'map3tiny', 'empty',2,480, 110,20, 280, [0, 0,160, 160],  'f'],
			[2, 'map4tiny', 'empty', 2,660,110,20, 80, [0, 0, 160, 160],  'f']
			
			//[1, 'puzzlebg', 'puzzlebg.png', 0, 0, 'f'],
			//[2, 'heatwithhightemperature', 'heatwithhightemperature.png', 2,124, 90,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'importmachine', 'importmachine.png', 2,449, 87,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'refiningheavily', 'refiningheavily.png',2,439, 355,20, 100, [0, 0, 61, 58],'f'],
			//[2, 'trituration', 'trituration.png', 2,119, 82,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'wastetreatment', 'wastetreatment.png', 2,120, 357,20, 100, [0, 0, 61, 58],  'f']
			];
		
			this.layoutUIElement('img/maze/1/',data);
			//game.sounds.play(17,true);
            /*
			this.atlas = new Hilo.TextureAtlas({
                image:'img/quiet/5/action.png',
                width:2048,
                height:1024,
                frames:[[1272, 0, 210, 310], [1272, 312, 210, 310], [1272, 0, 210, 310], [0, 0, 210, 310], [636, 624, 210, 310], [1484, 0, 210, 310], [636, 624, 210, 310], [636, 624, 210, 310], [1484, 0, 210, 310], [636, 624, 210, 310], [1272, 624, 210, 310], [1060, 624, 210, 310], [1060, 312, 210, 310], [1060, 0, 210, 310], [848, 624, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [1484, 312, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [1484, 312, 210, 310], [848, 312, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 312, 210, 310]],
                sprites: {
                	cut:[0,3,4,5,6,7,8,9,10,1,2],
                	touch1:{from:11,to:14},
                	unlift:[21,20,19,18,17,16,15],
                	lift:{from:15,to:21},
                	nail:{from:22,to:25},
                	sweep:{from:26,to:30},
                	stepbox:[0]
                }
           });
           
            this.playboy = this.createSprite(this.atlas,'sweep',813,211,6,this);
            this.playboy.visible = false;*/
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