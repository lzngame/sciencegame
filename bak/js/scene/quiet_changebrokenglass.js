(function(ns) {
	var QuietChangebrokenglassscene = ns.QuietChangebrokenglassscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.quiet_changebrokenglass,
		
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
			QuietChangebrokenglassscene.superclass.constructor.call(this, properties);
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
			
			this.touchnum = 0;
			this.isopen = false;
			this.iskeyonhand = false;
			this.isopenbox = false;
			this.isscissor = false;
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['hammer'])){
				var obj = this.items['hammer'];
				if (scene.step===0) {
					scene.step=1;
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
					},function(){
						obj.visible = false;
						obj.status=2;
						scene.items['glass1'].status = 1;
						scene.handonProp('img/quiet/5/hammer1.png',655,500);
					});
				}
				else{
					this.sayNo();
				}
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['glass1'])){
				var obj = this.items['glass1'];
				if (scene.step===1) {
					
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'nail',800,function(){
						scene.step=2;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['scissors'].status = 1;
						
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['scissors'])){
				var obj = this.items['scissors'];
				if (scene.step===2) {
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=3;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.handonProp('img/quiet/5/scissoronhand.png',669,521);
						scene.items['glass2'].status = 1;
						
					});
				}
				else{
					this.sayNo();
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['glass2'])){
				var obj = this.items['glass2'];
				if(scene.step===3){
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'cut',800,function(){
						scene.step=4;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['glass4'].status = 1;
						scene.items['glass4'].visible = true;
						
					});
						
				}
				else{
					this.sayNo();
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['glass4'])){
				var obj = this.items['glass4'];
				if(scene.step===4){
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=5;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.handonProp('img/quiet/5/1.png',663,521);
						scene.items['glassput'].visible=true;
						scene.items['glassput'].status=1;
						
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['glassput'])){
				var obj = this.items['glassput'];
				if(scene.step===5){
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'touch1',800,function(){
						scene.step=6;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['glassrecover'].visible=true;
						scene.items['broom'].visible=true;
						scene.items['broom'].status=1;
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['broom'])){
				var obj = this.items['broom'];
				if(scene.step===6){
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=7;
					},function(){
							obj.status = 2;
							obj.visible = false;
							scene.items['glass3'].visible=true;
							scene.items['glass3'].status=1;
							scene.handonProp('img/quiet/5/broom.png',663,521);
							
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['glass3'])){
				var obj = this.items['glass3'];
				if(scene.step===7){
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=8;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['glass'].visible=true;
						scene.passoverReady('img/earth/1/note.png',500,game.configdata.SCENE_NAMES.quiet_wearearplug);
							
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
			[1, 'bg', 'quiet5bg.png', 0, 0, 't'],
			[2, 'hammer', 'hammer.png', 1,196, 481,20, 70, [0, 0, 76, 29],  't'],
			[2, 'scissors', 'scissors.png', 2,602, 502,40, 80, [0, 0, 92, 40],  't'],
			[2, 'glassput', 'empty',2,1080, 122,20, 280, [0, 0, 77, 77],  'f'],
			[2, 'glassrecover', '1.png', 2,1079, 120,20, 80, [0, 0, 77, 77],  'f'],
			[2, 'glass1', 'glass1.png', 2,1080, 122,20, 250, [0, 0, 77, 76],  't'],
			[2, 'glass2', 'glass2.png', 2,907, 449,20, 100, [0, 0, 125, 43],  't'],
			[2, 'glass3', 'glass3.png', 2,1017, 399,20, 100, [0, 0, 132, 50], 't'],
			[2, 'glass4', 'glass4.png', 2,907, 449,20, 100, [0, 0, 151, 57],  'f'],
			[2, 'dustpan', 'dustpan.png',2,1094, 359,60, 200, [0, 0, 105, 78],  't'],
			[2, 'glass', 'glass.png', 2,1115, 390,20, 80, [0, 0, 48, 23],  'f'],
			[2, 'broom', 'broom.png', 1,25, 354,50, 150, [0, 0, 92,149],  't']
			
			//[1, 'puzzlebg', 'puzzlebg.png', 0, 0, 'f'],
			//[2, 'heatwithhightemperature', 'heatwithhightemperature.png', 2,124, 90,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'importmachine', 'importmachine.png', 2,449, 87,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'refiningheavily', 'refiningheavily.png',2,439, 355,20, 100, [0, 0, 61, 58],'f'],
			//[2, 'trituration', 'trituration.png', 2,119, 82,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'wastetreatment', 'wastetreatment.png', 2,120, 357,20, 100, [0, 0, 61, 58],  'f']
			];
		
			this.layoutUIElement('img/quiet/5/',data);
			//game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/quiet/5/action.png',
                width:2048,
                height:1024,
                frames:[[848, 312, 210, 310], [424, 624, 210, 310], [848, 312, 210, 310], [1696, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 624, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 624, 210, 310], [636, 0, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [848, 0, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 624, 210, 310], [848, 0, 210, 310], [1484, 624, 210, 310], [1484, 312, 210, 310], [1484, 0, 210, 310], [1272, 624, 210, 310], [1272, 312, 210, 310], [1272, 0, 210, 310], [1060, 624, 210, 310], [1060, 312, 210, 310], [1060, 0, 210, 310], [848, 624, 210, 310]],
                sprites: {
                	cut:[0,3,4,5,6,7,8,9,10,1,2],
                	touch1:{from:11,to:14},
                	unlift:[21,20,19,18,17,16,15],
                	lift:{from:15,to:21},
                	nail:{from:22,to:25},
                	put:{from:26,to:31},
                	stepbox:[0]
                }
           });
           
            this.playboy = this.createSprite(this.atlas,'lift',813,211,6,this);
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