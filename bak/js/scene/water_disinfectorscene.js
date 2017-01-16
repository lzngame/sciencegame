(function(ns) {
	var WaterDisinfectorscene = ns.WaterDisinfectorscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.water_disinfector,
		
		initPosx:650,
		initPosy:500,
		helpnote:'img/notes/water/water6help.png',
		
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		stream:null,
		
		isblueonhand:false,
		isbrownonhand:false,
		
		iskeyonhand:false,
		isopenbox:false,
		isscissor:false,
		
		constructor: function(properties) {
			WaterDisinfectorscene.superclass.constructor.call(this, properties);
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
			this.setHelp();
			
			game.drdialog.showTxt('img/water/6/note.png');
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['brownbottle'])){
				var obj = this.items['brownbottle'];
				if(this.isblueonhand){
					this.sayNo();
					return true;
				}
				this.isbrownonhand = true;
				this.pickSomething(obj,'uptake',-40,-110,'img/water/6/brownbottleonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bluebottle'])){
				if(this.isbrownonhand){
					this.sayNo();
					return true;
				}
				var obj = this.items['bluebottle'];
				this.isblueonhand = true;
				this.pickSomething(obj,'downtake',-40,-110,'img/water/6/bluebottleonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bluewatersurface'])){
				var obj = this.items['bluewatersurface'];
				var scene = this;
				if(!this.isblueonhand && !this.isbrownonhand){
					this.sayNo();
					return true;
				}
				scene.currentOnhandImg.removeFromParent();
				var action = 'putblue';
				if(this.isbrownonhand){
					action = 'putbrown';
				}
				scene.gotoDosomething(obj,1,0,0,action,800,function(){

				},function(){
					if(scene.isblueonhand){
						scene.items['blackwatersurface'].visible = true;
						scene.items['bluewatersurface'].visible = false;
						scene.isblueonhand = false;
						scene.items['bluebottle'].visible = true;
						scene.items['bluebottle'].x = 741;
						scene.items['bluebottle'].y = 455;
					}else{
						scene.items['bluewatersurface'].visible = true;
						scene.items['blackwatersurface'].visible = false;
						scene.items['bluewatersurface'].alpha = 0.6;
						scene.items['bluebottle'].status = 2;
						scene.isbrownonhand = false;
						scene.items['brownbottle'].visible = true;
						scene.items['brownbottle'].x = 791;
						scene.items['brownbottle'].y = 455;
						scene.items['watervalue'].state = 1;
						obj.status = 2;
					}
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['watervalue'])){
				var obj = this.items['watervalue'];
				if(obj.state == 0){
					this.sayNo();
					return true;
				}
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){
					
				},function(){
					obj.status = 2;
					scene.stream.visible = true;
					scene.finishpass();
				});
				return true;
			}
			return false;
		},
		finishpass:function(){
			var scene = this;
			scene.passoverReady('img/nextpasspoint.png',1500,game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.ecosystem);
			
			
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
[1, 'bg', 'water6bg.jpg', 0, 0, 't'],
[2, 'watervalue', 'empty', 1, 820, 334, 30, 130, [0, 0, 100, 90], 't'],
[2, 'bluewatersurface', 'bluewatersurface.png', 1, 130, 327, 400, 150, [0, 0, 600, 130], 't'],
[1, 'blackwatersurface', 'blackwatersurface.png', 129, 327, 'f'],
[2, 'brownbottle', 'brownbottle.png', 1, 69, 407, 70, 170, [0, 0, 30, 60], 't'],
[2, 'bluebottle', 'bluebottle.png', 1, 46, 564, 70, 50, [0, 0, 30, 60], 't']
			];
		
			this.layoutUIElement('img/water/6/',data);
			//game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/water/6/water6boyatlas.png',
                width: 848,
                height: 1248,
                frames:[[212, 936, 210, 310], [636, 0, 210, 310], [636, 624, 210, 310], [424, 936, 210, 310], [636, 312, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [636, 936, 210, 310], [212, 624, 210, 310], [636, 936, 210, 310], [636, 936, 210, 310], [424, 0, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	putbrown:[0,2,4],
                	putblue:[1,3,5],
                	backpick:[6,7,8,9,10,11,12,13],
                	downtake:[14,15],
                	uptake:[17,19]
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
            this.stream = this.createSprite(streamatlas,'idle',1006,409,10,this);
            this.stream.visible = false;
            this.playboy = this.createSprite(this.atlas,'putbrown',1023,211,10,this);
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