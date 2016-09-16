(function(ns) {
	var BagPanel = ns.BagPanel = Hilo.Class.create({
		Extends: Hilo.Container,
		equipImg:null,
		itemImg:null,
		items:null,
		isinstore:true,
		itemsLayer:null,
		itemborder:null,
		description:null,
		selectItem:null,
		loadItemBtn:null,
		throwItemBtn:null,
		putStoreBtn:null,
		backBtn:null,
		constructor: function(properties) {
			BagPanel.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this);
			
			this.background = '#262A30';
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			var img = game.getImg('uimap');
			var panel = this;
			
			var rect = game.configdata.getPngSize('uihead02');
			new Hilo.Bitmap({
				image: img,
				rect:rect,
				width:this.width,
				height:rect[3],
			}).addTo(this);
			
			var equipImgBg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('uihead09'),
            	x:this.width - 174,
            	y:95
            }).addTo(this);
            var itemImgBg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('uihead09'),
            	x:this.width - 90,
            	y:95,
            }).addTo(this);
            
            var goldtxtBg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('uihead10'),
            	x:75,
            	y:22
            }).addTo(this);
            var bluegem = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('bluegemstone'),
            	x:75,
            	y:58,
            }).addTo(this);
            var boxtxtBg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('uihead11'),
            	x:95,
            	y:55,
            }).addTo(this);
            
            var powertxtBg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('uihead05'),
            	x:this.width - 135,
            	y:16
            }).addTo(this);
            
            var nimbletxtBg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('uihead04'),
            	x:this.width - 135,
            	y:53,
            }).addTo(this);
            var hptxtBg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('uihead07'),
            	x:this.width - 72,
            	y:16
            }).addTo(this);
            var exptxtBg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('uihead08'),
            	x:this.width - 72,
            	y:53,
            }).addTo(this);
            
            var rect = game.configdata.getPngSize('box211');
            var itemsBg = new Hilo.Bitmap({
            	image:img,
            	rect:rect,
            	width:this.width-10,
            	height:rect[3],
            	x:5,
            	y:190,
            }).addTo(this);
            rect = game.configdata.getPngSize('box212');
            var descriptionBg = new Hilo.Bitmap({
            	image:img,
            	rect:rect,
            	width:this.width-10,
            	height:rect[3],
            	x:5,
            	y:260,
            }).addTo(this);
			
			var headc = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('headc'),
				x:10,
				y:20
			}).addTo(this);
			
			this.backBtn = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('image2123'),
				x:this.width - 100,
				y:this.height - 70
			}).addTo(this);
			this.backBtn.on(Hilo.event.POINTER_START,function(e){
				panel.hide();
			});
			
            var goldtxt = new game.NumFontBmp({
            	txt:game.userData.userInfo.goldboxNum,
				sourceImg: img,
				x: goldtxtBg.x + 30,
				y: goldtxtBg.y +8,
            }).addTo(this);
            
            var cointxt = new game.NumFontBmp({
            	txt: game.userData.userInfo.goldcoinNum,
				sourceImg: img,
				x: boxtxtBg.x + 10,
				y: boxtxtBg.y  +8,
            }).addTo(this);
            
            var powertxt = new game.NumFontBmp({
            	txt: '45',
				sourceImg: img,
				x: powertxtBg.x + 30,
				y: powertxtBg.y + 10,
            }).addTo(this);
            
            var hptxt = new game.NumFontBmp({
            	txt: '2',
				sourceImg:img,
				x: hptxtBg.x + 40,
				y: hptxtBg.y + 10,
            }).addTo(this);
            
            var nimbletxt = new game.NumFontBmp({
            	txt: '55',
				sourceImg:img,
				x: nimbletxtBg.x + 30,
				y: nimbletxtBg.y + 10,
            }).addTo(this);
            
            var exptxt = new game.NumFontBmp({
            	txt: '85',
				sourceImg:img,
				x: exptxtBg.x + 40,
				y: exptxtBg.y + 10,
            }).addTo(this);
            
            
            
            this.equipImg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('prop_icon_001'),
            	x:equipImgBg.x + 12,
            	y:equipImgBg.y + 12,
            }).addTo(this);
            this.itemImg = new Hilo.Bitmap({
            	image:img,
            	rect:game.configdata.getPngSize('prop_icon_001'),
            	x:itemImgBg.x + 12,
            	y:itemImgBg.y + 12,
            }).addTo(this);
            this.itemsLayer = new Hilo.Container({
            	x:itemsBg.x +6,
            	y:itemsBg.y +7,
            }).addTo(this);
            
			var font = "14px arial";
			this.description = new Hilo.Text({
				font: font,
                color:'white',
               	text: game.configdata.GAMETXTS.itemdescription,
              	lineSpacing: 10,
               	width:descriptionBg.width,
               	height:descriptionBg.height,
              	x:descriptionBg.x+5,
               	y:descriptionBg.y+5
			}).addTo(this);
			
			new Hilo.Text({
				x:14,
				y:this.height - 60, 
				lineSpacing: 10,
				color:game.configdata.GAME_COLORS.btntxtclr,
				text:game.configdata.GAMETXTS.bagnote,
			}).addTo(this);
			
			var btxX = this.width - 90;
			var btnY = descriptionBg.y + 5;
			this.loadItemBtn = new game.ImgTxtBtn({
				txt:game.configdata.GAMETXTS.loaditem,
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'uihead11',
				disy:0,
				x:btxX,
				y:btnY,
				visible:false
			}).addTo(this);
			this.loadItemBtn.on(Hilo.event.POINTER_START,function(e){
				var data = shopdata[panel.selectItem.index];
				var bagdata = game.userData.heroData.bagdata;
				if(data.category == 'EQUIP'){
					bagdata[1][0] = panel.selectItem.arraypos;
				}else{
					bagdata[1][1] = panel.selectItem.arraypos;
				}
				panel.refresh(bagdata);
				panel.setNoSelectState();
			});
			this.throwItemBtn = new game.ImgTxtBtn({
				txt:game.configdata.GAMETXTS.throwitem,
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'uihead11',
				disy:0,
				x:btxX,
				y:btnY + 60,
				visible:false,
			}).addTo(this);
			this.throwItemBtn.on(Hilo.event.POINTER_START,function(e){
				var data = shopdata[panel.selectItem.index];
				var bagdata = game.userData.heroData.bagdata;
				bagdata[0].splice(panel.selectItem.arraypos,1);
				if(data.category == 'EQUIP'){
					if(bagdata[1][0] == panel.selectItem.arraypos){
						bagdata[1][0] = -1;
					}
					if(panel.selectItem.arraypos < bagdata[1][0]){
						bagdata[1][0]--;
					}
					if(panel.selectItem.arraypos < bagdata[1][1]){
						bagdata[1][1]--;
					}
				}else{
					if(bagdata[1][1] == panel.selectItem.arraypos){
						bagdata[1][1] = -1;
					}
					if(panel.selectItem.arraypos < bagdata[1][1]){
						bagdata[1][1]--;
					}
					if(panel.selectItem.arraypos < bagdata[1][0]){
						bagdata[1][0]--;
					}
				}
				console.log(bagdata[0]);
				console.log(bagdata[1]);
				panel.refresh(bagdata);
				panel.setNoSelectState();
			});
			
			this.putStoreBtn = new game.ImgTxtBtn({
				txt:game.configdata.GAMETXTS.putstore,
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'uihead11',
				disy:0,
				x:btxX,
				y:btnY+60,
				visible:false,
			}).addTo(this);
			this.putStoreBtn.on(Hilo.event.POINTER_START,function(e){
				var panel = this.parent;
				var storedata = game.userData.heroData.storedata;
				if(storedata.length >= 18){
					 var flashtxt = new game.FlashtxtPanel({
							x:panel.width/2,
							y:panel.height/2,
						}).addTo(panel);
					flashtxt.show('仓库容量已满');
				}else{
					var data = shopdata[panel.selectItem.index];
					storedata.push(data.index);
					panel.parent.goodslayer.removeAllChildren();
					panel.parent.addGoods();
					var bagdata = game.userData.heroData.bagdata;
					bagdata[0].splice(panel.selectItem.arraypos,1);
					if(data.category == 'EQUIP'){
						if(bagdata[1][0] == panel.selectItem.arraypos){
							bagdata[1][0] = -1;
						}
						if(panel.selectItem.arraypos < bagdata[1][0]){
							bagdata[1][0]--;
						}
						if(panel.selectItem.arraypos < bagdata[1][1]){
							bagdata[1][1]--;
						}
						}else{
							if(bagdata[1][1] == panel.selectItem.arraypos){
								bagdata[1][1] = -1;
						}
						if(panel.selectItem.arraypos < bagdata[1][1]){
							bagdata[1][1]--;
						}
						if(panel.selectItem.arraypos < bagdata[1][0]){
							bagdata[1][0]--;
						}
					}
						console.log(bagdata[0]);
						console.log(bagdata[1]);
						panel.refresh(bagdata);
						panel.setNoSelectState();
				}
			});
		},
		addItem:function(iconindex,xpos,arraypos){
			var panel = this;
			var data = shopdata[iconindex];
			var icon = new Hilo.Bitmap({
					image:game.getImg('uimap'),
					rect:game.configdata.getPngSize(data.thumbnail),
					x:xpos,
				}).addTo(this.itemsLayer);
			icon.index = data.index;
			icon.category = data.category;
			icon.name = data.name;
			icon.arraypos = arraypos;
			icon.on(Hilo.event.POINTER_START,function(e){
				console.log(this.name);
				panel.itemborder.visible = true;
				panel.itemborder.x = this.x -2;
				panel.itemborder.y = this.y -3;
				panel.description.text = this.name;
				panel.selectItem = this;
				panel.loadItemBtn.visible = true;
				
				if(panel.isinstore){
					panel.putStoreBtn.visible = true;
					panel.throwItemBtn.visible = false;
				}else{
					panel.putStoreBtn.visible = false;
					panel.throwItemBtn.visible = true;
				}
			});
		},
		refresh:function(databag){
			this.itemsLayer.removeAllChildren();
			this.itemborder = new Hilo.Bitmap({
				image:game.getImg('uimap'),
				rect:game.configdata.getPngSize('image338'),
				x:-2,
				y:-3,
				visible:false,
			}).addTo(this.itemsLayer);
			var items = databag[0];
			for(var i=0;i<items.length;i++){
				var x =  i*40;
				var index = items[i];
				this.addItem(index,x,i);
			}
			var currentItem = databag[1];
			var bagdata = game.userData.heroData.bagdata;
			if(currentItem[0] != -1){
				var data = shopdata[bagdata[0][currentItem[0]]];
				this.equipImg.setImage(game.getImg('uimap'),game.configdata.getPngSize(data.img));
			}else{
				this.equipImg.setImage(game.getImg('uimap'),game.configdata.getPngSize('prop_icon_001'));
			}
			if(currentItem[1] != -1){
				var data = shopdata[bagdata[0][currentItem[1]]];
				this.itemImg.setImage(game.getImg('uimap'),game.configdata.getPngSize(data.img));
			}else{
				this.itemImg.setImage(game.getImg('uimap'),game.configdata.getPngSize('prop_icon_001'));
			}
		},
		setNoSelectState:function(){
			this.loadItemBtn.visible = false;
			this.throwItemBtn.visible = false;
			this.putStoreBtn.visible = false;
			this.description.text = game.configdata.GAMETXTS.itemdescription;
		},
		hide:function(){
			this.removeFromParent();
		},
	});
	
	var Itembox = ns.Itembox = Hilo.Class.create({
		Extends: Hilo.Container,
		bg:null,
		itempic:null,
		index:0,
		name:'',
		empty:false,  
		ignoreMulClick:false,
		category:'EQUIP',
		name:'',
		value:1,
		constructor: function(properties) {
			Itembox.superclass.constructor.call(this, properties);
			this.init(properties);
			this.interval = 10;
		},
		init: function(properties) {
			var img = game.getImg('uimap');
			var self = this;
			this.data = shopdata[this.index];
			this.bg = new Hilo.Bitmap({
				image:img,
				visible:false,
				rect:game.configdata.getPngSize('small_icon_whiteborder'),
			}).addTo(this);
			this.itempic = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize(this.data.thumbnail),
			}).addTo(this);
			this.on(Hilo.event.POINTER_START,function(e){
				if(self.ignoreMulClick)
					return;
				self.ignoreMulClick = true;
				self.put();
			});
		},
		put:function(){
			var bagdata = game.userData.heroData.bagdata;
			if(bagdata[0].length >= 5){
				console.log('放入背包失败，背包已满');
				game.currentScene.attentionPanel.show(game.configdata.GAMETXTS.bagIsnotenough);
				this.ignoreMulClick = false;
			}else{
				this.empty = true;
				var self = this;
				self.bg.visible = true;
				var data = shopdata[this.index];
				game.currentScene.attentionPanel.show(game.configdata.GAMETXTS.get+data.name);
				game.currentScene.topHeadPanel.loadItem(this.category,this.index,this.value);
				new Hilo.Tween.to(this.itempic,{
					y:self.itempic.y - 100,
					alpha:0
				},{
					duration:game.configdata.changItemTime,
					onComplete:function(){
						self.ignoreMulClick = false;
						self.removeFromParent();
					}
				});
			}
		},
		retrieve:function(){
			this.empty = false;
			var self = this;
			self.itempic.alpha = 0;
			self.itempic.y = 0;
			game.currentScene.unloadItem();
			new Hilo.Tween.to(this.itempic,{
				alpha:1
			},{
				duration:game.configdata.changItemTime/2,
				onComplete:function(){
					self.ignoreMulClick = false;
					self.bg.visible = false;
				}
			});
		}
	});
	
	var TopItembox = ns.TopItembox = Hilo.Class.create({
		Extends: Hilo.Container,
		defaultPic:null,
		itempic:null,
		index:0,
		name:'',
		empty:false,  
		category:'',
		value:0,
		valuetxt:null,
		inity:-1,
		constructor: function(properties) {
			TopItembox.superclass.constructor.call(this, properties);
			this.init(properties);
			this.interval = 10;
		},
		init: function(properties) {
			var img = game.getImg('uimap');
			var self = this;
			var bg = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('uihead09'),
			}).addTo(this);
			
			var rect = game.configdata.getPngSize('prop_icon_001');
			this.inity = bg.height/2 - rect[3]/2;
			this.defaultPic = new Hilo.Bitmap({
				image:img,
				rect:rect,
				x:bg.width/2 - rect[2]/2+2,
				y:this.inity,
			}).addTo(this);
			this.itempic = new Hilo.Bitmap({
				image:img,
				visible:false,
				rect:rect,
				x:bg.width/2 - rect[2]/2+2,
				y:this.inity,
			}).addTo(this);
			this.valuetxt = new game.NumFontBmp({
				txt: this.value.toString(),
				sourceImg: game.getImg('uimap'),
				y: 50,
				x: 50,
			}).addTo(this);
			if(this.category == 'EQUIP' || this.value == 0){
				this.valuetxt.visible = false;
			}else{
				this.valuetxt.visible = true;
			}
			this.on(Hilo.event.POINTER_START,function(e){
				if(this.category == 'EQUIP' || this.value == 0){
					return;
				}
				this.value--;
				if(this.value <= 0){
					this.unloaditem();
					this.valuetxt.visible = false;
				}else{
					this.valuetxt.setText(this.value);
				}
				this.parent.useItem(this.category,this.index,1);
			});
		},
		initItem:function(data,value){
			if(value == 0)
				return;
			this.value = value;
			this.category = data.category; 
			this.index = data.index;
			
			var rectname = game.configdata.getPngSize(data.img);
			this.itempic.setImage(game.getImg('uimap'),rectname);
			if(value > 1){
				this.valuetxt.setText(value);
				this.valuetxt.visible = true;
			}else{
				this.valuetxt.visible = false;
			}
				
			this.itempic.visible = true;
			this.defaultPic.visible = false;
			this.defaultPic.alpha = 1;
			
		},
		loaditem:function(category,index,value){
			var self = this;
			if(value == null)
				value = 1;
			this.value = value;
			this.category = category;
			this.index = index;
			var data = shopdata[index];
			var rectname = game.configdata.getPngSize(data.img);
			this.itempic.setImage(game.getImg('uimap'),rectname);
			new Hilo.Tween.to(this.defaultPic,{
				y:self.defaultPic.y + 80,
				alpha:0
			},{
				duration:game.configdata.changItemTime,
				onComplete:function(){
					self.itempic.visible = true;
					self.itempic.y = self.inity;
					self.defaultPic.visible = false;
					self.defaultPic.alpha = 1;
					self.defaultPic.y = self.inity;
					self.valuetxt.setText(self.value);
					if(self.category == 'EQUIP' || self.value == 0){
						self.valuetxt.visible = false;
					}else{
						self.valuetxt.visible = true;
					}
				}
			});
		},
		unloaditem:function(){
			var self = this;
			new Hilo.Tween.to(this.itempic,{
				y:self.itempic.y + 80,
				alpha:0
			},{
				duration:game.configdata.changItemTime/2,
				onComplete:function(){
					self.defaultPic.visible = true;
					self.defaultPic.y = self.inity;
					self.itempic.visible = false;
					self.itempic.alpha = 1;
					self.itempic.y = self.inity;
				}
			});
		},
		
		onUpdate:function(){
			
		}
	});
	
	var FlashHand = ns.FlashHand = Hilo.Class.create({
		Extends: Hilo.Container,
		handImg:null,
		speed:3,
		text:'',
		clr:0,
		constructor: function(properties) {
			FlashHand.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var img = game.getImg('uimap');
			var self = this;
			this.handImg = new Hilo.Bitmap({
				image:img,
				rect:game.configdata.getPngSize('hand_001'),
				x:220,
				y:300,
			}).addTo(this);
			new Hilo.Tween.to(this,{
				y:0,
			},{
				delay:500,
				duration:100,
				onComplete:function(){
					self.handImg.setImage(img,game.configdata.getPngSize('hand_002'));
					new Hilo.Tween.to(self,{
						y:self.y-60,
					},{
						duration:2000,
						onComplete:function(){
							self.removeFromParent();
						}
					});
				}
			});
		},
		flashup:function(){
			
		},
		
		onUpdate:function(){
			
		}
	});	
	
	var FlashUpText = ns.FlashUpText = Hilo.Class.create({
		Extends: Hilo.Container,
		speed:3,
		text:'',
		clr:0,
		txt1:null,
		txt2:null,
		txtclr:null,
		constructor: function(properties) {
			FlashUpText.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			var img = game.getImg('uimap');
			var self = this;
			var font = "15px arial";
			this.txt1 = new Hilo.Text({
                	font: font,
                	color:'black',
                	text: this.text,
               		lineSpacing: 10,
                	textAlign:'center',
                	textVAligh:'bottom',
           		 }).addTo(this);
           	this.txt2 = new Hilo.Text({
                	font: font,
                	color:this.txtclr,
                	text: this.text,
               		lineSpacing: 10,
                	textAlign:'center',
                	textVAligh:'bottom',
           		 }).addTo(this);
           	this.txt1.y = this.txt2.y+1;
           	this.txt1.x = this.txt2.x+1;
           	
           	this.flashup();
		},
		flashup:function(){
			var self = this;
			new Hilo.Tween.to(this,{
				y:self.y - 50,
				alpha:0.3
			},{
				//delay:200,
				duration:800,
				onComplete:function(){
					self.removeFromParent();
				}
			});
		},
		
		onUpdate:function(){
			
		}
	});
	
})(window.game);