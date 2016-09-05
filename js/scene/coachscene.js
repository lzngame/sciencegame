(function(ns) {
	var CoachScene = ns.CoachScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.coach,
		
		hand:null,
		one:false,
		two:false,
		three:false,
		
		note:null,
		
		
		topHeadPanel:null,
		attackContainer: null,
		bottomContainer: null,
		monsterHpline:null,
		attackBtn: null,
		shieldBtn: null,
		
		hero:null,
		currentMonster:null,
		pointdata:null,
		currentIndex: 0,
		
		monsterName:null,
		topHeight:null,
		attackStageHeight:null,
		lastmask:null,
		constructor: function(properties) {
			CoachScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.x = game.screenWidth / 2 - this.width / 2;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.background = '#1A0A04';
		},
		active: function(data) {
			console.log('%s active:', this.name);
			var scene = this;
			this.pointdata = {
				bgs:['bgmap_02','bgmap_03'],
				monsternames:['训练木偶','卡布奇 ']
			};
			
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			
			this.layoutBgMap();
			this.layoutUI();
			this.addHero();
			this.hero.y = this.currentIndex * this.attackStageHeight + 100;
			this.layoutBottomUI();
			this.initTouchAttack();
			this.initData();
			
			this.hand = new Hilo.Sprite({
				frames: game.configdata.getEffectFramesOne('hand'),
				x:this.attackBtn.x+10,
				y:this.attackBtn.y + 40,
				interval:80,
				alpha:0,
			}).addTo(this);
			
			var font = "14px arial";
			this.note = new Hilo.Text({
				font: font,
                color:game.configdata.GAME_COLORS.btntxtclr,
               	lineSpacing: 10,
                width:150,
                height:30,
				text: '试练',
				textAlign:'center',
				x:this.bottomContainer.x+40,
				y:370,
			}).addTo(this);
			
			this.step1();
		},
		step1:function(){
			var self = this;
			new Hilo.Tween.to(this.hand,{
				y:this.attackBtn.y + 10,
				alpha:1,
			},{
				delay:500,
				duration:300,
				onComplete:function(){
					self.note.text = '点击攻击，注意冷却时间';
					self.stop();
				}
			});
		},
		step2:function(){
			var self = this;
			
			new Hilo.Tween.to(this.hand,{
				x:this.shieldBtn.x + 10,
			},{
				delay:1000,
				duration:300,
				onComplete:function(){
					self.note.text = '点击防御，注意敌人攻击时机';
					self.stop();
				}
			});
		},
		step3:function(){
			var self = this;
			
			new Hilo.Tween.to(this.hand,{
				x:self.topHeadPanel.itemTopbox.x+30,
				y:self.topHeadPanel.itemTopbox.y+60,
			},{
				delay:1000,
				duration:300,
				onComplete:function(){
					self.note.text = '点击使用物品';
					self.stop();
				}
			});
		},
		step4:function(){
			var self = this;
			self.note.text = '开始冒险吧！';
			new Hilo.Tween.to(this.hand,{
				alpha:0,
			},{
				delay:2000,
				duration:300,
				onComplete:function(){
					game.switchScene(game.configdata.SCENE_NAMES.map);
				}
			});
		},
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.monsterdead:
					game.stage.off();
					game.switchScene(game.configdata.SCENE_NAMES.map);
					break;
				case game.configdata.MSAGE_TYPE.shieldfinish:
					this.attackBtn.continueCD();
					break;
				case game.configdata.MSAGE_TYPE.herodead:
					game.stage.off();
					game.switchScene(game.configdata.SCENE_NAMES.map);
					break;
				case game.configdata.MSAGE_TYPE.changeHerohp:
					var n = msg.msgdata;
					if(n <= 0){
						game.stage.off();
						game.switchScene(game.configdata.SCENE_NAMES.map);
					}
					this.topHeadPanel.setHealth(n);
					break;
				case game.configdata.MSAGE_TYPE.useItem:
					var index = msg.msgdata;
					var data = shopdata[index];
					if(index == 10 || index == 11){
						game.userData.coachData.hp++;
						this.topHeadPanel.setHealth(game.userData.coachData.hp);
					}
					this.step4();
					break;
				case game.configdata.MSAGE_TYPE.monseterLostHp:
					var currennthp = msg.msgdata;
					this.monsterHpline.setCurrent(currennthp);
					this.topHeadPanel.expNum.setText(game.userData.coachData.exp += 10);
					break;
			}
		},
		layoutBgMap:function(){
			this.topHeadPanel = new game.TopHeadPanel({	
				width:this.width,
			});
			this.topHeight = this.topHeadPanel.height;
			this.attackStageHeight = 212;//this.height - this.topHeight;
			var img = game.getImg('uimap');
			var imgs = this.pointdata.bgs;
			var maskGraphics = new Hilo.Graphics({
				width: this.width,
				height: this.attackStageHeight,
				y: this.topHeight
			});
			maskGraphics.lineStyle(1, "#000").beginFill("#000").drawRect(0, 0, maskGraphics.width, maskGraphics.height).endFill();

			this.attackContainer = new Hilo.Container({ 
				width: this.width,
				height: imgs.length * this.attackStageHeight,
				y:this.topHeight - this.currentIndex * this.attackStageHeight,
			}).addTo(this);
			for (var i = 0; i < imgs.length; i++) {
				var rect = game.configdata.getPngSize(imgs[i]);
				new Hilo.Bitmap({
					image: img,
					rect:rect,
					width:this.width,
					height:rect[3]*2,
					y: this.attackStageHeight * i
				}).addTo(this.attackContainer);
			}
			this.attackContainer.mask = maskGraphics;
		},
		layoutUI:function(){
			var img =  game.getImg('uimap');
			this.coinvaluebox = new game.Showbox({
				img: img,
				hidey:this.topHeadPanel.height - 68,
				showy:this.topHeadPanel.height -34,
			}).addTo(this);
			this.topHeadPanel.addTo(this);
		},
		stop:function(){
			this.hero.stop();
			this.currentMonster.stop();
		},
		play:function(){
			this.hero.play();
			this.currentMonster.play();
		},
		layoutBottomUI:function(){
			var img = game.getImg('uimap');
			var rect = game.configdata.getPngSize('monstername');
			var h = this.height - this.topHeight;
			var y = h + this.currentIndex * h;
			this.bottomContainer = new Hilo.Container({
				width: rect[2],
				height: rect[3],
				y: this.height+36,
			}).addTo(this);
			var monsternamebg = new Hilo.Bitmap({
				image: img,
				rect: rect,
				width:rect[2],
				height:rect[3]
			}).addTo(this.bottomContainer);
			
			this.bottomContainer.x = this.width / 2 - this.bottomContainer.width / 2;
			
			this.monsterHpline = new game.HpBorderLine({
				w:this.bottomContainer.width/2,
				h:15,
				x:this.bottomContainer.width/4,
				y:-17,
			}).addTo(this.bottomContainer);
			
			
			var font = "14px arial";
			this.monsterName = new Hilo.Text({
				font: font,
                color:'white',
               	lineSpacing: 10,
                width:rect[2],
                height:rect[3],
				text: '',
				textAlign:'center'
			}).addTo(this.bottomContainer);
			this.monsterName.y = 3;//this.bottomContainer.height / 2;
			this.bottomContainer.visible = true;
			this.bottomContainer.y = this.height - 36;
			this.monsterName.text = this.pointdata.monsternames[this.currentIndex];

			var btndis = 100;
			this.shieldBtn = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('defend'),
			}).addTo(this);
			this.shieldBtn.y = this.topHeight + this.attackStageHeight + 10;
			this.shieldBtn.x = this.width / 2 - this.shieldBtn.width - btndis;

			this.attackBtn = new game.AttackBtn({
				img: img,
				cdtime:game.userData.coachData.attackCd,
			}).addTo(this);
			this.attackBtn.y = this.shieldBtn.y;
			this.attackBtn.x = this.width / 2 - this.attackBtn.width / 2 + btndis;
			
			this.lastmask = new Hilo.Bitmap({
				width:this.width,
				height:this.height,
				image:img,
				rect:game.configdata.getPngSize('bg022'),
				alpha:0.3,
				visible:false
			}).addTo(this);
		},		
		initData:function(){
			this.addCharacter(20,0);
			this.topHeadPanel.initData(game.userData.coachData);
			this.monsterHpline.setValue(this.currentMonster.hp,this.currentMonster.hp);
		},
		addCharacter:function(monsterIndex,passIndex){
			if(monsterIndex < 1000){
				this.addMonster(monsterIndex,passIndex);
			}else{
				this.addNpc(monsterIndex,passIndex);
			}
		},
		addMonster:function(monsterIndex,passIndex){
			console.log('Add a monster');
			var data = game.monsterdata.monsters[monsterIndex];
			this.currentMonster = new game.Monster({
				name: 'monster',
				framename: 'idle',
				x: 180,
				y: passIndex * this.attackStageHeight +data.floory,
				atlas: game.monsterdata.getMonsterAtlas(data.index),
				once: false,
				interval: 5,
				hitoffsetx:data.hit_offsetx,
				hitoffsety:data.hit_offsety,
				shieldoffsetx:data.shield_offsetx,
				shieldoffsety:data.shield_offsety,
				attackKeyFrame:data.attackKeyFrame,
				update:data.updateFunc,
			}).addTo(this.attackContainer);
			this.currentMonster.power = 0;
			this.currentMonster.hp = 10000;
			if(data.behit != null){
				this.currentMonster.behit = data.behit;
				this.currentMonster.hatred = 0;
			}
			if(data.index == 5){
				this.currentMonster.relive = false;
			}
		},
		addNpc:function(monsterIndex,passIndex){
			game.stage.off();
			this.currentMonster = new game.Npc({
				name: 'npc',
				x: 180,
				y: passIndex * this.attackStageHeight + 30,
				frames: game.configdata.getEffectFrames('hpman'),
				interval: 5,
			}).addTo(this.attackContainer);
			this.attentionPanel.show(game.configdata.GAMETXTS.touchme);
		},
		addHero:function(){
			this.hero = new game.Hero({
				name: 'Hero',
				framename: 'idle',
				x: 80,
				y: -100,
				atlas:game.monsterdata.soliderhero_atlas,
				once: false,
				interval: 5,
				alpha:1,
			}).addTo(this.attackContainer);
			game.userData.coachData.power = 2;
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			console.log('%s destory',this.name);
			this.hero.removeFromParent();
			this.removeAllChildren();
			this.removeFromParent();
			game.stage.off();
			this.hero = null;
		},
		initTouchAttack:function(){
			var scene = this;
			game.stage.off();
			game.stage.on(Hilo.event.POINTER_START, function(e) {
				if(scene.ignoreTouch)
					return;
				console.log('touch state:attack');
				var stagex = e.stageX;
				var stagey = e.stageY;
				var posx = stagex - scene.x;
				var posy = stagey - scene.y;
				if (scene.checkoutrange(stagex, stagey)) {
					console.log('out range-- onstart:ignore move and moveend');
				} else {
					if (posx < scene.width / 2) {
						scene.hero.shield();
						if(!scene.two && scene.one){
							scene.step3();
							scene.two = true;
							scene.play();
						}
						scene.attackBtn.pause();
					} else {
						if (!scene.attackBtn.iscd) {
							scene.hero.attack();
							scene.attackBtn.startCd();
							if(!scene.one){
								scene.one = true;
								scene.step2();
								scene.play();
							}
						} else {
							scene.attackBtn.warning();
						}
					}
				}
			});
		},
		checkoutrange:function(stagex, stagey) {
			return (stagey < (this.y + this.topHeight) || stagey > (this.y + this.height) || stagex < this.x || stagex > (this.x + this.width));
		},
	});
})(window.game);