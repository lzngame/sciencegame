(function(ns) {
	var Npc = ns.Npc = Hilo.Class.create({
		Extends: Hilo.Sprite,
		name: '',
		atlas: null,
		taskFinished:false,
		
		initx: 0,
		isActionFirst:true,    //动作可能持续好多帧，每帧还会持续多个循环，这个值指示在动作的第一次发生 防止消息粘包
		framename: '',
		isdead:false,
		iswin:false,
		attackKeyFrame:2,
		hitoffsetx:32,
		hitoffsety:32,
		shieldoffsetx:50,
		shieldoffsety:32,
		petrifyTime:0,
		constructor: function(properties) {
			Npc.superclass.constructor.call(this, properties);
			this.init(properties);
			this.initx = this.x;
		},
		showTask:function(){
			console.log('开始对话');
			this.off();
			var self = this;
			new Hilo.Tween.to(this,{
				alpha:0.1,
			},{
				delay:500,
				duration:500,
				onComplete:function(){
					self.removeFromParent();
					game.currentScene.attentionPanel.show('你已得到祝福');
					sendMsg(game.currentScene,game.configdata.MSAGE_TYPE.monsterdead,'npc had finished');
				}
			});
		},
		init: function(properties) { 
			console.log('%s init', this);
			this.on(Hilo.event.POINTER_START,function(e){
				this.showTask();
			});
		},
	});
})(window.game);

