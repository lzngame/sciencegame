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
			new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngRect('headbg','uimap'),
			}).addTo(this);
			this.headImg = new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngRect(this.headImgUrl,'uimap'),
				x:70,
				y:0
			}).addTo(this);
			
			this.hpContainer = new Hilo.Container({
				x:75,
				y:5,
			}).addTo(this);
			
			this.setHp(0);
		},
		setHp: function(n) {
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
			game.sounds.play(3,false);
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
		index:0,
		initx:0,
		inity:0,
		showtime:0,
		sumtime:0,
		firstPosX:22,
		firstPosY:20,
		spaceLine:74,
		btnImg:null,
		iconpanel:null,
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
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('storebtn1','uimap'),
				x:230,
				y:250
			}).addTo(this);
			var panel = this;
			this.btnImg.on(Hilo.event.POINTER_START, function(e) {
				if(panel.y == panel.inity){
					panel.show(true,2000);
					this.setImage(game.getImg('uimap'),game.configdata.getPngRect('storebtn1','uimap'));
				}else{
					panel.show(false,0);
					this.setImage(game.getImg('uimap'),game.configdata.getPngRect('storebtn2','uimap'));
				}
			});
			this.iconpanel = new Hilo.Container({}).addTo(this);
		},
		setpos:function(x,y){
			this.x = x;
			this.y = y;
		},
		removeIcon:function(index){
			if(game.delIndexData(game.boydata.bagdata,index)){
				this.count--;
			}
			var panelarray = this.iconpanel.children;
			for(var i=0;i<panelarray.length;i++){
				var item = panelarray[i];
				if(item.index === index){
					item.removeFromParent();
					break;
				}
			}
		},
		addIcon:function(index){
			game.boydata.bagdata.push(index);
			this.addIconNoData(index);
		},
		addIconNoData:function(index){
			var initPos = this.iconpanel.getNumChildren()+1;
			var x = (initPos-1) % 6;
			var y = Math.floor((initPos-1) / 6);
			var item = game.configdata.TOOLSICONS[index];
			var icon = new game.IconTool({
				x:this.firstPosX + x * this.spaceLine,
				y:this.firstPosY + y * this.spaceLine,
				index:item.index,
				iconname:item.icon,
			}).addTo(this.iconpanel);
			icon.on(Hilo.event.POINTER_START, function(e) {
				console.log('Icon Index:%d',this.index);
				if(game.currentScene.excuteIcon){
					game.currentScene.excuteIcon(this.index);
				}else{
					console.log('此场景不能使用该物品');
				}
			});
			game.sounds.play(5,false);
		},
		show:function(isshow,time){
			var panel = this;
			var targety = this.inity;
			var h = this.bg.height-43;
			if(isshow){
				targety = targety + h;
				this.refresh();
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
		refresh:function(){
			this.iconpanel.removeAllChildren();
			for(var i=0;i<game.boydata.bagdata.length;i++){
				this.addIconNoData(game.boydata.bagdata[i]);
			}
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
		score:10987653214,
		imgpanel:null,
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
			this.imgpanel = new Hilo.Container({
				x:50
			}).addTo(this);
			this.addScore();
		},
		addScore:function(){
			this.imgpanel.removeAllChildren();
			this.score++;
			var stringScore = this.score.toString();
			for(var i=0;i<stringScore.length;i++){
				var numimg = new Hilo.Bitmap({
					image: game.getImg('uimap'),
					rect:game.configdata.getPngRect(this.basenum+stringScore.charAt(i),'uimap'),
					x:i*30
				}).addTo(this.imgpanel);
			}
		},
		onUpdate:function(){
		},
	});
	
	var IconTool = ns.IconTool = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'',
		index:-1,
		iconname:'',
		img:null,
		constructor: function(properties) {
			IconTool.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.iconname,'uimap'),
			}).addTo(this);
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
		},
		setCurrent:function(index){
			this.active = true;
			var item = game.configdata.TOOLSICONS[index];
			var iconname = item.icon;
			this.img.setImage(game.getImg('uimap'),game.configdata.getPngRect(iconname,'uimap'));
		}
	});
	
})(window.game);