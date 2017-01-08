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
		
		uiscene:null,
		drdialog:null,
		headPanel:null,
		 
		notepanel:null,
		toolippanel:null,
		toolspanel:null,
		soundmute:null,
		
		boydata:null,
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
			this.boydata = new game.BoyData();
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
			console.log('game init');
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
			this.scenes[game.configdata.SCENE_NAMES.load]         = new game.LoadScene();
			this.scenes[game.configdata.SCENE_NAMES.main]         = new game.MainScene();

			this.scenes[game.configdata.SCENE_NAMES.passchoice]   = new game.PassChoiceScene();
			this.scenes[game.configdata.SCENE_NAMES.gameover]     = new game.GameoverScene();
			
			this.scenes[game.configdata.SCENE_NAMES.traffic_repaircar]  = new game.Trafficrepaircarscene();
			this.scenes[game.configdata.SCENE_NAMES.traffic_escapebus]    = new game.Trafficescapebusscene();
			this.scenes[game.configdata.SCENE_NAMES.typhoon_room]    = new game.TyphoonRoomScene();
			this.scenes[game.configdata.SCENE_NAMES.typhoon_cave]    = new game.TyphoonCaveScene();
			this.scenes[game.configdata.SCENE_NAMES.typhoon_out]    = new game.TyphoonOutScene();
			this.scenes[game.configdata.SCENE_NAMES.confusion_switchbox]    = new game.ConfusionSwitchboxscene();
			this.scenes[game.configdata.SCENE_NAMES.confusion_cinema]    = new game.ConfusionCinemascene();
			this.scenes[game.configdata.SCENE_NAMES.confusion_doorway]    = new game.ConfusionDoorwayscene();
			this.scenes[game.configdata.SCENE_NAMES.plane_board]      = new game.PlaneBoardscene();
			this.scenes[game.configdata.SCENE_NAMES.plane_cabin]      = new game.PlaneCabinscene();
			this.scenes[game.configdata.SCENE_NAMES.plane_outside]    = new game.PlaneOutsidescene();
			this.scenes[game.configdata.SCENE_NAMES.water_intopipe]   = new game.WaterIntopipescene();
			this.scenes[game.configdata.SCENE_NAMES.water_closevalue]       = new game.WaterClosevaluescene();
			this.scenes[game.configdata.SCENE_NAMES.water_repairmachine]    = new game.WaterRepairmachinescene();
			this.scenes[game.configdata.SCENE_NAMES.water_clarifyingpool]   = new game.WaterClarifypoolscene();
			this.scenes[game.configdata.SCENE_NAMES.water_filterpool]   = new game.WaterFilterpoolscene();
			this.scenes[game.configdata.SCENE_NAMES.water_disinfector]   = new game.WaterDisinfectorscene();
			this.scenes[game.configdata.SCENE_NAMES.sky_knockshrew]   = new game.SkyKnockshrewscene();
			this.scenes[game.configdata.SCENE_NAMES.sky_repairairclearn]   = new game.SkyRepairairclearnscene();
			this.scenes[game.configdata.SCENE_NAMES.sky_closecoalgenerator]   = new game.SkyClosecoalgeneratorscene();
			this.scenes[game.configdata.SCENE_NAMES.sky_startwindgenerator]   = new game.SkyStartwindgeneratorscene();
			this.scenes[game.configdata.SCENE_NAMES.sky_startsungengerator]   = new game.Skystartsungengeratorscene();
			this.scenes[game.configdata.SCENE_NAMES.sky_saveplant]   = new game.SkySaveplantscene();
			this.scenes[game.configdata.SCENE_NAMES.earth_roadbattery]   = new game.EarthRoadbatteryscene();
			this.scenes[game.configdata.SCENE_NAMES.earth_farmlandbattery]   = new game.EarthFarmlandbatteryscene();
			this.scenes[game.configdata.SCENE_NAMES.earth_handlebattery]   = new game.EarthHandlebatteryscene();
			this.scenes[game.configdata.SCENE_NAMES.earth_changeplant]   = new game.EarthChangeplantscene();
			this.scenes[game.configdata.SCENE_NAMES.earth_fertilizer]   = new game.EarthFertilizerscene();
			this.scenes[game.configdata.SCENE_NAMES.earth_mendrubbishmachine]   = new game.EarthMendrubbishscene();
			this.scenes[game.configdata.SCENE_NAMES.quiet_enterfactory]   = new game.QuietEnterfactoryscene();
			this.scenes[game.configdata.SCENE_NAMES.quiet_shutmachine]   = new game.QuietShutmachinescene();
			this.scenes[game.configdata.SCENE_NAMES.quiet_addvoicefilter]   = new game.QuietAddvoicefilterscene();
			this.scenes[game.configdata.SCENE_NAMES.quiet_addcushionblocking]   = new game.QuietAddcushionblockscene();
			this.scenes[game.configdata.SCENE_NAMES.quiet_changebrokenglass]   = new game.QuietChangebrokenglassscene();
			this.scenes[game.configdata.SCENE_NAMES.quiet_wearearplug]   = new game.QuietWearearplugscene();
			this.scenes[game.configdata.SCENE_NAMES.maze_maze]   = new game.Mazemapscene();
			this.scenes[game.configdata.SCENE_NAMES.maze_puzzle]   = new game.MazePuzzlescene();
			this.scenes[game.configdata.SCENE_NAMES.maze_treasure]   = new game.MazeTreasurescene();
			this.scenes[game.configdata.SCENE_NAMES.earthquake_bedroom]   = new game.EarthQuakebedroomscene();
			this.scenes[game.configdata.SCENE_NAMES.earthquake_lobby]   = new game.EarthQuakelobbyscene();
			this.scenes[game.configdata.SCENE_NAMES.earthquake_kitchen]   = new game.Earthquakekitchenscene();
			this.scenes[game.configdata.SCENE_NAMES.fire_gallery]   = new game.Firegalleryscene();
			this.scenes[game.configdata.SCENE_NAMES.fire_door]   = new game.Firedoorscene();
			this.scenes[game.configdata.SCENE_NAMES.fire_washroom]   = new game.FireWashroomscene();
		},
		getImg: function(id) {
			var img = this.loadqueue.getContent(id);
			return img;
		},
		pauseGame: function(ispause) {
			ispause ? this.ticker.pause() : this.ticker.resume();
		},
		checkInRect:function(x,y,x1,y1,w1,h1){
			if(x > x1 && x < x1+w1 && y > y1 && y <y1+h1){
				return true;
			}else{
				return false;
			}
		},
		checkTwoBox:function(x1,y1,w1,h1,x2,y2,w2,h2){
			if (x1 >= x2 && x1 >= x2 + w2) {  
            	return false;  
        	} else if (x1 <= x2 && x1 + w1 <= x2) {  
            	return false;  
        	} else if (y1 >= y2 && y1 >= y2 + h2) {  
            	return false;  
        	} else if (y1 <= y2 && y1 + h1 <= y2) {  
            	return false;  
        	}  
        	return true;  
		},
		delIndexData:function(targetArray,indexItem){
			var index = targetArray.indexOf(indexItem);
			if(index != -1){
				targetArray.splice(index,1);
				return true;
			}else{
				return false;
			}
		}
	};
})();