(function(ns) {
	var WaterClarifypoolscene = ns.WaterClarifypoolscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.water_clarifyingpool,
		
		initPosx:950,
		initPosy:630,
		helpnote:'img/notes/water/water4help.png',
		
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		istied:false,
		ishandhook:false,
		isstraineronpipe:false,
		ishammeronhand:false,
		
		constructor: function(properties) {
			WaterClarifypoolscene.superclass.constructor.call(this, properties);
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
			
			this.istied = false;
			this.ishandhook = false;
			this.isstraineronpipe = false;
			this.ishammeronhand = false;
			this.setHelp();
			
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['hook'])){
				var obj = this.items['hook'];
				this.pickHook(obj,-74,-104,'img/water/4/onlyhookonhand.png',-48,-132);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['rope'])){
				var obj = this.items['rope'];
				this.pickHook(obj,-58,-100,'img/water/4/ropeonhand.png',-48,-132);
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['straineronfloor'])){
				var obj = this.items['straineronfloor'];
				var scene = this;
				if(!this.ishandhook){
					this.sayNo();
					return true;
				}
				if(obj.state == 0){
					obj.state = 1;
					this.currentOnhandImg.removeFromParent();
					this.hero.visible = false;
					scene.playboy.visible = true;
					scene.playboy.currentFrame = 0;
					scene.playboy._frames = this.atlas.getSprite('put');
					scene.playboy.play();
					this.handonProp('img/water/4/poolhook.png',this.playboy.x-170+30,this.playboy.y+70+88);
				}else{
					this.currentOnhandImg.removeFromParent();
					this.hero.visible = true;
					scene.playboy.visible = false;
					obj.status = 2;
					obj.removeFromParent();
					this.items['pipe'].state = 1;
					this.items['hookonfloor'].visible = true;
					this.handonProp('img/water/4/straineronhand.png',this.hero.posx-60,this.hero.posy-105);
				}
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pipe'])){
				var scene = this;
				var obj = this.items['pipe'];
				if(obj.state == 0){
					this.sayNo();
					return true;
				}
				var straineronpipe = this.items['straineronpipe'];
				if(obj.state == 1){
					obj.state = 0;
					this.currentOnhandImg.removeFromParent();
					this.isstraineronpipe = true;
					scene.gotoDosomething(obj,1,0,0,'backput',300,function(){
						straineronpipe.visible = true;
					},function(){
						//obj.status = 2;
						obj.visible = true;
					});
				}else if(obj.state == 2){
					obj.status = 2;
					obj.state = 0;
					this.currentOnhandImg.removeFromParent();
					scene.gotoDosomething(obj,1,0,0,'backput',300,function(){

					},function(){
						obj.visible = true;
						scene.items['boardonpipe1'].visible = true;
						scene.items['boardonpipe2'].visible = true;
						scene.finishpass();
					});
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['hammer'])){
				var obj = this.items['hammer'];
				var scene = this;
				if(!this.isstraineronpipe){
					this.sayNo();
					return true;
				}
				this.isHammeronhand = true;
				scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){

				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.handonProp('img/water/4/hammeronhand.png',scene.hero.posx-52,scene.hero.posy-121);
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['boardobj'])){
				var obj = this.items['boardobj'];
				var scene = this;
				if(!this.isHammeronhand){
					this.sayNo();
					return true;
				}
				var board1 = this.items['boardfall1'];
				var board2 = this.items['boardfall2'];
				var hammer = this.items['hammer'];
				var wallboard1 = this.items['boardonwall1'];
				var wallboard2 = this.items['boardonwall2'];
				this.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'knock',800,function(){

				},function(){
					obj.status = 2;
					obj.visible = false;
					board1.visible = true;
					board1.status = 1;
					board2.visible = true;
					hammer.visible = true;
					wallboard1.visible = false;
					wallboard2.visible = false;
					hammer.x = 1132;
					hammer.y = 285;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['boardfall1'])){
				var obj = this.items['boardfall1'];
				var scene = this;
				var board1 = this.items['boardfall1'];
				var board2 = this.items['boardfall2'];
				this.items['pipe'].state = 2;
				scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){
					
				},function(){
					obj.status = 2;
					obj.visible = false;
					board1.visible = false;
					board1.status = 2;
					board2.visible = false;
					scene.handonProp('img/water/4/boardonhand.png',scene.hero.posx-52,scene.hero.posy-121);
				});
				return true;
			}
			
			return false;
		},
		finishpass:function(){
			var scene = this;
			var rubbish1 = this.items['rubbish1'];
			var rubbish2 = this.items['rubbish2'];
			var rubbish3 = this.items['rubbish3'];
			new Hilo.Tween.to(rubbish1,{alpha:0},{duration:2000});
			new Hilo.Tween.to(rubbish2,{alpha:0},{duration:2000});
			new Hilo.Tween.to(rubbish3,{alpha:0},{duration:2200,onComplete:function(){
				scene.passoverReady('img/nextpasspoint.png',500,game.configdata.SCENE_NAMES.water_filterpool);
			}});
		},
		pickHook:function(obj,offsetx,offsety,onhandimg,x,y){
			var scene = this;
			if(!this.istied){
				this.istied = true;
				scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){

					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.handonProp(onhandimg,scene.hero.posx+offsetx,scene.hero.posy+offsety);
					});
			}else{
				this.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){

					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.ishandhook = true;
						scene.handonProp('img/water/4/hookonhand.png',scene.hero.posx+x,scene.hero.posy+y);
					});
			}
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
				[game.configdata.LAYOUTTYPE.img,'bg','img/water/4/water4bg.jpg',0,0,true],
				[game.configdata.LAYOUTTYPE.img,'rubbish1','img/water/4/rubbish1.png',452,486,true],
				[game.configdata.LAYOUTTYPE.img,'rubbish2','img/water/4/rubbish2.png',539,473,true],
				[game.configdata.LAYOUTTYPE.img,'rubbish3','img/water/4/rubbish3.png',600,429,true],
				[game.configdata.LAYOUTTYPE.img,'straineronpipe','img/water/4/strainer.png',211,214,true],
				[game.configdata.LAYOUTTYPE.img,'boardonpipe1','img/water/4/boardonpipe1.png',213,226,true],
				[game.configdata.LAYOUTTYPE.img,'boardonpipe2','img/water/4/boardonpipe2.png',217,222,true],
				[game.configdata.LAYOUTTYPE.img,'boardonwall1','img/water/4/boardonwall1.png',931,104,true],
				[game.configdata.LAYOUTTYPE.img,'boardonwall2','img/water/4/boardonwall2.png',935,105,true],
				[game.configdata.LAYOUTTYPE.img,'hookonfloor','img/water/4/hookonfloor.png',1032,415,true],
				
				[game.configdata.LAYOUTTYPE.activeobj,'hammer','hammer','img/water/4/hammer.png',989,464,40,50,[0,0,73,35],1],
				[game.configdata.LAYOUTTYPE.activeobj,'straineronfloor','straineronfloor','img/water/4/straineronfloor.png',710,460,22,202,[0,0,97,63],1],
				[game.configdata.LAYOUTTYPE.activeobj,'hook','hook','img/water/4/hook.png',995,348,22,52,[0,0,88,37],1],
				[game.configdata.LAYOUTTYPE.activeobj,'rope','rope','img/water/4/rope.png',1035,396,22,102,[0,0,80,50],1],
				[game.configdata.LAYOUTTYPE.activeobj,'boardfall1','boardfall1','img/water/4/boardonfloor1.png',1015,264,22,52,[0,0,120,30],2],
				[game.configdata.LAYOUTTYPE.activeobj,'boardfall2','boardfall2','img/water/4/boardonfloor2.png',1004,264,102,122,[0,0,120,30],2],
				[game.configdata.LAYOUTTYPE.activeobj,'pipe','pipe','empty',211,214,25,157,[0,0,40,120],1],
				[game.configdata.LAYOUTTYPE.activeobj,'boardobj','boardobj','empty',931,104,52,199,[0,0,100,90],1],
				
				[game.configdata.LAYOUTTYPE.img,'waterface','img/water/4/waterface.png',105,325,true],
			];
		
			this.layoutUIElement(data);
			//game.sounds.play(17,true);
            this.items['hookonfloor'].visible = false;
            this.items['boardfall1'].visible = false;
            this.items['boardfall2'].visible = false;
            this.items['straineronpipe'].visible = false;
            this.items['boardonpipe1'].visible = false;
            this.items['boardonpipe2'].visible = false;
            this.items['waterface'].alpha  = 0.3;
			this.atlas = new Hilo.TextureAtlas({
                image:'img/water/4/water4boyatlas.png',
                width: 1060,
                height: 936,
                frames:[[848, 0, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [848, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [424, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [636, 0, 210, 310], [636, 624, 210, 310]],
                sprites: {
                	idle:[0,0],
                	backpick:{from:9,to:15},
                	put:[2],
                	backput:[9,9],
                	knock:[5,6,7,8,5,6,7,8,5],
                }
            });
            var streamatlas = new Hilo.TextureAtlas({
                image:'img/water/4/streamatlas.png',
                width: 194,
                height: 264,
                frames:[[97, 0, 95, 130], [0, 132, 95, 130], [0, 0, 95, 130]],
                sprites: {
                	idle:[0,1,2],
                }
            });
            this.createSprite(streamatlas,'idle',207,275,10,this);
            
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