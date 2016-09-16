(function(ns) {
	var PointScene = ns.PointScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name: game.configdata.SCENE_NAMES.point,
		width: 0,
		height: 0,
		constructor: function(properties) {
			PointScene.superclass.constructor.call(this, properties);
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
			this.addTo(game.stage);
			this.alpha = 1;
			var scene = this;
			new Hilo.Tween.to(this,{
				alpha:1
			},{
				duration:1000
			});
			
			var img = game.getImg('uimap');
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