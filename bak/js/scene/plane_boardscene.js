(function(ns) {
	var PlaneBoardscene = ns.PlaneBoardscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.plane_board,
		
		boardcard:null,
		carimg:null,
		positioncard:null,
		sunvisorobj:null,
		deskobj:null,
		sunvisorimg1:null,
		sunvisorimg2:null,
		deskimg1:null,
		deskimg2:null,
		closedeskobj:null,
		cabinbg:null,
		lockdesk:null,
		lockimg1:null,
		lockimg2:null,
		
		beltimg1:null,
		beltimg2:null,
		beltobj:null,
		beltsprite:null,
		beltbg:null,
		
		beltstep1:null,
		beltstep2:null,
		beltexit:null,
		
		initPosx:250,
		initPosy:635,
		currentOnhandObj:null,
		currentOnhandImg:null,
		
		isSunvisor:false,
		isDesk:false,
		isBelt:false,
		
		desktime:0,
		isupdesk:false,
		
		sitman:null,
		
		atlas:null,
		beltatlas:null,
		
		storynote:null,
		black:null,
		maskgraphic:null,
		constructor: function(properties) {
			PlaneBoardscene.superclass.constructor.call(this, properties);
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
			
			this.layoutUI();
			this.isHelp1 = false;
			this.isHelp2 = false;
			game.sounds.play(14,true);
			
			this.handonProp('img/plane/bag.png',287,538);
			
			this.carimg = new Hilo.Bitmap({image:'img/plane/boardingcheck.png',visible:false}).addTo(this);
			this.cabinbg = new Hilo.Bitmap({image:'img/plane/cabindesk.png',visible:false}).addTo(this);
			this.lockimg1 = new Hilo.Bitmap({image:'img/plane/lock1.png',x:630,y:233,visible:false}).addTo(this);
			this.lockimg2 = new Hilo.Bitmap({image:'img/plane/lock2.png',x:640,y:223,visible:false}).addTo(this);
			this.beltbg = new Hilo.Bitmap({image:'img/plane/beltbg.png',visible:false}).addTo(this);
			
			this.beltsprite = new Hilo.Sprite({
				frames:this.beltatlas.getSprite('closefail'),
				interval:10,
				//loop:false,
				visible:false,
			}).addTo(this);
			//this.beltatlas.stop();
			
			this.isSunvisor = false;
			this.isDesk = false;
			this.isBelt = false;
			this.desktime = 0;
			this.isupdesk = false;
			
			this.initFingerMouse();
			this.showMask();
		},
		checkAll:function(){
			if(this.isSunvisor && this.isDesk && this.isBelt){
				game.drdialog.showTxt('img/plane/note2.png');
				game.drdialog.on(Hilo.event.POINTER_START,function(e){
					game.drdialog.hide();
					game.switchScene(game.configdata.SCENE_NAMES.plane_cabin);
				});
			}
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.boardcard)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.positioncard)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.sunvisorobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.deskobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.closedeskobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.lockdesk)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.beltobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.beltstep1)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.beltstep2)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.beltexit)
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
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.boardcard)){
				this.showboardcard();
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.sunvisorobj)){
				if(this.positioncard.status != 2){
					this.sayNo();
					return true;
				}
				this.sitman._frames = this.atlas.getSprite('openwindow');
				this.sitman.currentFrame = 0;
				this.sitman.play();
				this.sunvisorimg1.visible = false;
				this.sunvisorobj.status = 2;
				this.isSunvisor = true;
				this.checkAll();
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.closedeskobj)){
				if(this.positioncard.status != 2){
					this.sayNo();
					return true;
				}
				this.closedeskobj.status = 2;
				this.cabinbg.visible = true;
				this.lockdesk.status = 1;
				this.lockimg1.visible = true;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.lockdesk)){
				this.lockdesk.status = 2;
				var scene = this;
				this.lockimg1.visible = false;
				this.lockimg2.visible = true;
				this.lockdesk.state = 2;
				
				new Hilo.Tween.to(this,{
					alpha:1,
				},{
					delay:2000,
					duration:100,
					onComplete:function(){
						scene.cabinbg.removeFromParent();
						scene.lockimg1.removeFromParent();
						scene.lockimg2.removeFromParent();
						
						scene.isDesk = true;
						scene.checkAll();
					}
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.deskobj)){
				if(this.positioncard.status != 2){
					this.sayNo();
					return true;
				}
				this.sitman._frames = this.atlas.getSprite('closedesk');
				this.sitman.currentFrame = 0;
				this.sitman.play();
				var scene = this;
				this.closedeskobj.status = 1;
				this.deskobj.status = 2;
				this.isupdesk = true;
				new Hilo.Tween.to(this,{
					alpha:1,
				},{
					delay:500,
					duration:100,
					onComplete:function(){
						scene.deskimg1.visible = false;
						scene.deskimg2.visible = true;
					}
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.positioncard)){
				if(this.boardcard.state == 0){
					this.sayNo();
					return true;
				}
				var scene = this;
				this.positioncard.status = 2;
				this.boardcard.status = 2;
				scene.currentOnhandImg.removeFromParent();
				this.goDosomething(this.positioncard,this.sitman,'sitdown',570,270,function(){
					
				});
				return true;
			}
			
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.beltobj)){
				if(this.positioncard.status != 2){
					this.sayNo();
					return true;
				}
				if(this.beltobj.state == 0){
					this.beltbg.visible = true;
					this.beltsprite.visible = true;
					this.beltsprite.loop = false;
					this.beltsprite.currentFrame = 0;
					this.beltsprite._frames = this.beltatlas.getSprite('closefail');
					this.beltobj.status = 2;
					this.beltstep1.status = 1;
				}else{
					this.beltimg1.visible = false;
					this.beltimg2.visible = true;
					this.beltobj.status = 2;
					this.isBelt = true;
					this.checkAll();
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.beltstep1)){
				this.beltsprite.currentFrame = 0;
				this.beltsprite._frames = this.beltatlas.getSprite('step1');
				this.beltsprite.play();
				this.beltstep1.status = 2;
				this.beltstep2.status = 1;
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.beltstep2)){
				this.beltsprite.currentFrame = 0;
				this.beltsprite._frames = this.beltatlas.getSprite('step2');
				this.beltsprite.play();
				this.beltstep2.status = 2;
				this.beltexit.status = 1;
				this.beltimg1.visible = false;
				this.beltimg2.visible = true;
				this.beltobj.status = 2;
				this.isBelt = true;
				this.checkAll();
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.beltexit)){
				this.beltexit.status = 2;
				this.beltbg.visible = false;
				this.beltsprite.visible = false;
				this.beltobj.status = 1;
				this.beltobj.state = 2;
				return true;
			}
			
			return false;
		},
		
		goDosomething:function(obj,spriteObj,spriteAction,x,y,onCall){
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
						if(onCall){
							onCall();
						}
						scene.ignoreTouch = false;
						scene.hero.visible = false;
						spriteObj.visible = true;
						spriteObj.loop = false;
						spriteObj.x = x;
						spriteObj.y = y;
						spriteObj.currentFrame = 0;
						spriteObj._frames = scene.atlas.getSprite(spriteAction);
					}
				});
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
				image:'img/plane/planecabin.png',
			}).addTo(this);
			

			this.sunvisorimg2 = new Hilo.Bitmap({image:'img/plane/sunvisor2.png',x:620,y:314}).addTo(this);
			this.sunvisorimg1 = new Hilo.Bitmap({image:'img/plane/sunvisor1.png',x:620,y:314}).addTo(this);
			this.deskimg1 = new Hilo.Bitmap({image:'img/plane/desk1.png',x:565,y:394}).addTo(this);
			this.deskimg2 = new Hilo.Bitmap({image:'img/plane/desk2.png',x:566,y:354,visible:false}).addTo(this);
			

			this.atlas = new Hilo.TextureAtlas({
                image:'img/plane/planeatlas1.png',
                width: 1060,
                height:936,
                frames:[[424, 0, 210, 310], [848, 0, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 312, 210, 310], [848, 312, 210, 310], [212, 624, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [424, 312, 210, 310], [424, 312, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [0, 624, 210, 310], [424, 312, 210, 310]],
                sprites: {
                	idle:[0],
                	sitdown:[0,1,2,3,4,5,6],
                	openwindow:[13,12,11,10,9,8,7],
                	closedesk:[14,15,16,17,18,19],
                }
            });
            this.beltatlas = new Hilo.TextureAtlas({
                image:'img/plane/beltatlas.png',
                width: 2408,
                height:2752,
				frames:[[0, 0, 1202, 686], [0, 2064, 1202, 686], [1204, 1376, 1202, 686], [0, 2064, 1202, 686], [1204, 1376, 1202, 686], [1204, 688, 1202, 686], [1204, 0, 1202, 686], [1204, 2064, 1202, 686], [0, 1376, 1202, 686], [0, 688, 1202, 686]],
                sprites: {
                	closefail:[0,0,0,0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,5],
                	closeok:[5,6,7,8,9],
                	step1:[6,6],
                	step2:[6,7,8,9]
                }
            });
            
           this.sitman = new Hilo.Sprite({
				frames:this.atlas.getSprite('idle'),
				interval:10,
				x:640-71,
				y:376-94-10,
				visible:false,
			}).addTo(this);
			
			this.beltimg1 = new Hilo.Bitmap({image:'img/plane/belt1.png',x:692,y:470}).addTo(this);
			this.beltimg2 = new Hilo.Bitmap({image:'img/plane/belt2.png',x:655,y:445,visible:false}).addTo(this);
			new Hilo.Bitmap({image:'img/plane/handrail.png',x:682,y:434}).addTo(this);
			
            
			this.boardcard =    this.createActiveObj('board',292,550,224,342,'empty','empty',[0,0,35,35],2);
			this.positioncard =    this.createActiveObj('board',596,282,0,342,'empty','empty',[0,0,35,35],2);
			this.sunvisorobj  =    this.createActiveObj('sunvisor',636,312,0,342,'empty','empty',[0,0,65,105],2);
			this.deskobj  =    this.createActiveObj('desk',583,379,0,342,'empty','empty',[-20,20,55,25],2);
			this.closedeskobj  =    this.createActiveObj('closedesk',576,353,0,342,'empty','empty',[0,0,55,45],2);
			this.lockdesk  =    this.createActiveObj('lockdesk',640,233,0,342,'empty','empty',[0,0,55,55],2);
			this.beltobj  =    this.createActiveObj('belt1',692,467,0,342,'empty','empty',[0,0,55,55],2);
			this.beltstep1  =    this.createActiveObj('beltstep1',660,370,0,342,'empty','empty',[0,0,190,150],2);
			this.beltstep2  =    this.createActiveObj('beltstep1',660,370,0,342,'empty','empty',[0,0,190,150],2);
			this.beltexit  =    this.createActiveObj('beltexit',0,0,0,342,'empty','empty',[0,0,1100,650],2);
		},
		showboardcard:function(){
			var scene = this;
			scene.carimg.visible = true;
			scene.carimg.on(Hilo.event.POINTER_START,function(e){
				scene.carimg.off();
				scene.carimg.visible = false;
			});
			this.boardcard.state = 2;
		},
		
		showMask:function(){
			this.black = new Hilo.Bitmap({
				image:'img/typhoon/black.png',
				width:1202,
				height:686
			}).addTo(this);
			this.storynote = new Hilo.Bitmap({
				image:'img/plane/note1.png',
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
            		duration:2000,
            		onComplete:function(){
            			scene.objActive();
            		}
            	})
            );
		},
		objActive:function(){
			this.boardcard.status = 1;
			this.positioncard.status = 1;
			this.sunvisorobj.status = 1;
			this.deskobj.status = 1;
			this.beltobj.status = 1;
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
		},
		
		
		onUpdate:function(){
			if(this.isupdesk && this.lockdesk.state == 0){
				this.desktime++;
				if(this.desktime > 300){
					this.desktime = 0;
					this.isupdesk = false;
					this.deskimg1.visible = true;
					this.deskimg2.visible = false;
					this.lockdesk.status = 2;
					this.deskobj.status = 1;
				}
			}
		},
	});
})(window.game);