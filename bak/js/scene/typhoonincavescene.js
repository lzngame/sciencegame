(function(ns) {
	var TyphoonCaveScene = ns.TyphoonCaveScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.typhoon_cave,
		helpnote:'img/notes/typhoon/typhoon1help.png',
		
		monster:null,
		helmet:null,
		helmetimg:null,
		apple:null,
		door:null,
		opendoor:null,
		bee:null,
		beeobj:null,
		bug:null,
		chomper:null,
		chomperatlas:null,
		monsteratlas:null,
		eatappleatlas:null,
		takehelmetatlas:null,
		bugatlas:null,
		initPosx:750,
		initPosy:620,
		bg:null,
		storynote:null,
		black:null,
		takehelmetSprite:null,
		eatappleSprite:null,
		currentTarget:null,
		targets:null,
		flowbug:null,
		isbugfall:false,
		isflowbee:false,
		maskgraphic:null,
		body:null,
		ishelmet:false,
		isangry:false,
		angrytime:0,
		constructor: function(properties) {
			TyphoonCaveScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = 2404;
			this.height = game.configdata.mainStageSize.height;
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
			this.addHero(passdata[0],this.initPosx,this.initPosy);
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			this.layoutUI();
			
			game.sounds.play(14,true);
			//game.boydata.currentHp = 4;
			//game.headPanel.setHp(game.boydata.currentHp);
			this.showMask();
			
			this.ishelmet = false;
			this.isangry = false;
			this.angrytime = 0;
			this.setHelp();
			
		},
		checkFinishedAllTask:function(){
			
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				//this.checkActiveItemWithoutPos(mouseX,mouseY,this.chomper)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.apple)||
				//this.checkActiveItemWithoutPos(mouseX,mouseY,this.monster)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.beeobj)||
				//this.checkActiveItemWithoutPos(mouseX,mouseY,this.bug)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.door)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.helmet)
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
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.apple)){
				if(this.apple.state == 2){
					this.sayNo();
					this.angry();
				}else{
					this.gotoapple();
					this.apple.status = 2;
					this.door.status = 1;
					return true;
				}
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.beeobj)){
				if(this.beeobj.state == 2){
					this.sayNo();
					return true;
				}
				this.targets = [[331,117],[633,135],[866,317],[1173,391],[1055,464],[242,67],[316,145],[1200,-230]];
				this.currentTarget = [331,117];
				this.beeobj.status = 2;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.helmet)){
				this.takehelmet(this.helmet);
				this.beeobj.state = 1;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.door)){
				if(this.door.state == 2){
					this.sayNo();
					return true;
				}
				this.door.status = 2;
				this.door.removeFromParent();
				this.opendoor.visible = true;
				var scene = this;
				new Hilo.Tween.to(scene.maskgraphic,{
					scaleX:0,
					scaleY:0
				},{
					duration:1000,
					delay:500,
					onComplete:function(){
						scene.hero.visible = false;
						scene.monster.visible = false;
						scene.opendoor.visible = false;
						scene.chomper.visible = false;
						new Hilo.Bitmap({
							image:'img/typhoon/typhoonexit.png'
						}).addTo(scene);
						scene.showEndMask();
					}
				});
				return true;
			}
			
			return false;
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.ishelmet){
				this.hero.switchState('nocan',10);
			}
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
			this.bg = new Hilo.Bitmap({
				image:'img/typhoon/typhoonincave.png',
			}).addTo(this);
			this.apple = this.createActiveObj('apple',103,465,0,200,'img/typhoon/apple.png','',[0,0,40,40],1);
			this.apple.state = 2;
			this.door = this.createActiveObj('door',133,336,0,200,'img/typhoon/closedoor.png','',[0,0,120,250],1);
			this.door.state = 2;
			this.helmet = this.createActiveObj('helmet',1021,424,-70,200,'img/typhoon/helmet.png','',[0,0,60,60],1);
			this.beeobj = this.createActiveObj('bee',311,137,0,200,'empty','empty',[0,0,40,40],1);
			this.beeobj.state = 2;
			this.opendoor = new Hilo.Bitmap({
				x:133,
				y:336,
				image:'img/typhoon/opendoor.png',
				visible:false
			}).addTo(this);
			this.chomperatlas = new Hilo.TextureAtlas({
                image:'img/typhoon/chomperactions.png',
                width: 1284,
                height: 1626,
                frames:[[428, 542, 426, 540], [856, 542, 426, 540], [856, 0, 426, 540], [428, 1084, 426, 540], [856, 1084, 426, 540], [428, 0, 426, 540], [0, 1084, 426, 540], [0, 542, 426, 540], [0, 0, 426, 540]],
                sprites: {
                	idle:[7,7],
                    eat: [7,6,5,4,7,6,5,4,7,6,5,4,3,2,1,0],
                    spit:{from:5,to:8}
                }
            });
            this.eatappleatlas = new Hilo.TextureAtlas({
                image:'img/typhoon/eatapple.png', 
                width: 848,
                height: 624,
                frames:[[0, 0, 210, 310], [212, 312, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [636, 0, 210, 310], [212, 0, 210, 310], [0, 312, 210, 310]],
                sprites: {
                	idle:[0,1,2,3,4,5,6],
                }
            });
            this.monsteratlas = new Hilo.TextureAtlas({
                image:'img/typhoon/monsters.png',
                width: 1077,
                height: 1422,
                frames:[[359, 474, 357, 235], [359, 237, 357, 235], [359, 237, 357, 235], [718, 948, 357, 235], [359, 711, 357, 235], [359, 0, 357, 235], [718, 711, 357, 235], [718, 474, 357, 235], [718, 237, 357, 235], [718, 0, 357, 235], [359, 1185, 357, 235], [359, 948, 357, 235], [359, 711, 357, 235], [718, 948, 357, 235], [0, 1185, 357, 235], [0, 1185, 357, 235], [0, 948, 357, 235], [0, 711, 357, 235], [0, 474, 357, 235], [0, 237, 357, 235], [0, 711, 357, 235], [0, 0, 357, 235]],
                sprites: {
                	idle:[14,14],
                	eat:[0,6,7,8,9,10,11,12,13,1,2,3,4,5],
                	angry:{from:14,to:21},
                	idle2:[14,14,14,14,14,14,14,14,14,14,14],
                }
            });
            this.takehelmetatlas = new Hilo.TextureAtlas({
                image:'img/typhoon/takehelmet.png',
                width: 848,
                height: 624,
                frames:[[0, 0, 210, 310], [212, 312, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [636, 0, 210, 310], [212, 0, 210, 310], [0, 312, 210, 310]],
                sprites: {
                	idle:{from:0,to:6},
                }
            });
            this.bugatlas = new Hilo.TextureAtlas({
                image:'img/typhoon/bugs.png',
                width: 132,
                height: 94,
                frames:[[66, 0, 64, 45], [0, 47, 64, 45], [0, 0, 64, 45], [0, 47, 64, 45]],
                sprites: {
                	idle:[0,1,2,3],
                }
            });
            
            this.chomper = new Hilo.Sprite({
				frames:this.chomperatlas.getSprite('idle'),
				interval:10,
				x:135-179,
				y:60
			}).addTo(this);
			this.bug = new Hilo.Sprite({
				frames:this.bugatlas.getSprite('idle'),
				interval:10,
				x:1042,
				y:448,
				visible:false,
			}).addTo(this);
			this.monster = new Hilo.Sprite({
				frames:this.monsteratlas.getSprite('idle'),
				interval:10,
				x:347,
				y:440,
			}).addTo(this);
			
			this.takehelmetSprite = new Hilo.Sprite({
				frames:this.takehelmetatlas.getSprite('idle'),
				interval:10,
				x:909-25,
				y:326+5,
				visible:false,
			}).addTo(this);
			this.takehelmetSprite.stop();
			
			this.eatappleSprite = new Hilo.Sprite({
				frames:this.eatappleatlas.getSprite('idle'),
				interval:10,
				x:214-93,
				y:212+135,
				visible:false,
			}).addTo(this);
			this.eatappleSprite.stop();
			
			
			this.helmetimg = new Hilo.Bitmap({
				image:'img/typhoon/helmet.png',
				visible:false,
			});
			
			this.bee = new game.Bee({
				frames: game.monsterdata.soliderhero_atlas.getSprite('bee'),
				posx:331,
				posy:117,
				interval:4,
			}).addTo(this);
			
			this.flowbug = new Hilo.Bitmap({
				image:'img/typhoon/flowbug.png',
				visible:false
			}).addTo(this);
			
			
		},
		showTakehelmet:function(){
			this.takehelmetSprite.loop = false;
			this.takehelmetSprite.visible = true;
			this.takehelmetSprite.play();
		},
		showEatapple:function(){
			this.eatappleSprite.loop = false;
			this.eatappleSprite.visible = true;
			this.eatappleSprite.play();
			this.door.state = 1;
		},
		showEndMask:function(){
			var scene = this;
            new Hilo.Tween.to(scene.maskgraphic,{
            	scaleX:350,
            	scaleY:350,
            },{
            	delay:200,
            	duration:1000,
            	onComplete:function(){
            		
            	}
            }).link(
            	new Hilo.Tween.to(scene.maskgraphic,{
            		alpha:1
            	},{
            		duration:2000,
            		onComplete:function(){
            			//game.switchScene(game.configdata.SCENE_NAMES.typhoon_out);
            			scene.passoverReady('img/nextpasspoint.png',100,game.configdata.SCENE_NAMES.typhoon_out);
            		}
            	})
            );
		},
		showMask:function(){
			this.black = new Hilo.Bitmap({
				image:'img/typhoon/black.png',
				width:1202,
				height:686
			}).addTo(this);
			this.storynote = new Hilo.Bitmap({
				image:'img/typhoon/storybgnote.png',
				x:240,
				y:240
			}).addTo(this);
			var scene = this;
			this.maskgraphic = new Hilo.Graphics({width:100, height:100, x:600, y:340});
            this.maskgraphic.beginFill("#0ff").drawCircle(0, 0, 2).endFill();
            this.maskgraphic.pivotX = 2;
            this.maskgraphic.pivotY = 2;
            this.storynote.on(Hilo.event.POINTER_START, function(e){
            	scene.startMask();
            });
        },
        startMask:function(){
            var scene = this;
            new Hilo.Tween.to(this,{
            	alpha:1
            },{
            	delay:20,
            	duration:10,
            	onComplete:function(){
            		scene.mask = scene.maskgraphic;
            		scene.storynote.removeFromParent();
            		scene.black.removeFromParent();
            	}
            }).link(
            	new Hilo.Tween.to(scene.maskgraphic,{
            		scaleX:350,
            		scaleY:350,
            	},{
            		duration:2000
            	})
            );
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(!this.ishelmet){
				this.hero.switchState('nocan',10);
			}
		},
		angry:function(){
			this.monster._frames = this.monsteratlas.getSprite('angry');
			this.monster.currentFrame = 0;
			this.isangry = true;
			this.angrytime = 0;
			//this.monster.play();
		},
		onUpdate:function(){
			this.moveTargets();
			if(this.isflowbee){
				this.flowbug.x = this.bee.x;
				this.flowbug.y = this.bee.y+40;
			}
			if(this.isbugfall){
				this.flowbug.y += 2;
			}
			if(this.chomper.currentFrame == 12){
				this.monster.loop = false;
				this.apple.status = 1;
				this.apple.state = 1;
				
				this.monster._frames = this.monsteratlas.getSprite('eat');
				this.monster.currentFrame = 0;
			}
			if(this.isangry){
				if(this.angrytime > 120){
					this.isangry = false;
					this.angrytime = 0;
					//this.monster.stop();
					console.log('stop');
					this.monster._frames = this.monsteratlas.getSprite('idle');
					this.monster.currentFrame = 0;
				}
				this.angrytime++;
			}
		},
		moveTargets:function(){
			if(this.currentTarget){
				if(Math.abs(this.bee.posx - this.currentTarget[0]) <= 3 && Math.abs(this.bee.posy - this.currentTarget[1]) <= 3){
					if(this.targets.length > 0){
						this.startTargetsWalk();
					}else{
						this.currentTarget = null;
					}
				}
			}
		},
		eatbug:function(){
			this.chomper.loop = false;
			this.chomper._frames = this.chomperatlas.getSprite('eat');
		},
		startTargetsWalk:function(){
			console.log(this.targets.length);
			if(this.targets.length == 3){
				this.flowbug.visible = true;
				this.bug.visible = false;
				this.isflowbee = true;
			}
			if(this.targets.length == 1){
				this.flowbug.visible = false;
				console.log('throw bug');
				this.eatbug();
			}
			this.currentTarget = this.targets.shift();
			this.beewalk(this.currentTarget[0],this.currentTarget[1]);
		},
		beewalk:function(targetx,targety){
			var disX = targetx - this.bee.posx;
			var disY = targety - this.bee.posy;
			var angle = Math.atan2(disY,disX);
			this.bee.speedx = Math.cos(angle) *  this.bee.speed ;
			this.bee.speedy = Math.sin(angle) *  this.bee.speed ;
			this.bee.targetx = targetx;
			this.bee.targety = targety;
			if(disX < 0)
				this.bee.turnleft();
			else
				this.bee.turnright();
		},
		gotoapple:function(){
			var scene = this;
			scene.ignoreTouch = true;
			
			var targetx = 198;
			var targety = 631;
			
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:1,
					scaleY:1,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.visible = false;
						scene.apple.visible = false;
						scene.apple.status = 2;
						scene.apple.removeFromParent();
						scene.showEatapple();
					}
			}).link(
				new Hilo.Tween.to(this,{
					alpha:1
				},{
					duration:700,
					delay:500,
					onComplete:function(){
						scene.eatappleSprite.removeFromParent();
						scene.hero.visible = true;
						scene.ignoreTouch = false;
					}
				})
			);
		},
		takehelmet:function(obj){
			var scene = this;
			scene.ignoreTouch = true;
			
			var targetx = obj.x + obj.targetx;
			var targety = obj.y + obj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:1,
					scaleY:1,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.visible = false;
						scene.bug.visible = true;
						scene.helmet.status = 2;
						scene.helmet.removeFromParent();
						scene.showTakehelmet();
						scene.ignoreTouch = false;
						scene.ishelmet = true;
					}
			}).link(
				new Hilo.Tween.to(this,{
					alpha:1
				},{
					duration:700,
					delay:500,
					onComplete:function(){
						scene.takehelmetSprite.removeFromParent();
						scene.helmetimg.addTo(scene.hero);
						scene.helmetimg.visible=true;
						scene.helmetimg.x = 30;
						scene.hero.visible = true;
					}
				})
			);
		},
	});
})(window.game);