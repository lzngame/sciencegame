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
				}
			}
		},
	});
	
	var ActiveObject = ns.ActiveObject = Hilo.Class.create({
		Extends: Hilo.Container,
		img:null,
		status:1,    //0 未激活 1激活 2完成
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
				image: game.getImg('objects'),
				rect:game.configdata.getObjectSize(this.readyImgUrl),
				y:this.imgInity,
			}).addTo(this);
			var x = this.clickArea[0];
			var y = this.clickArea[1];
			var w = this.clickArea[2];
			var h = this.clickArea[3];
			//var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
			//g.lineStyle(1,"#998877").beginFill("#0ff").drawRect(0,0,w,h).endFill().addTo(this);
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
})(window.game);