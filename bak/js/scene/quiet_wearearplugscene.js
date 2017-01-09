(function(ns) {
	var QuietWearearplugscene = ns.QuietWearearplugscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.quiet_wearearplug,
		helpnote:'img/notes/quiet/quiet6help.png',
		
		initPosx:550,
		initPosy:573,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		passlayer:null,
		num1:null,
		num2:null,
		num3:null,
		p1:0,
		p2:0,
		p3:0,
		redlamp:null,
		greenlamp:null,
		workeratlas:null,
		worker:null,
		
		step1_pickjack:false,
		step2_putjack:false,
		step2_takecrowbar:false,
		step3_upjack:false,
		step4_pickstool:false,
		step5_putstool:false,
		step6_takerubber:false,
		step7_putrubber:false,
		
		constructor: function(properties) {
			QuietWearearplugscene.superclass.constructor.call(this, properties);
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
			
			
			this.showDialog('img/quiet/6/note2.png');
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
		showPass:function(ishide){
			if(ishide){
				this.passlayer.visible = true;
				this.hero.visible = false;
				this.items['ps1'].status = 1;
				this.items['ps2'].status = 1;
				this.items['ps3'].status = 1;
			}else{
				this.passlayer.visible = false;
				this.hero.visible = true;
				this.items['ps1'].status = 2;
				this.items['ps2'].status = 2;
				this.items['ps3'].status = 2;
			}
		},
		clickpass:function(index){
			if(index == 0){
				this.p1++;
				if(this.p1 > 9){
					this.p1 = 0;
				}
				var rect = [0,this.p1 * 71,47,71];
				this.num1.setImage('img/quiet/6/n1.png',rect);
			}
			if(index == 1){
				this.p2++;
				if(this.p2 > 9){
					this.p2 = 0;
				}
				var rect = [0,this.p2 * 71,47,71];
				this.num2.setImage('img/quiet/6/n1.png',rect);
			}
			if(index == 2){
				this.p3++;
				if(this.p3 > 9){
					this.p3 = 0;
				}
				var rect = [0,this.p3 * 71,47,71];
				this.num3.setImage('img/quiet/6/n1.png',rect);
			}
			
			if(this.p1 == 8 && this.p2 == 8 && this.p3 == 8){
				this.greenlamp.visible = true;
				this.showPass(false);
				this.items['closebox'].visible = false;
				this.items['closebox'].status  = 2;
				this.items['headset'].visible = true;
				this.items['openbox'].visible = true;
				this.items['openbox'].status  = 1;
			}
		},
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['passwordwall'])){
				var obj = this.items['passwordwall'];
				var scene = this;
				obj.status = 2;
				obj.visible = false;
				this.items['bigpwd'].status = 1;
				this.items['bigpwd'].visible = true;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bigpwd'])){
				var obj = this.items['bigpwd'];
				var scene = this;
				obj.status = 2;
				obj.visible = false;
				this.items['passwordwall'].status = 1;
				this.items['passwordwall'].visible = true;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stool'])){
				var obj = this.items['stool'];
				var scene = this;
				scene.step4_pickstool = true;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.visible = false;
					    obj.status = 2;
					    scene.handonProp('img/quiet/6/stool.png',500,475);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['openbox'])){
				var obj = this.items['openbox'];
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.status = 2;
					    scene.items['headset'].visible = false;
					    scene.handonProp('img/quiet/6/earplugonhand.png',500,475);
					    scene.items['workerobj'].state = 1;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['workerobj'])){
				var obj = this.items['workerobj'];
				var scene = this;
				if(obj.state == 0){
					this.showDialog('img/quiet/6/note.png');
				}else{
					scene.currentOnhandImg.removeFromParent();
					scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						
					},function(){
						scene.worker.currentFrame = 0;
						scene.worker._frames = scene.workeratlas.getSprite('turn');
						scene.worker.loop = false;
						obj.status = 2;
					});
				}
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
						scene.items['pwdhide'].status = 1;
						scene.items['pwdhide'].visible = true;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['closebox'])){
				var obj = this.items['closebox'];
				var scene = this;
				scene.showPass(true);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['pwdhide'])){
				var obj = this.items['pwdhide'];
				var scene = this;
				this.step7_putrubber = true;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'turn',800,function(){
						obj.visible = false;
					},function(){
					    obj.status = 2;
					    scene.items['closebox'].visible = true;
					    scene.items['closebox'].status = 1;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['ps1'])){
				var obj = this.items['ps1'];
				var scene = this;
				scene.clickpass(0);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['ps2'])){
				var obj = this.items['ps2'];
				var scene = this;
				scene.clickpass(1);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['ps3'])){
				var obj = this.items['ps3'];
				var scene = this;
				scene.clickpass(2);
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
[1, 'bg', 'quiet6bg.jpg', 0, 0, 't'],
[1, 'opendoor', 'opendoor.png', 154, 133, 'f'],
[2, 'workerobj', 'empty', 1,724, 273, 42,311,[0,0,140,300],'t'],
[2, 'passwordwall', 'empty', 1,226, 209, 60,44,[0,0,64,48],'t'],
[2, 'bigpwd', 'pwd.jpg', 1,226, 29, 60,44,[0,0,400,228],'f'],
[2, 'closedoor', 'closedoor.png', 1,46, 147, 40,270,[0,0,106,87],'t'],
[2, 'pwdhide', 'pwdhide.png', 2,60, 171, 35,257,[0,0,89,64],'f'],
[2, 'stool', 'stool.png', 1,882, 483, 26,110,[0,0,104,56],'t'],
[2, 'stoolobj', 'empty', 1,35, 414, 20,80,[0,0,104,50],'t'],
[2, 'closebox', 'closebox.png', 1,398, 525, 16,100,[0,0,90,90],'f'],
[2, 'openbox', 'openbox.png', 2,398, 474, 16,100,[0,0,90,90],'f'],
[1, 'headset', 'headset.png', 424, 521, 'f'],
[2, 'ps1', 'empty', 2,416, 352, 16,100,[0,0,40,70],'t'],
[2, 'ps2', 'empty', 2,538, 352, 16,100,[0,0,40,70],'t'],
[2, 'ps3', 'empty', 2,655, 352, 16,100,[0,0,40,70],'t'],
			];
		
			this.layoutUIElement('img/quiet/6/',data);


			this.atlas = new Hilo.TextureAtlas({
                image:'img/quiet/6/quiet6boyatlas.png',
                width:636,
                height:936,
                frames:[[424, 312, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [424, 624, 210, 310], [212, 0, 210, 310], [212, 624, 210, 310], [424, 312, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [212, 312, 210, 310]],
                sprites: {
                	turn:[7,8,9,10],
                	pick:[0,1,2,3,4,5,6]
                }
            });
            
            this.workeratlas = new Hilo.TextureAtlas({
                image:'img/quiet/6/workeratlas.png',
                width:808,
                height:652,
                frames:[[202, 326, 200, 324], [404, 326, 200, 324], [404, 0, 200, 324], [606, 0, 200, 324], [202, 0, 200, 324], [0, 326, 200, 324], [0, 0, 200, 324]],
                sprites: {
                	idle:[6],
                	turn:[0,0,0,0,0,1,2,3,4,5],
                	givefive:[5]
                }
            });
			this.worker = this.createSprite(this.workeratlas,'idle',724,273,6,this);
            
            this.playboy = this.createSprite(this.atlas,'pick',1023,211,6,this);
            this.playboy.visible = false;
            
           	this.passlayer = new Hilo.Container().addTo(this);
           	new Hilo.Bitmap({image:'img/quiet/6/largepwd.jpg'}).addTo(this.passlayer);
           	this.p1 = 3;
           	this.p2 = 2;
           	this.p3 = 1;
           	this.num1 = new Hilo.Bitmap(
           		{
           			image:'img/quiet/6/n1.png',
           			rect:[0,this.p1*71,47,71],
           			x:414,
           			y:352
           		}).addTo(this.passlayer);
           	this.num2 = new Hilo.Bitmap(
           		{
           			image:'img/quiet/6/n1.png',
           			rect:[0,this.p2*71,47,71],
           			x:538,
           			y:352
           		}).addTo(this.passlayer);
           	this.num3 = new Hilo.Bitmap(
           		{
           			image:'img/quiet/6/n1.png',
           			rect:[0,this.p3*71,47,71],
           			x:655,
           			y:352
           		}).addTo(this.passlayer);
           		
           	this.greenlamp = new Hilo.Bitmap({image:'img/quiet/6/a1.png',x:951,y:344}).addTo(this.passlayer);
           	this.redlamp = new Hilo.Bitmap({image:'img/quiet/6/a2.png',x:951,y:344}).addTo(this.passlayer);
           	this.passlayer.visible = false;
           	var scene = this;
           	this.passlayer.on(Hilo.event.POINTER_START,function(e){
           		scene.showPass(false);
           	});
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