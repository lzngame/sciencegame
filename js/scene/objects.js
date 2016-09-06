(function(ns) {
	var FallObject = ns.FallObject = Hilo.Class.create({
		Extends: Hilo.Container,
		img:null,
		wholeState:null,
		brokenState:null,
		isFall:false,
		fallspeed:3,
		floorline:450,
		imgInity:0,
		constructor: function(properties) {
			FallObject.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.img = new Hilo.Bitmap({
				image: game.getImg('objects'),
				rect:game.configdata.getObjectSize(this.wholeState),
				y:this.imgInity,
			}).addTo(this);
			/*var rect = game.configdata.getPngSize('atack');
			var h = rect[2];
			this.maskgraphics = new Hilo.Graphics({
			});
			this.maskgraphics.lineStyle(1, "#000").beginFill("#1A0A04").drawRect(0, 0, rect[2], rect[3]).endFill();
			this.maskgraphics.scaleY = 1;
			
			this.moveimg = new Hilo.Bitmap({
				image: this.img,
				rect: rect,
			}).addTo(this);
			this.moveimg.mask = this.maskgraphics;
			
			this.bgimg = new Hilo.Bitmap({
				image: this.img,
				rect: rect,
				alpha:0.3,
			}).addTo(this);
			
			this.warncd = new Hilo.Bitmap({
				image: game.getImg('uimap2'),
				rect:game.configdata.getPngSize2('nocd'),
				x:-60,
				y:-75,
				alpha:0,
			}).addTo(this);*/
		},
		onUpdate:function(){
			if(this.isFall){
				if(this.y < this.floorline){
					this.fallspeed += 1;
					this.y += this.fallspeed;
				}else{
					this.isFall = false;
					this.img.setImage(game.getImg('objects'),game.configdata.getObjectSize(this.brokenState));
					this.fallspeed = 4;
					/*this.img = new Hilo.Bitmap({
						image: game.getImg('objects'),
						rect:game.configdata.getObjectSize('ceilingfan02'),
					}).addTo(this);*/
				}
			}
		},
		startCd:function(){
			this.maskgraphics.scaleY = 0;
			this.iscd = true;
			this.resetCd();
		},
		pause:function(){
			if(this.tween){
				this.tween.pause();
			}
		},
		continueCD:function(){
			if(this.tween){
				this.tween.resume();
			}
		},
		resetCd:function(){
			var self = this;
			self.iscd = true;
			self.tween = new Hilo.Tween.to(this.maskgraphics,{
				scaleY:1,
			},{
				delay:100,
				duration:self.cdtime,
				onComplete:function(){
					self.iscd = false;
				}
			});
		},
		warning:function(){
			var self = this;
			this.warncd.alpha = 1;
			this.warncd.visible = true;
			new Hilo.Tween.to(this.warncd,{
				alpha:0,
			},{
				duration:500,
				ease: Hilo.Ease.Bounce.EaseOut,
				onComplete:function(){
					
				}
			});
		},
	});
})(window.game);