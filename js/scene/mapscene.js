(function(ns) {
	var MapScene = ns.MapScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.map,
		width: 0,
		height: 0,
		largemap:null,
		largemapimg:null,
		pointgate:null,
		normalRect:null,
		constructor: function(properties) {
			MapScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.x = game.screenWidth/2 - this.width/2;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			//this.alpha = 0.3;
			this.alpha = 1;
			var scene = this;
			new Hilo.Tween.to(this,{
				alpha:1
			},{
				duration:1000
			});
			
			var img = game.getImg('uimap');
			
			var sheephead = new Hilo.Container({
				background:'#18101F',
				width:this.width,
				height:88,
				y:this.height - 88,
			}).addTo(this);
			
			var maskGraphics = new Hilo.Graphics();
			maskGraphics.lineStyle(1, "#000").beginFill("#aaaaaa").drawRect(0, 0, this.width, this.height-sheephead.height).endFill();
			//maskGraphics.addTo(this);
			this.largemapimg = new Hilo.Bitmap({
				image:game.getImg('largemap'),
			});
			
			this.largemap = new Hilo.Container({
				width:this.largemapimg.width,
				height:this.largemapimg.height,
				x:-100,
				y:-150,
			}).addTo(this);
			this.largemapimg.addTo(this.largemap);
			
			if(this.height > 680)
				this.largemap.y = 0;
			
			this.largemap.mask = maskGraphics;
			
			this.setDoors();
			
			
			 
			var btny = this.height - 70;
			var stashbtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('btn_icon_10'),
				x:10,
				y:btny
			}).addTo(this);
			
			var awardbtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('btn_icon_32'),
				x:95,
				y:btny
			}).addTo(this);
			var shopdbtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('btn_icon_22'),
				x:180,
				y:btny
			}).addTo(this);
			
			var back = new Hilo.Bitmap({
				image:img,
				rect: game.configdata.getPngSize('btn_icon_08'),
				x:this.width - 70,
				y:btny
			}).addTo(this);
			back.on(Hilo.event.POINTER_START,function(e){
				if(scene.normalRect.visible)
					return;
				console.log('go back');
				game.switchScene(game.configdata.SCENE_NAMES.main);
			});
			
			stashbtn.on(Hilo.event.POINTER_START,function(){
				if(scene.normalRect.visible)
					return;
				game.switchScene(game.configdata.SCENE_NAMES.stash);
			});
			awardbtn.on(Hilo.event.POINTER_START,function(){
				if(scene.normalRect.visible)
					return;
				game.switchScene(game.configdata.SCENE_NAMES.unlock);
			});
			shopdbtn.on(Hilo.event.POINTER_START,function(){
				if(scene.normalRect.visible)
					return;
				game.switchScene(game.configdata.SCENE_NAMES.shop);
			});
			var lefttopcorner = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('mapbordertopleft'),
			}).addTo(this);
			var leftbottomcorner = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('mapborderbottomleft'),
			}).addTo(this);
			leftbottomcorner.y = this.height -leftbottomcorner.height -sheephead.height;
			var rightbottomcorner = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('mapborderbottomright'),
			}).addTo(this);
			rightbottomcorner.y = leftbottomcorner.y;
			rightbottomcorner.x = this.width -rightbottomcorner.width;
			var righttopcorner = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('mapbordertopright'),
			}).addTo(this);
			righttopcorner.x = this.width -righttopcorner.width;
			
			this.normalRect = new Hilo.Graphics();
			this.normalRect.lineStyle(1, "#000").beginFill("#000000").drawRect(0, 0, this.width, this.height).endFill();
			this.normalRect.addTo(this);
			this.normalRect.alpha = 0.6;
			this.normalRect.visible = false;
			
			var initx = 0;
			var inity = 0;
			this.on(Hilo.event.POINTER_START,function(e){
				if(scene.normalRect.visible)
					return;
				if(e.stageY > (this.y+this.height - sheephead.height))
					return;
				initx = e.stageX - scene.largemap.x;
				inity = e.stageY - scene.largemap.y;
			});
			this.on(Hilo.event.POINTER_MOVE,function(e){
				if(scene.normalRect.visible)
					return;
				if(e.stageY > (this.y+this.height - sheephead.height))
					return;
				scene.largemap.x = e.stageX - initx;
				scene.largemap.y = e.stageY - inity;
				
				scene.correctPos();
			});
			
			this.setPos();
		},
		correctPos:function(){
			if(this.largemap.x > 0)
				this.largemap.x = 0;
			if(this.largemap.y > 0)
				this.largemap.y = 0;
			if(this.largemap.x < -(this.largemapimg.width - this.width))
				this.largemap.x = -(this.largemapimg.width - this.width);
			if(this.largemap.y < -(this.largemapimg.height - this.height))
				this.largemap.y = -(this.largemapimg.height - this.height);
		},
		setPos:function(){
			var item = game.pointdata.doors[game.userData.heroData.activeDoorIndex];
			var x = item.x;
			var y = item.y;
			this.largemap.x = -x + this.width/2;
			this.largemap.y = -y + this.height/2;
			
			this.correctPos();
		},
		setDoors:function(){
			for(var i=0;i<game.userData.heroData.doorsState.length;i++){
				var item = game.userData.heroData.doorsState[i];
				var data = game.pointdata.doors[i];
				if(item.open){
					var door = new game.DoorIcon({
						name:data.name,
						icon:data.icon,
						description:data.description,
						state:item.state,
						x:data.x,
						y:data.y,
						pointIndex:data.pointDataIndex,
						doorIndex:data.doorIndex,
					});
					door.addTo(this.largemap);
				}
			}
		},
		showGate:function(door){
			this.pointgate = new game.PointGate({
				icon:door.icon,
				description:door.description,
				gateNameTxt:door.name,
			}).addTo(this);
			this.pointgate.x = this.width/2 - this.pointgate.width/2;
			this.pointgate.y = -this.pointgate.height;
			this.pointgate.doorIndex = door.doorIndex;
			this.normalRect.visible = true;
			this.pointgate.show(true);
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
		},
	});
	
	var WinoverScene = ns.WinoverScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.win,
		background:'black',
		scorePanel:null,
		bg:null,
		currentAchievementIndex:-1,
		constructor: function(properties) {
			WinoverScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.x = game.screenWidth/2 - this.width/2;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			var scene = this;
			
			this.currentAchievementIndex = data[0];
			
			var img = game.getImg('uimap');
			addDecorativeSide(img,this);
			
			this.bg = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('bg01ww'),
				alpha:0.5,
				width:this.width,
				height:this.height,
			}).addTo(this);
			this.scorePanel = new Hilo.Container({
				width:166*2,
				height:160*2,
				x:this.width/2-166,
				y:this.height/2 - 160,
			}).addTo(this);
			
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('image130'),
				scaleX:2,
				scaleY:2
			}).addTo(this.scorePanel);
			
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('image12230'),
				y:20,
				x:98,
			}).addTo(this.scorePanel);
			
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('zhanjiscore'),
				y:286,
				x:38,
			}).addTo(this.scorePanel);
			
			new game.NumFontBmp({
				txt: data[1],
				sourceImg: img,
				prefix:'bitwhitenum',
				y: 293,
				x: 98,
			}).addTo(this.scorePanel);
			
			this.checkLock();
			
			this.scorePanel.on(Hilo.event.POINTER_END,function(e){
				new Hilo.Tween.to(scene.scorePanel,{
					y:320,
					alpha:0,
				},{
					duration:300,
					onComplete:function(){
						scene.stepTwo();
					}
				})
			});
		},
		stepTwo:function(){
			var img = game.getImg('uimap');
			var scene = this;
			this.removeChild(this.scorePanel);
			this.bg.alpha = 0.1;
			var font = "14px arial";
			var txt = new Hilo.Text({
				font: font,
                color:'white',
               	lineSpacing: 10,
                width:this.width,
                height:this.height,
				text:game.pointdata.doors[game.userData.heroData.activeDoorIndex].winnote,
				y: 150,
				x: 14,
				alpha:0,
				textAlign:'center'
			}).addTo(this);
			new Hilo.Tween.to(txt,{
				alpha:1,
			},{
				duration:500,
				onComplete:function(){
					scene.on(Hilo.event.POINTER_START,function(){
						console.log('step -3');
						if(game.userData.heroData.exp > 2000){
							scene.stepThree();
						}else{
							game.switchScene(game.configdata.SCENE_NAMES.story);
						}
					});
				}
			})
		},
		stepThree:function(){
			this.off();
			var self = this;
			var img = game.getImg('uimap');
			var layer = new Hilo.Container({
				width:186*2,
				height:160*2,
				x:this.width/2-186,
				y:-320,
				visible:false,
			}).addTo(this);
			
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('bg022'),
				width:this.width,
				height:this.height
			}).addTo(layer);
			var backbtn = new game.ImgTxtBtn({
				txt:'返  回',
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'bottomback',
				disy:0,
				x:this.width - 218,
				y:this.height - 36,
			}).addTo(layer);
			backbtn.on(Hilo.event.POINTER_START,function(e){
				console.log('back to map');
				game.switchScene(game.configdata.SCENE_NAMES.story);
			});
			
			this.setFinishedAchievement(layer);
			
			var t1 = Hilo.Tween.to(layer, {
				y: 0
			}, {
				duration: 800,
				ease: Hilo.Ease.Bounce.EaseOut,
				onStart:function(){
					layer.visible = true;
				},
				onComplete: function() {
					//self.showAchievementBanner(layer,game.configdata.ACHIEVEMENTS[self.currentAchievementIndex]);
				}
			});
		},
		setFinishedAchievement:function(layer){
			for(var i=0;i<game.userData.userInfo.finishAchieve.length;i++){
				if(game.userData.userInfo.finishAchieve[i][1]){
					var item = game.userData.userInfo.finishAchieve[i][0];
					var data = game.configdata.ACHIEVEMENTS[item];
					this.createAchieve(data,layer,40,i*85 + 120);
				}
			}
		},
		createAchieve:function(achievedata,parent,x,y){
			var img = game.getImg('uimap');
			var tasklayer = new Hilo.Container({
				x:x,
				y:y,
			}).addTo(parent);
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('image159'),
				scaleX:2,
				scaleY:2
			}).addTo(tasklayer);
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(achievedata.icon),
				x:4,
				y:5
			}).addTo(tasklayer);
			var font = "14px arial";
			var txt = new Hilo.Text({
				font: font,
                color:'white',
               	lineSpacing: 10,
                width:300,
                height:60,
				text:achievedata.description,
				y: 13,
				x: 95,
			}).addTo(tasklayer);
			return tasklayer;
		},
		showAchievementBanner: function(layer,achievedata){
			var y = game.userData.userInfo.finishAchieve.length *85 + 120;
			var tasklayer = this.createAchieve(achievedata,layer,480,y);
			new Hilo.Tween.to(tasklayer,{
				x:40,
			},{
				delay:100,
				duration:150,
			});
		},
		checkLock:function(){
			var result = [];
			if(game.userData.heroData.exp > 1000){
				if(game.userData.heroData.lockdata[0] == 0){
					game.userData.heroData.unlock(0,0);
					this.addUnlockInfo(0,0);
				}
			}
			
			if(game.userData.userInfo.goldcoinNum > 16000){
				if(game.userData.heroData.lockdata[1] == 0){
					game.userData.heroData.unlock(0,1);
					this.addUnlockInfo(0,1);
				}
			}
		},
		addUnlockInfo:function(kind,index){
			var pos = kind *2 + index;
			var  lockicon = new game.LockIcon({
				x:50,
				y:80,
				pos:pos,
				state:2,
				isflash:true,
			}).addTo(this.scorePanel);
			var objdata = lockConfigdata[pos];
			var name = new game.ColorShadowText(
			{	x:130,
				y:90,
				clr:game.configdata.GAME_COLORS.btntxtclr,
				clrshadow:'black',
				txt:objdata.name,}
			).addTo(this.scorePanel);
			var note = new game.ColorShadowText(
			{	x:130,
				y:130,
				clr:game.configdata.GAME_COLORS.btntxtclr,
				clrshadow:'black',
				txt:game.configdata.GAMETXTS.lockIsReady,}
			).addTo(this.scorePanel);
		},
		deactive: function() {
			var scene = this;
			Hilo.Tween.to(this, {
					y: -this.height,
				}, {
					duration: 500,
					ease: Hilo.Ease.Back.EaseIn,
					onComplete: function() {
						console.log('main scene destory');
						scene.y = game.screenHeight / 2 - scene.height / 2;
						scene.destory();
					}
				});
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
		},
		onUpdate:function(){
			//console.log(this);
		}
	});
})(window.game);