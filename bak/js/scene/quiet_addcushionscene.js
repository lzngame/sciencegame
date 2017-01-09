(function(ns) {
	var QuietAddcushionblockscene = ns.QuietAddcushionblockscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.quiet_addcushionblocking,
		helpnote:'img/notes/quiet/quiet4help.png',
		
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
		
		step1_pickjack:false,
		step2_putjack:false,
		step2_takecrowbar:false,
		step3_upjack:false,
		step4_pickstool:false,
		step5_putstool:false,
		step6_takerubber:false,
		step7_putrubber:false,
		
		constructor: function(properties) {
			QuietAddcushionblockscene.superclass.constructor.call(this, properties);
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
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['jack'])){
				var obj = this.items['jack'];
				var scene = this;
				scene.step1_pickjack = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/quiet/4/jackonhand.png',675,532);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stool'])){
				if(!this.step3_upjack){
					this.sayNo();
					return true;
				}
				var obj = this.items['stool'];
				var scene = this;
				scene.step4_pickstool = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/quiet/4/stool.png',675,532);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['rubberinbox'])){
				var obj = this.items['rubberinbox'];
				var scene = this;
				scene.step6_takerubber = true;
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.items['rubberobj'].status = 1;
					    scene.handonProp('img/quiet/4/rubberonhand.png',675,532);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stoolobj'])){
				if(!this.step4_pickstool){
					this.sayNo();
					return true;
				}
				var obj = this.items['stoolobj'];
				var scene = this;
				scene.step5_putstool = true;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
						var stool = scene.items['stool'];
						stool.visible = true;
						stool.x = obj.x;
						stool.y = obj.y;
						obj.status = 2;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['closedoor'])){
				if(!this.step5_putstool){
					this.sayNo();
					return true;
				}
				var obj = this.items['closedoor'];
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
						scene.items['opendoor'].visible = true;
						obj.visible = false;
						obj.status = 2;
						scene.items['rubberinbox'].status = 1;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['crowbar'])){
				if(!this.step2_putjack){
					this.sayNo();
					return true;
				}
				var obj = this.items['crowbar'];
				var scene = this;
				this.step2_takecrowbar = true;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/quiet/4/crowbaronhand.png',665,516);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['rubberobj'])){
				var obj = this.items['rubberobj'];
				var scene = this;
				this.step7_putrubber = true;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.status = 2;
					    scene.items['rubberonfloor'].visible = true;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['jackup'])){
				var obj = this.items['jackup'];
				var scene = this;
				if(!this.step7_putrubber){
					this.sayNo();
					return true;
				}
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.status = 2;
					    obj.visible = false;
					    scene.items['jackover'].visible = true;
					    scene.items['machine'].visible = true;
					    scene.items['machine2'].visible = false;
					    scene.passoverReady('img/nextpasspoint.png',1500,game.configdata.SCENE_NAMES.quiet_changebrokenglass);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['jackready'])){
				var obj = this.items['jackready'];
				var scene = this;
				if(obj.state == 0){
					obj.state = 1;
					scene.step2_putjack = true;
					scene.currentOnhandImg.removeFromParent();
					scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = true;
					});
				}else{
					if(!scene.step2_takecrowbar){
						scene.sayNo();
						return true;
					}
					scene.currentOnhandImg.removeFromParent();
					obj.status = 2;
					scene.step3_upjack = true;
					scene.gotoDosomething(obj,1,0,0,'jack',800,function(){
						
					},function(){
					    obj.visible = false;
					    scene.items['machine2'].visible = true;
					    scene.items['machine'].visible = false;
					    scene.items['jackup'].visible = true;
					    scene.items['jackup'].status = 1;
					});
				}
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
[1, 'bg', 'quiet4bg.jpg', 0, 0, 't'],
[2, 'rubberinbox', 'rubberinbox.png', 2,49, 182,30,240,[0,0,106,53], 't'],
[1, 'rubberonfloor', 'rubberonfloor.png', 557, 492, 'f'],
[1, 'opendoor', 'opendoor.png', 149, 135, 'f'],
[2, 'closedoor', 'closedoor.png', 1,45, 151, 42,271,[0,0,100,80],'t'],
[2, 'stoolobj', 'empty', 1,35, 417, 60,44,[0,0,130,30],'t'],
[2, 'rubberobj', 'empty', 2,557, 492, 40,104,[0,0,130,50],'t'],
[2, 'crowbar', 'crowbar.png', 1,203, 491, 20,40,[0,0,100,20],'t'],
[2, 'jack', 'jacknocrowbar.png', 1,300, 483, 26,110,[0,0,50,50],'t'],
[2, 'jackready', 'jacknocrowbar.png', 1,499, 467, -5,50,[0,0,50,50],'f'],
[2, 'jackup', 'jackup.png', 2,471, 458, 16,100,[0,0,90,90],'f'],
[1, 'machine', 'machine.png', 224, 42, 't'],
[1, 'machine2', 'machine2.png', 227, 27, 'f'],
[2, 'stool', 'stool.png', 1,874, 483, 26,80,[0,0,100,50],'t'],
[1, 'jackover', 'jackoncrowbar.png', 471, 488,'f'],
			];
		
			this.layoutUIElement('img/quiet/4/',data);

			this.atlas = new Hilo.TextureAtlas({
                image:'img/quiet/4/quiet4boyatlas.png',
                width:1060,
                height:936,
                frames:[[424, 312, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 624, 210, 310], [848, 624, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [424, 0, 210, 310], [424, 624, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	jack:[0,1,2,3,4,5,6,7,8],
                	turn:[16,17,18,19],
                	pick:[9,10,11,12,15]
                }
            });

            
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