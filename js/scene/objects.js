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
		isRun:false,
		runspeed:0,
		frames:null,
		onDanger:true,
		clickArea:[0,0,10,10],
		
		fallAnimaIndex:0,
		animaFrames:null,
		startBreak:false,
		interval:0,
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
			var x = this.clickArea[0];
			var y = this.clickArea[1];
			var w = this.clickArea[2];
			var h = this.clickArea[3];
			//var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
			//g.lineStyle(1,"#f00").drawRect(0,0,w,h).endFill().addTo(this);
		},
		onUpdate:function(){
			if(this.isFall){
				if(this.y < this.floorline){
					this.fallspeed += 1.5;
					this.y += this.fallspeed;
				}else{
					this.isFall = false;
					this.startBreak = true;
					this.fallspeed = 4;
					this.onDanger = false;
            		console.log('break');
				}
			}
			if(this.startBreak){
				console.log('index:%d',this.fallAnimaIndex);
				console.log('interval:%d',this.interval);
				
				if(this.interval > 2){
					this.img.setImage(game.getImg('fallobjs'),this.animaFrames[this.fallAnimaIndex]);
					this.interval = 0;
					if(this.fallAnimaIndex < this.animaFrames.length-1){
						this.fallAnimaIndex++;
					}else{
						this.startBreak = false;
					}
				}else{
					this.interval++;
				}
			}
			if(this.isRun){
				this.x -= this.runspeed;
				if(this.x < -100){
					this.removeFromParent();
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
		setpos:function(x,y){
			this.x = x;
			this.y = y;
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
		clickArea:[0,0,0,0],
		constructor: function(properties) {
			ActiveObject.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.readyImgUrl,'uimap'),
			}).addTo(this);
			var x = this.clickArea[0];
			var y = this.clickArea[1];
			var w = this.clickArea[2];
			var h = this.clickArea[3];
			var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
			g.lineStyle(1,"#f00").drawRect(0,0,w,h).endFill().addTo(this);
		},
		setEndImg:function(x,y){
			console.log(this.name+':ACTIVE');
			this.status = 2;
			this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.finishedImgUrl,'uimap'));	
			this.img.x = x;
			this.img.y = y;
		},
		onUpdate:function(){
			
		},
	});
	
	var RunblockObj = ns.RunblockObj = Hilo.Class.create({
		Extends: Hilo.Container,
		body:null,
		img:null,
		name:'runblock',
		clickArea:[0,0,10,10],
		constructor: function(properties) {
			ActiveObject.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.body = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.img,'uimap'),
			}).addTo(this);
			var x = this.clickArea[0];
			var y = this.clickArea[1];
			var w = this.clickArea[2];
			var h = this.clickArea[3];
			//var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
			//g.lineStyle(1,"#f00").drawRect(0,0,w,h).endFill().addTo(this);
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
			
			this.setHealth(0);
		},
		setHealth: function(n) {
			this.hpContainer.removeAllChildren();
			var img = game.getImg('uimap');
			for (var i = 0; i < this.healthValue; i++) {
				new Hilo.Bitmap({
					image: img,
					rect: game.configdata.getPngRect(this.healthIconBlack,'uimap'),
					x: i * 70,
					y:2
				}).addTo(this.hpContainer);
			}
			for (var i = 0; i < n; i++) {
				new Hilo.Bitmap({
					image: img,
					rect: game.configdata.getPngRect(this.healthIcon,'uimap'),
					x: i * 70 ,
					y:2
				}).addTo(this.hpContainer);
			}
		},
	});
	
	
	var DrNote = ns.DrNote = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'doctor note txt',
		headimg:'doctorhead',
		noteimg:'doctorbg',
		txt:'............',
		text1:null,
		text2:null,
		showtime:100,
		sumtime:0,
		constructor: function(properties) {
			DrNote.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.noteimg,'uimap'),
				x:170,
				y:40
			}).addTo(this);
			new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.headimg,'uimap'),
			}).addTo(this);
			
			var font = "14px arial";
			this.text1 = new Hilo.Text({
                	font: font,
                	color:'black',
                	text: this.txt,
               		lineSpacing: 10,
                	width:400,
                	height:30,
                	textAlign:'center',
               		textVAlign:'middle',
                	y: 90,
                	x:135,
           		 }).addTo(this);
           	this.text2 = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: this.txt,
               		lineSpacing: 10,
                	width:400,
                	height:30,
                	textAlign:'center',
               		textVAlign:'middle',
                	y: 91,
                	x:134,
           		 }).addTo(this);
		},
		show:function(hide,txt,showtime){
			var targetx = -700;
			if(hide){
				targetx = 0;
				this.txt = txt;
				this.text1.text = this.txt;
				this.text2.text = this.txt;
				this.sumtime = 0;
				if(showtime){
					this.showtime = showtime;
				}
			}
			
			new Hilo.Tween.to(this,{
					x:targetx
				},{
					duration:300,
					onComplete:function(){
						
					}
				});
		},
		onUpdate:function(){
			if(this.x == 0){
				this.sumtime++;
			}
			if(this.sumtime >= this.showtime){
				this.show(false);
				this.sumtime = 0;
			}
		},
	});
	
})(window.game);