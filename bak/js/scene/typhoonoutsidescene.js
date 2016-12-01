(function(ns) {
	var TyphoonOutScene = ns.TyphoonOutScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.typhoon_out,
		bench:null,
		rod:null,
		rainboot:null,
		warnplate:null,
		putBenchobj:null,
		putPlateobj:null,
		doorobj:null,
		initPosx:350,
		initPosy:590,
		currentOnhandObj:null,
		rodatlas:null,
		rodSprite:null,
		rodimg:null,
		isUprod:false,
		isFallwarnplate:false,
		isFallrainboot:false,
		rainbootImg:null,
		warnplateImg:null,
		sumtime:0,
		constructor: function(properties) {
			TyphoonOutScene.superclass.constructor.call(this, properties);
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
			this.layoutBgMap();
			this.addHero(null,this.initPosx,this.initPosy);
			
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			this.sumtime = 0;
			
			game.sounds.play(14,true);
			//game.boydata.currentHp = 4;
			//game.headPanel.setHp(game.boydata.currentHp);

			
		},
		checkFinishedAllTask:function(){
			return (this.isFlower_l && this.isFlower_m && this.isFlower_s && this.isFullbucket && this.isClosewindow && this.isRepairwindow);
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.bench)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.rod)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.rainboot)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.warnplate)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.putBenchobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.putPlateobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.thewindow)
			){
				return true;
			}else{
				return false;
			}
		},
		receiveMsg: function(msg) {
			
		},
		putProp:function(){
			this.hero.putProp();
			this.currentOnhandObj = null;
		},
		
		putdownProp:function(obj,x,y,onCall){
			var scene = this;
			scene.putProp();
			scene.ignoreTouch = true;
			scene.hero.switchState('turn180',10);
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					scaleX:1,
					scaleY:1,
				}, {
					duration: 60,
					onComplete: function() {
						scene.hero.switchState('idleback',5);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:200,
							onComplete:function(){
								scene.hero.switchState('backpick',8);
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
									scaleX:1,
									scaleY:1,
								},{
									duration:60,
									delay:320,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.ignoreTouch = false;
										obj.visible = true;
										obj.status = 1;
										obj.x = x;
										obj.y = y;
										if(onCall)
											onCall();
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
		putdownFlower:function(obj,oncall,oncall2){
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var scene = this;
			scene.currentOnhandImg.removeFromParent();
			new Hilo.Tween.to(scene.hero,{
				posx:targetx,
				posy:targety
			},{
				duration:100,
				onComplete:function(){
					scene.putdownProp(obj,0,0,oncall2);
					scene.showFlowerImg(obj);
					scene.currentOnhandObj = null;
					if(oncall){
						oncall();
					}
				}
			});
		},
		showFlowerImg:function(obj){
			if(obj.name == 'putbench'){
				this.bench.visible = true;
				this.bench.status = 1;
				this.bench.state = 3;
				this.bench.x = obj.x;
				this.bench.y = obj.y;
			}
			if(obj.name == 'putplate'){
				this.warnplateImg.visible = true;
			}
		},
		pickPropQuick:function(pickProp,propimg,obj,x,y,onCall){
			var scene = this;
			scene.ignoreTouch = true;
			scene.hero.switchState('turn180',10);
			scene.currentOnhandObj = obj;
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:obj.scaleFact,
					scaleY:obj.scaleFact,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.switchState('idleback',10);
						game.sounds.play(6,false);
					}
				}).link(
					new Hilo.Tween.to(scene.hero,{
							alpha:1,
						},{
							duration:10,
							delay:200,
							onComplete:function(){
								if(obj.name == 'bench'|| obj.name=='warnplate')
									scene.hero.switchState('backpick',10);
								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
									scaleX:1,
									scaleY:1,
								},{
									duration:120,
									delay:320,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.hero.takeProp(pickProp,x,y);
										scene.handonProp(propimg,scene.hero.posx+x,scene.hero.posy+y);
										scene.ignoreTouch = false;
										obj.visible = false;
										obj.status = 2;
										if(onCall)
											onCall();
									}
								});
							}
						})
				);
		},
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.bench)){
				if(!this.currentOnhandObj && this.bench.state == 0){
					this.pickPropQuick('bench','img/typhoon/bench.png',this.bench,-40,-130);
					this.bench.state = 1;
					this.putBenchobj.status = 1;
				}else if(this.currentOnhandObj && this.currentOnhandObj.name == 'rod' && this.bench.state == 3){
					this.rodSprite.visible = true;
					this.hero.visible = false;
					this.currentOnhandImg.removeFromParent();
					this.rodSprite.x = 427-80;
					this.rodSprite.y = 268-84;
					this.bench.status = 2;
					this.rodimg.visible = true;
				}else{
					this.sayNo();
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.putBenchobj)){
				if(this.currentOnhandObj && this.currentOnhandObj.name == 'bench'){
					this.putdownFlower(this.putBenchobj);
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.doorobj)){
				if(this.doorobj.state == 2){
					game.switchScene(game.configdata.SCENE_NAMES.typhoon_room);
				}else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.putPlateobj)){
				if(this.currentOnhandObj && this.currentOnhandObj.name == 'warnplate'){
					var scene = this;
					this.putPlateobj.scaleFact = 1;
					this.doorobj.state = 2;
					scene.putdownFlower(this.putPlateobj,function(){
						scene.rainbootImg.setImage('img/typhoon/rainboot3.png');
						scene.rainbootImg.x = 78;
						scene.rainbootImg.y = 239;
						scene.rainbootImg.visible = true;
						},function(){
						scene.rainbootImg.setImage('img/typhoon/rainboot2.png');
						scene.rainbootImg.x = 34;
						scene.rainbootImg.y = 239;
						scene.rainbootImg.visible = true;
					});
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.rod)){
				if(!this.currentOnhandObj && this.bench.x > 184){
					this.pickPropQuick('rod','img/typhoon/rodonhand.png',this.rod,-80,-103);
				}else{
					this.sayNo();
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.warnplate)){
				if(this.currentOnhandObj && this.rodimg.visible && this.warnplate.state != 2){
					this.upRod();
					this.isFallwarnplate = true;
				}else if(!this.currentOnhandObj && this.warnplate.state == 2){
					this.warnplate.scaleFact = 1;
					this.rainbootImg.setImage('img/typhoon/rainboot3.png');
					var scene = this;
					scene.rainbootImg.x = 78;
					scene.rainbootImg.y = 239;
					scene.putPlateobj.status = 1;
					this.pickPropQuick('warnplate','img/typhoon/warnplate1.png',this.warnplate,-40,-180,function(){
						scene.rainbootImg.setImage('img/typhoon/rainboot2.png');
						scene.rainbootImg.x = 34;
						scene.rainbootImg.y = 239;
					});
				}else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.rainboot)){
				if(this.currentOnhandObj && this.rainboot.state != 2  && this.rodimg.visible){
					this.upRod();
					this.isFallrainboot = true;
				}else if(this.rainboot.state == 2 && this.isFallrainboot && this.isFallwarnplate){
					this.rodSprite.x = 427-80+93;
					this.rodSprite.y = 268-84+45;
					this.rodSprite._frames = this.rodatlas.getSprite('onboot');
					this.rodSprite.currentFrame = 0;
					this.rodSprite.loop = false;
					this.rainboot.removeFromParent();
					this.rainboot.status = 2;
					var scene = this;
					new Hilo.Tween.to(this,{
						alpha:1,
					},{
						duration:100,
						delay:500,
						onComplete:function(){
							scene.rodSprite.visible = false;
							scene.hero.visible = true;
							scene.rainbootImg.addTo(scene.hero);
							scene.rainbootImg.x = 34;
							scene.rainbootImg.y = 239;
							scene.hero.posx = 554;
							scene.putProp();
						}
					});
				}else{
					this.sayNo();
				}
				return true;
			}
			
			return false;
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
		layoutBgMap:function(){
			var scene = this;
			new Hilo.Bitmap({
				image:'img/typhoon/typhoonoutbg.png',
			}).addTo(this);
			
			this.bench = this.createActiveObj('bench',184,468,0,100,'img/typhoon/bench.png','',[0,0,100,40],1);
			this.rod = this.createActiveObj('rod',80,300,0,200,'img/typhoon/rod.png','',[0,0,40,140],1);
			this.warnplate = this.createActiveObj('warnplate',412,117,0,110,'img/typhoon/warnplate2.png','',[0,0,40,40],1);
			this.rainboot = this.createActiveObj('rainboot',439,113,0,200,'img/typhoon/rainboot1.png','',[0,0,40,40],1);
			this.bench.scaleFact = 1;
			this.rod.scaleFact = 1;
			this.putBenchobj = this.createActiveObj('putbench',417,454,0,80,'empty','empty',[0,0,100,50],2);
			this.putPlateobj = this.createActiveObj('putplate',690,480,-50,40,'empty','empty',[0,0,100,50],2);
			this.doorobj = this.createActiveObj('door',723,100,-50,40,'empty','empty',[0,0,150,250],1);
			
			this.showflashEffect();
			
			this.rodatlas = new Hilo.TextureAtlas({
                image:'img/typhoon/backonrod.png',
                width: 848,
                height: 936,
                frames:[[0, 312, 210, 310], [0, 0, 210, 310], [212, 312, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 624, 210, 310], [636, 0, 210, 310], [212, 624, 210, 310], [212, 624, 210, 310], [636, 0, 210, 310], [212, 624, 210, 310], [212, 0, 210, 310], [0, 624, 210, 310], [424, 312, 210, 310]],
                sprites: {
                	idle:[0],
                	rod:[1,2,3,0],
                	onboot:{from:4,to:14},
                }
            });

            this.rodimg = new Hilo.Bitmap({
            	image:'img/typhoon/rod.png',
            	x:427,
            	y:208,
            	visible:false,
            }).addTo(this);
            
            this.rodSprite = new Hilo.Sprite({
				frames:this.rodatlas.getSprite('idle'),
				interval:10,
				visible:false,
			}).addTo(this);
			
			this.rainbootImg = new Hilo.Bitmap({
				image:'img/typhoon/rainboot2.png',
			});
			
			this.warnplateImg = new Hilo.Bitmap({
				image:'img/typhoon/warnplate1.png',
				x:690,
				y:430,
				visible:false,
			}).addTo(this);
			

		},
		upRod:function(){
			this.rodSprite._frames = this.rodatlas.getSprite('rod');
			this.rodSprite.currentFrame = 0;
			this.isUprod = true;
		},
		showNote:function(){
			var scene = this;
			var img = new Hilo.Bitmap({
				image:'img/note04.png',
				x:scene.passPaneleBg.x,
				y:scene.passPaneleBg.y,
			}).addTo(this);
			img.on(Hilo.event.POINTER_START, function(e) {
				game.switchScene(game.configdata.SCENE_NAMES.passchoice);
			});
		},
		
		
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.currentOnhandObj ==null){
				this.hero.switchState('nocan',10);
			}
		},
		showflashEffect:function(){
			var tmpatlas = new Hilo.TextureAtlas({
                image:'img/typhoon/flasheffect.png',
                width: 438,
                height: 396,
                frames:[[0, 198, 217, 97],[0, 297, 217, 97], [219, 0, 217, 97], [99, 0, 217, 97], [0, 0, 217, 97]], 
                sprites: {
                	idle:[0,1,2,3,4],
                }
            });
            
            new Hilo.Sprite({
				frames:tmpatlas.getSprite('idle'),
				interval:10,
				x:733,
				y:505
			}).addTo(this);
		},
		onUpdate:function(){
			this.sumtime++;
			if(this.sumtime == 450){
				game.drdialog.showTxt('img/typhoon/note1.png');
			}
			if(this.sumtime == 600){
				game.drdialog.hide();
			}
			if(this.isUprod){
				if(this.rodSprite.currentFrame == 0){
					this.rodimg.y = 208;
				}
				if(this.rodSprite.currentFrame == 1){
					this.rodimg.y = 208-65;
				}
				if(this.rodSprite.currentFrame == 2){
					this.rodimg.y = 208-70;
				}
				if(this.rodSprite.currentFrame == 3){
					this.rodimg.y = 208;
					this.rodSprite._frames = this.rodatlas.getSprite('idle');
					this.rodSprite.currentFrame = 0;
					console.log('fall');
					var scene = this;

					if(this.isFallwarnplate){
						new Hilo.Tween.to(scene.warnplate,{
							x:380,
							y:431,
						},{
							duration:300,
							onComplete:function(){
								scene.warnplate.state = 2;
							}
						});
					}
					if(this.isFallrainboot){
						new Hilo.Tween.to(scene.rainboot,{
							x:520,
							y:431,
						},{
							duration:300,
							onComplete:function(){
								scene.rainboot.state = 2;
							}
						});
					}
					if(this.isFallrainboot && this.isFallwarnplate){
						this.rodimg.x = 407;
						this.rodimg.y = 308;
						this.isUprod = false;
					}
				}
			}
		},
	});
})(window.game);