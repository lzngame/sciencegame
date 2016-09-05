(function(ns) {
	var UnlockScene = ns.UnlockScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.unlock,
		pointgate:null,
		normalRect:null,
		locklayer:null,
		rightlayer:null,
		goldtxt:null,
		ignoretouch:false,
		currentSelectIcon:null,
		currentName:null,
		currentState:null,
		currentNote:null,
		unlockBtn:null,
		head:null,
		heads:null,
		headIndex:0,
		maskGraphics:null,
		maskInity:45,
		constructor: function(properties) {
			UnlockScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = game.screenHeight / 2 - this.height / 2;
			this.x = game.screenWidth/2 - this.width/2;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			var lockdata = game.userData.heroData.lockdata;
			this.addTo(game.stage);
			var scene = this;
			var img = game.getImg('uimap');
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('bgmap_44'),
				width:this.width,
				height:this.height
			}).addTo(this);
			
			this.heads = ['small_icon010','small_icon052','small_icon103'];
			
			
			var w = 186;
			var h = 270;
			this.maskGraphics = new Hilo.Graphics({
				x:this.width/2 - w/2 ,
				y:this.maskInity,
			});
			this.maskGraphics.lineStyle(1, "#000").beginFill('rgba(100,100,100,0)',0.5).drawRect(0, 0, w, h).endFill();
			this.locklayer = new Hilo.Container({
				width:w,
				height:60*7,
				x:this.maskGraphics.x,
				y:this.maskGraphics.y + h  - 20- 60 *7,
 			}).addTo(this);
			this.locklayer.mask = this.maskGraphics;
			this.setLockIcon();
			var imgs =['bottomunlock01','bottomunlock02','bottomunlock03'];
			for(var i=0;i<imgs.length;i++){
				var rect = game.configdata.getPngSize(imgs[i]);
				new Hilo.Bitmap({
					x:this.locklayer.x + i * 65 -2,
					y:this.maskGraphics.y + h - rect[3],
					image:img,
					rect:rect,
				}).addTo(this);
			}
			var inity = 0;
			this.locklayer.on(Hilo.event.POINTER_START,function(e){
				var posy = e.stageY - scene.y;
				inity = posy; 
			});
			this.locklayer.on(Hilo.event.POINTER_MOVE,function(e){
				var lockdata = game.userData.heroData.lockdata;
				var posy = e.stageY - scene.y;
				var dy = posy - inity;
				inity = posy;
				scene.locklayer.y += dy;
				if(scene.locklayer.y > scene.maskInity){
					scene.locklayer.y = scene.maskInity;
				}
				if(scene.locklayer.y < (scene.maskGraphics.y + h  - 20- 60 *7)){
					scene.locklayer.y = (scene.maskGraphics.y + h  - 20- 60 *7);
				}
			});
			
			var exitbtn = new Hilo.Bitmap({
				image:img,
				rect: game.configdata.getPngSize('btn_icon_08'),
			}).addTo(this);
			exitbtn.on(Hilo.event.POINTER_START,function(e){
				scene.ignoretouch = false;
				game.switchScene(game.configdata.SCENE_NAMES.map);
			});
			
			this.rightlayer = new Hilo.Container({
				//background:'red',
				width:this.width,
				height:150,
				x:5,
				y:320
			}).addTo(this);
			new Hilo.Bitmap({
				image:img,
				y:-10,
				rect:game.configdata.getPngSize('image351'),
				width:this.rightlayer.width,
				height:this.rightlayer.height,
			}).addTo(this.rightlayer);
			
			
			
			
			this.head = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize(this.heads[this.headIndex]),
				x:this.rightlayer.width/2 - 16,
				y:10
			}).addTo(this.rightlayer);
			
			var changeHeadLeft = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('btn_icon_12'),
				width:30,
				height:30,
				x:this.rightlayer.x + this.rightlayer.width/2 -32-40,
				y:10
			}).addTo(this.rightlayer);
			changeHeadLeft.on(Hilo.event.POINTER_START,function(e){
				scene.changeHead(true);
			});
			
			var changeHeadRight = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('btn_icon_11'),
				width:30,
				height:30,
				x:this.rightlayer.x + this.rightlayer.width/2 + 35,
				y:10
			}).addTo(this.rightlayer);
			changeHeadRight.on(Hilo.event.POINTER_START,function(e){
				scene.changeHead(false);
			});
			
			var font = "14px arial";
			this.currentName = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: '护甲倍增',
               		lineSpacing: 10,
                	width:130,
                	height:30,
                	y: 50,
                	x: this.rightlayer.x + this.rightlayer.width/2 - 69,
                	textAlign:'center',
           		 }).addTo(this.rightlayer);
           	this.currentNote = new Hilo.Text({
                	font: font,
                	color:'white',
                	text: '技能介绍',
               		lineSpacing: 10,
                	width:300,
                	height:30,
                	y: 78,
                	x: this.rightlayer.x + this.rightlayer.width/2 - 155,
                	textAlign:'center',
           		 }).addTo(this.rightlayer);
           		 
           	this.unlockBtn = new game.ImgTxtBtn({
				txt:'解 锁 技 能',
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'image271',
				disy:-2,
				x:this.rightlayer.x + this.rightlayer.width/2 - 82,
				y:105,
				visible:false,
			}).addTo(this.rightlayer);
			
			
			this.pricetxt = new game.IconNum({
				x:this.currentName.x + 120,
				y:this.currentName.y + 2,
				sourceImg:img,
				num:12345,
				icon:'coin_01',
				disy:2,
				visible:false
			}).addTo(this.rightlayer);
           		 
			new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngSize('image147'),
				x:70
			}).addTo(this);
			this.goldtxt = new game.NumFontBmp({
				txt:game.userData.userInfo.goldcoinNum,
				sourceImg: img,
				x:105,
				y:12
			}).addTo(this);
			
			
		},
		setLockIcon:function(){
			var scene = this;
			var lockdata = game.userData.heroData.lockdata;
			for(var i=0;i<lockdata.length;i++){
				var index =  lockdata[i];
				var xpos = Math.floor(i/7) * 65;
				var ypos = (i % 7) * (-60) + this.locklayer.height - 60;
				console.log('%d:%d',xpos,ypos);
				var lockbtn = new game.LockIcon({
					y:ypos,
					x:xpos,
					isflash:false,
					pos:i,
					state:index,
				}).addTo(this.locklayer);
				lockbtn.on(Hilo.event.POINTER_START,function(e){
					scene.selectIcon(this);
				});
			}
		},
		unlock:function(){
			var scene = this;
			if(scene.ignoretouch)
					return;
			scene.ignoretouch = true;
			scene.locklayer.alpha = 0.2;
			scene.rightlayer.alpha = 0.2;
			var item = scene.currentSelectIcon;
			var objdata = lockConfigdata[item.pos];
			var img = objdata.thumbnail;
			var okpanel = new game.SurePanel({
				x:scene.width/2,
				y:scene.height/2,
				goodsimg:img,
				titletxt:game.configdata.GAMETXTS.lockReady,
				txt1:objdata.name,
				txt2:objdata.price.toString()+game.configdata.GAMETXTS.unlockTxt,
			}).addTo(scene);
			okpanel.backbtn.on(Hilo.event.POINTER_START,function(e){
				scene.ignoretouch = false;
				scene.locklayer.alpha = 1;
				scene.rightlayer.alpha = 1;
				okpanel.removeFromParent();
			});
			okpanel.okbtn.on(Hilo.event.POINTER_START,function(e){
				var lockdata = game.userData.heroData.lockdata;
				scene.ignoretouch = false;
				scene.locklayer.alpha = 1;
				scene.rightlayer.alpha = 1;
				okpanel.removeFromParent();
				var flashtxt = new game.FlashtxtPanel({
					x:scene.width/2,
					y:scene.height/2,
				}).addTo(scene);
				if(objdata.price <= game.userData.userInfo.goldcoinNum){
					lockdata[item.pos] = 2;
					game.userData.userInfo.goldcoinNum -= objdata.price;
					scene.goldtxt.setText(game.userData.userInfo.goldcoinNum);
					flashtxt.show(game.configdata.GAMETXTS.lockSuccess,'white',800);
					item.open();
					scene.selectIcon(item);
					game.userData.saveHeroDataJsonSt();
				}else{
					flashtxt.show(game.configdata.GAMETXTS.notEnoughGold,'white',800);
				}
			});
		},
		selectIcon:function(item){
			if(this.ignoretouch)
				return;
			if(this.currentSelectIcon)
				this.currentSelectIcon.setFlash(false);
			this.currentSelectIcon = item;
			item.setFlash(true);
			this.unlockBtn.visible = true;
			var objdata = lockConfigdata[item.pos];
			if(item.state == 0){
				this.unlockBtn.setText(game.configdata.GAMETXTS.lockClose);
				this.unlockBtn.setBgAlpha(0.2);
				this.pricetxt.visible = false;
				this.unlockBtn.off();
			}else if(item.state == 1){
				this.unlockBtn.setText(game.configdata.GAMETXTS.lockReady);
				this.unlockBtn.setBgAlpha(1);
				this.pricetxt.visible = true;
				this.pricetxt.setText(objdata.price);
				
				var scene = this;
				this.unlockBtn.on(Hilo.event.POINTER_START,function(e){
					if(scene.ignoretouch)
						return;
					scene.unlock();
				});
			}else{
				this.unlockBtn.setText(game.configdata.GAMETXTS.lockOpen);
				this.unlockBtn.setBgAlpha(0.2);
				this.pricetxt.visible = false;
				this.unlockBtn.off();
			}
			var name = objdata.name;
			this.currentName.text = name;
			this.currentNote.text = objdata.description;
		},
		changeHead: function(isleft) {
			if(isleft)
				this.headIndex++;
			else
				this.headIndex--;
			if(this.headIndex<0)
				this.headIndex = 2;
			if(this.headIndex>2)
				this.headIndex = 0;
			this.head.setImage(game.getImg('uimap'),game.configdata.getPngSize(this.heads[this.headIndex]));
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			console.log('%s destory', this.name);
			this.removeAllChildren();
			this.removeFromParent();
		},
	});
})(window.game);