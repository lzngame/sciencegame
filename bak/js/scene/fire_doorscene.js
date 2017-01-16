(function(ns) {
	var Firedoorscene = ns.Firedoorscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.fire_door,
		helpnote:'img/notes/fire/fire3help.png',
		
		initPosx:550,
		initPosy:573,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		numpanel:null,
		numposinit:0,
		nums:null,
		
		iswarn:false,
		ischangelamp:false,
		warntime:0,
		
		step0_isphone:false,
		step2_pickcard:false,
		step1_iscard:false,
		step2_isstool:false,
		
		constructor: function(properties) {
			Firedoorscene.superclass.constructor.call(this, properties);
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
			
			this.numpanel = new Hilo.Container({x:616,y:160}).addTo(this);
			this.nums = [];
			this.numposinit = 0;
			
			game.sounds.play(14,true);
			
			
			this.warntime = 0;
			this.iswarn = false;
			
			this.numposinit =0;
			this.iswarn = false;
			this.ischangelamp =false;
			this.warntime = 0;
			this.step0_isphone = false;
			this.step2_pickcard =false;
			this.step1_iscard = false;
			this.step2_isstool = false;
			
			this.setHelp();
		},
		addNum:function(n){
			if(this.numposinit > 2)
				return;
			this.nums[this.numposinit] = n;
			this.numposinit++;
			new Hilo.Bitmap({
				image:'img/fire/3/'+n.toString()+'.png',
				x:this.numposinit*22
			}).addTo(this.numpanel);
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
		showDrawer:function(){
			this.hero.visible = false;
			this.items['drawerbg'].visible = true;
			this.items['stool'].status = 2;
			this.items['drawer'].status = 2;
			this.items['doorcard'].status = 2;
			this.items['glass'].status = 2;
			this.items['card'].status = 1;
			this.items['card'].visible = true;
		},
		showPhonepanel:function(){
			this.hero.visible = false;
			this.items['phonebg'].visible = true;
			this.items['num0'].status = 1;
			this.items['num1'].status = 1;
			this.items['num2'].status = 1;
			this.items['num3'].status = 1;
			this.items['num4'].status = 1;
			this.items['num5'].status = 1;				
			this.items['num6'].status = 1;
			this.items['num7'].status = 1;
			this.items['num8'].status = 1;
			this.items['num9'].status = 1;
			this.items['call'].status = 1;
			this.items['phone'].status = 2;
			this.items['stool'].status = 2;
			this.items['drawer'].status = 2;
			this.items['doorcard'].status = 2;
			this.items['glass'].status = 2;
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['call'])){
				var obj = this.items['call'];
				var scene = this;
				this.numposinit = 0;
				this.numpanel.removeAllChildren();
				if(this.nums[0] == 1 && this.nums[1] ==1 && this.nums[2]==9){
					//this.sayYes();
					this.items['phonebg'].visible = false;
					this.items['num0'].status = 2;
					this.items['num1'].status = 2;
					this.items['num2'].status = 2;
					this.items['num3'].status = 2;
					this.items['num4'].status = 2;
					this.items['num5'].status = 2;
					this.items['num6'].status = 2;
					this.items['num7'].status = 2;
					this.items['num8'].status = 2;
					this.items['num9'].status = 2;
					this.items['call'].status = 2;
					this.items['phone'].status = 2;
					this.items['stool'].status = 1;
					this.items['drawer'].status = 1;
					this.items['doorcard'].status = 1;
					this.items['glass'].status = 1;
					this.hero.visible = true;
					this.step0_isphone = true;
				}else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num0'])){
				var obj = this.items['num0'];
				var scene = this;
				scene.addNum(0);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num1'])){
				var obj = this.items['num1'];
				var scene = this;
				scene.addNum(1);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num2'])){
				var obj = this.items['num2'];
				var scene = this;
				scene.addNum(2);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num3'])){
				var obj = this.items['num3'];
				var scene = this;
				scene.addNum(3);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num4'])){
				var obj = this.items['num4'];
				var scene = this;
				scene.addNum(4);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num5'])){
				var obj = this.items['num5'];
				var scene = this;
				scene.addNum(5);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num6'])){
				var obj = this.items['num6'];
				var scene = this;
				scene.addNum(6);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num7'])){
				var obj = this.items['num7'];
				var scene = this;
				scene.addNum(7);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num8'])){
				var obj = this.items['num8'];
				var scene = this;
				scene.addNum(8);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['num9'])){
				var obj = this.items['num9'];
				var scene = this;
				scene.addNum(9);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['drawer'])){
				if(!this.step0_isphone){
					this.sayNo();
					return true;
				}
				var obj = this.items['drawer'];
				obj.status = 2;
				var scene = this;
				scene.showDrawer();
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['phone'])){
				var obj = this.items['phone'];
				var scene = this;
				scene.hero.visible = false;
				scene.showPhonepanel();
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['card'])){
				var obj = this.items['card'];
				var scene = this;
				obj.visible = false;
				obj.status = 2;
				this.items['drawerbg'].visible = false;
				this.hero.visible = true;
				this.items['stool'].status = 1;
				this.items['doorcard'].status = 1;
				this.items['glass'].status = 1;
				this.handonProp('img/fire/3/cardonhand.png',525,470);
				this.step2_pickcard = true;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['doorcard'])){
				if(!this.step2_pickcard){
					this.sayNo();
					return true;
				}
				var obj = this.items['doorcard'];
				var scene = this;
				this.step1_iscard = true;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'card',800,function(){
						
					},function(){
					    obj.status = 2;
					    scene.iswarn = true;
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['glass'])){
				if(!this.step2_isstool){
					this.sayNo();
					return true;
				}
				var obj = this.items['glass'];
				var scene = this;
				scene.currentOnhandImg.removeFromParent();
				scene.gotoDosomething(obj,1,0,0,'door',800,function(){
						
					},function(){
					    obj.status = 2;
					    obj.visible = true;
					    scene.items['glassonfloor'].visible = true;
						scene.passoverReady('img/notes/fire/fireintroduce.png',500,game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.calamity);
					});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['stool'])){
				if(!this.step1_iscard){
					this.sayNo();
					return true;
				}
				var obj = this.items['stool'];
				this.step2_isstool = true;
				var scene = this;
				obj.visible = false;
				scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
						
					},function(){
					    obj.status = 2;
					    scene.handonProp('img/fire/3/stoolonhand.png',470,420);
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
[1, 'bg', 'fire3bg.jpg', 0, 0, 't'],
[1, 'glassonfloor', 'glass2.png', 851, 549, 'f'],
[2, 'glass', 'glass.png', 1,1042,373, -40,210,[0,0,60,190],'f'],
[1, 'alarm', 'lamp2.png', 843, 260, 't'],
[1, 'alarm1', 'lamp1.png', 843, 260, 't'],
[2, 'stool', 'stool.png', 1,647, 519, 40,60,[0,0,100,50],'t'],
[2, 'drawer', 'empty', 1,485, 435, 74,300,[0,0,60,25],'t'],
[2, 'phone', 'empty', 1,383, 323, 20,100,[0,0,40,50],'t'],
[2, 'doorcard', 'empty', 1,915, 328, -50,190,[0,0,30,30],'t'],
[1, 'phonebg', 'phonebg.jpg', 0, 0, 'f'],
[1, 'drawerbg', 'drawerbg.jpg', 0, 0, 'f'],
[2, 'card', 'card.png', 2,509, 322, -80,190,[0,0,170,100],'f'],

[2, 'num0', 'empty', 2,645, 396, -80,190,[0,0,40,26],'t'],
[2, 'num1', 'empty', 2,587, 277, -80,190,[0,0,40,26],'t'],
[2, 'num2', 'empty', 2,643, 277, -80,190,[0,0,40,26],'t'],
[2, 'num3', 'empty', 2,696, 277, -80,190,[0,0,40,26],'t'],
[2, 'num4', 'empty', 2,587, 316, -80,190,[0,0,40,26],'t'],
[2, 'num5', 'empty', 2,643, 316, -80,190,[0,0,40,26],'t'],
[2, 'num6', 'empty', 2,696, 316, -80,190,[0,0,40,26],'t'],
[2, 'num7', 'empty', 2,587, 354, -80,190,[0,0,40,26],'t'],
[2, 'num8', 'empty', 2,643, 354, -80,190,[0,0,40,26],'t'],
[2, 'num9', 'empty', 2,696, 354, -80,190,[0,0,40,26],'t'],
[2, 'call', 'empty', 2,699, 395, -80,190,[0,0,40,26],'t'],
			];
		
			this.layoutUIElement('img/fire/3/',data);

			this.atlas = new Hilo.TextureAtlas({
                image:'img/fire/3/fire3boyatlas.png',
                width:1060,
                height:936,
                frames:[[424, 624, 210, 310], [848, 624, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 0, 210, 310], [424, 312, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [636, 624, 210, 310], [848, 312, 210, 310]],
                sprites: {
                	card:[0,1,2,3,4,5],
                	door:[6,7,8,9,10],
                	pick:[11,12,13,14,15,16,17],
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