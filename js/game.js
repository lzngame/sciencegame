(function() {
	window.onload = function() {
		game.init();
	};

	var game = window.game = {
		self: this,
		canvas: null,
		screenW: 0,
		screenH: 0,
		loadqueue: null,
		isLoadfinished: false,
		isPause: false,
		stage: null,
		ticker: null,
		canvas: null,
		clock: null,
		previousScene: null,
		currentScene: null,
		scenes: null,
		loadingimg: null,
		log: null,
		gamestart: false,
		winWidth:0,
		winHeight:0,
		init: function() {
			var browserInfo = Hilo.browser;
			var winWidth = window.innerWidth || document.documentElement.clientWidth;
			var winHeight = window.innerHeight || document.documentElement.clientHeight;
			this.screenWidth = winWidth;
			this.screenHeight = winHeight;
			if (this.screenWidth > game.configdata.MAXSIZE.maxWidth)
				this.screenWidth = game.configdata.MAXSIZE.maxWidth;
			if (this.screenHeight > game.configdata.MAXSIZE.maxHeight)
				this.screenHeight = game.configdata.MAXSIZE.maxHeight;
			this.refresh();
			this.switchScene(game.configdata.SCENE_NAMES.load);
		},
		refresh: function() {
			console.log('game init :window had loaded');
			console.log('screen size:(%d,%d)', this.screenWidth, this.screenHeight);
			this.loadqueue = new Hilo.LoadQueue();
			this.initstage();
			this.initEvent();
			this.initScene();
		},
		initstage: function() {
			var gameContainer = document.getElementById("game-container");
			/*gameContainer.style.width = this.screenWidth + 'px';
			gameContainer.style.height = this.screenHeight + 'px';
			gameContainer.style.background = 'red';*/
			
			this.initcanvas(this.screenWidth, this.screenHeight);
			this.stage = new Hilo.Stage({
				renderType: 'canvas',
				container: gameContainer,
				canvas: this.canvas,
				width: this.screenWidth,
				height: this.screenHeight,
				background: game.configdata.BGCOLOR,
			});
			game.configdata.mainStageSize.width = this.stage.width;
			game.configdata.mainStageSize.height = this.stage.height;
			this.ticker = new Hilo.Ticker(game.configdata.FPS);
			this.ticker.addTick(game.clock);
			this.ticker.addTick(this.stage);
			this.ticker.addTick(Hilo.Tween);
			this.ticker.start();
		},
		initEvent: function() {
			this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
			this.stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true);
			this.stage.enableDOMEvent(Hilo.event.POINTER_END, true);
			
			
		},
		initcanvas: function(w, h) {
			var canvas = document.getElementById(game.configdata.CANVASID);
			canvas.width = w;
			canvas.height = h;
			this.canvas = canvas;
		},
		switchScene: function(scenename, data) {
			if (this.currentScene != null) {
				this.currentScene.deactive();
				this.previousScene = this.currentScene;
			}
			this.currentScene = this.scenes[scenename];
			this.currentScene.active(data);
			//addfps(10,210,this.currentScene);
		},
		initScene: function() {
			this.scenes = {};
			this.scenes[game.configdata.SCENE_NAMES.load]    = new game.LoadScene();
			this.scenes[game.configdata.SCENE_NAMES.main]    = new game.MainScene();

			this.scenes[game.configdata.SCENE_NAMES.story]   = new game.StoryScene();
			this.scenes[game.configdata.SCENE_NAMES.map]     = new game.MapScene();
			this.scenes[game.configdata.SCENE_NAMES.stash]   = new game.StashScene();
			this.scenes[game.configdata.SCENE_NAMES.failure] = new game.FailureScene();
			this.scenes[game.configdata.SCENE_NAMES.unlock]  = new game.UnlockScene();
			this.scenes[game.configdata.SCENE_NAMES.shop]    = new game.ShopScene();
			this.scenes[game.configdata.SCENE_NAMES.win]     = new game.WinoverScene();
			this.scenes[game.configdata.SCENE_NAMES.coach]   = new game.CoachScene();
			
			this.scenes[game.configdata.SCENE_NAMES.attack]       = new game.AttackScene();
			this.scenes[game.configdata.SCENE_NAMES.choice]       = new game.ChoiceScene();
			this.scenes[game.configdata.SCENE_NAMES.cookieroom]   = new game.CookieroomScene();
			this.scenes[game.configdata.SCENE_NAMES.lift]         = new game.LifeScene();
			this.scenes[game.configdata.SCENE_NAMES.runaway]      = new game.RunawayScene();
			
		},
		getImg: function(id) {
			var img = this.loadqueue.getContent(id);
			return img;
		},
		pauseGame: function(ispause) {
			ispause ? this.ticker.pause() : this.ticker.resume();
		},
		checkInRect:function(x,y,x1,y1,w1,h1){
			return  (x > x1 && x < x1+w1 && y > y1 && y <y1+h1);
		},
	};
})();