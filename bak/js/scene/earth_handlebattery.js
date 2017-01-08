(function(ns) {
	var EarthHandlebatteryscene = ns.EarthHandlebatteryscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earth_handlebattery,
		helpnote:'img/notes/earth/earth3help.png',
		
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
			EarthHandlebatteryscene.superclass.constructor.call(this, properties);
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
			
			this.touchnum = 0;
			this.isopen = false;
			this.iskeyonhand = false;
			this.isopenbox = false;
			this.isscissor = false;
			this.step =0;
			this.setHelp();
			
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['battery'])){
				var obj = this.items['battery'];
				if (scene.step===0) {
					scene.gotoDosomething(obj,1,0,0,'put',800,function(){
						scene.step=1;
					},function(){
						obj.visible = false
						scene.items['bucket'].visible = false;
						new Hilo.Tween.to(scene.hero,{
							posx:317,
							posy:492,
							scaleX:1,
							scaleY:1,
						},{
							duration:120,
							delay:120,
							onComplete:function(){
								scene.hero.visible=false;
								scene.playboy.visible=true;
								scene.playboy.x = scene.hero.posx -115;
								scene.playboy.y = scene.hero.posy -283;
								scene.playboy.currentFrame = 0;
								scene.playboy._frames = scene.atlas.getSprite('pour');
								scene.playboy.loop = false;
								scene.playboy.play();
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bucket1'])){
				var obj = this.items['bucket1'];
				if (scene.step===1) {
					
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=2;
					},function(){
						obj.status = 2;
						obj.visible = false;
						
						new Hilo.Tween.to(scene.hero,{
							posx:1023,
							posy:536,
							scaleX:1,
							scaleY:1,
						},{
							duration:120,
							delay:120,
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
						scene.items['bucket1m'].visible = true;
						//scene.items['leaflet'].status = 2;
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bucket2'])){
				var obj = this.items['bucket2'];
				if (scene.step===2) {
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=3;
					},function(){
						obj.status = 2;
						obj.visible = false;
						
						new Hilo.Tween.to(scene.hero,{
							posx:973,
							posy:536,
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
						scene.items['bucket2m'].visible = true;
						//scene.items['leaflet'].visible = true;
						//scene.items['leaflet'].status = 2;
					});
				}
				else{
					this.sayNo();
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bucket3'])){
				var obj = this.items['bucket3'];
				if(scene.step===3){
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=4;
					},function(){
						obj.status = 2;
						obj.visible = false;
						
						new Hilo.Tween.to(scene.hero,{
							posx:1093,
							posy:536,
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
								scene.items['bucket3m'].visible = true;
							}
						});
					});
				}
				else{
					this.sayNo();
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['button'])){
				var obj = this.items['button'];
				//TODO
				if(scene.step===4){
					scene.gotoDosomething(obj,1,0,0,'press',800,function(){
						scene.step=5;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['bg'].visible=false;
						scene.items['bucket3m'].visible=false;
						scene.items['bucket2m'].visible=false;
						scene.items['bucket1m'].visible=false;
						
						scene.items['puzzlebgm'].visible=true;
						scene.items['heatwithhightemperaturem'].visible=true;
						scene.items['refiningheavilym'].visible=true;
						scene.items['importmachinem'].visible=true;
						scene.items['triturationm'].visible=true;
						scene.items['wastetreatmentm'].visible=true;
						scene.items['touchpuzzle'].status=1;
						scene.items['touchpuzzle'].visible=true;
					});
				}
				else{
					this.sayNo();
					
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['touchpuzzle'])){
				var obj = this.items['touchpuzzle'];
				if(scene.step===5){
					if (scene.touchnum>=1) {
						scene.passoverReady('img/nextpasspoint.png',1000,game.configdata.SCENE_NAMES.earth_changeplant);

					}
					else{
						scene.items['puzzlebg'].visible=true;
						scene.items['heatwithhightemperature'].visible=true;
						scene.items['refiningheavily'].visible=true;
						scene.items['importmachine'].visible=true;
						scene.items['trituration'].visible=true;
						scene.items['wastetreatment'].visible=true;
						
						scene.items['puzzlebgm'].visible=false;
						scene.items['heatwithhightemperaturem'].visible=false;
						scene.items['refiningheavilym'].visible=false;
						scene.items['importmachinem'].visible=false;
						scene.items['triturationm'].visible=false;
						scene.items['wastetreatmentm'].visible=false;
					}
					scene.touchnum++;
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
			[1, 'bg', 'earth3bg.jpg', 0, 0, 't'],
			[2, 'bucket3', 'bucket3.png', 1,1130, 402,20, 100, [0, 0, 61, 58],  't'],
			[2, 'bucket3m', 'bucket3.png', 2,1053, 429,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'bucket2', 'bucket2.png',1,494, 505,20, 100, [0, 0, 61, 58],'t'],
			[2, 'bucket2m', 'bucket2.png', 2,923, 429,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'bucket1', 'bucket1.png', 1,711, 508,20, 100, [0, 0, 61, 58],  't'],
			[2, 'bucket1m', 'bucket1.png', 2,1003, 429,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'bucket', 'bucket.png',2,41, 460,20, 150, [0, 0, 61, 90],  't'],
			[2, 'battery', 'battery.png', 1,51, 451,50, 100, [0, 0, 61,90],  't'],
			[2, 'button', 'button.png', 1,620, 335,-20, 150, [0, 0, 22,22],  't'],
			[1, 'puzzlebg', 'puzzlebg.png', 0, 0, 'f'],
			[2, 'heatwithhightemperature', 'heatwithhightemperature.png', 2,124, 90,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'importmachine', 'importmachine.png', 2,449, 87,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'refiningheavily', 'refiningheavily.png',2,439, 355,20, 100, [0, 0, 61, 58],'f'],
			[2, 'trituration', 'trituration.png', 2,119, 82,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'wastetreatment', 'wastetreatment.png', 2,120, 357,20, 100, [0, 0, 61, 58],  'f'],
			[1, 'puzzlebgm', 'puzzlebg.png', 0, 0, 'f'],
			[2, 'heatwithhightemperaturem', 'heatwithhightemperature.png', 2,109, 87,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'importmachinem', 'importmachine.png', 2,773,357 ,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'refiningheavilym', 'refiningheavily.png',2,439, 355,20, 100, [0, 0, 61, 58],'f'],
			[2, 'triturationm', 'trituration.png', 2,120, 357,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'wastetreatmentm', 'wastetreatment.png', 2,119, 82,20, 100, [0, 0, 61, 58],  'f'],
			[2, 'touchpuzzle', 'empty', 2,0,0,20, 100, [0, 0, 1100, 987],  'f']
			/*[2, 'hammer', 'hammer.png',1, 859,462, 20, 80, [0, 0, 76, 30], 't'],
			[2, 'leaflet1', 'leaflet3.png',2,300, 286,-20, 150, [0, 0, 40, 53],  't'],
			[2, 'leaflet2', 'leaflet2.png', 2, 575, 484, 20, 80, [0, 0, 118, 22], 't'],
			[2, 'leaflet3', 'leaflet1.png', 1, 409, 409, 20, 80, [0, 0,40, 55], 'f'],
			[2, 'package', 'package.png', 1, 289, 449, 70, 150, [0, 0, 112, 67], 'f'],
			[2, 'knife', 'knife.png',1, 319, 472, -20, 80, [0, 0, 42, 18], 'f'],
			[2, 'leafletinput', 'empty',1,409, 409,20, 80, [0, 0, 40, 53],  'f'],
			[2, 'cabinetput', 'empty', 1, 289, 429,-20, 150, [0, 0, 112, 67], 'f']*/
			];
		
			this.layoutUIElement('img/earth/3/',data);
			//game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/earth/3/action.png',
                width:2048,
                height:1024,
                frames:[[636, 0, 210, 310], [1272, 0, 210, 310], [1060, 624, 210, 310], [1060, 312, 210, 310], [1060, 0, 210, 310], [1060, 624, 210, 310], [636, 0, 210, 310], [848, 624, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 312, 210, 310], [636, 312, 210, 310], [848, 312, 210, 310], [1272, 312, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [424, 312, 210, 310], [424, 312, 210, 310], [424, 624, 210, 310], [1272, 312, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	lift:{from:0,to:6},
                	unlift:[6,5,4,3,2,1,0],
                	pour:{from:7,to:14},
                	press:{from:15,to:22},
                	put:{from:23,to:28},
                	stepbox:[0]
                }
           });
           
            this.playboy = this.createSprite(this.atlas,'press',1023,211,6,this);
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