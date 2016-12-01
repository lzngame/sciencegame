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
					game.sounds.play(6,false);
				}
				this.img.setImage(game.getImg('effects'),this.frames[this.index]);
			}else{
				this.interval++;
			}
		},
	});
	
	
	var AnimaEffect = ns.AnimaEffect = Hilo.Class.create({
		Extends: Hilo.Bitmap,
		name:'effect',
		sourceImg:'',
		interval:0,
		initimg:null,
		frames:null,
		index:0,
		fpstime:4,
		isplay:false,
		constructor: function(properties) {
			AnimaEffect.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg(this.sourceImg),
				rect:game.configdata.getPngRect(this.frames[0],'uimap')
			});
		},
		setpos:function(x,y){
			this.x = x;
			this.y = y;
		},
		onUpdate:function(){
			if(this.isplay){
				if(this.interval > this.fpstime){
					this.interval = 0;
					this.index++;
					if(this.index > this.frames.length-1){
						this.index = 0;
					}
					this.setImage(game.getImg(this.sourceImg),game.configdata.getPngRect(this.frames[this.index],'uimap'));
				}else{
						this.interval++;
				}
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
		firstPosX:40,
		firstPosY:50,
		spaceLine:80,
		btnImg:null,
		iconpanel:null,
		isshow:false,
		shader:null,
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
			this.shader = new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('shader'),
				visible:false,
			}).addTo(this);
			this.btnImg = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('storebtn1','uimap'),
				x:280,
				y:395
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
		showshader:function(mousex,mousey){
			var icons = this.iconpanel.children;
			for(var i=0;i<icons.length;i++){
				var item = icons[i];
				var x = this.x + item.x;
				var y = this.y + item.y;
				var w = item.img.width;
				var h = item.img.height;
				if(game.checkInRect(mousex,mousey,x,y,w,h)){
					this.shader.visible = true;
					this.shader.x = item.x;
					this.shader.y = item.y;
					break;
				}else{
					this.shader.visible = false;
				}
			}
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
			this.shader.visible = false;
		},
		addIcon:function(index){
			game.boydata.bagdata.push(index);
			this.addIconNoData(index);
			game.sounds.play(1,false);
		},
		addIconNoData:function(index){
			var initPos = this.iconpanel.getNumChildren()+1;
			var x = (initPos-1) % 4;
			var y = Math.floor((initPos-1) / 4);
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
					game.sounds.play(12,false);
				}else{
					console.log('此场景不能使用该物品');
				}
			});
		},
		show:function(isshow,time){
			var panel = this;
			var targety = this.inity;
			var h = this.bg.height;
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
			this.shader.visible = false;
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
		score:0,
		imgpanel:null,
		basenum:'whitenum0',
		constructor: function(properties) {
			StarScore.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('smallstar','uimap'),
			}).addTo(this);
			this.imgpanel = new Hilo.Container({
				x:25,
				y:3,
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
					x:i*15
				}).addTo(this.imgpanel);
			}
		},
		onUpdate:function(){
		},
	});
	
	var UpBtn = ns.UpBtn = Hilo.Class.create({
		Extends: Hilo.Bitmap,
		name:'',
		state:true,
		upimg:'',
		downimg:'',
		sumtime:0,
		constructor: function(properties) {
			UpBtn.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.on(Hilo.event.POINTER_START, function(e) {
				if(this.state){
					this.state = false;
					this.sumtime = 0;
					this.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.downimg,'uimap'));
				}
			});
		},
		onUpdate:function(){
			if(!this.state){
				this.sumtime++;
				if(this.sumtime > 3){
					this.state = true;
					this.setImage(game.getImg('uimap'),game.configdata.getPngRect(this.upimg,'uimap'));
				}
			}
		}
	});
	
	var PasswordlockBtn = ns.PasswordlockBtn = Hilo.Class.create({
		Extends: Hilo.Bitmap,
		name:'',
		index:-1,
		state:true,
		upimg:'',
		downimg:'',
		constructor: function(properties) {
			PasswordlockBtn.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.on(Hilo.event.POINTER_START, function(e) {
				this.state = !this.state;
				var imgrect = this.upimg;
				if(!this.state){
					imgrect = this.downimg;
				}
				this.setImage(game.getImg('uimap'),game.configdata.getPngRect(imgrect,'uimap'));
				game.sounds.play(2,false);
			});
		},
	});
	
	var PasswordlockPanel = ns.PasswordlockPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'',
		sureBtnImg:null,
		initx:420,
		inity:200,
		btns:null,
		exitBtnImg:null,
		constructor: function(properties) {
			PasswordlockPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			new Hilo.Bitmap({
				image:game.getImg('passwordbg')
			}).addTo(this);
			this.btns = new Array();
			for(var i=0;i<9;i++){
				var x = (i%3) * 120 + this.initx;
				var y = Math.floor(i/3) * 82 + this.inity;
				var btn = new game.PasswordlockBtn({
					image:game.getImg('uimap'),
					rect:game.configdata.getPngRect('passbtndown','uimap'),
					upimg:'passbtndown',
					downimg:'passbtnup',
					x:x,
					y:y,
					index:i,
					state:true,
				}).addTo(this);
				this.btns.push(btn);
			}
			this.sureBtnImg = new game.UpBtn({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('surebtn1','uimap'),
				upimg:'surebtn1',
				downimg:'surebtn2',
				state:true,
				x:558,
				y:450,
			}).addTo(this);
			this.exitBtnImg = new Hilo.Bitmap({
				x:543,
				y:565,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('lockpanelexit','uimap'),
			}).addTo(this);
		},
		resetDefault:function(){
			for(var i=0;i<9;i++){
				var btn = this.btns[i];
				btn.state = true;
				btn.setImage(game.getImg('uimap'),game.configdata.getPngRect(btn.upimg,'uimap'));
			}
		},
		checkLetter:function(){
			//console.log('check---');
			for(var i=0;i<9;i++){
				var btn = this.btns[i];
				//console.log('index:%d  x:%f  y:%f  state:%s',i,btn.x,btn.y,btn.state);
			}
			
			if(this.btns[3].state && this.btns[5].state  &&(!this.btns[0].state ) &&(!this.btns[1].state ) &&(!this.btns[2].state ) &&(!this.btns[4].state ) &&(!this.btns[6].state ) &&(!this.btns[7].state ) &&(!this.btns[8].state)){
				return true;
			}else{
				return false;
			}
		}
	});
	
	var TelPanel = ns.TelPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'',
		exitBtnImg:null,
		callbtn:null,
		numpanel:null,
		firetelnum:'',
		telnums:['telnum00','telnum01','telnum02','telnum03','telnum04','telnum05','telnum06','telnum07','telnum08','telnum09'],
		constructor: function(properties) {
			TelPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			new Hilo.Bitmap({
				image:game.getImg('telbg')
			}).addTo(this);
			var datas =[['tel0',642,389,0],
						['tel1',582,274,1],['tel2',635,274,2],['tel3',692,274,3],
						['tel4',582,313,4],['tel5',635,313,5],['tel6',692,313,6],
						['tel7',582,349,7],['tel8',635,349,8],['tel9',692,349,9]];
			for(var i=0;i<datas.length;i++){
				var item = datas[i];
				var x = item[1];
				var y = item[2];
				var btn = new game.PasswordlockBtn({
					image:game.getImg('uimap'),
					rect:game.configdata.getPngRect(item[0],'uimap'),
					upimg:item[0],
					downimg:item[0],
					x:x,
					y:y,
					index:item[3],
					state:true,
				}).addTo(this);
				btn.on(Hilo.event.POINTER_START, function(e) {
					this.parent.addNum(this.index);
					game.sounds.play(2,false);
				});
			}
			this.callbtn = new Hilo.Bitmap({
				x:693,
				y:389,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('telenter','uimap'),
			}).addTo(this);
			this.exitBtnImg = new Hilo.Bitmap({
				x:780,
				y:545,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect('backbtn','uimap'),
			}).addTo(this);
			this.numpanel = new Hilo.Container({
				x:622,
				y:152
			}).addTo(this);
		},
		addNum:function(i){
			var count = this.numpanel.getNumChildren()-1;
			if(count > 4)
				return;
			var num = new Hilo.Bitmap({
				x:30+count*25,
				y:10,
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect(this.telnums[i],'uimap'),
			}).addTo(this.numpanel);
			this.firetelnum += i.toString();
			console.log(this.firetelnum);
		},
		reset:function(){
			this.firetelnum = '';
			this.numpanel.removeAllChildren();
		},
		checkLetter:function(){
			console.log('check---');
			if(this.firetelnum =='119'){
				return true;
			}else{
				return false;
			}
		}
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
	
	
	var PicPanel = ns.PicPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'pic panel',
		panel:null,
		img1:null,
		img2:null,
		exitimg:null,
		constructor: function(properties) {
			PicPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.exitimg = new Hilo.Bitmap({
				image: game.getImg('uimap'),
				rect:game.configdata.getPngRect('backbtn','uimap'),
				x:0,
				y:152
			}).addTo(this);
			this.exitimg.on(Hilo.event.POINTER_START, function(e) {
				this.parent.exit();
			});
			this.panel = new Hilo.Container({}).addTo(this);
		},
		addPic:function(index){
			this.visible = true;
			var name = 'halfpic01';
			if(index == 11)
				name = 'halfpic01';
			if(index == 12)
				name = 'halfpic02';
			new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngRect(name,'uimap')
			}).addTo(this.panel);
		},
		exit:function(){
			this.panel.removeAllChildren();
			this.visible = false;
		},
		onUpdate:function(){
		},
	});
	
	
	var SwitchBtn = ns.SwitchBtn = Hilo.Class.create({
		Extends: Hilo.Bitmap,
		state:false,
		default:'',
		other:'',
		func:null,
		constructor: function(properties) {
			SwitchBtn.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.setRect(this.state);
			this.on(Hilo.event.POINTER_START, function(e) {
				this.state = !this.state;
				this.setRect(this.state);
				this.func(this.state);
			});
		},
		setRect:function(indexstate){
			this.state = indexstate;
			var rectname = this.default;
			if(this.state){
				rectname = this.other;
			}
			this.setImage(game.getImg('uimap'),game.configdata.getPngRect(rectname,'uimap'));
		}
	});
	
	
	var ShootBread = ns.ShootBread = Hilo.Class.create({
		Extends: Hilo.Bitmap,
		name:'shootBread',
		upline:0,
		downline:0,
		speed:0,
		roasttime:100,
		sumtime:0,
		inity:0,
		up:false,
		constructor: function(properties) {
			ShootBread.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.inity = this.y;
		},
		onUpdate:function(){
			this.sumtime++;
			if(this.sumtime == this.roasttime){
				this.up = true;
			}
			if(this.y <= (this.inity - 100)){
				this.up = false;
				this.parent.swapChildren(this,this.parent.toaster);
				this.speed = 6;
				this.parent.ragfall = true;
			}
			if(this.up && this.sumtime > this.roasttime){
				this.y -= this.speed;
			}
			if(!this.up && this.sumtime > this.roasttime){
				if(this.y >= (this.inity + 200)){
					this.setImage(game.getImg('uimap'),game.configdata.getPngRect('breadonfloor','uimap'));
				}else{
					this.y += this.speed;
				}
			}
		},
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
		},
		showTxt:function(sturl){
			this.visible = true;
			this.alpha = 1;
			this.contentimg.removeFromParent();
			this.contentimg = new Hilo.Bitmap({
				image:sturl,
				x:210,
				y:70,
			}).addTo(this);
		},
		hide:function(){
			new Hilo.Tween.to(this,{
				alpha:0,
			},{
				duration:400,
				onComplete:function(){
					
				}
			})
		},
		onUpdate:function(){
		},
	});
	
})(window.game);