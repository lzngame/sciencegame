(function(ns) {
	
	var ActiveObject = ns.ActiveObject = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'',
		img:null,
		state:0,
		status:0,    //0 未激活 1激活 2完成
		readyImgUrl:'',
		finishedImgUrl:'',
		targetx:0,
		targety:0,
		initimg:true,
		clickArea:[0,0,0,0],
		constructor: function(properties) {
			ActiveObject.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			if(this.readyImgUrl.indexOf('.') == -1){
				this.img = new Hilo.Bitmap({
					image: game.getImg('uimap'),
					rect:game.configdata.getPngRect(this.readyImgUrl,'uimap'),
				}).addTo(this);
			}else{
				this.img = new Hilo.Bitmap({
					image:this.readyImgUrl
				}).addTo(this);
			}
			
			var x = this.clickArea[0];
			var y = this.clickArea[1];
			var w = this.clickArea[2];
			var h = this.clickArea[3];
			if(game.configdata.NOLINE){
					var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
					g.lineStyle(1,"#00f").drawRect(0,0,w,h).endFill().addTo(this);
					var t = new Hilo.Graphics({width:3,height:3,x:this.targetx,y:this.targety});
					t.lineStyle(1,"#f00").drawRect(0,0,3,3).endFill().addTo(this);
				}
		},
		setInitImg:function(){
			var rect = game.configdata.getPngRect(this.readyImgUrl,'uimap');
			this.img.setImage(game.getImg('uimap'),rect);	
			this.img.x = 0;
			this.img.y = 0;
			this.initimg = true;
		},
		setEndImg:function(x,y){
			var rect = game.configdata.getPngRect(this.finishedImgUrl,'uimap');
			this.img.setImage(game.getImg('uimap'),rect);	
			this.img.x = x;
			this.img.y = y;
			this.initimg = false;
		},
		remove:function(){
			this.removeFromParent();
			this.status = 2;
			game.sounds.play(12,false);
		},
		onUpdate:function(){
			
		},
	});
	
	//头像控件 -- 有生命值
	var TopHeadPanel = ns.TopHeadPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		headImg:null,
		headImgUrl:null,
		healthValue:0,
		healthIcon:'',
		healthIconBlack:'',
		expNum:null,
		powerNum:null,
		nimbleNum:null,
		equipTopbox:null,
		itemTopbox:null,
		currentItembox:null,
		magicContainer:null,
		hpContainer:null,
		checkBag:null,
		interval:0,
		fpstime:5,
		isSayNo:false,
		isSayYes:false,
		index:0,
		constructor: function(properties) {
			TopHeadPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('topheadpanel init');
			var self = this;
			var img = game.getImg('uimap');
			new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngRect('headbg','uimap'),
			}).addTo(this);
			this.headImg = new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngRect(this.headImgUrl,'uimap'),
				x:7,
				y:5
			}).addTo(this);
			
			this.hpContainer = new Hilo.Container({
				x:130,
				y:50,
			});
			
			this.setHp(0);
		},
		setHp: function(n) {
			this.hpContainer.removeAllChildren();
			var img = game.getImg('uimap');
			for (var i = 0; i < this.healthValue; i++) {
				new Hilo.Bitmap({
					image: img,
					rect: game.configdata.getPngRect(this.healthIconBlack,'uimap'),
					x: i * 30,
					y:2
				}).addTo(this.hpContainer);
			}
			for (var i = 0; i < n; i++) {
				new Hilo.Bitmap({
					image: img,
					rect: game.configdata.getPngRect(this.healthIcon,'uimap'),
					x: i * 30 ,
					y:2
				}).addTo(this.hpContainer);
			}
		},
		sayNo:function(){
			this.isSayNo = true;
			this.isSayYes = false;
			game.sounds.play(18,false);
		},
		sayYes:function(nosound){
			this.isSayNo = false;
			this.isSayYes = true;
			if(!nosound)
			   game.sounds.play(11,false);
		},
		onUpdate:function(){
			if(this.isSayNo || this.isSayYes){
				var frames = ['headok01','headok02'];
				if(this.isSayNo){
					frames = ['headfail0','headfail1','headfail2','headfail3'];
				}
				if(this.interval > this.fpstime){
					this.interval = 0;
					this.index++;
					if(this.index > frames.length-1){
						this.index = 0;
						this.isSayNo = false;
						this.isSayYes = false;
						this.headImg.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.headImgUrl,'uimap'));
					}
					this.headImg.setImage(game.getImg('uimap'),game.configdata.getPngRect(frames[this.index],'uimap'));
				}else{
						this.interval++;
				}
			}
		},
	});
	
	
	
	
	
	var FingerMouse = ns.FingerMouse = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'',
		index:-1,
		defaulticonname:'hand_001',
		img:null,
		active:false,
		constructor: function(properties) {
			FingerMouse.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.defaulticonname,'uimap'),
			}).addTo(this);
		},
		setDefault:function(){
			this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.defaulticonname,'uimap'));
			this.index = -1;
		},
		setCurrent:function(index){
			this.active = true;
			var item = game.configdata.TOOLSICONS[index];
			var iconname = item.icon;
			this.index = index;
			this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(iconname,'uimap'));
		}
	});

	
	
	var Runbus = ns.Runbus = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'runbus',
		speed:0,
		body:null,
		tyre1:null,
		tyre2:null,
		bodyname:'',
		tyrename:'',
		tyre1x:0,
		tyre2x:0,
		tyrey:0,
		tyrepivotx:0,
		tyrepivoty:0,
		pause:false,
		constructor: function(properties) {
			Runbus.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.body = new Hilo.Bitmap({
				image:game.getImg(this.bodyname),
			}).addTo(this);
			this.tyre1 = new Hilo.Bitmap({
				image:this.tyrename,
				x:this.tyre1x,
				y:this.tyrey,
				pivotX:this.tyrepivotx,
				pivotY:this.tyrepivoty
			}).addTo(this);
			this.tyre2 = new Hilo.Bitmap({
				image:this.tyrename,
				x:this.tyre2x,
				y:this.tyrey,
				pivotX:this.tyrepivotx,
				pivotY:this.tyrepivoty
			}).addTo(this);
		},
		onUpdate:function(){
			if(!this.pause){
				this.tyre1.rotation += 10;
				this.tyre2.rotation += 10;
				this.x += this.speed;
			}
		},
	});
	
	
	var DrDialog = ns.DrDialog = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'drdialog',
		head:null,
		dialogbg:null,
		contentimg:null,
		passoverbg:null,
		passovercontent:null,
		constructor: function(properties) {
			Runbus.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.dialogbg = new Hilo.Bitmap({
				image:'img/dialogbg.png',
			}).addTo(this);
			this.head = new Hilo.Bitmap({
				image:'img/drhead.png',
				x:-80,
				y:-74,
			}).addTo(this);
			this.contentimg = new Hilo.Bitmap({
				x:210,
				y:70,
			}).addTo(this);
			this.passovercontent = new Hilo.Bitmap({
				x:340,
				y:168,
				visible:false,
			}).addTo(this);
			this.passoverbg = new Hilo.Bitmap({
				image:'img/note04bg.png',
				visible:false,
			}).addTo(this);
		},
		showTxt:function(sturl){
			this.x = 180;
			this.y = 150;
			this.visible = true;
			this.alpha = 1;
			this.contentimg.removeFromParent();
			this.contentimg = new Hilo.Bitmap({
				image:sturl,
				x:210,
				y:70,
			}).addTo(this);
			this.contentimg.visible = true;
			this.dialogbg.visible = true;
			this.head.visible = true;
			this.passoverbg.visible = false;
			this.passovercontent.visible = false;
		},
		hide:function(oncall){
			this.off();
			new Hilo.Tween.to(this,{
				alpha:0,
			},{
				duration:400,
				onComplete:function(){
					if(oncall){
						oncall();
					}
				}
			})
		},
		showPassover:function(sturl){
			this.x = 0;
			this.y = 0;
			this.visible = true;
			this.alpha = 1;
			this.contentimg.visible = false;
			this.dialogbg.visible = false;
			this.head.visible = false;
			this.passoverbg.visible = true;
			this.passovercontent.visible = true;
			
			this.passovercontent.removeFromParent();
			this.passovercontent = new Hilo.Bitmap({
				image:sturl,
				x:340,
				y:168,
			}).addTo(this);
		},
		
		onUpdate:function(){
		},
	});
	
})(window.game);