(function(ns) {
	var SkyRepairairclearnscene = ns.SkyRepairairclearnscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.sky_repairairclearn,
		helpnote:'img/notes/sky/sky2help.png',
		
		initPosx:650,
		initPosy:600,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		ispower:false,
		isopen:false,
		
		constructor: function(properties) {
			SkyRepairairclearnscene.superclass.constructor.call(this, properties);
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
			this.setHelp();
			this.ispower = false;
			this.isopen = false;
			this.iskeyonhand = false;
			this.isopenbox = false;
			this.isscissor = false;
			
			/*game.drdialog.showTxt('img/sky/2/note.png');
			this.ignoreTouch = true;
			var scene = this;
            game.drdialog.on(Hilo.event.POINTER_START,function(e){
            	game.drdialog.hide();
            	scene.ignoreTouch = false;
            });*/
            this.showDialog('img/sky/2/note.png');
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['irongateclose'])){
				var obj = this.items['irongateclose'];
				var scene = this;
				this.isopen = true;
				scene.gotoDosomething(obj,1,0,0,'open',800,function(){
					
				},function(){
					scene.items['irongateclose'].visible= false;
					scene.items['irongateclose'].status = 2;
					scene.items['irongateopen'].status = 1;
					scene.items['irongateopen'].visible = true;
					scene.items['strainerobj'].status = 1;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['irongateopen'])){
				var obj = this.items['irongateopen'];
				var scene = this;
				if(this.items['strainerobj'].state != 3){
					this.sayNo();
					return true;
				}
				this.isopen = false;
				scene.gotoDosomething(obj,1,0,0,'open',800,function(){
					
				},function(){
					scene.items['irongateclose'].visible= true;
					scene.items['irongateopen'].status = 2;
					scene.items['irongateopen'].visible = false;
					scene.items['strainerobj'].status = 2;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['button'])){
				if(!this.ispower){
					this.sayNo();
					return true;
				}
				var obj = this.items['button'];
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'open',800,function(){
					
				},function(){
					scene.items['buttongreen'].visible= true;
					scene.items['button'].status = 2;
					scene.items['button'].visible = false;
					scene.passoverReady('img/sky/4/happy.png',2000,game.configdata.SCENE_NAMES.sky_closecoalgenerator);
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['sofacushion'])){
				var obj = this.items['sofacushion'];
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'move',800,function(){
					
				},function(){
					scene.items['sofacushion'].x -= 100;
					scene.items['sofacushion'].status = 2;
					scene.items['strainer1'].status = 1;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['strainer1'])){
				var obj = this.items['strainer1'];
				var scene = this;
				var tmp = this.items['strainerobj'];
				if(tmp.state != 1){
					this.sayNo();
					return true;
				}
				scene.gotoDosomething(obj,1,0,0,'move',800,function(){
					
				},function(){
					scene.items['strainer1'].status = 2;
					scene.items['strainer1'].visible = false;
					scene.handonProp('img/sky/2/straineronhand_2.png',615,505);
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['strainer2'])){
				if(this.items['strainerobj'].state != 2){
					this.sayNo();
					return true;
				}
				var obj = this.items['strainer2'];
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'move',800,function(){
					
				},function(){
					scene.items['strainer2'].status = 2;
					scene.items['strainer2'].visible = false;
					scene.handonProp('img/sky/2/straineronhand_3.png',615,505);
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['electricwirefall'])){
				var obj = this.items['electricwirefall'];
				var scene = this;
				if(this.items['strainerobj'].state != 3 || this.isopen){
					this.sayNo();
					return true;
				}
				scene.gotoDosomething(obj,1,0,0,'move',800,function(){
					
				},function(){
					scene.items['electricwirefall'].status = 2;
					scene.items['electricwirefall'].visible = false;
					scene.items['electricwirewall'].visible = true;
					scene.ispower = true;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['closet'])){
				var obj = this.items['closet'];
				var scene = this;
				if(!this.isopen){
					this.sayNo();
					return true;
				}
				scene.gotoDosomething(obj,1,0,0,'move',800,function(){
					
				},function(){
					scene.hero.visible = false;
					scene.items['bigcloset'].visible = true;
					scene.items['closet'].status = 2;
					scene.items['strainerincloset'].visible = true;
					scene.items['strainerincloset'].status  = 1;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['strainerobj'])){
				var obj = this.items['strainerobj'];
				var scene = this;
				scene.putinStrainer();
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['strainerincloset'])){
				var obj = this.items['strainerincloset'];
				var scene = this;
				scene.items['strainerincloset'].status = 2;
				scene.items['strainerincloset'].visible = false;
				scene.items['bigcloset'].visible = false;
				scene.hero.visible = true;
				scene.handonProp('img/sky/2/straineronhand_1.png',615,475);
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
						scene.passoverReady('img/sky/4/happy.png',2000,game.configdata.SCENE_NAMES.sky_closecoalgenerator);
            			
						//game.switchScene(game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.ecosystem);
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
[1, 'bg', 'sky2bg.jpg', 0, 0, 't'],
[1, 'instrainer1', 'instrainer1.png', 68, 414, 'f'],
[1, 'instrainer2', 'instrainer2.png', 67, 407, 'f'],
[1, 'instrainer3', 'instrainer3.png', 66, 406, 'f'],
[2, 'strainer2', 'strainer2.png', 1, 1130, 295, 0, 270, [0, 0, 30, 100], 't'],
[2, 'strainer1', 'strainer1.png', 2, 362, 390, 70, 160, [0, 0, 130, 40], 't'],
[2, 'sofacushion', 'sofacushion.png', 1, 342, 382, 70, 150, [0, 0, 120, 70], 't'],
[2, 'irongateopen', 'irongate2.png', 1, 132, 377, 140, 170, [0, 0, 70, 100], 'f'],
[2, 'irongateclose', 'irongate.png', 1, 59, 395, 110, 160, [0, 0, 70, 100], 't'],
[2, 'electricwirefall', 'electricwire2.png', 1,132, 383,30, 120, [50, 0, 50, 30], 't'],
[1, 'electricwirewall', 'electricwire1.png',  138, 318,  'f'],
[1, 'buttongreen', 'buttongreen.png',  75, 393,  'f'],
[2, 'button', 'button.png', 1, 75, 393, 80, 160, [0, 0, 20, 20], 't'],
[2, 'closet', 'empty', 1, 563, 336, 90, 190, [0, 0, 150, 40], 't'],
[2, 'strainerobj', 'empty', 2, 59, 395, 110, 160, [0, 30, 70, 110], 't'],
[1, 'bigcloset', 'bigcloset.jpg', 0, 0, 'f'],
[2, 'strainerincloset', 'strainerincloset.png', 2,80, 90,930, 200, [150, 150, 650, 250], 'f'],
[1, 'bigclearn', 'bigclearn.jpg', 0, 0, 'f'],
[1, 'big1', 'big1.png', 416, 192, 'f'],
[1, 'big2', 'big2.png', 416, 192, 'f'],
[1, 'big3', 'big3.png', 416, 192, 'f'],
			];
		
			this.layoutUIElement('img/sky/2/',data);
			//game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/sky/2/sky2boyatlas.png',
                width:848,
                height:936,
                frames:[[212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 312, 210, 310], [0, 312, 210, 310], [0, 624, 210, 310], [212, 0, 210, 310], [424, 312, 210, 310], [424, 312, 210, 310], [212, 312, 210, 310], [212, 312, 210, 310], [424, 624, 210, 310], [424, 624, 210, 310], [424, 624, 210, 310], [212, 312, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [424, 0, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [636, 0, 210, 310], [212, 312, 210, 310], [424, 312, 210, 310]],
                sprites: {
                	move:{from:0,to:7},
                	open:{from:8,to:16},
                	strainer:{from:17,to:23},
                }
            });
           
            this.playboy = this.createSprite(this.atlas,'move',1023,211,6,this);
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