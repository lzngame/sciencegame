(function(ns) {
	var EarthChangeplantscene = ns.EarthChangeplantscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earth_changeplant,
		helpnote:'img/notes/earth/earth4help.png',
		
		initPosx:360,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		fireeffect:null,
		
		step1_stone:false,
		step2_firelime:false,
		step3_dustpan:false,
		step4_limeon:false,
		
		constructor: function(properties) {
			EarthChangeplantscene.superclass.constructor.call(this, properties);
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
			
			this.shoes = new Hilo.Bitmap({
				image:'img/earth/2/shoesonfoot.png',
				visible:false,
			}).addTo(this);
			
			this.step1_stone = false;
			this.step2_firelime=false;
			this.step3_dustpan=false;
			this.step4_limeon=false;
			this.setHelp();
            this.showDialog('img/earth/4/note.png');
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stone'])){
				var obj = this.items['stone'];
				var stonecopy = this.items['stone1'];
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    scene.handonProp('img/earth/4/stoneonhand.png',330,520);
					    obj.visible = false;
						stonecopy.visible = false;
					    obj.status = 2;
					    scene.step1_stone = true;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['dustpan'])){
				if(!this.step2_firelime){
					this.sayNo();
					return true;
				}
				var obj = this.items['dustpan'];
				var scene = this;
				scene.step3_dustpan = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    scene.handonProp('img/earth/4/dustpan.png',306,500);
					    obj.visible = false;
					    obj.status = 2;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['lime'])){
				if(!this.step3_dustpan){
					this.sayNo();
					return true;
				}
				var obj = this.items['lime'];
				var scene = this;
				scene.step4_limeon = true;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    scene.handonProp('img/earth/4/limeonhand.png',306,500);
					    obj.visible = false;
					    obj.status = 2;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pollutedsoil'])){
				if(!this.step4_limeon){
					this.sayNo();
					return true;
				}
				var obj = this.items['pollutedsoil'];
				var scene = this;
				scene.currentOnhandImg.removeFromParent();
				obj.status = 2;
				scene.gotoDosomething(obj,1,0,0,'put',800,function(){
						
					},function(){
					    new Hilo.Tween.to(obj,{alpha:0},{duration:2000,delay:1000,onComplete:function(){
							scene.passoverReady('img/nextpasspoint.png',2000,game.configdata.SCENE_NAMES.earth_fertilizer);
					   }});
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['hay'])){
				if(!this.step1_stone){
					this.sayNo();
					return true;
				}
				var obj = this.items['hay'];
				var scene = this;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'fire',800,function(){
						
					},function(){
					   //obj.visible = false;
					   scene.fireeffect.visible = true;
					   obj.status = 2;
					   scene.items['stone'].visible = true;
					   scene.items['stone1'].visible = true;
					   new Hilo.Tween.to(scene.fireeffect,{alpha:0},{duration:1000,delay:1000,onComplete:function(){
					   	  obj.visible = false;
					   	  scene.items['lime'].visible = true;
					   	  scene.items['lime'].status  = 1;
					   	  scene.step2_firelime = true;
					   }});
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
[1, 'bg', 'earth4bg.jpg', 0, 0, 't'],
[2, 'pollutedsoil', 'pollutedsoil.png', 1,202, 383, 20,80,[70,30,400,100],'t'],
//[1, 'fire', 'fire.png', 811, 409, 't'],
[2, 'stone', 'stone.png', 1,953, 519, 20,40,[0,0,70,30],'t'],
[1, 'stone1', 'stone.png', 980, 520,'t'],
[2, 'hay', 'hay.png', 1,830, 441, 30,60,[0,0,150,60],'t'],
[2, 'lime', 'lime.png', 2,881, 461, 20,40,[0,0,100,40],'f'],
[2, 'dustpan', 'dustpan.png', 1,785, 515, 40,70,[0,0,120,67],'t'],
			];
		
			this.layoutUIElement('img/earth/4/',data);

			this.atlas = new Hilo.TextureAtlas({
                image:'img/earth/4/earth4boyatlas.png',
                width:1060,
                height:936,
                frames:[[0, 312, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [848, 0, 210, 310], [424, 0, 210, 310], [848, 0, 210, 310], [848, 0, 210, 310], [424, 0, 210, 310], [848, 0, 210, 310], [636, 0, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [848, 312, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310]],
                sprites: {
                	pick:[0,3,4,5,6,4,3,0],
                	fire:[0,3,4,5,6,7,8,9,10,1,2],
                	put:{from:11,to:18},
                }
            });
            var fireatlas = new Hilo.TextureAtlas({
                image:'img/earth/4/fireatlas.png',
                width: 247,
                height: 480,
                frames:[[0, 120, 245, 118], [0, 240, 245, 118], [0, 360, 245, 118], [0, 0, 245, 118]],
                sprites: {
                	idle:[0,1,2,3],
                }
            });
            this.fireeffect = this.createSprite(fireatlas,'idle',811,409,10,this);
            this.fireeffect.visible = false;
           
            this.playboy = this.createSprite(this.atlas,'pick',1023,211,6,this);
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