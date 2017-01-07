(function(ns) {
	var Firegalleryscene = ns.Firegalleryscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.fire_gallery,
		initPosx:550,
		initPosy:573,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		iswarn:false,
		ischangelamp:false,
		warntime:0,
		
		step0_firelamp:false,
		step1_pickextinguisher:false,
		step2_turnpic:false,
		step3_pickstone:false,
		step4_killfire:false,
		
		constructor: function(properties) {
			Firegalleryscene.superclass.constructor.call(this, properties);
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
			
			this.warntime = 0;
			this.iswarn = false;
			
			this.step1_extinguisher = false;
			this.step2_pickspanner = false;
			this.step3_closegas = false;
			this.step4_pickrag = false;
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
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['extinguisher'])){
				if(!this.step0_firelamp){
					this.sayNo();
					return true;
				}
				var obj = this.items['extinguisher'];
				var scene = this;
				this.step1_pickextinguisher = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/fire/1/extinguisher.png',521,475);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stone'])){
				var obj = this.items['stone'];
				var scene = this;
				if(!this.step2_turnpic){
					this.sayNo();
					return true;
				}
				this.step3_pickstone = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/fire/1/stoneonhand.png',501,455);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pic'])){
				var obj = this.items['pic'];
				var scene = this;
				this.step2_turnpic = true;
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.items['warnbox'].status = 1;
					    scene.items['pic1'].visible = true;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['fireobj'])){
				if(!this.step1_pickextinguisher){
					this.sayNo();
					return true;
				}
				var obj = this.items['fireobj'];
				var scene = this;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'extinguisher',2300,function(){
						scene.extinguishereffect.visible = true;
						
						new Hilo.Tween.to(scene.fireeffect,{alpha:0},{duration:2000,onComplete:function(){
							scene.extinguishereffect.removeFromParent();
							
						}});
					},function(){
					    obj.status = 2;
						scene.items['extinguisher'].visible = true;
						scene.items['extinguisher'].x = 600;
						scene.items['extinguisher'].y = 470;
						scene.hero.visible = false;
						scene.crowout();
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['warnbox'])){
				var obj = this.items['warnbox'];
				if(!this.step3_pickstone){
					this.sayNo();
					return;
				}
				var scene = this;
				this.step0_firelamp = true;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.status = 2;
					    scene.iswarn = true;
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
[1, 'bg', 'fire1bg.jpg', 0, 0, 't'],
[1, 'pic1', 'pic1.png', 497, 169, 'f'],
[2, 'warnbox', 'warnbox.png', 2,461,276, 60,210,[0,0,50,50],'t'],
[1, 'alarm', 'alarm.png', 43, 183, 't'],
[1, 'alarm1', 'alarm1.png', 43, 183, 't'],
[2, 'stone', 'stone.png', 1,197, 463, 20,50,[0,0,50,50],'t'],
[2, 'pic', 'pic2.png', 1,427, 169, 74,300,[0,0,179,180],'t'],
[2, 'extinguisher', 'extinguisher.png', 1,680, 363, 20,100,[0,0,50,90],'t'],
[2, 'fireobj', 'empty', 1,700, 483, -80,120,[0,0,140,120],'t'],
			];
		
			this.layoutUIElement('img/fire/1/',data);

			this.atlas = new Hilo.TextureAtlas({
                image:'img/earthquake/2/earthquake2boyatlas.png',
                width:848,
                height:1248,
                frames:[[636, 0, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [636, 936, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [636, 936, 210, 310], [424, 312, 210, 310], [212, 0, 210, 310], [212, 0, 210, 310], [0, 936, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [212, 936, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310]],
                sprites: {
                	extinguisher:[16],
                	door:[0,1,2],
                	turn:[17,18,19,20],
                	pick:{from:3,to:9},
                	spanner:{from:10,to:15}
                }
            });
            
            this.workeratlas = new Hilo.TextureAtlas({
                image:'img/fire/1/effectatlas.png',
                width:988,
                height:1020,
                frames:[[494, 509, 266, 161], [494, 672, 266, 161], [494, 183, 266, 161], [494, 346, 266, 161], [494, 835, 149, 183], [645, 835, 149, 183], [762, 553, 149, 183], [762, 368, 149, 183], [762, 183, 149, 183], [336, 915, 110, 78], [224, 915, 110, 78], [112, 915, 110, 78], [0, 915, 110, 78], [0, 732, 492, 181], [0, 183, 492, 181], [0, 366, 492, 181], [0, 549, 492, 181], [494, 0, 492, 181], [0, 0, 492, 181]],
                sprites: {
                	smoke:[13,14,15,16,17,18],
                	fireeffect:[4,5,6,7,8],
                	extinguisher:[9,10,11,12],
                	crow:[0,1,2,3],
                }
            });
			this.smokeeffect = this.createSprite(this.workeratlas,'smoke',704,303,6,this);
			this.fireeffect =  this.createSprite(this.workeratlas,'fireeffect',710,462,6,this);
			this.extinguishereffect =  this.createSprite(this.workeratlas,'extinguisher',690,460,6,this);
            this.extinguishereffect.visible = false;
			this.crower =  this.createSprite(this.workeratlas,'crow',516,456,10,this);
            this.crower.visible = false;
            
            this.playboy = this.createSprite(this.atlas,'pick',1023,211,6,this);
            this.playboy.visible = false;
		},
		crowout:function(){
			var scene = this;
			scene.crower.visible = true;
			new Hilo.Tween.to(scene.crower,{x:1300,alpha:0},{duration:4000,onComplete:function(){
					
				}});
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
			if(this.iswarn){
				this.warntime++;
				if(this.warntime > 10){
					this.ischangelamp = !this.ischangelamp;
					this.warntime = 0;
				}
				this.items['alarm1'].visible = this.ischangelamp;
			}
		},
	});
})(window.game);