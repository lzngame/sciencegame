(function(ns) {
	var QuietEnterfactoryscene = ns.QuietEnterfactoryscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.quiet_enterfactory,
		helpnote:'img/notes/quiet/quiet1help.png',
		
		initPosx:720,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		glove:null,
		dogatlas:null,
		dog:null,
		cirquelock:null,
		cirque1:null,
		cirque2:null,
		cirque3:null,
		c1Num:0,
		c2Num:0,
		c3Num:0,
		
		step1_picknet:false,
		step2_pickbone:false,
		step3_putbone:false,
		step4_password:false,
		step5_installgear:false,
		step6_offstick:false,
		step7_closedoor:false,
		
		constructor: function(properties) {
			QuietEnterfactoryscene.superclass.constructor.call(this, properties);
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
			this.step1_dialogover = false;
			this.step2_takewheel = false;
			this.step3_installwheel = false;
			this.step4_inshovel = false;
			
			
			
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
		showGlove:function(ishide){
			var x= this.hero.posx-35;
			var y = this.hero.posy-109;
			this.glove.x = x;
			this.glove.y = y;
			this.glove.visible = ishide;
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['net'])){
				var obj = this.items['net'];
				var scene = this;
				this.step1_picknet = true;
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/quiet/1/nets.png',669,532);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bone'])){
				var obj = this.items['bone'];
				var scene = this;
				this.step2_pickbone = true;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/quiet/1/boneonhand.png',670,515);
					    scene.items['net'].visible = true;
					    scene.items['net'].x = 899;
					    scene.items['net'].y = 485;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['lockobj'])){
				var obj = this.items['lockobj'];
				var scene = this;
				if(!scene.step3_putbone){
					scene.dog.currentFrame = 0;
					scene.dog._frames = scene.dogatlas.getSprite('angry');
				}else{
					scene.cirquelock.visible = true;
					scene.hero.visible = false;
					scene.ignoreTouch = true;
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['dogobj'])){
				var obj = this.items['dogobj'];
				var scene = this;
				
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.status = 2;
					    scene.items['bone'].visible = true;
					    scene.items['bone'].x = 304;
					    scene.items['bone'].y = 563;
					    scene.dog.currentFrame = 0;
					    scene.dog._frames = scene.dogatlas.getSprite('eat');
					    scene.step3_putbone = true;
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
[1, 'bg', 'quiet1bg.jpg', 0, 0, 't'],
[1, 'closedoor', 'closedoor.png', 397, 142, 't'],
[1, 'opendoor', 'opendoor.png', 434, 136, 'f'],
[2, 'lockobj', 'empty', 1,352, 277, 42,221,[0,0,112,60],'t'],
[2, 'dogobj', 'empty', 1,159, 427, 186,150,[0,0,160,140],'f'],
[2, 'bone', 'bone.png', 1,766, 439, 20,180,[0,0,70,20],'t'],
[2, 'net', 'nets.png', 1,1099, 369, 26,180,[0,0,93,160],'t'],
			];
		
			this.layoutUIElement('img/quiet/1/',data);

			this.atlas = new Hilo.TextureAtlas({
                image:'img/quiet/1/quiet1boyatlas.png',
                width:636,
                height:936,
                frames:[[212, 312, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [424, 624, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 624, 210, 310], [424, 624, 210, 310]],
                sprites: {
                	turn:[0,1,2,3],
                	pick:[4,5,6,7,8,9,10]
                }
            });

            this.dogatlas = new Hilo.TextureAtlas({
                image:'img/quiet/1/dogatlas.png',
                width: 525,
                height: 620,
                frames:[[175, 155, 173, 153], [350, 155, 173, 153], [350, 0, 173, 153], [350, 155, 173, 153], [175, 465, 173, 153], [175, 310, 173, 153], [350, 310, 173, 153], [175, 0, 173, 153], [0, 465, 173, 153], [0, 310, 173, 153], [0, 155, 173, 153], [0, 0, 173, 153]],
                sprites: {
                	eat:[0,1,2,3],
                	angry:[4,5,6,7],
                	idle:[8,9,10,11],
                }
            });
            this.dog = this.createSprite(this.dogatlas,'idle',159,427,10,this);
            this.playboy = this.createSprite(this.atlas,'pick',1023,211,6,this);
            this.playboy.visible = false;
            
            this.showPassLock();
            this.cirquelock.visible = false;
		},
		showPassLock:function(){
			this.cirquelock = new Hilo.Container().addTo(this);
            var s1 = 257/2;
            var s2 = 368/2;
            var s3 = 525/2;
            var scene = this;
            new Hilo.Bitmap({image:'img/quiet/1/cirquebg.jpg'}).addTo(this.cirquelock);
            this.cirque3 = new Hilo.Bitmap({image:'img/quiet/1/cirque3.png',x:355+s3,y:79+s3}).addTo(this.cirquelock);
            this.cirque2 = new Hilo.Bitmap({image:'img/quiet/1/cirque2.png',x:433+s2,y:157+s2}).addTo(this.cirquelock);
            this.cirque1 = new Hilo.Bitmap({image:'img/quiet/1/cirque1.png',x:488+s1,y:212+s1}).addTo(this.cirquelock);
            this.cirque1.pivotX = s1;
            this.cirque1.pivotY = s1;
            this.cirque2.pivotX = s2;
            this.cirque2.pivotY = s2;
            this.cirque3.pivotX = s3;
            this.cirque3.pivotY = s3;
            this.cirque2.rotation = 240;
            this.cirque3.rotation = 300;
            this.cirquelock.on(Hilo.event.POINTER_START,function(e){
            	var stagex = e.stageX;
				var stagey = e.stageY;
				console.log('x:%d y:%d',stagex,stagey); //622,346,
				var dis = Math.sqrt((stagex - 613)*(stagex-613)+(stagey-318)*(stagey-318));
				if(dis < 134){
					scene.cirque1.rotation += 60;
					scene.c1Num++;
					if(scene.c1Num >= 6){
						scene.c1Num = 0;
					}
				}else if(dis <186){
					scene.cirque2.rotation += 60;
					scene.c2Num++;
					if(scene.c2Num >= 6){
						scene.c2Num = 0;
					}
				}else if(dis <267){
					scene.cirque3.rotation += 60;
					scene.c3Num++;
					if(scene.c3Num >= 6){
						scene.c3Num = 0;
					}
				}
				if((scene.c1Num == 5 && scene.c2Num == 1 && scene.c3Num == 0)||
				   (scene.c1Num == 4 && scene.c2Num == 0 && scene.c3Num == 5)||
				   (scene.c1Num == 3 && scene.c2Num == 5 && scene.c3Num == 4)||
				   (scene.c1Num == 2 && scene.c2Num == 4 && scene.c3Num == 3)||
				   (scene.c1Num == 1 && scene.c2Num == 3 && scene.c3Num == 2)||
				   (scene.c1Num == 0 && scene.c2Num == 2 && scene.c3Num == 1))
				{
					scene.cirquelock.visible = false;
					scene.ignoreTouch = false;
					scene.hero.visible = true;
					scene.step4_password = true;
					scene.items['closedoor'].visible = false;
					scene.items['opendoor'].visible = true;
					
            		scene.passoverReady('img/nextpasspoint.png',1500,game.configdata.SCENE_NAMES.quiet_shutmachine);
					
					console.log('c1:%d c2:%d c3:%d',scene.c1Num,scene.c2Num,scene.c3Num); //622,346,
				}else{
					console.log('c1:%d c2:%d c3:%d',scene.c1Num,scene.c2Num,scene.c3Num); //622,346,
				}
            });
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