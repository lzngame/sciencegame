(function(ns) {
	var Mazemapscene = ns.Mazemapscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.maze_maze,
		boy:null,
		defaultspeed:3,
		speedx:0,
		speedy:0,
		isgetgold:false,
		isover:false,
		
		initPosx:550,
		initPosy:573,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		passlayer:null,
		num1:null,
		num2:null,
		num3:null,
		p1:0,
		p2:0,
		p3:0,
		redlamp:null,
		greenlamp:null,
		workeratlas:null,
		worker:null,
		
		step1_pickjack:false,
		step2_putjack:false,
		step2_takecrowbar:false,
		step3_upjack:false,
		step4_pickstool:false,
		step5_putstool:false,
		step6_takerubber:false,
		step7_putrubber:false,
		
		constructor: function(properties) {
			Mazemapscene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.x = 0;
			this.y = 0;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
		},
		active: function(passdata) {
			console.log('%s active:', this.name);
			this.scene = this;
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks = [];
			this.initBlocks(this.blocks);
			this.items = {};
			this.initmapx = 100;
			this.initmapy = 100;
			this.mapdata = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,
1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,
1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,
1,0,0,1,0,0,1,0,0,0,1,1,1,1,1,1,0,0,1,
1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,
1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,1,0,1,
1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,
1,0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,1,0,1,
1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,1,
1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,1,
1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,0,1,
1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,
1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,
1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

			this.layoutBgMap();
			//this.addHero(null,this.initPosx,this.initPosy);
			
			this.currentkey = 'empty';
			//this.hero.posx = this.initPosx;
			//this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			
			this.layoutUI();
			
			game.sounds.play(14,true);
			this.isgetgold = false;
			this.isover = false;
			this.boy = new Hilo.Bitmap({image:'img/maze/2/3.png',x:829,y:592}).addTo(this);
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			for(var i in this.items){
				var obj = this.items[i];
				if(obj.status != null){
					if(this.checkActiveItemWithoutPos(mouseX,mouseY,obj)){
						return true;
					}
				}
			}
			return false;
		},
		stopboy:function(){
			this.speedx = 0;
			this.speedy = 0;
		},
		runboy:function(){
			this.boy.x += this.speedx;
			this.boy.y += this.speedy;
		},
		tilemap:function(initx,inity,size,data,blockimg){
			for(var i=0;i<data.length;i++){
				var xp = i % 19;
				var yp = Math.floor(i / 19);
				var item = data[i];
				if(item != 0){
					var itemmap = new Hilo.Bitmap({
							image:blockimg,
							x:initx + xp*size,
							y:inity + yp*size
					}).addTo(this);
				}
			}
		},
		
		clickpass:function(index){
			if(index == 0){
				this.p1++;
				if(this.p1 > 9){
					this.p1 = 0;
				}
				var rect = [0,this.p1 * 71,47,71];
				this.num1.setImage('img/quiet/6/n1.png',rect);
			}
			if(index == 1){
				this.p2++;
				if(this.p2 > 9){
					this.p2 = 0;
				}
				var rect = [0,this.p2 * 71,47,71];
				this.num2.setImage('img/quiet/6/n1.png',rect);
			}
			if(index == 2){
				this.p3++;
				if(this.p3 > 9){
					this.p3 = 0;
				}
				var rect = [0,this.p3 * 71,47,71];
				this.num3.setImage('img/quiet/6/n1.png',rect);
			}
			
			if(this.p1 == 8 && this.p2 == 8 && this.p3 == 8){
				this.greenlamp.visible = true;
				this.showPass(false);
				this.items['closebox'].visible = false;
				this.items['closebox'].status  = 2;
				this.items['headset'].visible = true;
				this.items['openbox'].visible = true;
				this.items['openbox'].status  = 1;
			}
		},
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['up'])){
				var obj = this.items['up'];
				var scene = this;
				this.speedy = (this.defaultspeed * -1);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['down'])){
				var obj = this.items['down'];
				var scene = this;
				this.speedy = (this.defaultspeed * 1);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['left'])){
				var obj = this.items['left'];
				var scene = this;
				this.speedx = (this.defaultspeed * -1);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['right'])){
				var obj = this.items['right'];
				var scene = this;
				this.speedx = (this.defaultspeed *1);
				return true;
			}
			
			
			return false;
		},
		
		
		receiveMsg: function(msg) {
			console.log('Not Remove');	
		},
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		createActiveObj:function(objname,x,y,targetx,targety,readyImgurl,clickrect,status,isvisible){
			return new game.ActiveObject({
				name:objname,
				x:x,
				y:y,
				targetx:targetx,
				targety:targety,
				readyImgUrl:readyImgurl,
				finishedImgUrl:readyImgurl,
				clickArea:clickrect,
				status:status,
				visible:isvisible,
			}).addTo(this);
		},
		layoutUIElement:function(baseurl,arraydata){
			for(var i=0;i<arraydata.length;i++){
				var item = arraydata[i];
				var itemtype = item[0];
				var type = game.configdata.LAYOUTTYPE.activeobj;
				if(itemtype == 1)
					type = game.configdata.LAYOUTTYPE.img;
				var obj = item[1];
				var img = item[2];
				img = baseurl+img;
				if(type == game.configdata.LAYOUTTYPE.activeobj){
					var status = item[3];
					var x = item[4];
					var y = item[5];
					var targetx = item[6];
					var targety = item[7];
					var clickrect = item[8];
					var isvisible = item[9]=='t';
					this.items[obj] = this.createActiveObj(obj,x,y,targetx,targety,img,clickrect,status,isvisible);
				}
				if(type == game.configdata.LAYOUTTYPE.img){
					var obj = item[1];
					var x = item[3];
					var y = item[4];
					var isvisible = item[5]=='t';
					this.items[obj] = new Hilo.Bitmap({image:img,x:x,y:y,visible:isvisible}).addTo(this);
				}
			}
		},
		layoutBgMap:function(){
			var scene = this;
			var data = [
[1, 'bg', 'mapbg.jpg', 0, 0, 't'],
[1, 'keys', 'keys.png', 173, 486, 't'],
[2, 'up', 'empty', 1,217, 477, 42,271,[0,0,44,52],'t'],
[2, 'down', 'empty', 1,217, 585, 42,271,[0,0,44,52],'t'],
[2, 'left', 'empty', 1,166, 526, 42,271,[0,0,44,52],'t'],
[2, 'right', 'empty', 1,267, 526, 42,271,[0,0,44,52],'t'],
[1,'boxclose1','goldboxclose.png',808,166,'t'],
[1,'boxopen1','goldboxopen.png',804,145,'f'],
[1,'boxclose2','goldboxclose.png',327,328,'t'],
[1,'boxopen2','goldboxopen.png',326,309,'f'],
[1,'boxclose3','goldboxclose.png',564,373,'t'],
[1,'boxopen3','goldboxopen.png',562,354,'f'],
[1,'boxclose4','goldboxclose.png',552,215,'t'],
[1,'boxopen4','goldboxopen.png',548,195,'f'],
[1,'gold','gold.png',570,200,'f']
			];
		
			this.layoutUIElement('img/maze/2/',data);
			this.tilemap(304,41,32,this.mapdata,'img/maze/2/tile35.png');
			
		},
		onTouchEnd:function(e){
			this.stopboy();
		},
		createSprite:function(sourceatlas,defaultaction,x,y,interval,parent){
			return new Hilo.Sprite({
				frames:sourceatlas.getSprite(defaultaction),
				interval:interval,
				x:x,
				y:y,
			}).addTo(parent);
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.currentOnhandObj == null){
				//this.hero.switchState('nocan',10);
			}
		},
		checkblocks:function(data,initx,inity){
			var isblock = false;
			for(var i=0;i<data.length;i++){
				var xp = i % 19;
				var yp = Math.floor(i / 19);
				var item = data[i];
				var w = 32;
				var h = 32;
				if(item != 0){
					var x = initx + xp*w;
					var y = inity + yp*h;
					if(this.speedx > 0 ){
					  if(this.boy.y >= y && this.boy.y <= y+h){
					  	if(this.boy.x <= x){
					  		if(this.boy.x + this.speedx >= x){
					  			this.stopboy();
					  			isblock = true;
					  			break;
					  		}
					  	}
					  }
					}
					if(this.speedx < 0 ){
					  if(this.boy.y >= y && this.boy.y <= y+h){
					  	if(this.boy.x >= x+w){
					  		if(this.boy.x + this.speedx <= x+w){
					  			this.stopboy();
					  			isblock = true;
					  			break;
					  		}
					  	}
					  }
					}
					if(this.speedy > 0 ){
					  if(this.boy.x >= x && this.boy.x <= x+w){
					  	if(this.boy.y <= y){
					  		if(this.boy.y + this.speedy >= y){
					  			this.stopboy();
					  			isblock = true;
					  			break;
					  		}
					  	}
					  }
					}
					if(this.speedy < 0 ){
					  if(this.boy.x >= x && this.boy.x <= x+w){
					  	if(this.boy.y >= y+h){
					  		if(this.boy.y + this.speedy <= y+h){
					  			this.stopboy();
					  			isblock = true;
					  			break;
					  		}
					  	}
					  }
					}
				}
			}
			return isblock;
		},
		checkbox:function(){
			var box1 = this.items['boxclose1'];
			if(box1.visible && Math.abs(box1.x-this.boy.x) <50 && Math.abs(box1.y-this.boy.y) <50){
				this.items['boxclose1'].visible = false;
				this.items['boxopen1'].visible = true;
			}
			var box2 = this.items['boxclose2'];
			if(box2.visible && Math.abs(box2.x-this.boy.x) <50 && Math.abs(box2.y-this.boy.y) <50){
				this.items['boxclose2'].visible = false;
				this.items['boxopen2'].visible = true;
			}
			var box3 = this.items['boxclose3'];
			if(box3.visible && Math.abs(box3.x-this.boy.x) <50 && Math.abs(box3.y-this.boy.y) <50){
				this.items['boxclose3'].visible = false;
				this.items['boxopen3'].visible = true;
			}
			var box4 = this.items['boxclose4'];
			if(box4.visible && Math.abs(box4.x-this.boy.x) <50 && Math.abs(box4.y-this.boy.y) <50){
				this.items['boxclose4'].visible = false;
				this.items['boxopen4'].visible = true;
				this.items['gold'].visible = true;
				var obj = this.items['gold'];
				this.isgetgold = true;
				var scene = this;
				new Hilo.Tween.to(obj,{alpha:0},{duration:1500,delay:1000,onComplete:function(){
					scene.showDialog('img/maze/2/note.png');
				}});
			}
		},
		
		onUpdate:function(){
			if(!this.checkblocks(this.mapdata,304,41)){
				this.runboy();
				this.checkbox();
			}
			if(!this.isover && this.isgetgold && Math.abs(this.boy.x - 350) < 50 && Math.abs(this.boy.y - 85) < 50){
				this.isover = true;
				this.passoverReady('img/nextpasspoint.png',1200,game.configdata.SCENE_NAMES.maze_treasure);
			}
		},
	});
})(window.game);