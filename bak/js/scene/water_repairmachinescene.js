(function(ns) {
	var WaterRepairmachinescene = ns.WaterRepairmachinescene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.water_repairmachine,
		
		initPosx:950,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		pwdimg:null,
		islube:null,
		valueRotations:null,
		vapourpanel:null,
		pipes:null,
		isSpanner:false,
		
		currentpipeindex:-1,
		constructor: function(properties) {
			WaterRepairmachinescene.superclass.constructor.call(this, properties);
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
			this.currentpipeindex = -1;
			this.pipes = [false,false,false,false,false];
			this.isSpanner = false;
			
			this.pwdimg = new Hilo.Bitmap({image:'img/water/3/pwd.jpg',visible:false}).addTo(this);
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
		
		receiveMsg: function(msg) {
			
		},
		putProp:function(){
			this.hero.putProp();
			this.currentOnhandObj = null;
		},
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['instruction'])){
				var obj = this.pwdimg;
				obj.visible = true;
				var scene = this;
				scene.hero.visible = false;
				scene.ignoreTouch = true;
				obj.on(Hilo.event.POINTER_START,function(e){
					scene.ignoreTouch = false;
					scene.hero.visible = true;
					obj.visible = false;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['screw1'])){
				var obj = this.items['screw1'];
				if(this.currentpipeindex != -1){
					this.sayNo();
					return true;
				}
				if(this.items['spanner'].status == 1){
					this.sayNo();
					return true;
				}
				this.spanner(obj);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['screw2'])){
				var obj = this.items['screw2'];
				if(this.currentpipeindex != -1){
					this.sayNo();
					return true;
				}
				if(this.items['spanner'].status == 1){
					this.sayNo();
					return true;
				}
				this.spanner(obj);
				return true;
			}
			
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['spanner'])){
				var obj = this.items['spanner'];
				if(this.currentpipeindex != -1){
					this.sayNo();
					return true;
				}
				var scene = this;
				this.isSpanner = true;
				scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){

				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.handonProp('img/water/3/spanneronhand.png',scene.hero.posx-47,scene.hero.posy-114);
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pipeobj1'])){
				if(this.isSpanner){
					this.sayNo();
					return true;
				}
				if(this.currentpipeindex == -1)
					this.pickupPipe(1,'img/water/3/rg4.png',80,130);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pipeobj2'])){
				if(this.isSpanner){
					this.sayNo();
					return true;
				}
				if(this.currentpipeindex == -1)
					this.pickupPipe(2,'img/water/3/rg1.png',80,130);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pipeobj3'])){
				if(this.isSpanner){
					this.sayNo();
					return true;
				}
				if(this.currentpipeindex == -1)
					this.pickupPipe(3,'img/water/3/rg2.png',80,130);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pipeobj4'])){
				if(this.isSpanner){
					this.sayNo();
					return true;
				}
				if(this.currentpipeindex == -1)
					this.pickupPipe(4,'img/water/3/rg3.png',45,120);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pipeobj5'])){
				if(this.isSpanner){
					this.sayNo();
					return true;
				}
				if(this.currentpipeindex == -1)
					this.pickupPipe(5,'img/water/3/rg5.png',60,140);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['putpipeobj1'])){
				if(this.currentpipeindex == 1)
					this.fixPipe(this.currentpipeindex);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['putpipeobj2'])){
				if(this.currentpipeindex == 2)
					this.fixPipe(this.currentpipeindex);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['putpipeobj3'])){
				if(this.currentpipeindex == 3)
					this.fixPipe(this.currentpipeindex);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['putpipeobj4'])){
				if(this.currentpipeindex == 4)
					this.fixPipe(this.currentpipeindex);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['putpipeobj5'])){
				if(this.currentpipeindex == 5)
					this.fixPipe(this.currentpipeindex);
				else
					this.pickdownPipe(this.currentpipeindex);
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['greenlamp'])){
				var obj = this.items['greenlamp'];
				var scene = this;
				if(obj.state == 0){
					this.sayNo();
					return true;
				}
				scene.gotoDosomething(obj,1,0,0,'pushbutton',800,function(){

				},function(){
					obj.status = 2;
					obj.visible = false;
					new Hilo.Tween.to(this,{
						alpha:1
					},{
						duration:1000,
						delay:1500,
						onComplete:function(){
							game.switchScene(game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.ecosystem);
						}
					});
				});
				return true;
			}
			
			return false;
		},
		fixPipe:function(index){
			var targetobj = this.items['putpipeobj'+index.toString()];
			var obj = this.items['pipeobj'+index.toString()];
			obj.status = 2;
			targetobj.status = 2;
			var img = this.items['pipe'+index.toString()];
			var scene = this;
			this.currentpipeindex = -1;
			this.currentOnhandImg.removeFromParent();
			this.pipes[index-1] = true;
			this.disObj();
			var action = 'pushbutton';
			if(index == 2)
				action = 'pushbutton';
			scene.gotoDosomething(targetobj,1,0,0,action,800,function(){
					img.visible = true;
				},function(){
					
				});
			if(this.pipes[0] && this.pipes[1] && this.pipes[2] && this.pipes[3] && this.pipes[4] && this.items['screw1'].status == 2 && this.items['screw2'].status == 2){
				this.items['greenlamp'].state = 1;
			}
		},
		activeObj:function(){
			var obj1 = this.items['putpipeobj1'];
			if(obj1.state == 0){
				obj1.status = 1;
			}
			var obj2 = this.items['putpipeobj2'];
			if(obj2.state == 0){
				obj2.status = 1;
			}
			var obj3 = this.items['putpipeobj3'];
			if(obj3.state == 0){
				obj3.status = 1;
			}
			var obj4 = this.items['putpipeobj4'];
			if(obj4.state == 0){
				obj4.status = 1;
			}
			var obj5 = this.items['putpipeobj5'];
			if(obj5.state == 0){
				obj5.status = 1;
			}
		},
		disObj:function(){
			var obj1 = this.items['putpipeobj1'];
			if(obj1.state == 0){
				obj1.status = 2;
			}
			var obj2 = this.items['putpipeobj2'];
			if(obj2.state == 0){
				obj2.status = 2;
			}
			var obj3 = this.items['putpipeobj3'];
			if(obj3.state == 0){
				obj3.status = 2;
			}
			var obj4 = this.items['putpipeobj4'];
			if(obj4.state == 0){
				obj4.status = 2;
			}
			var obj5 = this.items['putpipeobj5'];
			if(obj5.state == 0){
				obj5.status = 2;
			}
		},
		pickdownPipe:function(index){
			var obj = this.items['pipeobj'+index.toString()];
			var scene = this;
			this.currentpipeindex = -1;
			this.currentOnhandImg.removeFromParent();
			this.disObj();
			scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){
					obj.visible = true;
				},function(){
					obj.status = 1;
					
				});
		},
		pickupPipe:function(index,img,x,y){
			var obj = this.items['pipeobj'+index.toString()];
			var scene = this;
			this.currentpipeindex = index;
			this.activeObj();
			scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){

				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.handonProp(img,scene.hero.posx-x,scene.hero.posy-y);
				});
		},
		spanner:function(obj){
			var scene = this;
			scene.currentOnhandImg.visible = false;
			obj.status = 2;
			if(this.pipes[0] && this.pipes[1] && this.pipes[2] && this.pipes[3] && this.pipes[4] && this.items['screw1'].status == 2 && this.items['screw2'].status == 2){
				this.items['greenlamp'].state = 1;
			}
			scene.gotoDosomething(obj,1,0,0,'spanner',1000,function(){
 
				},function(){
					scene.currentOnhandImg.visible = true;
					obj.removeFromParent();
					if(scene.items['screw1'].status == 2 && scene.items['screw2'].status ==2){
						scene.currentOnhandImg.removeFromParent();
						scene.isSpanner = false;
						var tmp = scene.items['spanner'];
						tmp.visible = true;
						tmp.x = scene.hero.posx + 70;
						tmp.y = scene.hero.posy - 80;
						tmp.status = 2;
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
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		createActiveObj:function(objname,x,y,targetx,targety,readyImgurl,finishedImgurl,clickrect,status){
			return new game.ActiveObject({
				name:objname,
				x:x,
				y:y,
				targetx:targetx,
				targety:targety,
				readyImgUrl:readyImgurl,
				finishedImgUrl:finishedImgurl,
				clickArea:clickrect,
				status:status,
			}).addTo(this);
		},
		layoutUIElement:function(arraydata){
			for(var i=0;i<arraydata.length;i++){
				var item = arraydata[i];
				var itemtype = item[0];
				if(itemtype == game.configdata.LAYOUTTYPE.activeobj){
					var name = item[1];
					var obj = item[2];
					var img = item[3];
					var x = item[4];
					var y = item[5];
					var targetx = item[6];
					var targety = item[7];
					var clickrect = item[8];
					var status = item[9];
					this.items[obj] = this.createActiveObj(name,x,y,targetx,targety,img,img,clickrect,status);
				}
				if(itemtype == game.configdata.LAYOUTTYPE.img){
					var obj = item[1];
					var img = item[2];
					var x = item[3];
					var y = item[4];
					var isvisible = item[5];
					this.items[obj] = new Hilo.Bitmap({image:img,x:x,y:y,visible:isvisible}).addTo(this);
				}
			}
		},
		layoutBgMap:function(){
			var scene = this;
			var data = [
				[game.configdata.LAYOUTTYPE.img,'bg','img/water/3/water3bg.jpg',0,0,true],
				[game.configdata.LAYOUTTYPE.img,'lamp','img/water/3/lamp.png',1021,266,true],
				[game.configdata.LAYOUTTYPE.img,'pipe1','img/water/3/pipe1.png',288,362,false],
				[game.configdata.LAYOUTTYPE.img,'pipe2','img/water/3/pipe2.png',344,279,false],
				[game.configdata.LAYOUTTYPE.img,'pipe3','img/water/3/pipe3.png',458,362,false],
				[game.configdata.LAYOUTTYPE.img,'pipe4','img/water/3/pipe4.png',619,427,false],
				[game.configdata.LAYOUTTYPE.img,'pipe5','img/water/3/pipe5.png',712,313,false],
				[game.configdata.LAYOUTTYPE.img,'screwdown1','img/water/3/screw1_down.png',1105,308,true],
				[game.configdata.LAYOUTTYPE.img,'screwdown2','img/water/3/screw1_down.png',1164,308,true],
				[game.configdata.LAYOUTTYPE.img,'redlamp','img/water/3/redlamp.png',1112,351,true],
				
				
				[game.configdata.LAYOUTTYPE.activeobj,'spanner','spanner','img/water/3/spanner.png',126,542,20,50,[0,0,87,33],1],
				[game.configdata.LAYOUTTYPE.activeobj,'instruction','instruction','empty',794,238,22,202,[0,0,56,50],1],
				[game.configdata.LAYOUTTYPE.activeobj,'greenlamp','greenlamp','img/water/3/greenstartbtn.png',1112,351,22,202,[0,0,30,30],1],
				
				[game.configdata.LAYOUTTYPE.activeobj,'pipeobj1','pipeobj1','img/water/3/pipeonfloor1.png',0,510,22,102,[0,0,90,90],1],
				[game.configdata.LAYOUTTYPE.activeobj,'pipeobj2','pipeobj2','img/water/3/pipeonfloor2.png',332,471,102,122,[40,0,150,80],1],
				[game.configdata.LAYOUTTYPE.activeobj,'pipeobj3','pipeobj3','img/water/3/pipeonfloor3.png',142,496,112,122,[90,40,100,80],1],
				[game.configdata.LAYOUTTYPE.activeobj,'pipeobj4','pipeobj4','img/water/3/pipeonfloor4.png',519,518,82,52,[40,0,100,40],1],
				[game.configdata.LAYOUTTYPE.activeobj,'pipeobj5','pipeobj5','img/water/3/pipeonfloor5.png',703,470,122,92,[50,20,180,90],1],
				
				[game.configdata.LAYOUTTYPE.activeobj,'putpipeobj1','putpipeobj1','empty',288,362,22,202,[0,0,90,90],2],
				[game.configdata.LAYOUTTYPE.activeobj,'putpipeobj2','putpipeobj2','empty',344,279,22,202,[0,0,150,80],2],
				[game.configdata.LAYOUTTYPE.activeobj,'putpipeobj3','putpipeobj3','empty',458,362,22,202,[0,20,180,80],2],
				[game.configdata.LAYOUTTYPE.activeobj,'putpipeobj4','putpipeobj4','empty',619,427,22,202,[40,0,100,40],2],
				[game.configdata.LAYOUTTYPE.activeobj,'putpipeobj5','putpipeobj5','empty',712,313,22,202,[50,20,180,90],2],
				
				[game.configdata.LAYOUTTYPE.activeobj,'screw1','screw1','img/water/3/screw1_up.png',1105,307,-70,232,[0,0,30,30],1],
				[game.configdata.LAYOUTTYPE.activeobj,'screw2','screw2','img/water/3/screw1_up.png',1156,307,-70,232,[0,0,30,30],1],
			];
			
			this.layoutUIElement(data);
			game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/water/3/water3boyatlas.png',
                width: 848,
                height: 936,
                frames:[[424, 624, 210, 310], [636, 0, 210, 310], [636, 312, 210, 310], [212, 624, 210, 310], [636, 312, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [636, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [636, 624, 210, 310], [0, 624, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	idle:[0,0],
                	pushbutton:[0,1,2,3,4,5,6,7],
                	backpick:[8,9,10,11,12,13,14],
                	spanner:[15,16,17,18,19,20],
                }
            });
            
            this.playboy = this.createSprite(this.atlas,'idle',1023,211,10,this);
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