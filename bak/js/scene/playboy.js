(function(ns) {
	var Playboy = ns.Playboy = Hilo.Class.create({
		Extends: Hilo.Container,
		body:null,
		name: '',
		atlas:null,
		initx: 0,
		isActionFirst:true,    //动作可能持续好多帧，每帧还会持续多个循环，这个值指示在动作的第一次发生 防止消息粘包
		framename: '',
		isdead:false,
		iswin:false,
		attackKeyFrame:2,
		hitoffsetx:32,
		hitoffsety:32,
		shieldoffsetx:50,
		shieldoffsety:32,
		petrifyTime:0,
		
		offsetx:0,
		offsety:0,
		offsetxRight:0,
		offsetxLeft:0,
		posx:0,
		posy:0,
		jumpspeed:0,
		jumpPower:-18,
		floory:0,
		speed:5.0,
		speedx:0,
		speedy:0,
		targetx:0,
		targety:0,
		ispillow:false,
		isRunaway:false,
		gravity:1.5,
		
		prop:null,
		hand:null,
		inProp:false,
		
		currentHealth:5,
		isFirstcirle:false,
		preFrame:-1,
		
		constructor: function(properties) {
			Playboy.superclass.constructor.call(this, properties);
			this.init(properties);
			this.initx = this.x;
		},
		init: function(properties) {
			console.log('%s init', this);
			this.pivotX = 78;
			this.pivotY = 282;
			this.body = new Hilo.Sprite().addTo(this);
			this.body._frames = this.atlas.getSprite('idle');
			this.body.interval = 10;
			this.nametxt = new Hilo.Text({
				text: '',
				color: '#FF00FF',
				y:-20,
			}).addTo(this);
			var img = game.getImg('uimap');
			this.prop = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngRect('empty','uimap'),
			}).addTo(this);
			this.hand = new Hilo.Bitmap({
				x:32,
				y:178,
				image:img,
				visible:false,
				rect:game.configdata.getPngRect('coverhand','uimap'),
			}).addTo(this);
		},
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.behit:
					if (this.framename == 'idle' || this.framename == 'petrify')
						this.exeBehit(msg.msgdata);
					else if (this.framename == 'shield')
						this.exeShield();
					else if (this.framename == 'attack' && this.body.currentFrame > this.attackKeyFrame)
						this.exeBehit(msg.msgdata);
					break;
			}
		},
		putProp:function(){
			this.prop.visible = this.hand.visible = this.inProp = false;
		},
		takeProp:function(propname,x,y){
			this.hand.visible = this.prop.visible = this.inProp = true;
			this.prop.x = x;
			this.prop.y = y;
			this.prop.setImage(game.getImg('uimap'),game.configdata.getPngRect(propname,'uimap'));
		},
		turnleft:function(){
			this.scaleX = -1;
			//this.offsetx = this.offsetxLeft;
		},
		turnright:function(){
			this.scaleX = 1;
			//this.offsetx = this.offsetxRight;
		},
		blockStop:function(){
			this.speedx = 0;
			this.speedy = 0;
			this.targetx = this.Playboy.posx;
			this.targety = this.Playboy.posy;
			//this.switchState('idle',6);
		},
		onUpdate: function() {
			if(this.preFrame != this.body.currentFrame){
				this.preFrame = this.body.currentFrame;
				this.isFirstcirle = true;
			}else{
				this.isFirstcirle = false;
			}
			
			
			this.atLastFrame();
			if(this.framename =='upladder'){
				if(this.isFirstcirle){
					if(this.body.currentFrame == 2 || this.body.currentFrame ==5){
						//this.posy -= 40;
					}
				}
			}
			if(this.framename =='downladder'){
				if(this.isFirstcirle){
					if(this.body.currentFrame == 2 || this.body.currentFrame ==5){
						//this.posy += 40;
					}
				}
			}
			if(this.framename =='jump'){
				this.posy += this.jumpspeed;
				if(this.posy >= this.floory){
					this.posy = this.floory;
					this.speedx = 0;
					this.speedy = 0;
					this.targetx = this.posx;
					this.targety = this.posy;
					if(this.isRunaway){
						this.switchState('run',6);
					}else{
						this.switchState('idle',6);
					}
					this.jumpspeed = 0;
				}else{
					this.jumpspeed += this.gravity;
				}
			}
			
			if(Math.abs(this.posx -this.targetx) <5 && Math.abs(this.posy-this.targety) <5 && (this.speedx != 0 || this.speedy != 0)){
				this.posx = this.targetx;
				this.posy = this.targety;
				this.speedx = 0;
				this.speedy = 0;
				if(this.framename != 'idle' && this.framename != 'handup'){
					if(this.ispillow){
						this.switchState('handup',5);
					}else{
						this.switchState('idle',5);
					}
				}
					
			}else{
				this.posx += this.speedx;
				this.posy += this.speedy;
			}
			this.x = this.posx + this.offsetx ;
			this.y = this.posy + this.offsety;
		},
		sendMsg: function(target, msgtype, msgdata) {
			target.receiveMsg({
				msgtype: msgtype,
				msgdata: msgdata
			});
		},
		shield:function(){
			if(this.framename == 'idle')
				this.switchState('shield',6);
		},
		win:function(){
			this.switchState('win',10);
		},
		switchState: function(name, interval) {
			this.framename = name;
			this.body._frames = this.atlas.getSprite(name);
			this.body.interval = interval;
			this.body.currentFrame = 0;
			if(name != 'shield'){
				this.sendMsg(game.currentScene,game.configdata.MSAGE_TYPE.shieldfinish,'shield finished');
			}
		},
		atLastFrame: function() {
			if (this.body.currentFrame == this.body.getNumFrames() - 1) {
				switch (this.framename) {
					case 'fallladder':
						this.regainIdle();
						break;
					case 'onTopladder':
						this.regainIdle();
						this.posy -= 90;
						break;
					case 'nocan':
						this.regainIdle();
						break;
					case 'downTopladder':
						this.switchState('downladder',6);
						this.speedy = 1.5;
						break;
					case 'takebackput':
						this.regainIdle();
						break;
					case 'takebackputjack':
						this.regainIdle();
						break;
					case 'handon':
						this.regainIdle();
						break;
					case 'pick':
						this.regainIdle();
						break;
					case 'dead':
						if(!this.isdead){
							this.sendMsg(game.currentScene, game.configdata.MSAGE_TYPE.Playboydead, 'Playboy dead');
							this.isdead = true;
						}
						break;
					case 'win':
						if(!this.iswin){
							this.sendMsg(game.currentScene, game.configdata.MSAGE_TYPE.winpoint, 'Playboy win');
							this.iswin = true;
						}
						break;
					case 'petrify':
						this.petrifyTime += 10;
						if(this.petrifyTime > 3550){
							this.petrifyTime = 0;
							this.regainIdle();
						}
						break;
				}
			}
		},
		exeBehit:function(msgdata){
			var isMiss = Math.random() <= game.userData.PlayboyData.missRatio;
			if(isMiss){
				var txt = new game.FlashUpText({
						x:this.x + 20,
						y:this.y+10,
						text:'闪避',
						txtclr:'yellow'
					}).addTo(this.parent);
				return;
			}
			switch(msgdata.attacktype){
				case 'attack':
					this.attackBehit(msgdata);
					break;
				case 'magic':
					this.magicBehit(msgdata);
					break;
			}
		},
		behitEffect:function(msgdata){
			
		},
		magicBehit: function(msgdata) {
			var power = msgdata.attackvalue;
			var type = msgdata.attacktype;
			this.switchState('petrify', 10);
		},
		attackBehit: function(msgdata) {
			var power = msgdata.attackvalue;
			var type = msgdata.attacktype;
			if(this.framename != 'petrify'){
				this.switchState('behit', 5);
			}
			
			game.userData.PlayboyData.hp -= power;
			if(game.userData.PlayboyData.hp < 0)
				game.userData.PlayboyData.hp = 0;
			addEffect(this,'sword1');
			getLostBlood(power,1,this.x+15,this.y+10,this.y,this.y+50).addTo(this.parent);
			this.sendMsg(game.currentScene,game.configdata.MSAGE_TYPE.changePlayboyhp,game.userData.PlayboyData.hp);
			if (game.userData.PlayboyData.hp <= 0) {
				this.switchState('dead', 4);
				this.loop = false;
				return;
			}
			var Playboy = this;
			Hilo.Tween.to(this, {
				x: this.initx - 5,
			}, {
				duration: 100,
				onComplete: function() {
					Hilo.Tween.to(Playboy, {
						x: Playboy.initx + 5,
					}, {
						duration: 100,
						onComplete: function() {
							//Playboy.iscd = false;
						}
					});
				}
			});
		},
		exeShield: function() {
			addEffect(this,'shield');
			var txt = new game.FlashUpText({
				x:this.x + 20,
				y:this.y+10,
				text:'格挡',
				txtclr:'white'
			}).addTo(this.parent);
		},
		regainIdle: function() {
			this.switchState('idle',6);
			this.body.interval = 5;
			this.x = this.initx;
		},
	});
})(window.game);

