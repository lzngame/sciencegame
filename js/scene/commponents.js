(function(ns) {
	var AttackBtn = ns.AttackBtn = Hilo.Class.create({
		Extends: Hilo.Container,
		img:null,
		maskgraphics:null,
		bgimg:null,
		moveimg:null,
		iscd:false,
		cdtime:100,
		warncd:null,
		tween:null,
		constructor: function(properties) {
			AttackBtn.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var rect = game.configdata.getPngSize('atack');
			var h = rect[2];
			this.maskgraphics = new Hilo.Graphics({
			});
			this.maskgraphics.lineStyle(1, "#000").beginFill("#1A0A04").drawRect(0, 0, rect[2], rect[3]).endFill();
			this.maskgraphics.scaleY = 1;
			
			this.moveimg = new Hilo.Bitmap({
				image: this.img,
				rect: rect,
			}).addTo(this);
			this.moveimg.mask = this.maskgraphics;
			
			this.bgimg = new Hilo.Bitmap({
				image: this.img,
				rect: rect,
				alpha:0.3,
			}).addTo(this);
			
			this.warncd = new Hilo.Bitmap({
				image: game.getImg('uimap2'),
				rect:game.configdata.getPngSize2('nocd'),
				x:-60,
				y:-75,
				alpha:0,
			}).addTo(this);
		},
		startCd:function(){
			this.maskgraphics.scaleY = 0;
			this.iscd = true;
			this.resetCd();
		},
		pause:function(){
			if(this.tween){
				this.tween.pause();
			}
		},
		continueCD:function(){
			if(this.tween){
				this.tween.resume();
			}
		},
		resetCd:function(){
			var self = this;
			self.iscd = true;
			self.tween = new Hilo.Tween.to(this.maskgraphics,{
				scaleY:1,
			},{
				delay:100,
				duration:self.cdtime,
				onComplete:function(){
					self.iscd = false;
				}
			});
		},
		warning:function(){
			var self = this;
			this.warncd.alpha = 1;
			this.warncd.visible = true;
			new Hilo.Tween.to(this.warncd,{
				alpha:0,
			},{
				duration:500,
				ease: Hilo.Ease.Bounce.EaseOut,
				onComplete:function(){
					
				}
			});
		},
	});
	
	var LockIcon = ns.LockIcon = Hilo.Class.create({
		Extends: Hilo.Container,
		lockImg:null,
		contentImg:null,
		flashImg:null,
		isflash:false,
		sumtime:0,
		state:0,
		pos:null,
		constructor: function(properties) {
			LockIcon.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.width = 54;
			this.height = 60;
			var self = this;
			var img = game.getImg('uimap');
			
			this.lockImg = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('lock01'),
			}).addTo(this);
			
			var objdata = lockConfigdata[this.pos];
			var imgname =  objdata.thumbnail;// lockContentImg[this.pos[0]][this.pos[1]];
			this.contentImg = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(imgname),
				x:this.width/2 - 16,
				y:this.height/2 - 16,
				visible:false,
			}).addTo(this);
		
			this.flashImg = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('image338'),
				x:this.width/2 - 18+1,
				y:this.height/2 - 19,
				visible:false,
			}).addTo(this);
			
			this.setState();
		},
		open:function(){
			this.state  = 2;
			this.setState();
		},
		setState:function(){
			if(this.state == 0){
				this.contentImg.visible = false;
			}else if(this.state == 1){
				this.contentImg.visible = true;
			}else{
				this.contentImg.visible = true;
				this.lockImg.setImage(game.getImg('uimap'),game.configdata.getPngSize('lock03'));
			}
		},
		setFlash:function(isflash){
			if(isflash){
				this.isflash = true;
			}else{
				this.isflash = false;
				this.flashImg.visible = false;
			}
		},
		onUpdate:function(){
			if(!this.isflash)
				return;
			if(this.sumtime <300){
				this.flashImg.visible = true;
			}else{
				this.flashImg.visible = false;
			}
			this.sumtime += game.clock.fpstick;
			if(this.sumtime >= 300 * 2){
				this.sumtime = 0;
			}
		},
	});
	
	//头像控件 -- 有生命值
	var TopHeadPanel = ns.TopHeadPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		headImg:null,
		headImgUrl:null,
		healthValue:3,
		healthIcon:'',
		expNum:null,
		powerNum:null,
		nimbleNum:null,
		equipTopbox:null,
		itemTopbox:null,
		currentItembox:null,
		magicContainer:null,
		hpContainer:null,
		checkBag:null,
		constructor: function(properties) {
			TopHeadPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('topheadpanel init');
			var self = this;
			var img = game.getImg('uimap');
			this.headImg = new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngRect(this.headImgUrl,'uimap'),
				width:64,
				height:64
			}).addTo(this);
			
			this.hpContainer = new Hilo.Container({
				x:75,
				y:5,
			}).addTo(this);
			
			this.setHealth(3);
		},
		setHealth: function(n) {
			this.hpContainer.removeAllChildren();
			var img = game.getImg('uimap');
			for (var i = 0; i < n; i++) {
				new Hilo.Bitmap({
					image: img,
					rect: game.configdata.getPngRect(this.healthIcon,'uimap'),
					x: i * 64 + 4,
					y:2
				}).addTo(this.hpContainer);
			}
		},
	});
	
	var DoorIcon = ns.DoorIcon = Hilo.Class.create({
		Extends: Hilo.Container,
		state:0,
		pointIndex:-1,
		name:'',
		doorIndex:-1,
		icon:'',
		description:'',
		constructor: function(properties) {
			DoorIcon.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var img = game.getImg('uimap');
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(game.pointdata.door_state2pic[this.state]),
			}).addTo(this);
			var font = "14px arial";
			new Hilo.Text({
                	font: font,
                	color:'black',
                	text: this.name,
               		lineSpacing: 10,
                	width:100,
                	height:30,
                	textAlign:'center',
               		textVAlign:'middle',
                	y: 35,
                	x:-35,
           		 }).addTo(this);
           	new Hilo.Text({
                	font: font,
                	color:'white',
                	text: this.name,
               		lineSpacing: 10,
                	width:100,
                	height:30,
                	textAlign:'center',
               		textVAlign:'middle',
                	y: 36,
                	x:-34,
           		 }).addTo(this);
			
			this.on(Hilo.event.POINTER_START,function(e){
				this.parent.parent.showGate(this);
			});
		},
	});
	
	var GoodsIcon = ns.GoodsIcon = Hilo.Class.create({
		Extends: Hilo.Container,
		price:0,
		img:'',
		name:'',
		index:-1,
		description:'',
		buybtn:null,
		background:'white',
		constructor: function(properties) {
			GoodsIcon.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var img = game.getImg('uimap');
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(this.img),
			}).addTo(this);
			
			var font = "14px arial";
			new Hilo.Text({
                	font: font,
                	color:'white',
                	text: this.name,
               		lineSpacing: 10,
                	width:60,
                	height:20,
                	y:70,
                	x:2
           		 }).addTo(this);
			
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('coin_01'),
				x:2,
				y:92,
				width:16,
				height:16
			}).addTo(this);
			
			new game.NumFontBmp({
				txt: this.price.toString(),
				sourceImg: img,
				y:94,
				x:22,
			}).addTo(this);
		},
	});
	
	var HpLine = ns.HpLine = Hilo.Class.create({
		Extends: Hilo.Container,
		totalValue:0,
		currentValue:0,
		hpBg:null,
		hpContainer:null,
		constructor: function(properties) {
			HpLine.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var img = game.getImg('uimap');
			this.hpBg = new Hilo.Container({
			}).addTo(this);
			this.hpContainer = new Hilo.Container({
			}).addTo(this);
			this.setTotal(this.totalValue);
			this.setCurrent(this.currentValue);
		},
		setTotal: function(n) {
			this.hpBg.removeAllChildren();
			var img = game.getImg('uimap');
			for (var i = 0; i < n; i++) {
				new Hilo.Bitmap({
					image: img,
					rect: game.configdata.getPngSize('blackheart'),
					x: i * 20
				}).addTo(this.hpBg);
			}
		},
		setCurrent: function(value) {
			this.hpContainer.removeAllChildren();
			var n = Math.floor(value /10.0);
			var img = game.getImg('uimap');
			for (var i = 0; i < n; i++) {
				new Hilo.Bitmap({
					image: img,
					rect: game.configdata.getPngSize('heart'),
					x: i * 20
				}).addTo(this.hpContainer);
			}
		},
	});
	
	var StoreIcon = ns.StoreIcon = Hilo.Class.create({
		Extends: Hilo.Container,
		price:0,
		img:'',
		name:'',
		description:'',
		buybtn:null,
		background:'white',
		storepos:-1,
		index:-1,
		constructor: function(properties) {
			StoreIcon.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var img = game.getImg('uimap');
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(this.img),
			}).addTo(this);
			
			new game.NumFontBmp({
				txt:'5',
				sourceImg: img,
				y:50,
				x:50,
			}).addTo(this);
		},
	});
	
	var SurePanel = ns.SurePanel = Hilo.Class.create({
		Extends: Hilo.Container,
		goodsimg:'',
		name:'',
		price:-1,
		okbtn:null,
		backbtn:null,
		txt1:'note1',
		txt2:'note2',
		titletxt:'',
		note01:null,
		note02:null,
		constructor: function(properties) {
			SurePanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var img = game.getImg('uimap');
			var bg = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('image252'),
			}).addTo(this);
			this.width = bg.width;
			this.height = bg.height;
			//this.scaleX = 0.3;
			//this.scaleY = 0.5;
			this.pivotX = bg.width/2;
			this.pivotY = bg.height/2;
			
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(this.goodsimg),
				x:25,
				y:60,
			}).addTo(this);
			
			var font = "14px arial"; 
			this.note01 = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: this.txt1,
               		lineSpacing: 10,
                	width:60,
                	height:20,
                	y:60,
                	x:100
           		 }).addTo(this);
           	this.note02 = new Hilo.Text({
                	font: font,
                	color:'white',
                	text:this.txt2,
               		lineSpacing: 10,
                	width:60,
                	height:20,
                	y:105,
                	x:100
           		 }).addTo(this);
           		 
           	new Hilo.Text({
                	font: font,
                	color:'black',
                	text: this.titletxt,
               		lineSpacing: 10,
                	width:140,
                	height:20,
                	y:7,
                	x:80,
                	textAlign:'center'
           		 }).addTo(this);
           		 
           	this.okbtn = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('okbtn'),
				x:this.width/2 - 36 - 60,
				y:140,
			}).addTo(this);
			
			this.backbtn = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('cancelbtn'),
				x:this.width/2 - 36 + 60,
				y:140,
			}).addTo(this);
		}
	});
	
	var GoodsExePanel = ns.GoodsExePanel = Hilo.Class.create({
		Extends: Hilo.Container,
		goodsimg:'',
		okbtn:null,
		backbtn:null,
		titletxt:'',
		txt1:'',
		txt2:'',
		note1:null,
		note2:null,
		constructor: function(properties) {
			GoodsExePanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var img = game.getImg('uimap');
			var bg = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('image252'),
			}).addTo(this);
			this.width = bg.width;
			this.height = bg.height;
			this.pivotX = bg.width/2;
			this.pivotY = bg.height/2;
			
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(this.goodsimg),
				x:25,
				y:60,
			}).addTo(this);
			
			var font = "14px arial"; 
			this.note1 = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: this.txt1,
               		lineSpacing: 10,
                	width:60,
                	height:20,
                	y:60,
                	x:100
           		 }).addTo(this);
           	this.note2 = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: this.txt2,
               		lineSpacing: 10,
                	width:60,
                	height:20,
                	y:105,
                	x:100
           		 }).addTo(this);
           		 
           	new Hilo.Text({
                	font: font,
                	color:'black',
                	text: this.titletxt,
               		lineSpacing: 10,
                	width:140,
                	height:20,
                	y:7,
                	x:80,
                	textAlign:'center'
           		 }).addTo(this);
           		 
           	this.okbtn = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('okbtn'),
				x:this.width/2 - 36 - 60,
				y:140,
			});
			
			this.putbagBtn =	new game.ImgTxtBtn({
				txt:game.configdata.GAMETXTS.putbag,
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'btnbgline',
				disy:-2,
				x:this.width/2 - game.configdata.getPngSize('btnbgline')[2]/2 - 80,
				y:this.height - 20,
			}).addTo(this);
			
			this.throwBtn =	new game.ImgTxtBtn({
				txt:game.configdata.GAMETXTS.throwitem,
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'btnbgline',
				disy:-2,
				x:this.width/2 - game.configdata.getPngSize('btnbgline')[2]/2 + 75,
				y:this.height - 20
			}).addTo(this);
			
			this.backbtn = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('image2123'),
				x:this.width - 60,
				y:5,
			}).addTo(this);
			
		}
	});
	
	var HpBorderLine = ns.HpBorderLine = Hilo.Class.create({
		Extends: Hilo.Container,
		clr:'red',
		totalValue:null,
		currentValue:null,
		bgimg:null,
		hpimg:null,
		w:0,
		h:0,
		innerImg:null,
		constructor: function(properties) {
			HpBorderLine.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var img = game.getImg('uimap');
			
			new Hilo.Bitmap({
				image:img,
				rect: game.configdata.getPngSize('greenbtn01'),
				width:this.w,
				height:this.h,
			});//.addTo(this);
			
			this.innerImg = new Hilo.Bitmap({
				image:img,
				rect: game.configdata.getPngSize('bluebtn01'),
				width:this.w,
				height:this.h,
			}).addTo(this);
			
			this.bgimg = new Hilo.Bitmap({
				image:img,
				rect: game.configdata.getPngSize('uihead03'),
				width:this.w+10,
				height:this.h,
				x:-3,
			}).addTo(this);
			
			this.setValue(this.totalValue,this.currentValue);
		},
		setCurrent:function(value){
			this.setValue(this.totalValue,value);
		},
		setValue:function(total,current){
			this.totalValue = total;
			if(current > total)
				current = total;
			this.currentValue = current;
			var wHpScale = (this.currentValue/this.totalValue);
			this.innerImg.width = this.w * wHpScale;
		},
	});
	
	
	var ImgTxtBtn = ns.ImgTxtBtn = Hilo.Class.create({
		Extends: Hilo.Container,
		rectname:'',
		txt:'',
		disy:0,
		disx:0,
		txtclr:'white',
		onfunc:null,
		data:null,
		bgalpha:1,
		btntxt1:null,
		btntxt2:null,
		constructor: function(properties) {
			ImgTxtBtn.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var img = game.getImg('uimap');
			this.bgimg = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(this.rectname),
				alpha:this.bgalpha,
			}).addTo(this);
			this.width = this.bgimg.width;
			this.height = this.bgimg.height;
			var font = "15px arial";
			this.btntxt1 = new Hilo.Text({
                	font: font,
                	color:'black',
                	text: this.txt,
               		lineSpacing: 10,
                	width:this.bgimg.width,
                	textAlign:'center',
                	textVAligh:'bottom',
                	maxWidth:this.bgimg.width,
           		 }).addTo(this);
           	this.btntxt2 = new Hilo.Text({
                	font: font,
                	color:this.txtclr,
                	text: this.txt,
               		lineSpacing: 10,
                	width:this.bgimg.width,
                	textAlign:'center',
                	textVAligh:'bottom',
                	maxWidth:this.bgimg.width,
           		 }).addTo(this);
           	this.btntxt2.y = this.height/2 - this.btntxt2._fontHeight/2 + this.disy;
           	this.btntxt2.x += this.disx;
           	this.btntxt1.y = this.btntxt2.y+1;
           	this.btntxt1.x = this.btntxt2.x+1;
		},
		setText:function(txt){
			this.btntxt1.text = txt;
			this.btntxt2.text = txt;
		},
		setBgAlpha:function(a){
			this.bgimg.alpha = a;
		}
	});
	
	var NumFontBmp = ns.NumFontBmp = Hilo.Class.create({
		Extends: Hilo.Container,
		txt:'',
		sourceImg:null,
		jump:false,
		g:1,
		initSpeedX:1,
		prefix:'whitenum',
		initSpeedY:3,
		speedX:1,
		speedY:3,
		floor:0,
		once:1,
		onlyRight:false,
		onlyLeft:false,
		direct:-1,              //right
		constructor: function(properties) {
			NumFontBmp.superclass.constructor.call(this, properties);
			this.init(properties);
			this.setText(this.txt);
		},
		
		setText:function(n){
			var img = this.sourceImg;
			if(typeof(n)=='number')
				this.txt = n.toString();
			else
				this.txt = n;
			var initx = 0;
			this.removeAllChildren();
			for(var i=0;i<this.txt.length;i++){
				var st = this.txt[i];
				var name = this.prefix+st;
				if(st == '+')
					name = this.prefix+'add';
				var rect = game.configdata.getPngSize(name);
				var numindex = new Hilo.Bitmap({
					image:img,
					rect:rect,
					x:initx+i*2,
 				}).addTo(this);
 				initx += rect[2];
			}
		},
		init: function(properties) {
			this.setText(this.txt);
		},
		setJumpseed:function(){
			var xspeed = (Math.random()+0.5)*this.direct;
			var yspeed = Math.random()*2+1;
			this.initSpeedX = this.speedX = xspeed;
			this.initSpeedY = this.speedY = yspeed;
		},
		onUpdate:function(){
			if(this.jump){
				this.x -= this.speedX;
				this.speedY -= this.g/4;
				this.y -= this.speedY;
				if(this.y >= this.floor){
					this.y = this.floor;
					this.once++;
					//var yspeed = (this.initSpeedY-=0.5);
					//var xspeed = (this.initSpeedX-=0.3);
					var yspeed = this.initSpeedY/this.once;
					var xspeed = this.initSpeedX/this.once;
					if(xspeed < 0.1 || yspeed < 0.1){
						this.jump = false;
						var num = this;
						new Hilo.Tween.to(num,{
							alpha:0
						},{
							duration:300,
							ease: Hilo.Ease.Bounce.EaseOut,
							onComplete: function() {
								num.removeFromParent();
							}
						});
					}else{
						this.speedY = yspeed;
						this.speedX = xspeed;
					}
				}
			}
		}
	});
	
	var JumpCoin = ns.JumpCoin = Hilo.Class.create({
		Extends: Hilo.Sprite,
		jump:false,
		g:0.7,
		onlyRight:false,
		onlyLeft:false,
		initSpeedX:2,
		initSpeedY:4,
		speedX:2,
		speedY:4,
		once:1,
		floor:0,
		constructor: function(properties) {
			JumpCoin.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
		},
		setJumpseed:function(){
			var direct = 1;
			if(Math.random() > 0.5)
				direct = -1;
			if(this.onlyLeft)
				direct = 1;
			if(this.onlyRight)
				direct = -1;
			var xspeed = (Math.random()+1.5)*direct;
			var yspeed = Math.random()*2+3;
			this.initSpeedX = this.speedX = xspeed;
			this.initSpeedY = this.speedY = yspeed;
		},
		onUpdate:function(){
			if(this.jump){
				this.x -= this.speedX;
				this.speedY -= this.g/4;
				this.y -= this.speedY;
				if(this.y >= this.floor){
					this.y = this.floor;
					this.once++;
					var yspeed = this.initSpeedY/this.once;
					var xspeed = this.initSpeedX/this.once;
					if(xspeed < 0.5 || yspeed < 0.5){
						this.jump = false;
						var coin = this;
						var scene = coin.parent.parent;
						var targety = scene.currentIndex * scene.attackStageHeight + scene.topHeight - 170;
						var targetx = 5;
						var durationtime = Math.ceil(Math.random()*200) + 400;
						new Hilo.Tween.to(coin,{
							x:targetx,
							y:targety,
						},{
							duration:durationtime,
							onComplete: function() {
								game.currentScene.coinvaluebox.addOneCoin(game.userData.userInfo.goldcoinNum);
								coin.removeFromParent();
							}
						});
					}else{
						this.speedY = yspeed;
						this.speedX = xspeed;
					}
				}
			}
		}
	});
	
	var Goldbox = ns.Goldbox = Hilo.Class.create({
		Extends: Hilo.Sprite,
		constructor: function(properties) {
			Goldbox.superclass.constructor.call(this, properties);
			this.init(properties);
			this.interval = 10;
		},
		init: function(properties) {
		},
		open:function(){
			this._frames = game.configdata.getEffectFrames('boxopen');
			this.loop = false;
		},
		onUpdate:function(){
			if (this.currentFrame > 0 && this.currentFrame == this.getNumFrames() - 1) {
				var frame = this.getFrame(this.currentFrame);
				new Hilo.Bitmap({
					image:frame.image,
					rect:frame.rect,
					x:this.x,
					y:this.y
				}).addTo(this.parent);
				this.removeFromParent();
			}
		}
	});
	
	var IconNum = ns.IconNum = Hilo.Class.create({
		Extends:Hilo.Container,
		icon:'',
		numtxt:null,
		num:0,
		disy:0,
		scale:1,
		sourceImg:null,
		constructor:function(properties){
			IconNum.superclass.constructor.call(this,properties);
			this.init(properties);
		},
		init:function(properties){
			var rect = game.configdata.getPngSize(this.icon);
			new Hilo.Bitmap({
				image:this.sourceImg,
				rect:rect,
				scaleX:this.scale,
				scaleY:this.scale,
			}).addTo(this);
			this.numtxt = new game.NumFontBmp({
				x:rect[2]*this.scale,
				y:this.disy,
				txt:this.num,
				sourceImg:this.sourceImg,
				scaleX:this.scale,
				scaleY:this.scale,
			}).addTo(this);
		},
		setText:function(n){
			this.numtxt.setText(n);
		}
	});
	
	var PointGate = ns.PointGate = Hilo.Class.create({
		Extends: Hilo.Container,
		icon:'',
		description:'',
		herosprite:null,
		data:null,
		gateNameTxt:'',
		doorIndex:-1,
		constructor: function(properties) {
			PointGate.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this);
			var img = game.getImg('uimap');
			var bg = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('entergate'),
			}).addTo(this);
			this.width = bg.width;
			this.height = bg.height;
			
			var backbtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('image346'),
				x:30,
				y:265
			}).addTo(this);
			backbtn.on(Hilo.event.POINTER_START,function(){
				this.parent.hide();
			});
			
			var gobtn = new game.ImgTxtBtn({
				txt:game.configdata.GAMETXTS.enterpass,
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'image271',
				disy:-2,
				x:110,
				y:265
			}).addTo(this);
			gobtn.on(Hilo.event.POINTER_START,function(){
				game.switchScene(game.configdata.SCENE_NAMES.attack,this.parent.doorIndex);
			});
			
			var gateimg = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize(this.icon),
				x:26,
				y:42
			}).addTo(this);
			
			var atlas = new Hilo.TextureAtlas({
				image: game.getImg('soliderhero'),
				width: 496 * 2,
				height: 364 * 2,
				frames: [
					[2, 2, 64, 64],
					[68, 2, 64, 64],
					[134, 2, 64, 64],
					[200, 2, 64, 64],
					[266, 2, 64, 64],
					[2, 68, 64, 64],
					[68, 68, 64, 64],
				],
				sprites: {
					idle: {	from: 1,to: 4}
				}
			});
			
			 var hero = new Hilo.Sprite({
                frames: atlas.getSprite('idle'),
                x: 135,
                y: 190,
                interval: 6,
                timeBased: false,
                loop: true,
            }).addTo(this);


			
			var font = "14px arial";
            var content = "关卡名称";

            //text view
            this.gateNameTxt = new Hilo.Text({
                font: font,
                color:'white',
                text: this.gateNameTxt,
                lineSpacing: 10,
                width: 100,
                height: 30,
                x: 40,
                y: 10,
                textAlign:'center'
            }).addTo(this);
            
            new Hilo.Text({
                font: font,
                color:game.configdata.GAME_COLORS.btntxtclr,
                text: this.description,
                lineSpacing: 10,
                width: 80,
                height: 100,
                x: 160,
                y: 60,
            }).addTo(this);
		},
		setName:function(txt){
			this.gateNameTxt.text = txt;
		},
		show:function(){
			var box = this;
			var targety = this.parent.height/2 - box.height/2 - 50;
			Hilo.Tween.to(box,{
					y:targety,
				},{
					duration:200,
				});
		},
		hide:function(){
			var box = this;
			box.parent.normalRect.visible = false;
			Hilo.Tween.to(box,{
					y:this.height,
				},{
					duration:100,
					onComplete:function(){
						box.visible = false;
						box.y = -box.height;
						box.removeFromParent();
					}
				});
		}
	});
	
	var AbilitySumPanel = ns.AbilitySumPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		constructor: function(properties) {
			AbilitySumPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this);
			var img = game.getImg('uimap');
			var panel = this;
			var bg = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('image276'),
			}).addTo(this);
			this.width = bg.width;
			this.height = bg.height;
			
			var hpbtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('btn_icon_01'),
				x:130,
				y:146
			}).addTo(this);
			var attackbtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('btn_icon_03'),
				x:207,
				y:60
			}).addTo(this);
			var magicbtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('btn_icon_04'),
				x:207,
				y:218
			}).addTo(this);
			var agilitybtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('btn_icon_02'),
				x:290,
				y:146
			}).addTo(this);
			
			var font = "14px arial";
            //text view
            var hptxt = new game.NumFontBmp({
            	txt: game.userData.heroData.hp,
				sourceImg: img,
				x: 203,
				y: 175,
            }).addTo(this);
            
            var attacktxt = new game.NumFontBmp({
            	txt: game.userData.heroData.power,
				sourceImg: img,
				x: 230,
				y: 150,
            }).addTo(this);
            
            var magictxt = new game.NumFontBmp({
            	txt: game.userData.heroData.magic,
				sourceImg: img,
				x: 230,
				y: 200,
            }).addTo(this);
            
            var nimbletxt = new game.NumFontBmp({
            	txt: game.userData.heroData.nimble,
				sourceImg: img,
				x: 257,
				y: 175,
            }).addTo(this);
			
			
			hpbtn.on(Hilo.event.POINTER_START,function(){
				game.userData.heroData.hp += 10;
				if(game.userData.heroData.hp > game.userData.heroData.totalhp)
				    game.userData.heroData.hp = game.userData.heroData.totalhp;
				panel.hide();
			});
			agilitybtn.on(Hilo.event.POINTER_START,function(){
				game.userData.heroData.nimble += 1;
				panel.hide();
			});
			magicbtn.on(Hilo.event.POINTER_START,function(){
				game.userData.heroData.magic += 1;
				panel.hide();
			});
			attackbtn.on(Hilo.event.POINTER_START,function(){
				game.userData.heroData.power += 5;
				panel.hide();
			});
		},
		hide:function(){
			this.parent.lastmask.visible = false;
			this.parent.topHeadPanel.refresh();
			this.removeFromParent();
		},
		addProp:function(type){
			game.userData.heroData.hp += 2;
		},
	});
	
	
	var Showbox = ns.Showbox = Hilo.Class.create({
		Extends: Hilo.Container,
		img:null,
		coinbmpnum:null,
		boxbmpnum:null,
		coinvalue:0,
		boxvalue:0,
		
		bg:null,
		hidey:22,
		showy:58,
		sumtime:0,
		showtime:2500,
		isshow:false,
		currentNum:20,
		targetNum:20,
		setNumtime:90,
		setNumtimeSum:0,
		changenum:false,
		nohide:false,
		constructor: function(properties) {
			Showbox.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this);
			this.bg = new Hilo.Bitmap({
				image:this.img,
				rect:game.configdata.getPngSize('box98'),
			}).addTo(this);
			this.coinbmpnum = new game.NumFontBmp({txt:this.coinvalue,sourceImg:game.getImg('uimap'),x:35,y:43}).addTo(this);
			this.boxbmpnum = new game.NumFontBmp({txt:this.boxvalue,sourceImg:game.getImg('uimap'),x:35,y:13}).addTo(this);
			this.y = this.hidey;
		},
		setCoinValue:function(n){
			this.coinvalue = n;
			this.coinbmpnum.setText(n);
		},
		setBoxValue:function(n){
			this.boxvalue = n;
			this.boxbmpnum.setText(n);
		},
		
		addOneCoin:function(target){
			this.coinvalue++;
			this.coinbmpnum.setText(this.coinvalue);
			if(this.coinvalue == target){
				this.hide(1500);
			}
		},
		show:function(hide){
			var box = this;
			Hilo.Tween.to(box,{
					y:box.showy,
				},{
					duration:300,
					onComplete:function(){
						box.isshow= true;
					}
				});
		},
		hide:function(delay){
			var box = this;
			Hilo.Tween.to(box,{
					y:box.hidey,
				},{
					duration:300,
					delay:delay,
					onComplete:function(){
					}
				});
		},
		add:function(n){
			this.changenum = true;
			this.targetNum = this.currentNum + n;
		},
	});
	
	var AttentionPanel = ns.AttentionPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		txt:null,
		inity:-1,
		visible:false,
		constructor: function(properties) {
			AttentionPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this);
			var rect = game.configdata.getPngSize('bottomline');
			var bg = new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:rect,
				width:rect[2],
				height:rect[3]
			}).addTo(this);
			var font = "14px arial";
			this.txt = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: '',
               		lineSpacing: 10,
                	width: bg.width,
                	height: bg.height,
               		textAlign:'center',
           		 }).addTo(this);
           	this.height = bg.height;
		},
		show:function(txt){
			if(this.visible)
				return;
			this.txt.text = txt;
			var panel = this;
			var targety = this.inity + this.height;
			new Hilo.Tween.to(this,{
				y:targety,
			},{
				duration:400,
				onStart:function(){
					panel.visible = true;
					console.log('onStart');
				},
				onComplete:function(){
					var targety = panel.inity;
					new Hilo.Tween.to(panel,{
						y:targety
					},{
						delay:1500,
						duration:300,
						onComplete:function(){
							panel.visible = false;
						}
					})
				}
			});
		}
	});
	
	var FpsPanel = ns.FpsPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		txt:null,
		constructor: function(properties) {
			FpsPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var rect = game.configdata.getPngSize('btnbgline');
			var bg = new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:rect,
				width:rect[2],
				height:rect[3],
			}).addTo(this);
			var font = "16px arial";
			this.txt = new Hilo.Text({
                	font: font,
                	color:'yellow',
                	text: '',
               		lineSpacing: 10,
                	width: bg.width,
                	height: bg.height,
               		textAlign:'center',
               		textVAlign:'middle',
               		y:6
           		 }).addTo(this);
		},
		onUpdate:function(){
			this.txt.text = game.clock.fpstick.toString()+':'+game.ticker.getMeasuredFPS();
		}
	});
	
	var FlashtxtPanel = ns.FlashtxtPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		txt:null,
		inity:-1,
		initx:-1,
		constructor: function(properties) {
			FlashtxtPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this);
			var bg = new Hilo.Bitmap({
				image:game.getImg('uimap'), 
				rect:game.configdata.getPngSize('image252'),
			}).addTo(this);
			var font = "14px arial";
			new Hilo.Text({
                	font: font,
                	color:'black',
                	text: game.configdata.GAMETXTS.titletxt_flash,
               		lineSpacing: 10,
                	width:140,
                	height:20,
                	y:7,
                	x:80,
                	textAlign:'center'
           		 }).addTo(this);
			this.txt = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: '',
               		lineSpacing: 10,
                	width: bg.width,
                	height: bg.height,
               		textAlign:'center',
               		textVAlign:'middle',
               		y:18 
           		 }).addTo(this);
           	this.height = bg.height;
           	this.inity = this.y;
           	this.initx = this.x;
           	this.pivotX = bg.width/2;
           	this.pivotY = bg.height/2;
		},
		show:function(txt,clr,showtime){
			if(clr)
				this.txt.color = clr;
			var time = 1000;
			if(showtime)
				time = showtime;
			this.txt.text = txt;
			this.visible = true;
			var panel = this;
			var targety = this.y + this.height;
			new Hilo.Tween.to(panel,{
				scaleX:0.1,
				scaleY:0.1
			},{
				delay:time,
				duration:100,
				onComplete:function(){
					panel.visible = false;
				}
			});
		}
	});
	
	var ColorShadowText = ns.ColorShadowText = Hilo.Class.create({
		Extends: Hilo.Container,
		clr:'white',
		clrshadow:'black',
		txt:'shadow',
		constructor: function(properties) {
			ColorShadowText.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var self = this;
			var font = "14px arial";
			new Hilo.Text({
                	font: font,
                	color:this.clrshadow,
                	text: this.txt,
               		lineSpacing: 10,
                	width:this.width,
                	height:this.height,
                	textAlign:'center',
               		textVAlign:'middle',
           		 }).addTo(this);
           	new Hilo.Text({
                	font: font,
                	color:this.clr,
                	text: this.txt,
               		lineSpacing: 10,
                	width:this.width,
                	height:this.height,
                	textAlign:'center',
               		textVAlign:'middle',
           		 }).addTo(this);
		},
	});
})(window.game);