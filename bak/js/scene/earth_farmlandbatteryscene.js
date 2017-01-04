(function(ns) {
	var EarthFarmlandbatteryscene = ns.EarthFarmlandbatteryscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.earth_farmlandbattery,
		
		initPosx:360,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		shoes:null,
		digbatterynum:0,
		pickbatterynum:0,
		putbatterynum:0,
		
		step1_branch:false,
		step2_shoes:false,
		step3_branch:false,
		isonbattery:false,
		
		constructor: function(properties) {
			EarthFarmlandbatteryscene.superclass.constructor.call(this, properties);
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
			
			
			
			this.step1_branch = false;
			this.step2_shoes=false;
			this.step3_branch=false;
			this.isonbattery=false;
			this.digbatterynum=0;
			this.pickbatterynum=0;
			this.putbatterynum=0;
		
			
            this.showDialog('img/earth/2/note1.png');
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['branch'])){
				var obj = this.items['branch'];
				var scene = this;
				if(obj.state == 0){
					obj.state = 1;
					scene.step1_branch = true;
					scene.gotoDosomething(obj,1,0,0,'branch',800,function(){
					
					},function(){
					    obj.x = 984;
					    obj.y = 450;
						obj.targety = 50;
					});
				}else{
					if(!scene.step2_shoes){
						scene.sayNo();
						return true;
					}
					scene.step3_branch = true;
					scene.showShoes(false);
					scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
					
					},function(){
					   obj.status = 2;
					   obj.visible = false;
					   scene.handonProp('img/earth/2/branchonhand.png',314,483);
					   scene.showShoes(true);
					});
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['rainshoes'])){
				var obj = this.items['rainshoes'];
				var scene = this;
				if(!this.step1_branch){
					this.sayNo();
					return true;
				}
				this.step2_shoes = true;
				scene.gotoDosomething(obj,1,0,0,'shoes',800,function(){
					
					},function(){
					   scene.showShoes(true);
					   obj.visible = false;
					   obj.status = 2;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['barrel'])){
				var obj = this.items['barrel'];
				var scene = this;
				if(!this.isonbattery){
					this.sayNo();
					return true;
				}
				scene.putbatterynum++;
				if(scene.currentOnhandImg){
					scene.currentOnhandImg.removeFromParent();
				}
				scene.showShoes(false);
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
					
					},function(){
					   scene.showShoes(true);
					   scene.isonbattery = false;
					   scene.items['battery_barrel0'+scene.putbatterynum.toString()].visible = true;
					   if(scene.putbatterynum >= 4){
							scene.passoverReady('img/sky/4/happy.png',2000,game.configdata.SCENE_NAMES.earth_handlebattery);
					   }
					});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['battery1'])){
				this.digBattery('battery1');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['battery2'])){
				this.digBattery('battery2');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['battery3'])){
				this.digBattery('battery3');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['battery4'])){
				this.digBattery('battery4');
				return true;
			}
			return false;
		},
		digBattery:function(batteryname){
			var obj = this.items[batteryname];
			var scene = this;
			if(!this.step3_branch){
				this.sayNo();
				return true;
			}
			if(obj.state == 1 && this.digbatterynum < 4){
				this.sayNo();
				return true;
			}
			
			if(obj.state == 0){
				scene.currentOnhandImg.visible = false;
				this.showShoes(false);
				this.digbatterynum++;
				scene.gotoDosomething(obj,1,0,0,'dig',800,function(){
					
					},function(){
					   scene.showShoes(true);
					   obj.visible = true;
					   obj.state  = 1;
					   scene.currentOnhandImg.visible = true;
					   if(scene.digbatterynum >= 4){
					   		scene.currentOnhandImg.removeFromParent();
					   		scene.items['branch'].visible = true;
					   		scene.items['branch'].x = scene.hero.posx + 100;
					   		scene.items['branch'].y = scene.hero.posy ;
					   }
					});
			}else{
				if(this.isonbattery){
					this.sayNo();
					return true;
				}
				scene.currentOnhandImg.visible = false;
				this.showShoes(false);
				this.pickbatterynum++;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
					
					},function(){
					   scene.showShoes(true);
					   obj.visible = false;
					   obj.status = 2;
					   scene.handonProp('img/earth/2/batteryonhand.png',345,528);
					   scene.isonbattery = true;
					});
			}
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
[1, 'bg', 'earth2bg.jpg', 0, 0, 't'],
[2, 'barrel', 'barrel.png', 1,725, 400, 20,80,[0,0,69,67],'t'],
[1, 'battery_barrel01', 'battery_barrel01.png', 747, 400, 'f'],
[1, 'battery_barrel02', 'battery_barrel01.png', 740, 400, 'f'],
[1, 'battery_barrel03', 'battery_barrel03.png', 758, 399, 'f'],
[1, 'battery_barrel04', 'battery_barrel03.png', 756, 398, 'f'],
[2, 'battery1', 'battery1.png', 1,184, 336, -30,40,[0,0,30,30],'f'],
[2, 'battery2', 'battery1.png', 1,677, 334, -30,40,[0,0,30,30],'f'],
[2, 'battery3', 'battery1.png', 1,692, 441, -30,40,[0,0,30,30],'f'],
[2, 'battery4', 'battery1.png', 1,488, 494, -30,40,[0,0,30,30],'f'],

[2, 'branch', 'branch.png', 1,924, 307, 40,180,[0,0,120,67],'t'],
[2, 'rainshoes', 'rainshoes.png', 1,866, 393, 10,40,[0,0,60,30],'t'],
			];
		
			this.layoutUIElement('img/earth/2/',data);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/earth/2/earth2boyatlas.png',
                width:1272,
                height:1248,
                frames:[[636, 312, 210, 310], [636, 0, 210, 310], [424, 936, 210, 310], [1060, 312, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 936, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 936, 210, 310], [212, 0, 210, 310], [0, 936, 210, 310], [1060, 0, 210, 310], [0, 624, 210, 310], [424, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [424, 624, 210, 310], [1060, 0, 210, 310], [848, 936, 210, 310], [848, 624, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [636, 936, 210, 310], [848, 0, 210, 310], [848, 0, 210, 310], [636, 936, 210, 310], [636, 624, 210, 310]],
                sprites: {
                	branch:[0,1,2,3,4],
                	pick:{from:13,to:19},
                	dig:{from:5,to:12},
                	shoes:[21,22,23,24,25,26,27,28,20]
                }
            });
           
            this.playboy = this.createSprite(this.atlas,'dig',1023,211,6,this);
            this.playboy.visible = false;
		},
		showShoes:function(ishide){
			var x= this.hero.posx-44;
			var y = this.hero.posy-43;
			this.shoes.x = x;
			this.shoes.y = y;
			this.shoes.visible = ishide;
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