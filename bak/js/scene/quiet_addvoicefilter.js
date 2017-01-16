(function(ns) {
	var QuietAddvoicefilterscene = ns.QuietAddvoicefilterscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.quiet_addvoicefilter,
		helpnote:'img/notes/quiet/quiet3help.png',
		
		initPosx:700,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		
		ispower:false,
		isopen:false,
		
		constructor: function(properties) {
			QuietAddvoicefilterscene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.x = 0;
			this.y = 0;
			this.pointerflag = 0;
			this.pointer1flag = 0;
			this.pointer2flag = 0;
			this.pointer3flag = 0;
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
			this.addHero(null,this.initPosx,this.initPosy);
			
			this.currentkey = 'empty';
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			
			this.layoutUI();
			
			game.sounds.play(14,true);
			
			this.isboxopen = false;
			this.ishammerdrop = false;
			this.isnoisehood = false;
			this.noisehoodloop = 0;
			this.istakehammer = false;
			this.isnailed = 0;
			this.step =0;
			
			this.setHelp();
			
            //this.showDialog('img/earth/1/note.png');
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
		
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		checkActiveObjects:function(mouseX,mouseY){
			var scene = this;
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['chair'])){
				var obj = this.items['chair'];
				if (scene.step===0) {
					scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						scene.step=1;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.handonProp('img/quiet/3/chair.png',660,520);
						//scene.items['leaflet'].status = 2;
					});
				}
				else{
					this.sayNo();
				}
				//this.pickSomething(obj,'pick',-60,-130,'img/sky/4/fanonhand.png',400);
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['deskput'])){
				var obj = this.items['deskput'];
				if (scene.step===1) {
					
					scene.currentOnhandImg.visible = false;
					delete scene.currentOnhandImg;
					scene.gotoDosomething(obj,1,0,0,'unlift',800,function(){
						scene.step=2;
					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.items['chair1'].status = 1;
						scene.items['chair1'].visible = true;
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['door2'])){
				var obj = this.items['door2'];
				if (scene.step===2) {
					scene.step=3;
					obj.status = 2;
					obj.visible = false;
					
					scene.items['door1'].visible = true;
					scene.items['door1'].status = 1;
					scene.items['noisehood'].visible = true;
					scene.items['noisehood'].status = 1;
				
				}
				else{
					this.sayNo();
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['chair1'])){
				var obj = this.items['chair1'];
				if(scene.step===3){
					scene.step=4;
					scene.hero.posx = 90;
					scene.hero.posy = 400;
						
				}
				else{
					this.sayNo();
				}
				
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['noisehood'])){
				var obj = this.items['noisehood'];
				if(scene.step===4){
					scene.gotoDosomething(obj,1,0,0,'enclosure',800,function(){
						scene.step=5;
					},function(){
						scene.hero.posx = 700;
						scene.hero.posy = 630;
						obj.visible=false;
						obj.status=2;
						scene.handonProp('img/quiet/3/noisecover.png',650,460);
						scene.items['noisehood1cover'].status=1;
						
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['noisehood1cover'])){
				var obj = this.items['noisehood1cover'];
					//scene.step=5;
				if(scene.step===5){
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'enclosure',800,function(){
						scene.isnoisehood=true;
					},function(){
						obj.visible=false;
						obj.status=2;
						scene.items['noisehood1'].visible=true;
						scene.items['noisehood1'].status=2;
						scene.items['box1'].status=1;
						scene.items['noisehood1'].y=273;
						if(scene.isboxopen){
							scene.items['box1'].status=2;
						}
						if(scene.istakehammer&&scene.isnailed===0){
							scene.handonProp('img/quiet/3/hammer.png',655,500);
						}
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['noisehood1'])){
				var obj = this.items['noisehood1'];
					//scene.step=6;
				if(scene.step===5){
					if (!scene.currentOnhandImg) {
						scene.gotoDosomething(obj,1,0,0,'lift',800,function(){
						},function(){
							
							scene.hero.posx = 700;
							scene.hero.posy = 630;
							scene.items['noisehood1cover'].visible=true;
							scene.items['noisehood1cover'].status=1;
							scene.items['noisehood1'].visible=false;
							scene.items['noisehood1'].status=2;
							scene.handonProp('img/quiet/3/noisecover.png',650,460);
						});
					}
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['box1'])){
				var obj = this.items['box1'];
					//scene.step=6;
				if(scene.step===5&&scene.isnoisehood){
					scene.isboxopen=true;
					obj.visible=false;
					obj.status=2;
					scene.items['hammer'].status=2;
					scene.items['hammer'].visible=true;
					scene.items['box'].status=2;
					scene.items['box'].visible=true;
					scene.items['nails'].visible=true;
					scene.items['nails'].status=1;
				}
				else{
					this.sayNo();
				}
				//scene.items['noisehood1'].status=1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['box'])){
				var obj = this.items['box'];
					//scene.step=6;
				if(scene.istakehammer){
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible = false;
						delete scene.currentOnhandImg;
					}
					scene.gotoDosomething(obj,1,0,0,'enclosure',800,function(){
						obj.visible=true;
						obj.status=2;
						scene.istakehammer=false;
					},function(){
						scene.items['hammer'].status=1;
						scene.items['hammer'].visible=true;
					});
				}
				else{
					this.sayNo();
				}
				//scene.items['noisehood1'].status=1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['nails'])){
				var obj = this.items['nails'];
					//scene.step=6;
				if(scene.step===5&&scene.isnoisehood){
					scene.gotoDosomething(obj,1,0,0,'enclosure',800,function(){
						obj.visible=false;
						obj.status=2;
					},function(){
						scene.items['hammer'].status=1;
						new Hilo.Tween.to(scene.hero,{
							posx:652,
							posy:532,
							scaleX:1,
							scaleY:1,
						},{
							duration:120,
							delay:120,
							onComplete:function(){
								scene.hero.visible=false;
								scene.playboy.visible=true;
								scene.playboy.x = scene.hero.posx -115;
								scene.playboy.y = scene.hero.posy -283;
								scene.playboy.currentFrame = 0;
								scene.playboy._frames = scene.atlas.getSprite('enclosure');
								scene.playboy.loop = false;
								scene.playboy.play();
							}
						});
						
					});
					
				}
				else{
					this.sayNo();
				}
				//scene.items['noisehood1'].status=1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['hammer'])){
				var obj = this.items['hammer'];
				if (!scene.currentOnhandImg&&scene.isnoisehood) {
					//scene.step=6;
					scene.hero.posx=700;
					scene.hero.posy=630;
					scene.gotoDosomething(obj,1,0,0,'enclosure',800,function(){
						scene.istakehammer=true;
						obj.visible=false;
						obj.status=2;
					},function(){
						scene.handonProp('img/quiet/3/hammer.png',655,500);
						scene.items['nails4'].status=1;
						scene.items['nails4'].visible=true;
						scene.items['noisehood1cover'].status=2;
						scene.items['noisehood1'].status=2;
						scene.items['box'].status=1;
					});
				}
				else{
					this.sayNo();
				}
				//scene.items['noisehood1'].status=1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['nails4'])){
				if(scene.isnoisehood){
					var obj = this.items['nails4'];
					if (scene.currentOnhandImg) {
						scene.currentOnhandImg.visible=false;
						delete scene.currentOnhandImg;
					}
						//scene.step=6;
					scene.gotoDosomething(obj,1,0,0,'nail',800,function(){
						obj.visible=true;
						obj.status=2;
						scene.isnailed++;
					},function(){
						if (scene.currentOnhandImg) {
							scene.currentOnhandImg.visible=true;
						}
					});
				}
				else{
					this.sayNo();
				}
				//scene.items['noisehood1'].status=1;
				return true;
			}
			
			return false;
		},
		putinStrainer:function(){
			var obj = this.items['strainerobj'];
			obj.state++;
			var scene = this;
			this.currentOnhandImg.removeFromParent();
			scene.gotoDosomething(obj,1,0,0,'strainer',800,function(){
					
				},function(){
					scene.items['instrainer'+obj.state.toString()].visible = true;
				});
		},
		finishpass:function(){
			var scene = this;
			new Hilo.Tween.to(this,{
				alpha:1,
			},{
				duration:1000,
				delay:1000,
				onComplete:function(){
					game.drdialog.showTxt('img/water/6/note2.png');
            		game.drdialog.on(Hilo.event.POINTER_START,function(e){
            			game.drdialog.hide();
						game.switchScene(game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.ecosystem);
           			 });
				}
			})
		},
		pickSomething:function(obj,action,offsetx,offsety,onhandimg,time){
			var scene = this;
			scene.gotoDosomething(obj,1,0,0,action,time,function(){

					},function(){
						obj.status = 2;
						obj.visible = false;
						scene.handonProp(onhandimg,scene.hero.posx+offsetx,scene.hero.posy+offsety);
					});
		},
		gotoLadder:function(targetobj,scaleFact,h,playaction,onladderaction,time,onCall1,onCall2){
			var scene = this;
			scene.ignoreTouch = true;
			targetobj.status = 2;
			var targetx = targetobj.x + targetobj.targetx;
			var targety = targetobj.y + targetobj.targety;
			var ladddery = targety - h;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:scaleFact,
					scaleY:scaleFact,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.visible = false;
						scene.playboy.visible = true;
						scene.playboy.loop = true;
						scene.playboy.x = scene.hero.posx -115;
						scene.playboy.y = scene.hero.posy -283;
						scene.playboy.currentFrame = 0;
						scene.playboy.scaleX = scaleFact;
						scene.playboy.scaleY = scaleFact;
						scene.playboy._frames = scene.atlas.getSprite(playaction);
						scene.playboy.play();
						if(onCall1){
							onCall1();
						}
						game.sounds.play(19,false);
					}
				}).link(
					new Hilo.Tween.to(scene.playboy,{
							y:h,
						},{
							duration:time,
							//delay:delay,
							onComplete:function(){
								scene.playboy.stop();
								scene.playboy.currentFrame = 0;
								scene.playboy._frames = scene.atlas.getSprite(onladderaction);
								scene.ignoreTouch = false;
							}
						})
				);
		},
		downLadder:function(targetobj,h,scaleFact,playaction,time,onCall){
			var scene = this;
			scene.ignoreTouch = true;
			targetobj.status = 2;
			var targetx = targetobj.x + targetobj.targetx;
			var targety = targetobj.y + targetobj.targety;
			scene.playboy.currentFrame = 0;
			scene.playboy.loop = true;
			scene.playboy.scaleX = scaleFact;
			scene.playboy.scaleY = scaleFact;
			scene.playboy._frames = scene.atlas.getSprite(playaction);
			scene.playboy.play();
			new Hilo.Tween.to(scene.playboy, {
					y:h,
					scaleX:scaleFact,
					scaleY:scaleFact,
				}, {
					duration: time,
					onComplete: function() {
						scene.hero.visible = true;
						scene.playboy.visible = false;
						scene.playboy.loop = true;
						scene.ignoreTouch = false;
						if(onCall){
							onCall();
						}
					}
				});
		},
		gotoDosomething:function(targetobj,scaleFact,x,y,playaction,delay,onCall1,onCall2){
			var scene = this;
			scene.ignoreTouch = true;
			var targetx = targetobj.x + targetobj.targetx;
			var targety = targetobj.y + targetobj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero, {
					posx:targetx,
					posy:targety,
					scaleX:scaleFact,
					scaleY:scaleFact,
				}, {
					duration: 120,
					onComplete: function() {
						scene.hero.visible = false;
						scene.playboy.visible = true;
						scene.playboy.loop = false;
						scene.playboy.x = scene.hero.posx -115;
						scene.playboy.y = scene.hero.posy -283;
						scene.playboy.currentFrame = 0;
						scene.playboy.scaleX = scaleFact;
						scene.playboy.scaleY = scaleFact;
						scene.playboy._frames = scene.atlas.getSprite(playaction);
						scene.playboy.play();
						if(onCall1){
							onCall1();
						}
						game.sounds.play(19,false);
					}
				}).link(
					new Hilo.Tween.to(scene,{
							alpha:1,
						},{
							duration:310,
							delay:delay,
							onComplete:function(){
								scene.hero.visible = true;
								scene.playboy.visible = false;
 								new Hilo.Tween.to(scene.hero,{
									posx:initx,
									posy:inity,
									scaleX:1,
									scaleY:1,
								},{
									duration:120,
									delay:120,
									onComplete:function(){
										scene.hero.switchState('idle',10);
										scene.ignoreTouch = false;
										if(onCall2)
											onCall2();
									}
								});
							}
						})
				);
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
			[1, 'bg', 'quiet3bg.png', 0, 0, 't'],
			[2, 'box', 'box.png', 2,1031, 321,30, 180, [0, 0, 112, 87],  'f'],
			[2, 'box1', 'box2.png',2, 1027, 352,20, 100, [0, 0, 112, 47],  't'],
			[2, 'chair', 'chair.png', 1,891, 484,30, 100, [0, 0, 104, 60],  't'],
			[2, 'chair1', 'chair.png', 1,50, 384,30, 100, [0, 0, 104, 60],  'f'],
			[2, 'door1', 'door1.png', 2,154, 120,20, 100, [0, 0, 79, 114], 'f'],
			[2, 'door2', 'door2.png', 1,47, 141,0, 150, [0, 0, 106,87],  't'],
			[2, 'deskput', 'empty', 1,0, 380,50, 100, [0, 0, 180,87],  't'],
			[2, 'hammer', 'hammer.png',2,1031, 322,50, 200, [0, 0, 56, 65],'f'],
			[2, 'nails', 'nails.png', 2,1101, 342,50, 200, [0, 0, 33, 20],  'f'],
			[2, 'noisehood', 'noisehood.png',2,57, 177,20, 220, [0, 0, 98, 47],  'f'],
			[2, 'noisehood1', 'noisehood1.png', 2,612, 273,50, 150, [0, 0, 175,115],  'f'],
			[2, 'nails1', 'nails1.png', 2,620, 372,-50, 170, [0, 0, 12, 13],  't'],
			[2, 'nails2', 'nails2.png', 2,775, 371,-50, 170, [0, 0,  12, 13],  't'],
			[2, 'nails3', 'nails3.png', 2,775, 276,-50, 270, [0, 0,  12, 13],  't'],
			[2, 'nails4', 'nails4.png', 2,617, 278,-50, 270, [0, 0,  175, 115],  't'],
			[2, 'noisehood1cover', 'empty', 1,612, 273,50,300, [0, 0, 175,115],  't']
			//[2, 'button', 'button.png', 1,649, 337,20, 150, [0, 0, 32,32],  't'],
			//[2, 'specification', 'specification.png', 2,0, 0,-20, 150, [0, 0, 1089,979],  'f']
			
			//[1, 'puzzlebg', 'puzzlebg.png', 0, 0, 'f'],
			//[2, 'heatwithhightemperature', 'heatwithhightemperature.png', 2,124, 90,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'importmachine', 'importmachine.png', 2,449, 87,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'refiningheavily', 'refiningheavily.png',2,439, 355,20, 100, [0, 0, 61, 58],'f'],
			//[2, 'trituration', 'trituration.png', 2,119, 82,20, 100, [0, 0, 61, 58],  'f'],
			//[2, 'wastetreatment', 'wastetreatment.png', 2,120, 357,20, 100, [0, 0, 61, 58],  'f']
			];
		
			this.layoutUIElement('img/quiet/3/',data);
			//game.sounds.play(17,true);
           //scene.items['noisehood1'].y=700;
			this.atlas = new Hilo.TextureAtlas({
                image:'img/quiet/3/action.png',
                width:1024,
                height:2048,
                frames:[[212, 936, 210, 310], [424, 1560, 210, 310], [424, 1248, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 1560, 210, 310], [212, 1248, 210, 310], [424, 0, 210, 310], [424, 624, 210, 310], [636, 0, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 1560, 210, 310], [0, 1248, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	enclosure:{from:0,to:3},
                	unlift:[10,9,8,7,6,5,4],
                	lift:{from:4,to:10},
                	nail:{from:11,to:14},
                	put:{from:15,to:20},
                	stepbox:[0]
                }
           });
           
            this.playboy = this.createSprite(this.atlas,'lift',813,211,6,this);
            this.playboy.visible = false;
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
			var scene = this;
			if (scene.isnoisehood===true) {
				scene.noisehoodloop++;
				if (scene.noisehoodloop>1000 && scene.isnailed<1){
					var obj=scene.items['noisehood1'];
					obj.y=500;
					obj.status=1;
					obj.visible=true;
					scene.noisehoodloop=0;
					scene.isnoisehood=false;
					scene.isnailed=0;
					if(scene.istakehammer){
						scene.items['nails4'].status=1;
					}
					scene.items['noisehood1cover'].status=2;
				}
				else if (scene.isnailed) {
					scene.passoverReady('img/nextpasspoint.png',500,game.configdata.SCENE_NAMES.quiet_addcushionblocking);
				}
			}
		},
	});
})(window.game);