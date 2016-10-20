(function(ns) {
	var DepotCar = ns.DepotCar = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'DepotCar',
		carimg:null,
		isDescend:false,
		constructor: function(properties) {
			DepotCar.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			this.carimg = new Hilo.Bitmap({
				image:'img/car.png',
				pivotY:265,
				pivotX:80,
				y:265,
				x:80,
			}).addTo(this);
		    var g3 = new Hilo.Graphics();
            g3.lineStyle(2, "#009898").drawCircle(0, 0, 2).endFill().addTo(this);
		},
		onUpdate:function(){
			this.autoDescend();
		},
		autoDescend:function(){
			if(this.isDescend){
				if(this.carimg.rotation < 0){
					this.carimg.rotation += 0.2;
				}else{
					this.carimg.rotation = 0;
					this.isDescend = false;
				}
			}
		}
	});
	
})(window.game);