(function(ns) {
	var WaterFilterpoolscene = ns.WaterFilterpoolscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.water_filterpool,
		
		initPosx:950,
		initPosy:500,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		isonhandfilter:false,
		isfinishfilter:false,
		iskeyonhand:false,
		isopenbox:false,
		isscissor:false,
		
		constructor: function(properties) {
			WaterFilterpoolscene.superclass.constructor.call(this, properties);
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
			
			this.isonhandfilter = false;
			this.isfinishfilter = false;
			this.iskeyonhand = false;
			this.isopenbox = false;
			this.isscissor = false;
			
			game.drdialog.showTxt('img/water/5/note.png');
            game.drdialog.on(Hilo.event.POINTER_START,function(e){
            	game.drdialog.hide();
            });
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['filteronfloor1'])){
				var obj = this.items['filteronfloor1'];
				if(this.isonhandfilter){
					this.sayNo();
					return true;
				}
				this.isonhandfilter = true;
				this.pickSomething(obj,'backpick',-60,-150,'img/water/5/filteronfloor2.png');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['filteronfloor2'])){
				if(this.isonhandfilter){
					this.sayNo();
					return true;
				}
				var obj = this.items['filteronfloor2'];
				this.isonhandfilter = true;
				this.pickSomething(obj,'backpick',-60,-150,'img/water/5/filteronfloor2.png');
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['filteronwaterobj1'])){
				this.putFilterIntoWater('filteronwaterobj1');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['filteronwaterobj2'])){
				this.putFilterIntoWater('filteronwaterobj2');
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['yellowkey'])){
				var scene = this;
				var obj = this.items['yellowkey'];
				if(!this.isfinishfilter){
					this.sayNo();
					return true;
				}
				scene.gotoDosomething(obj,1,0,0,'takekey',500,function(){
					obj.status = 2;
					obj.visible = false;
				},function(){
					scene.iskeyonhand = true;
					scene.handonProp('img/water/5/yellowkey.png',scene.hero.posx+30,scene.hero.posy-92);
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['brownkey'])){
				this.sayNo();
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['closelock'])){
				var obj = this.items['closelock'];
				var scene = this;
				if(!this.iskeyonhand){
					this.sayNo();
					return true;
				}
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'takekey',800,function(){

				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.items['closedoorleft'].visible = false;
					scene.items['closedoorright'].visible = false;
					scene.items['opendoorleft'].visible = true;
					scene.items['opendoorright'].visible = true;
					scene.items['bolt'].visible = false;
					scene.items['bag'].status = 1;
					scene.isopenbox = true;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['scissor'])){
				if(!this.isopenbox){
					this.sayNo();
					return true;
				}
				var obj = this.items['scissor'];
				var scene = this;
				this.isscissor = true;
				scene.pickSomething(obj,'takekey',20,-99,'img/water/5/scissor.png');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bag'])){
				if(!this.isscissor){
					this.sayNo();
					return true;
				}
				var obj = this.items['bag'];
				var scene = this;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'takekey',800,function(){
					
				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.items['openbag'].visible = true;
					scene.items['poolobj'].status = 1;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['poolobj'])){
				var obj = this.items['poolobj'];
				var scene = this;
				scene.items['openbag'].visible = false;
				scene.gotoDosomething(obj,1,0,0,'frontput',800,function(){
					
				},function(){
					obj.status = 2;
					scene.items['openbag'].visible = true;
				});
				return true;
			}
			
			return false;
		},
		putFilterIntoWater:function(filtername){
			if(!this.isonhandfilter){
					this.sayNo();
					return true;
				}
			this.isonhandfilter = false;
			var obj = this.items[filtername];
			var scene = this;
			scene.currentOnhandImg.removeFromParent();
			var waterimg = 'filteronwater1';
			if(filtername == 'filteronwaterobj2')
					waterimg = 'filteronwater2';
			scene.gotoDosomething(obj,1,0,0,'putdown',500,function(){
					obj.status = 2;
					scene.items[waterimg].visible = true;
				},function(){
					if(scene.items['filteronwaterobj1'].status == 2 && scene.items['filteronwaterobj2'].status == 2){
						scene.isfinishfilter = true;
					}
				});
		},
		pickSomething:function(obj,action,offsetx,offsety,onhandimg){
			var scene = this;
			
			scene.gotoDosomething(obj,1,0,0,action,800,function(){

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
		layoutUIElement:function(arraydata){
			var baseurl = 'img/water/5/';
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
[1, 'bg', 'water5bg.jpg', 0, 0, 't'],
[2, 'filteronfloor1', 'filteronfloor1.png', 1, 104, 444, 50, 40, [0, 0, 180, 50], 't'],
[2, 'filteronfloor2', 'filteronfloor2.png', 1, 1025, 337, 50, 90, [0, 0, 160, 90], 't'],
[2, 'yellowkey', 'yellowkey.png', 1, 997, 261, 10, 200, [0, 0, 40, 40], 't'],
[2, 'brownkey', 'brownkey.png', 1, 1077, 260, 0, 0, [0, 0, 40, 40], 't'],
[2, 'scissor', 'scissor.png', 1, 336, 258, 30, 150, [0, 0, 60, 80], 't'],
[1, 'boxbodybg', 'boxbodybg.png', 485, 119, 't'],
[1, 'openbag', 'openbag.png', 830, 395, 'f'],
[1, 'filteronwater2', 'filteronwater2.png', 897, 509, 'f'],
[2, 'bag', 'bag.png', 2, 603, 302, 10, 160, [0, 0, 90, 120], 't'],
[1, 'filteronwater1', 'filteronwater1.png', 408, 501, 'f'],
[1, 'closedoorright', 'closedoorright.png', 671, 273, 't'],
[1, 'closedoorleft', 'closedoorleft.png', 570, 272, 't'],
[1, 'opendoorleft', 'opendoorleft.png', 519, 249, 'f'],
[1, 'opendoorright', 'opendoorright.png', 759, 253, 'f'],
[1, 'bolt', 'bolt.png', 637, 321, 't'],
[2, 'closelock', 'closelock.png', 1, 662, 342, 20, 150, [0, 0, 30, 30], 't'],
[1, 'openlock', 'openlock.png', 662, 342, 'f'],
[2, 'filteronwaterobj1', 'empty', 1, 408, 501, 0, 0, [0, 0, 40, 130], 't'],
[2, 'filteronwaterobj2', 'empty', 1, 897, 509, 0, 0, [0, 0, 40, 130], 't'],
[2, 'poolobj', 'empty', 2, 0, 546, 950, -30, [0, 0, 1200, 60], 't']
			];
		
			this.layoutUIElement(data);
			//game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/water/5/water5boyatlas.png',
                width: 1060,
                height: 936,
                frames:[[424, 312, 210, 310], [848, 312, 210, 310], [212, 936, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 936, 210, 310], [848, 0, 210, 310], [0, 624, 210, 310], [424, 0, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [424, 0, 210, 310], [848, 0, 210, 310], [636, 936, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310]],
                sprites: {
                	putdown:[0,1,2],
                	takekey:[3,4,5,6],
                	backpick:[7,8,9,10,11,12,13],
                	frontput:[14,15,16,17,18,19]
                }
            });
           
            
            this.playboy = this.createSprite(this.atlas,'putdown',1023,211,10,this);
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