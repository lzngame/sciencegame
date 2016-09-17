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
			if(game.configdata.NOLINE){
					var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
					g.lineStyle(1,"#00f").drawRect(0,0,w,h).endFill().addTo(this);
				}
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
			if(game.configdata.NOLINE){
					var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
					g.lineStyle(1,"#00f").drawRect(0,0,w,h).endFill().addTo(this);
				}
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
			if(game.configdata.NOLINE){
					var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
					g.lineStyle(1,"#00f").drawRect(0,0,w,h).endFill().addTo(this);
				}
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
	
	var ToolipNote = ns.ToolipNote = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'doctor note txt',
		noteimg:'tilebg',
		txt:'............',
		text1:null,
		text2:null,
		showtime:100,
		sumtime:0,
		hideX:1230,
		showX:900,
		constructor: function(properties) {
			ToolipNote.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.noteimg,'uimap'),
			}).addTo(this);
			
			var font = "18px arial";
			this.text1 = new Hilo.Text({
                	font: font,
                	color:'black',
                	text: this.txt,
               		lineSpacing: 10,
                	width:400,
                	height:30,
                	textAlign:'center',
               		textVAlign:'middle',
                	y: 30,
                	x:-25,
           		 }).addTo(this);
           	this.text2 = new Hilo.Text({
                	font: font,
                	color:'#ff9966',
                	text: this.txt,
               		lineSpacing: 10,
                	width:400,
                	height:30,
                	textAlign:'center',
               		textVAlign:'middle',
                	y: 31,
                	x:-26,
           		 }).addTo(this);
		},
		show:function(hide,txt,showtime){
			var targetx = this.hideX;
			if(hide){
				targetx = this.showX;
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
			if(this.x == this.showX){
				this.sumtime++;
			}
			if(this.sumtime >= this.showtime){
				this.show(false);
				this.sumtime = 0;
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
			
			var font = "18px arial";
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
                	color:'#ff9966',
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
	
	
	var FlashStar = ns.FlashStar = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'flash start',
		interval:0,
		img:null,
		flash01:'start01',
		flash02:'start02',
		index:0,
		constructor: function(properties) {
			FlashStar.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.flash01,'uimap'),
			}).addTo(this);
		},
		setpos:function(x,y){
			this.x = x;
			this.y = y;
		},
		hide:function(){
			var x = this.x;
			var y = this.y;
			new game.FlashStarEffect({
				x:x-30,
				y:y-30
			}).addTo(this.parent);
			this.removeFromParent();
		},
		onUpdate:function(){
			if(this.interval > 10){
				this.interval = 0;
				this.index++;
				if(this.index % 2 ==0){
					this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.flash01,'uimap'));
				}else{
					this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.flash02,'uimap'));
				}
			}else{
				this.interval++;
			}
		},
	});
	
	var FlashStarEffect = ns.FlashStarEffect = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'flash start effect',
		interval:0,
		img:null,
		frames:null,
		index:0,
		constructor: function(properties) {
			FlashStarEffect.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var data = [[380,417,146,139],
						[380,278,146,139],
						[380,139,146,139],
						[234,556,146,139],
						[234,0,146,139],
						[234,139,146,139],
						[234,417,146,139],
						[234,278,146,139],
						[380,695,146,139],
						[380,556,146,139],
						[234,695,146,139],
						[234,834,146,139]];
			this.frames = data;
			this.img = new Hilo.Bitmap({
				image: game.getImg('effects'),
				rect:data[0],
			}).addTo(this);
		},
		setpos:function(x,y){
			this.x = x;
			this.y = y;
		},
		onUpdate:function(){
			if(this.interval > 3){
				this.interval = 0;
				this.index++;
				if(this.index > this.frames.length-1){
					this.index = 0;
					this.removeFromParent();
				}
				this.img.setImage(game.getImg('effects'),this.frames[this.index]);
			}else{
				this.interval++;
			}
		},
	});
	
	
	var ToolsIconPanel = ns.ToolsIconPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'ToolsIconPanel',
		bg:null,
		count:0,
		index:0,
		initx:0,
		inity:0,
		showtime:0,
		sumtime:0,
		firstPosX:22,
		firstPosY:20,
		spaceLine:74,
		btnImg:null,
		constructor: function(properties) {
			ToolsIconPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.bg = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('toolsbg','uimap'),
			}).addTo(this);
			this.x = this.initx;
			this.y = this.inity;
			this.btnImg = new Hilo.Bitmap({
				image: game.getImg('storebtn1'),
				x:230,
				y:250
			}).addTo(this);
			var panel = this;
			this.btnImg.on(Hilo.event.POINTER_START, function(e) {
				if(panel.y == panel.inity){
					panel.show(true,2000);
					this.setImage(game.getImg('storebtn1'));
				}else{
					panel.show(false,0);
					this.setImage(game.getImg('storebtn2'));
				}
			});
		},
		setpos:function(x,y){
			this.x = x;
			this.y = y;
		},
		addIcon:function(index){
			this.count++;
			var x = (this.count-1) % 6;
			var y = Math.floor((this.count-1) / 6);
			var item = game.configdata.TOOLSICONS[index];
			var icon = new Hilo.Bitmap({
				x:this.firstPosX + x * this.spaceLine,
				y:this.firstPosY + y * this.spaceLine,
				index:item.index,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect(item.icon,'uimap'),
			}).addTo(this);
		},
		show:function(isshow,time){
			var panel = this;
			var targety = this.inity;
			var h = this.bg.height-43;
			if(isshow){
				targety = targety + h;
			}
			new Hilo.Tween.to(panel,{
				 y:targety
			},{
				duration:500,
				onComplete:function(){
				}
			});
			panel.showtime = time;
		},
		onUpdate:function(){
			if(this.showtime > 0){
				this.sumtime++;
			}
			if(this.sumtime > this.showtime){
				this.sumtime = 0;
				this.showtime = 0;
				this.show(false,0);
			}
		},
	});
	
	
	
	var TaskLine = ns.TaskLine = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'task line',
		interval:4,
		index:0,
		img:null,
		text1:null,
		txt:'',
		frames:null,
		constructor: function(properties) {
			TaskLine.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.frames = ['question1','question2','question3','question4'];
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('question1','uimap'),
			}).addTo(this);
			var font = "18px arial";
			this.text1 = new Hilo.Text({
                	font: font,
                	color:'green',
                	text: this.txt,
               		lineSpacing: 10,
                	width:300,
                	height:100,
                	y: 30,
                	x:85,
           		 }).addTo(this);
           	this.text1 = new Hilo.Text({
                	font: font,
                	color:'yellow',
                	text: this.txt,
               		lineSpacing: 10,
                	width:300,
                	height:100,
                	y: 31,
                	x:86,
           		 }).addTo(this);
		},
		hide:function(){
			new game.FlashStarEffect({
				x:this.x-30,
				y:this.y-30
			}).addTo(this.parent);
			this.removeFromParent();
		},
		onUpdate:function(){
			if(this.interval > 3){
				this.interval = 0;
				this.index++;
				if(this.index > this.frames.length-1){
					this.index = 0;
				}
				this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.frames[this.index]));
			}else{
				this.interval++;
			}
		},
	});
	
	var StarScore = ns.StarScore = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'star score',
		score:4,
		img:null,
		basenum:'whitenum0',
		constructor: function(properties) {
			StarScore.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('start01','uimap'),
			}).addTo(this);
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.basenum+this.score.toString(),'uimap'),
				x:75
			}).addTo(this);
		},
		addScore:function(){
			this.score++;
			var name = this.basenum+this.score.toString();
			var rect = game.configdata.getPngRect(name,'uimap');
			this.img.setImage(game.getImg('uimap'),rect);
		},
		onUpdate:function(){
			if(this.interval > 3){
				this.interval = 0;
				this.index++;
				if(this.index > this.frames.length-1){
					this.index = 0;
				}
				this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.frames[this.index]));
			}else{
				this.interval++;
			}
		},
	});
	
})(window.game);