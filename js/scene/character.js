(function(ns) {
	var Hero = ns.Hero = Hilo.Class.create({
		Extends: Hilo.Sprite,
		name: '',
		atlas: null,
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
		offsetx:-252,
		offsety:-353,
		offsetxRight:-252,
		offsetxLeft:232,
		posx:0,
		posy:0,
		jumpspeed:0,
		floory:0,
		speed:3.0,
		speedx:0,
		speedy:0,
		targetx:0,
		targety:0,
		constructor: function(properties) {
			Hero.superclass.constructor.call(this, properties);
			this.init(properties);
			this.initx = this.x;
		},
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.behit:
					if (this.framename == 'idle' || this.framename == 'petrify')
						this.exeBehit(msg.msgdata);
					else if (this.framename == 'shield')
						this.exeShield();
					else if (this.framename == 'attack' && this.currentFrame > this.attackKeyFrame)
						this.exeBehit(msg.msgdata);
					break;
			}
		},
		init: function(properties) { 
			console.log('%s init', this);
			this._frames = this.atlas.getSprite('idle');
		},
		turnleft:function(){
			this.scaleX = -1;
			this.offsetx = this.offsetxLeft;
		},
		turnright:function(){
			this.scaleX = 1;
			this.offsetx = this.offsetxRight;
		},
		
		onUpdate: function() {
			this.atLastFrame();
			if(this.framename =='jump'){
				if(Math.abs(this.posy - this.floory) < 10 && this.jumpspeed > 0){
					this.speedx = 0;
					this.speedy = 0;
					this.targetx = this.posx;
					this.targety = this.posy;
					this.switchState('idle',6);
					this.jumpspeed = 0;
				}else{
					this.jumpspeed += 1.5;
				}
				this.posy += this.jumpspeed;
				
			}
			
			if(Math.abs(this.posx -this.targetx) <5 && Math.abs(this.posy-this.targety) <5 && (this.speedx != 0 || this.speedy != 0)){
				this.posx = this.targetx;
				this.posy = this.targety;
				this.speedx = 0;
				this.speedy = 0;
				if(this.framename != 'idle')
					this.switchState('idle',5);
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
			this._frames = this.atlas.getSprite(name);
			this.interval = interval;
			this.currentFrame = 0;
			if(name != 'shield'){
				this.sendMsg(game.currentScene,game.configdata.MSAGE_TYPE.shieldfinish,'shield finished');
			}
		},
		atLastFrame: function() {
			if (this.currentFrame == this.getNumFrames() - 1) {
				switch (this.framename) {
					case 'behit':
						this.regainIdle();
						break;
					case 'attack':
						this.regainIdle();
						this.isActionFirst = true;
						break;
					case 'shield':
						this.regainIdle();
						break;
					case 'dead':
						if(!this.isdead){
							this.sendMsg(game.currentScene, game.configdata.MSAGE_TYPE.herodead, 'hero dead');
							this.isdead = true;
						}
						break;
					case 'win':
						if(!this.iswin){
							this.sendMsg(game.currentScene, game.configdata.MSAGE_TYPE.winpoint, 'hero win');
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
			var isMiss = Math.random() <= game.userData.heroData.missRatio;
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
			
			game.userData.heroData.hp -= power;
			if(game.userData.heroData.hp < 0)
				game.userData.heroData.hp = 0;
			addEffect(this,'sword1');
			getLostBlood(power,1,this.x+15,this.y+10,this.y,this.y+50).addTo(this.parent);
			this.sendMsg(game.currentScene,game.configdata.MSAGE_TYPE.changeHerohp,game.userData.heroData.hp);
			if (game.userData.heroData.hp <= 0) {
				this.switchState('dead', 4);
				this.loop = false;
				return;
			}
			var hero = this;
			Hilo.Tween.to(this, {
				x: this.initx - 5,
			}, {
				duration: 100,
				onComplete: function() {
					Hilo.Tween.to(hero, {
						x: hero.initx + 5,
					}, {
						duration: 100,
						onComplete: function() {
							//hero.iscd = false;
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
			
			this.interval = 5;
			this.x = this.initx;
		},
	});

	var Monster = ns.Monster = Hilo.Class.create({
		Extends: Hilo.Sprite,
		name: '',
		framename: '',
		atlas: null,
		initx: 0,
		iscd: false,
		hp: 200,
		isdead:false,
		sumtime: 0,
		iswin:false,
		sendcd:true,
		attackPower:20,
		hitoffsetx:0,
		hitoffsety:0,
		shieldoffsetx:0,
		shieldoffsety:0,
		attackKeyFrame:3,
		update:null,
		behit:null,
		blockidleTime:0,
		lv:1,
		isboss:false,
		constructor: function(properties) {
			Monster.superclass.constructor.call(this, properties);
			this.init(properties);
			this.initx = this.x;
		},
		init: function(properties) {
			this._frames = this.atlas.getSprite('idle');
		},
		switchState: function(name, interval) {
			this.framename = name;
			this._frames = this.atlas.getSprite(name);
			this.interval = interval;
			this.currentFrame = 0;
		},
		onUpdate: function() {
			this.update(this);
		},
		atLastFrame: function() {
			if (this.currentFrame == this.getNumFrames() - 1) {
				switch (this.framename) {
					case 'behit':
					case 'attack':
					case 'attackMagic':
					case 'shield':
					case 'relive':
						this.regainIdle();
						break;
					case 'playdead':
						this.switchState('relive',3);
						break;
					case 'dead':
						if(!this.isdead){
							this.addDeadPict(this.getFrame(this.currentFrame));
							this.sendMsg(game.currentScene,game.configdata.MSAGE_TYPE.monsterdead,'monster had dead');
 							this.removeFromParent();
						}
						this.isdead = true;
						break;
					case 'blockidle':
						this.blockidleTime+= 10;
						if(this.blockidleTime > 500){
							this.blockidleTime = 0;
							this.regainIdle();
						}
						break;
					default:
						this.regainIdle();
						break;
				}
			}
		},
		addDeadPict:function(frameinfo){
			new Hilo.Bitmap({
				image:frameinfo.image,
				rect:frameinfo.rect,
				x:this.x,
				y:this.y
			}).addTo(this.parent);
		},
		regainIdle: function() {
			this._frames = this.atlas.getSprite('idle');
			this.currentFrame = 0;
			this.framename = 'idle';
			this.iscd = false;
			this.interval = 5;
			this.x = this.initx;
			this.sendcd = true;
		},
		sendMsg: function(target, msgtype, msgdata) {
			target.receiveMsg({
				msgtype: msgtype,
				msgdata: msgdata
			});
		},
		receiveMsg: function(msg) {
			switch (msg.msgtype) {
				case game.configdata.MSAGE_TYPE.behit:
					if (this.framename == 'idle')
						this.exeBehit(msg.msgdata);
					else if (this.framename == 'shield' || this.framename == 'blockidle')
						this.exeShield();
					else if(this.framename == 'attack')
						this.exeBehit(msg.msgdata);
					break;
			}
		},
		exeBehit: function(power) {
			if(this.behit){
				this.behit(power,this);
			}
		},
		exeShield: function() {
			addEffect(this,'shield');
			var txt = new game.FlashUpText({
				x:this.x+10,
				y:this.y+10,
				text:'格挡',
				txtclr:'white'
			}).addTo(this.parent);
		}
	});
})(window.game);

function getLostBlood(n,direct,x,y,inity,floory){
	var num = new game.NumFontBmp({
		txt: n,
		sourceImg: game.getImg('uimap'),
		prefix:'rednum',
		direct:direct,
		x: x,
		y: y,
		initY:inity,
		floor:floory
	});
	num.setJumpseed();
	num.jump = true;
	return num;
}

function sendMsg(target, msgtype, msgdata){
	target.receiveMsg({
				msgtype: msgtype,
				msgdata: msgdata
			});
	}

function addEffect(body,sttype) {
	var atlas = new Hilo.TextureAtlas({
		image: game.getImg('uimap2'),
		width:1024,
		height:512,
		frames: [
			[461,682,54,76],[198,727,58,76],[396,526,57,76],[458,862,54,76],   //d_effect
			[458,940,54,76],[401,940,55,76],[462,378,54,76],[462,66,54,76],    //b_effect
			[136,946,65,65],[130,134,66,65],[130,743,66,65],[130,201,66,65],   //effect_a
			[136,878,65,66],[130,539,66,66],[130,607,66,66],[130,675,66,66],   //effect_d
		],
		sprites: {
			sword: [0, 1, 2, 3],
			sword1: [4, 5, 6, 7],
			sword2: [8, 9, 10, 11],
			shield: [12, 13, 14, 15],
		}
	});
	var effect = new Hilo.Sprite({
		frames: atlas.getSprite(sttype),
		timeBased: false,
		onUpdate: function() {
			if (this.currentFrame == this.getNumFrames() - 1) {
				this.removeFromParent();
			}
		}
	});
	if(sttype == 'shield'){
		effect.x = body.x -effect.width/2  + body.shieldoffsetx;
		effect.y = body.y -effect.height/2 + body.shieldoffsety;
	}
	if(sttype == 'sword' || sttype == 'sword1' ||sttype == 'sword2'){
		effect.x = body.x -effect.width/2  + body.hitoffsetx;
		effect.y = body.y -effect.height/2 + body.hitoffsety;
	}
	effect.addTo(body.parent);
}