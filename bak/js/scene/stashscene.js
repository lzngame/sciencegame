(function(ns) {
	var StashScene = ns.StashScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.stash,
		goodslayer:null,
		ignore:false,
		constructor: function(properties) {
			StashScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.width = game.configdata.mainStageSize.width;
			this.height = game.configdata.mainStageSize.height;
			this.y = game.screenHeight/2 - this.height/2;
			this.x = game.screenWidth/2 - this.width/2;
		},
		active: function(data) {
			console.log('%s active:', this.name);
			this.addTo(game.stage);
			var scene = this;
			
			var img = game.getImg('uimap');
			new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('bg01ww'),
				width:this.width,
				height:this.height
			}).addTo(this);
			var rect = game.configdata.getPngSize('store01');
			var bg = new Hilo.Bitmap({
				image: img,
				rect: rect,
				x:this.width/2 - rect[2]/2,
				y:this.height/2 - rect[3]/2,
			}).addTo(this);
			if(this.height <= 480)
				bg.y += 30;
			var exitbtn = new Hilo.Bitmap({
				image: img,
				rect: game.configdata.getPngSize('btn_icon_08'),
			}).addTo(this);
			exitbtn.on(Hilo.event.POINTER_START,function(e){
				game.switchScene(game.configdata.SCENE_NAMES.map);
			});
			this.goodslayer = new Hilo.Container({
				x:bg.x + 20,
				y:bg.y + 18,
			}).addTo(this);
			
			var checkBag = new game.ImgTxtBtn({
				txt:'背包',
				txtclr:game.configdata.GAME_COLORS.btntxtclr,
				rectname:'image348',
				disy:-2,
				x:this.width - 62,
				y:10,
			}).addTo(this);
			checkBag.on(Hilo.event.POINTER_START,function(e){
				var bagdata = game.userData.heroData.bagdata;
				var panel = new game.BagPanel({
				}).addTo(scene);
				panel.refresh(bagdata);
			});
			
			
			new Hilo.Bitmap({
				image: img,
				rect:game.configdata.getPngSize('image147'),
				x:70
			}).addTo(this);
			new game.NumFontBmp({
				txt:game.userData.userInfo.goldcoinNum,
				sourceImg: img,
				x:105,
				y:12
			}).addTo(this);
			
			
			this.addGoods();
		},
		addGoods:function(){
			var storedata = game.userData.heroData.storedata;
			for(var i=0;i<storedata.length;i++){
				this.addItem(storedata[i],i);
			}
		},
		addItem:function(index,i){
			var scene = this;
			clearData();
			var data = shopdata[index];
			var x = (i % 3) * 74
			var y = Math.floor(i / 3) * 74;
			var icon = new game.StoreIcon({
				img:data.img,
				x:x,
				y:y,
				storepos:i,
				index:data.index,
			}).addTo(this.goodslayer); 
			icon.on(Hilo.event.POINTER_START,function(e){
				if(scene.ignore)
					return;
				scene.ignore = true;
				var selectItem = this;
				scene.goodslayer.alpha = 0.3;
				var objdata = shopdata[selectItem.index];
				var goodspanel = new game.GoodsExePanel({
					x:scene.width/2,
					y:scene.height/2,
					titletxt:game.configdata.GAMETXTS.titletxt_store,
					txt1:objdata.name,
					txt2:objdata.description,
					goodsimg:this.img,
				}).addTo(scene);
				goodspanel.storepos = this.storepos;
				goodspanel.backbtn.on(Hilo.event.POINTER_START,function(e){
					this.parent.removeFromParent();
					scene.ignore = false;
					scene.goodslayer.alpha = 1;
				});
				goodspanel.throwBtn.on(Hilo.event.POINTER_START,function(e){
					var storedata = game.userData.heroData.storedata;
					scene.ignore = false;
					scene.goodslayer.alpha = 1;
					this.parent.removeFromParent();
					selectItem.visible = false;//.removeChildAt(okpanel.storepos);
					storedata[goodspanel.storepos] = -1;//storedata.splice(okpanel.storepos,1);
					goodspanel.storepos = -1;
					game.userData.saveHeroDataJsonSt();
				});
				goodspanel.putbagBtn.on(Hilo.event.POINTER_START,function(e){
					scene.ignore = false;
					scene.goodslayer.alpha = 1;
					var bagdata = game.userData.heroData.bagdata;
					this.parent.removeFromParent();
					if(bagdata[0].length >= 5){
						 var flashtxt = new game.FlashtxtPanel({
							x:scene.width/2,
							y:scene.height/2,
						}).addTo(scene);
						flashtxt.show('背包已满,请先清理背包');
					}else{
						selectItem.visible = false;
						game.userData.heroData.storedata[goodspanel.storepos] = -1;
						goodspanel.storepos = -1;
						bagdata[0].push(selectItem.index);
						game.userData.saveHeroDataJsonSt();
					}
				});
			});
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