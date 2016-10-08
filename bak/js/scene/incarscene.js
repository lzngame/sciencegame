(function(ns) {
	var IncarScene = ns.IncarScene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.incar,
		bgImg:null,
		starbtn:null,
		clipper:null,
		cover:null,
		safeline:null,
		safelineimg:null,
		safelamp:null,
		canlamp:null,
		
		constructor: function(properties) {
			IncarScene.superclass.constructor.call(this, properties);
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
			this.layoutUI();
			this.setPassData();
		},
		
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.starbtn)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.clipper)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.safeline)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.cover)
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
			if(this.checkActiveItem(mouseX,mouseY,this.starbtn)){
				if(!this.checkFinger(-1)){
					return;
				}
			}
			if(this.checkActiveItem(mouseX,mouseY,this.clipper)){
				if(!this.checkFinger(-1)){
					return;
				}
				this.clipper.remove();
				game.toolspanel.addIcon(17);
				game.toolspanel.show(true,100);
				game.boydata.incardata.clipperused = true;
				return;
			}
			if(this.checkActiveItem(mouseX,mouseY,this.safeline)){
				if(!this.checkFinger(-1)){
					return;
				}
				if(this.safeline.state == 0){
					this.safeline.state = 1;
					this.safelineimg.setImage('img/safeline02.png');
					this.safelamp.visible = true;
				}else{
					this.safeline.state = 0;
					this.safelineimg.setImage('img/safeline01.png');
					this.safelamp.visible = false;
				}
			}
			if(this.checkActiveItem(mouseX,mouseY,this.cover)){
				if(!this.checkFinger(-1)){
					return;
				}
				if(this.cover.initimg){
					this.cover.setEndImg(0,60);
					if(!game.boydata.incardata.clipperused){
						this.clipper.status = 1;
					}else{
						this.clipper.remove();
					}
				}else{
					this.cover.setInitImg();
				}
			}
			
			
		},
		
		
		setPassData:function(){
			if(game.boydata.depotdata.canfull){
				this.canlamp.visible = true;
			}
		},
		layoutSceneData:function(){
			var scene = this;
			var img = game.getImg('uimap');
			this.bgImg = new Hilo.Bitmap({
				image: game.getImg('carmeter'),
			}).addTo(this);
			
			this.starbtn  = new game.ActiveObject({
				x:611,
				y:457,
				status:1,
				readyImgUrl:'starbtn01',
				finishedImgUrl:'starbtn01',
				clickArea:[0,0,50,50],
			}).addTo(this);
			
			this.clipper  = new game.ActiveObject({
				x:864,
				y:484,
				status:0,
				readyImgUrl:'clipper',
				finishedImgUrl:'clipper',
				clickArea:[0,0,96,60],
			}).addTo(this);
			
			this.cover  = new game.ActiveObject({
				x:748,
				y:461,
				status:1,
				readyImgUrl:'cover01',
				finishedImgUrl:'cover02',
				clickArea:[0,0,400,90],
			}).addTo(this);
			
			this.safeline  = new game.ActiveObject({
				x:83,
				y:508,
				status:1,
				readyImgUrl:'empty',
				finishedImgUrl:'empty',
				clickArea:[0,0,100,90],
			}).addTo(this);
			
			this.safelineimg = new Hilo.Bitmap({
				x:0,
				y:394,
				image:'img/safeline01.png',
			}).addTo(this);
			
			this.canlamp = new Hilo.Bitmap({
				x:273,
				y:328,
				image:img,
				visible:false,
				rect:game.configdata.getPngRect('canlamp','uimap'),
			}).addTo(this);
			
			this.safelamp = new Hilo.Bitmap({
				x:363,
				y:328,
				image:img,
				visible:false,
				rect:game.configdata.getPngRect('safelamp','uimap'),
			}).addTo(this);
			
			var btn = new Hilo.Bitmap({
				x:763,
				y:228,
				image:img,
				rect:game.configdata.getPngRect('backbtn','uimap'),
			}).addTo(this);
			btn.on(Hilo.event.POINTER_START, function(e) {
				game.sounds.play(2,false);
				game.switchScene(game.configdata.SCENE_NAMES.depot,[200,600]);
			});
		},
		destory: function() {
			this.removeAllChildren();
			this.removeFromParent();
			game.stage.off();
		},
		onUpdate:function(){
			
		},
	});
})(window.game);


