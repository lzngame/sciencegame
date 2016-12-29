(function(ns) {
	var WaterIntopipescene = ns.WaterIntopipescene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.confusion_cinema,
		
		initPosx:650,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		activeobjs:null,
		atlas:null,
		wateratlas:null,
		items:null,
		playboy:null,
		currentkey:'empty',
		keydises:null,
		maskgraphic:null,
		isbranchonhand:false,
		isinstrumentonhand:false,
		constructor: function(properties) {
			WaterIntopipescene.superclass.constructor.call(this, properties);
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
			this.keydises = {
				bluekey:60,
				yellowkey:100,
				pinkkey:140,
				purplekey:180
			};
			this.isbranchonhand = false;
			this.isinstrumentonhand = false;
			game.sounds.play(14,true);
			this.showMask('img/water/waterbgnote.png');
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bluelock'])||this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['purplelock'])||this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['yellowlock'])){
				var obj = this.items['bluelock'];
				this.sayNo();
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pinklock'])){
				var obj = this.items['pinklock'];
				if(this.currentkey == 'pinkkey'){
					var scene = this;
					this.currentOnhandImg.removeFromParent();
					scene.items['pinkkey'].removeFromParent();
					obj.status = 2;
					var scene = this;
					scene.gotoDosomething(obj,0.8,0,0,'onshoesuptake',300,function(){
						scene.items['branch'].visible = true;
						scene.items['branch'].x = 586;
						scene.items['branch'].y = 555;
						scene.items['branch'].status = 2;
						scene.items['branch'].state = 2;
					},function(){
						scene.items['closerailimg'].visible = false;
						scene.items['openrailimg'].visible = true;
						scene.items['lockclose'].visible = false;
						scene.items['lockopen'].visible = true;
						scene.items['pinkexit'].status = 1;
					});
				}else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pinkexit'])){
				var obj = this.items['pinkexit'];
				var scene = this;
				scene.gotoDosomething(obj,0.9,0,0,'goexit',1800,function(){
						scene.hero.alpha = 0;
					},function(){
						game.switchScene(game.configdata.SCENE_NAMES.water_closevalue);
					});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bluekey'])){
				var obj = this.items['bluekey'];
				this.takeKey('bluekey');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pinkkey'])){
				var obj = this.items['pinkkey'];
				this.takeKey('pinkkey');
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['yellowkey'])){
				var obj = this.items['yellowkey'];
				this.takeKey('yellowkey');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['purplekey'])){
				var obj = this.items['purplekey'];
				this.takeKey('purplekey');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['onecheckpoint'])){
				this.checkwater('onecheckpoint');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['twocheckpoint'])){
				this.checkwater('twocheckpoint');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['threecheckpoint'])){
				this.checkwater('threecheckpoint');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['fourcheckpoint'])){
				this.checkwater('fourcheckpoint');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['branch'])){
				var obj = this.items['branch'];
				var scene = this;
				this.isbranchonhand = true;
				if(obj.state == 0){
					this.gotoDosomething(obj,1,0,0,'breakoffbranch',550,function(){
					
					},function(){
						obj.visible = false;
						obj.status = 2;
						scene.handonProp('img/water/branchonhand.png',scene.hero.posx-44,scene.hero.posy-149);
					});
				}else{
					scene.currentOnhandImg.removeFromParent();
					this.gotoDosomething(obj,1,0,0,'onshoesdowntake',400,function(){
						
					},function(){
						obj.visible = false;
						obj.status = 2;
						scene.items['instrumentinbox'].state = 1;
						scene.isbranchonhand = true;
						scene.isinstrumentonhand = false;
						new Hilo.Bitmap({image:'img/water/instrumentonfloor.png',x:obj.x,y:obj.y}).addTo(scene);
						scene.handonProp('img/water/branchonhand.png',scene.hero.posx-44,scene.hero.posy-149);
					});
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['instrumentinbox'])){
				if(this.items['shoesinbox'].status == 1){
					this.sayNo();
					return true;
				}
				var obj = this.items['instrumentinbox'];
				var scene = this;
				this.isinstrumentonhand = true;
				this.gotoDosomething(obj,1,0,0,'onshoesdowntake',500,function(){
					
				},function(){
					obj.visible = false;
					obj.status = 2;
					scene.handonProp('img/water/instrumentonhand.png',scene.hero.posx-44,scene.hero.posy-100);
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['shoesinbox'])){
				var obj = this.items['shoesinbox'];
				var scene = this;
				this.gotoDosomething(obj,1,0,0,'wareshoes',1100,function(){
					obj.visible = false;
					obj.status = 2;
					obj.removeFromParent();
				},function(){
					scene.boyidleshoes();
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['closebox'])){
				var obj = this.items['closebox'];
				if(!this.isbranchonhand){
					this.sayNo();
					return;
				}
				var scene = this;
				this.currentOnhandImg.removeFromParent();
				this.gotoDosomething(obj,1,0,0,'prybox',400,function(){
					
				},function(){
					obj.visible = false;
					obj.status = 2;
					scene.items['openbox'].visible = true;
					scene.items['branch'].visible = true;
					scene.items['branch'].x = 886;
					scene.items['branch'].y = 555;
					//scene.items['branch'].status = 1;
					scene.items['instrumentinbox'].status = 1;
					scene.items['shoesinbox'].status = 1;
					scene.items['branch'].state = 2;
					scene.items['branch'].targety = 50;
					scene.isbranchonhand = false;
				});
				return true;
			}
			
			return false;
		},
		takeKey:function(keyname){
			if(!this.isbranchonhand || this.items['instrumentinbox'].state == 0){
				this.sayNo();
				return;
			}
			var obj = this.items[keyname];
			var scene = this;
			this.currentOnhandImg.visible = false;
			
			if(this.currentkey != 'empty'){
					var proobj = this.items[this.currentkey];
					proobj.status = 1;
					proobj.state = 2;
					proobj.targety = 40;
					proobj.targetx = -10;
					var dis = scene.keydises[proobj.name];
					proobj.x = this.hero.posx + dis;
					proobj.y = this.hero.posy -60;
					console.log('%s--%d',proobj.name,dis);
				}
			var action = 'upbranch';
			if(obj.state != 0){
				action = 'onshoesdowntake';
						  
			}
			this.gotoDosomething(obj,1,0,0,action,200,function(){
					
				},function(){
					scene.currentOnhandImg.visible = true;
					scene.currentkey = obj.name;
					obj.x = scene.hero.posx + 38;
					obj.y = scene.hero.posy - 92;
					obj.status = 2;
				});
		},
		
		checkwater:function(pointname){
			var obj = this.items[pointname];
			if(!this.isinstrumentonhand){
				this.sayNo();
				return;
			}
			var scene = this;
			scene.currentOnhandImg.visible = false;
			this.gotoDosomething(obj,1,0,0,'checkwater',1000,function(){
					scene.items['greenlamp'].visible = true;
					scene.items['redlamp'].visible = false;
					if(pointname == 'twocheckpoint'){
						scene.items['greenlamp'].visible = false;
						scene.items['redlamp'].visible = true;
						scene.items['branch'].status = 1;
						game.sounds.play(36,false);
					}
					scene.items['redlamp'].x = scene.items['greenlamp'].x = scene.playboy.x + 160;
					scene.items['redlamp'].y = scene.items['greenlamp'].y = scene.playboy.y + 30;
				},function(){
					scene.currentOnhandImg.visible = true;
					scene.items['greenlamp'].visible = false;
					scene.items['redlamp'].visible = false;
				});
		},
		boyidleshoes:function(){
			new Hilo.Bitmap({
				image:'img/water/shoesidle.png',
				x:35,
				y:240,
			}).addTo(this.hero);
		},
		gotoExit:function(targetobj,scaleFact,x,y,playaction,delay,onCall1,onCall2){
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
				[game.configdata.LAYOUTTYPE.img,'bg','img/water/waterpipelinebg.png',0,0,true],
				[game.configdata.LAYOUTTYPE.img,'closerailimg','img/water/closerail.png',490,226,true],
				[game.configdata.LAYOUTTYPE.img,'openrailimg','img/water/openrail.png',440,204,false],
				[game.configdata.LAYOUTTYPE.img,'lockclose','img/water/closepinklock.png',681,320,true],
				[game.configdata.LAYOUTTYPE.img,'lockopen','img/water/openpinklock.png',681,320,false],
				[game.configdata.LAYOUTTYPE.activeobj,'bluekey','bluekey','img/water/bluekey.png',31,266,40,280,[0,0,30,30],1],
				[game.configdata.LAYOUTTYPE.activeobj,'pinkkey','pinkkey','img/water/pinkkey.png',319,233,40,280,[0,0,30,30],1],
				[game.configdata.LAYOUTTYPE.activeobj,'yellowkey','yellowkey','img/water/yellowkey.png',164,225,40,280,[0,0,30,30],1],
				[game.configdata.LAYOUTTYPE.activeobj,'purplekey','purplekey','img/water/purplekey.png',400,251,40,280,[0,0,30,30],1],
				
				[game.configdata.LAYOUTTYPE.img,'openbox','img/water/openbox.png',1011,521,true],
				[game.configdata.LAYOUTTYPE.img,'redlamp','img/water/redlamp.png',1011,521,false],
				[game.configdata.LAYOUTTYPE.img,'greenlamp','img/water/greenlamp.png',1011,521,false],
				[game.configdata.LAYOUTTYPE.activeobj,'shoesinbox','shoesinbox','img/water/inboxshoes.png',1028,532,0,100,[0,0,30,30],2],
				[game.configdata.LAYOUTTYPE.activeobj,'instrumentinbox','instrumentinbox','img/water/inboxinstrument.png',1080,532,0,130,[0,0,30,30],2],
				[game.configdata.LAYOUTTYPE.activeobj,'closebox','closebox','img/water/closebox.png',1011,511,-30,90,[0,0,150,100],1],
				[game.configdata.LAYOUTTYPE.activeobj,'branch','branch','img/water/branch.png',158,302,62,202,[0,0,150,30],1],
				
				[game.configdata.LAYOUTTYPE.activeobj,'onecheckpoint','onecheckpoint','empty',229,378,62,202,[0,0,150,60],1],
				[game.configdata.LAYOUTTYPE.activeobj,'twocheckpoint','twocheckpoint','empty',469,378,62,202,[0,0,150,60],1],
				[game.configdata.LAYOUTTYPE.activeobj,'threecheckpoint','threecheckpoint','empty',720,378,62,202,[0,0,150,60],1],
				[game.configdata.LAYOUTTYPE.activeobj,'fourcheckpoint','fourcheckpoint','empty',968,378,22,202,[0,0,150,60],1],
				
				[game.configdata.LAYOUTTYPE.activeobj,'bluelock','bluelock','empty',433,315,62,202,[0,0,30,40],1],
				[game.configdata.LAYOUTTYPE.activeobj,'pinklock','pinklock','empty',684,315,22,202,[0,0,30,40],1],
				[game.configdata.LAYOUTTYPE.activeobj,'purplelock','purplelock','empty',929,315,62,202,[0,0,30,40],1],
				[game.configdata.LAYOUTTYPE.activeobj,'yellowlock','yellowlock','empty',1170,315,22,202,[0,0,30,40],1],
				
				[game.configdata.LAYOUTTYPE.activeobj,'pinkexit','pinkexit','empty',466,189,122,342,[0,0,180,180],2],
			];
			
			this.layoutUIElement(data);
			this.items['openbox'].visible = false;
			
			this.wateratlas = new Hilo.TextureAtlas({
                image:'img/water/stream.png',
                width: 211,
                height: 243,
                frames:[[0, 162, 209, 79], [0, 81, 209, 79], [0, 0, 209, 79]],
                sprites: {
                	idle:[0,1,2],
                }
            });
            
			this.createSprite(this.wateratlas,'idle',968,378,15);
			this.createSprite(this.wateratlas,'idle',720,370,11);
			this.createSprite(this.wateratlas,'idle',469,373,7);
			this.createSprite(this.wateratlas,'idle',229,378,11);

			var rippleatlas = new Hilo.TextureAtlas({
                image:'img/water/ripple.png',
                width: 907,
                height: 264,
                frames:[[0, 176, 905, 86], [0, 88, 905, 86], [0, 0, 905, 86]],
                sprites: {
                	idle:[0,1,2],
                }
            });
            
			this.createSprite(rippleatlas,'idle',417,436,20);
			
			this.atlas = new Hilo.TextureAtlas({
                image:'img/water/water1boyatlas.png',
                width: 1484,
                height: 1560,
                frames:[[636, 0, 210, 310], [1272, 0, 210, 310], [1060, 1248, 210, 310], [1060, 936, 210, 310], [1060, 624, 210, 310], [1060, 312, 210, 310], [1060, 0, 210, 310], [848, 1248, 210, 310], [848, 936, 210, 310], [848, 624, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [636, 1248, 210, 310], [636, 936, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [1272, 312, 210, 310], [424, 1248, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 1248, 210, 310], [212, 936, 210, 310], [212, 1248, 210, 310], [212, 936, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 1248, 210, 310], [0, 936, 210, 310], [0, 1248, 210, 310], [0, 1248, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	idle:[0,0],
                	breakoffbranch:[0,1,2,3,4],
                	prybox:{from:19,to:23},
                	wareshoes:[26,27,28,29,30,31,32,33,34],
                	onshoesdowntake:[7,8,9,10],
                	onshoesuptake:[10,35],
                	checkwater:[5,6,6,6],
                	upbranch:[36,36],
                	goexit:[11,12,13,14,15,16,17,18],
                }
            });
            
            this.playboy = this.createSprite(this.atlas,'idle',1023,211,10);
            this.playboy.visible = false;
            
		},
		createSprite:function(sourceatlas,defaultaction,x,y,interval){
			return new Hilo.Sprite({
				frames:sourceatlas.getSprite(defaultaction),
				interval:interval,
				x:x,
				y:y,
			}).addTo(this);
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.currentOnhandObj == null){
				//this.hero.switchState('nocan',10);
			}
		},
		showMask:function(bgnote){
			this.black = new Hilo.Bitmap({
				image:'img/typhoon/black.png',
				width:1202,
				height:686
			}).addTo(this);
			this.storynote = new Hilo.Bitmap({
				image:bgnote,
				x:240,
				y:240
			}).addTo(this);
			var scene = this;
			this.maskgraphic = new Hilo.Graphics({width:100, height:100, x:600, y:340});
            this.maskgraphic.beginFill("#0ff").drawCircle(0, 0, 2).endFill();
            this.maskgraphic.pivotX = 2;
            this.maskgraphic.pivotY = 2;
            this.storynote.on(Hilo.event.POINTER_START, function(e){
            	scene.startMask();
            });
        },
        startMask:function(){
            var scene = this;
            new Hilo.Tween.to(this,{
            	alpha:1
            },{
            	delay:20,
            	duration:10,
            	onComplete:function(){
            		scene.mask = scene.maskgraphic;
            		scene.storynote.removeFromParent();
            		scene.black.removeFromParent();
            	}
            }).link(
            	new Hilo.Tween.to(scene.maskgraphic,{
            		scaleX:350,
            		scaleY:350,
            	},{
            		duration:2000
            	})
            );
		},
		onUpdate:function(){
			
		},
	});
})(window.game);