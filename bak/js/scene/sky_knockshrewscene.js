(function(ns) {
	var SkyKnockshrewscene = ns.SkyKnockshrewscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.sky_knockshrew,
		initPosx:650,
		initPosy:500,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		poses:null,
		currentQuestionIndex:-1,
		question:null,
		constructor: function(properties) {
			SkyKnockshrewscene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.x = 0;
			this.y = 0;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
		},
		active: function(passdata) {
			console.log('%s active:', this.name);
			this.scene = this;
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks = [];
			this.initBlocks(this.blocks);
			this.items = {};
			
			this.layoutBgMap();
			
			this.initTouchEvent();
			this.initFingerMouse();
			
			this.layoutUI();
			
			game.sounds.play(14,true);
			this.poses = [[166,395],[484,395],[796,395]];
			this.question = [['question1.png','a'],['question2.png','a'],['question3.png','a'],['question4.png','a'],['question5.png','a']];
			this.showShrew();
			this.showQuestion(1);
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			for(var i in this.items){
				var obj = this.items[i];
				if(obj.status != null){
					if(this.checkActiveItemWithoutPos(mouseX,mouseY,obj)){
						return true;
					}
				}
			}
			return false;
		},
		showQuestion:function(index){
			this.items['q1'].visible = false;
			this.items['q2'].visible = false;
			this.items['q3'].visible = false;
			this.items['q4'].visible = false;
			this.items['q5'].visible = false;
			var name = 'q'+index.toString();
			this.items[name].visible = true;
			this.currentQuestionIndex = index;
		},
		showShrew:function(){
			var a = this.items['a'];
			var b = this.items['b'];
			var c = this.items['c'];
			var t = [a,b,c];
			var p = [[0,1,2],[1,2,0],[2,1,0],[2,0,1],[0,2,1],[1,0,2]];
			var index = Math.floor(Math.random() * p.length);
			var item = p[index];
			var p1 = item[0];
			var p2 = item[1];
			var p3 = item[2];
			var p1x = this.poses[p1][0];
			var p1y = this.poses[p1][1];
			var p2x = this.poses[p2][0];
			var p2y = this.poses[p2][1];
			var p3x = this.poses[p3][0];
			var p3y = this.poses[p3][1];
			a.x = p1x;
			a.y = p1y;
			b.x = p2x;
			b.y = p2y;
			c.x = p3x;
			c.y = p3y;
			a.alpha = 0;
			b.alpha = 0;
			c.alpha = 0;
			new Hilo.Tween.to(a,{alpha:1},{duration:200});
			new Hilo.Tween.to(b,{alpha:1},{duration:200});
			new Hilo.Tween.to(c,{alpha:1},{duration:200});
		},
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['a'])){
				var obj = this.items['a'];
				console.log(obj);
				this.showBesom(mouseX,mouseY);
				this.checkAnswer('a');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['b'])){
				var obj = this.items['b'];
				console.log(obj);
				this.showBesom(mouseX,mouseY);
				this.checkAnswer('b');
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['c'])){
				var obj = this.items['c'];
				console.log(obj);
				this.showBesom(mouseX,mouseY);
				this.checkAnswer('c');
				return true;
			}
			return false;
		},
		showBesom:function(mx,my){
			this.items['besom'].visible = true;
			this.items['besom'].x = mx-100;
			this.items['besom'].y = my-100;
		},
		checkAnswer:function(answer){
			if(this.currentQuestionIndex >= 5){
				new Hilo.Tween.to(this,{alpha:1},{duration:100,delay:1000,onComplete:function(){
							game.switchScene(game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.ecosystem);
				}});
			}
			var right = this.question[this.currentQuestionIndex-1][1];
			if(right == answer){
				this.currentQuestionIndex++;
				this.showQuestion(this.currentQuestionIndex);
				this.showShrew();
				return true;
			}else{
				return false;
			}
		},
		receiveMsg: function(msg) {
			console.log('Not Remove');	
		},
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		createActiveObj:function(objname,x,y,targetx,targety,readyImgurl,clickrect,status,isvisible){
			return new game.ActiveObject({
				name:objname,
				x:x,
				y:y,
				targetx:targetx,
				targety:targety,
				readyImgUrl:readyImgurl,
				finishedImgUrl:readyImgurl,
				clickArea:clickrect,
				status:status,
				visible:isvisible,
			}).addTo(this);
		},
		layoutUIElement:function(baseurl,arraydata){
			for(var i=0;i<arraydata.length;i++){
				var item = arraydata[i];
				var itemtype = item[0];
				var type = game.configdata.LAYOUTTYPE.activeobj;
				if(itemtype == 1)
					type = game.configdata.LAYOUTTYPE.img;
				var obj = item[1];
				var img = item[2];
				img = baseurl+img;
				if(type == game.configdata.LAYOUTTYPE.activeobj){
					var status = item[3];
					var x = item[4];
					var y = item[5];
					var targetx = item[6];
					var targety = item[7];
					var clickrect = item[8];
					var isvisible = item[9]=='t';
					this.items[obj] = this.createActiveObj(obj,x,y,targetx,targety,img,clickrect,status,isvisible);
				}
				if(type == game.configdata.LAYOUTTYPE.img){
					var obj = item[1];
					var x = item[3];
					var y = item[4];
					var isvisible = item[5]=='t';
					this.items[obj] = new Hilo.Bitmap({image:img,x:x,y:y,visible:isvisible}).addTo(this);
				}
			}
		},
		layoutBgMap:function(){
			var scene = this;
			var data = [
[1, 'bg', 'sky1bg.jpg', 0, 0, 't'],
[1, 'q1', 'question1.png', 291, 112, 't'],
[1, 'q2', 'question2.png', 291, 112, 't'],
[1, 'q3', 'question3.png', 291, 112, 't'],
[1, 'q4', 'question4.png', 291, 112, 't'],
[1, 'q5', 'question5.png', 291, 112, 't'],
[2, 'a', 'mousea.png', 1, 820, 534, 30, 130, [0, 0, 180, 190], 't'],
[2, 'b', 'mouseb.png', 1, 520, 534, 30, 130, [0, 0, 180, 190], 't'],
[2, 'c', 'mousec.png', 1, 320, 534, 30, 130, [0, 0, 180, 190], 't'],
[1, 'besom', 'besom.png', 291, 112, 'f'],
			];
		
			this.layoutUIElement('img/sky/1/',data);
			//game.sounds.play(17,true);
		},
		
		createSprite:function(sourceatlas,defaultaction,x,y,interval,parent){
			return new Hilo.Sprite({
				frames:sourceatlas.getSprite(defaultaction),
				interval:interval,
				x:x,
				y:y,
			}).addTo(parent);
		},
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
			if(this.currentOnhandObj == null){
				//this.hero.switchState('nocan',10);
			}
		},
		
		onUpdate:function(){
			
		},
	});
})(window.game);