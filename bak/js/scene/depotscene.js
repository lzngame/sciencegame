(function(ns) {
	var DepotScene = ns.DepotScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.depot,
		bgImg:null,
		interludetxt:null,
		depotTime:0,
		gasolinecan:null,
		cardoorhandler:null,
		linetyre:null,
		floortyre:null,
		emptytyre:null,
		largegasoline:null,
		ingasoline:null,
		
		shakeTime:0,
		
		constructor: function(properties) {
			DepotScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.x = game.screenWidth / 2 - this.width / 2;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
		},
		active: function(passdata) {
			console.log('%s active:', this.name);
			var scene = this;
			
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks =[];
			this.layoutSceneData();
			this.initTouchEvent();
			game.sounds.play(14,true);
			this.initFingerMouse();
			this.setPassData();
			this.layoutUI();
			game.boydata.currentHp = 4;
			game.headPanel.setHp(game.boydata.currentHp);
		},
		
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.cardoorhandler)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.linetyre)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.floortyre)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.emptytyre)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.largegasoline)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.ingasoline)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.gasolinecan)
			){
				return true;
			}else{
				return false;
			}
		},
		excuteIcon:function(index){
			if(index==3){
				game.toolspanel.removeIcon(index);
				game.boydata.addHp();
				game.headPanel.setHp(game.boydata.currentHp);
				new game.FlashStarEffect({
					x:this.hero.posx-50,
					y:this.hero.posy-250,
				}).addTo(this);
				game.toolippanel.show(true,'补充体力',200);
				this.fingerMouse.visible = true;
				this.fingerMouse.active = false; 
				this.fingerMouse.setDefault();
			}else{
				this.fingerMouse.visible = true;
				this.fingerMouse.active = true; 
				this.fingerMouse.setCurrent(index);
			}
			game.toolspanel.show(false,0);
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItem(mouseX,mouseY,this.linetyre)){
				if(!this.checkFinger(17)){
					return;
				}
				if(this.fingerMouse.index == 17){
					this.linetyre.remove();
					game.headPanel.sayYes();
					game.toolspanel.removeIcon(17);
					this.fingerMouse.setDefault();
					this.floortyre  = new game.ActiveObject({
						x:10,
						y:530,
						status:1,
						readyImgUrl:'tyreonfloor',
						finishedImgUrl:'tyreonfloor',
						clickArea:[0,0,60,60],
					}).addTo(this);
					this.swapChildren(this.fingerMouse,this.floortyre);
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.cardoorhandler)){
				if(!this.checkFinger(-1)){
					return;
				}
				game.switchScene(game.configdata.SCENE_NAMES.incar);
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.floortyre)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.floortyre.remove();
				game.toolspanel.show(true,100);
				game.toolspanel.addIcon(15);
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.emptytyre)){
				if(!this.checkFinger(15)){
					return;
				}
				if(this.fingerMouse.index == 15){
					game.headPanel.sayYes();
					this.fingerMouse.setDefault();
					game.toolspanel.removeIcon(15);
					var t = new Hilo.Bitmap({
						x:435,
						y:516,
						image:game.getImg('uimap'),
						rect:game.configdata.getPngRect('tyre','uimap')
					}).addTo(this);
					this.emptytyre.remove();
					this.swapChildren(t,this.fingerMouse);
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.largegasoline)){
				if(!this.checkFinger(16)){
					return;
				}
				if(this.fingerMouse.index == 16){
					game.headPanel.sayYes();
					this.fingerMouse.setDefault();
					this.ingasoline  = new game.ActiveObject({
						x:454,
						y:493,
						status:1,
						readyImgUrl:'empty',
						finishedImgUrl:'empty',
						clickArea:[0,0,40,40],
					}).addTo(this);
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.ingasoline)){
				if(!this.checkFinger(16)){
					return;
				}
				if(this.fingerMouse.index == 16){
					game.headPanel.sayYes();
					this.fingerMouse.setDefault();
					game.toolspanel.removeIcon(16);
					game.boydata.depotdata.canfull = true;
				}
			}
			
			if(this.checkActiveItem(mouseX,mouseY,this.gasolinecan)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.gasolinecan.remove();
				game.toolspanel.addIcon(16);
				game.toolspanel.show(true,100);
			}
		},
		destory: function() {
			this.removeAllChildren();
			this.removeFromParent();
			game.stage.off();
		},
		changeBg:function(){
			var scene = this;
			Hilo.Tween.to(scene, {
				alpha:0.01,
			}, {
				duration: 400,
				delay:3000,
				onComplete: function() {
					scene.interludetxt.removeFromParent();
					scene.bgImg.setImage(game.getImg('depot'));
					if(scene.linetyre)
						scene.linetyre.visible = true;
					if(scene.floortyre)
						scene.floortyre.visible = true;
					scene.gasolinecan.visible = true;
					Hilo.Tween.to(scene, {
						alpha:1
					}, {
						duration: 400,
						//ease: Hilo.Ease.Bounce.EaseOut,
						onComplete: function() {
							scene.alpha = 1;
							
							
						}
					});
				}
			});
		},
		setPassData:function(){
			if(game.boydata.depotdata.pass){
				this.bgImg.setImage(game.getImg('depot'));
				if(this.linetyre)
					this.linetyre.visible = true;
				if(this.floortyre)
					this.floortyre.visible = true;
				this.gasolinecan.visible = true;
			}
		},
		layoutSceneData:function(){
			var scene = this;
			var img = game.getImg('uimap');
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('interlude'),
			}).addTo(this);
			
			this.gasolinecan  = new game.ActiveObject({
				x:375,
				y:423,
				status:1,
				readyImgUrl:'parcan',
				finishedImgUrl:'parcan',
				clickArea:[0,0,40,40],
				visible:false,
			}).addTo(this);
			
			this.largegasoline  = new game.ActiveObject({
				x:713,
				y:480,
				status:1,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,50,80],
			}).addTo(this);
			
			this.cardoorhandler  = new game.ActiveObject({
				x:530,
				y:478,
				status:1,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,60,60],
			}).addTo(this);
			
			this.linetyre  = new game.ActiveObject({
				x:-12,
				y:270,
				status:1,
				visible:false,
				readyImgUrl:'lintyre',
				finishedImgUrl:'tyreonfloor',
				clickArea:[0,0,60,60],
			}).addTo(this);
			
			this.emptytyre  = new game.ActiveObject({
				x:445,
				y:526,
				status:1,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,60,60],
			}).addTo(this);
			
			
			this.interludetxt = new Hilo.Bitmap({
				image: 'img/note03.png',
				x:1202,
				y:200,
			}).addTo(this);
		},
		onUpdate:function(){
			this.depotTime++;
			if(this.depotTime == 30){
				var scene = this;
				game.boydata.depotdata.pass = true;
				new Hilo.Tween.to(scene.interludetxt,{
						x:210,
					},{
						duration:5000,
						onComplete:function(){
							scene.changeBg();
						}
					});
			}
		},
	});
})(window.game);


