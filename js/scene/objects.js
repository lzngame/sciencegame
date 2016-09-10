(function(ns) {
	var FallObject = ns.FallObject = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'fallobject',
		img:null,
		wholeState:null,
		brokenState:null,
		isFall:false,
		fallspeed:3,
		floorline:450,
		imgInity:0,
		onDanger:false,
		constructor: function(properties) {
			FallObject.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.wholeState,'uimap'),
				y:this.imgInity,
			}).addTo(this);
			
		},
		onUpdate:function(){
			if(this.isFall){
				if(this.y < this.floorline){
					this.fallspeed += 1.5;
					this.y += this.fallspeed;
				}else{
					this.isFall = false;
					this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.brokenState,'object'));
					this.fallspeed = 4;
					this.onDanger = true;
				}
			}
		},
	});
	
	var FingerPoint = ns.FingerPoint = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'finger point',
		interval:0,
		right:true,
		img:null,
		constructor: function(properties) {
			FingerPoint.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('finger01','uimap'),
			}).addTo(this);
			if(!this.right){
				this.turnleft();
			}
		},
		turnleft:function(){
			this.right = false;
			this.img.scaleX = -1;
			this.img.x = 125;
		},
		onUpdate:function(){
			if(this.right){
				this.img.x++;
				if(this.img.x > 10){
					this.img.x = 0;
				}
			}else{
				this.img.x --;
				if(this.img.x <115){
					this.img.x = 125;
				}
			}
		},
	});
	
	var ActiveObject = ns.ActiveObject = Hilo.Class.create({
		Extends: Hilo.Container,
		img:null,
		status:0,    //0 未激活 1激活 2完成
		readyImgUrl:'',
		finishedImgUrl:'',
		activeFunc:null,
		clickArea:[0,0,0,0],
		constructor: function(properties) {
			ActiveObject.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.readyImgUrl,'uimap'),
				y:this.imgInity,
			}).addTo(this);
			var x = this.clickArea[0];
			var y = this.clickArea[1];
			var w = this.clickArea[2];
			var h = this.clickArea[3];
			var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
			g.lineStyle(1,"#f00").drawRect(0,0,w,h).endFill().addTo(this);
		},
		onActive:function(){
			console.log(this.name+':ACTIVE');
			this.status = 2;
			this.activeFunc();
			this.img.setImage(game.getImg('objects'),game.configdata.getObjectSize(this.finishedImgUrl));	
		},
		onUpdate:function(){
			
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
					x: i * 50 ,
					y:2
				}).addTo(this.hpContainer);
			}
		},
	});
	
})(window.game);