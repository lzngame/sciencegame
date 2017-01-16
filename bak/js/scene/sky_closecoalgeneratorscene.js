(function(ns) {
	var SkyClosecoalgeneratorscene = ns.SkyClosecoalgeneratorscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.sky_closecoalgenerator,
		helpnote:'img/notes/sky/sky3help.png',
		
		initPosx:200,
		initPosy:627,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		stream:null,
		robotnull:null,
		robotget:null,
		
		isblueonhand:false,
		isbrownonhand:false,
		
		iskeyonhand:false,
		isopenbox:false,
		isscissor:false,
		
		constructor: function(properties) {
			SkyClosecoalgeneratorscene.superclass.constructor.call(this,properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init',this.name);
			this.x = 0;
			this.y = 0;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
		},
		active: function(passdata) {
			console.log('%s active:',this.name);
			this.scene = this;
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks = [];
			this.initBlocks(this.blocks);
			this.items = {};
			this.buttononflag=false;
			this.wire1flag=false;
			this.step=0;
			this.keyget=false;
			this.layoutBgMap();
			this.addHero(null,this.initPosx,this.initPosy);
			
			this.currentkey = 'empty';
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			
			this.layoutUI();
			
			game.sounds.play(14,true);
			
			this.isonhandfilter = false;
			this.isfinishfilter = false;
			this.iskeyonhand = false;
			this.isopenbox = false;
			this.isscissor = false;
			this.setHelp();
			game.drdialog.showTxt('img/sky/3/note2.png');
			this.ignoreTouch=true;
			var scene=this;
            game.drdialog.on(Hilo.event.POINTER_START,function(e){
            	game.drdialog.hide();
				scene.ignoreTouch=false;
            });
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['cover'])){
				var obj = this.items['cover'];
				scene.gotoDosomething(obj,1,0,0,'uptake',800,function(){
						scene.items['cover'].visible = true;
						scene.items['buttonon'].visible = true;
						scene.items['buttonon'].status = 1;
						scene.items['cover'].status = 2;
				},function(){
					scene.step=1;
				});
				return true;
			}
			
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['buttonon'])){
				
				var obj = this.items['buttonon'];
				scene.gotoDosomething(obj,1,0,0,'uptake',800,function(){
						scene.items['buttonoff'].visible = true;
						scene.items['buttonoff'].status = 1;
						scene.items['buttonon'].visible = false;
						scene.items['buttonon'].status = 2;
						scene.robotnull.stop();
						
				},function(){
					scene.buttononflag=true;
					scene.step=2;
				});
				return true;
			}
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['buttonoff'])){
				if (scene.step===2) {
					var obj = this.items['buttonoff'];
					scene.gotoDosomething(obj,1,0,0,'uptake',800,function(){
							scene.items['buttonoff'].visible = false;
							scene.items['buttonoff'].status = 2;
							scene.items['buttonon'].visible = true;
							scene.items['buttonon'].status = 1;
							scene.robotnull.play();
					},function(){
						scene.buttononflag=false;
						scene.step=1;
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			//点击鼓风系统
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['fan'])){
				if (scene.step===2||scene.step===5) {
					var obj = this.items['fan'];
					scene.gotoDosomething(obj,1,0,0,'uptake',800,function(){
						///TODO
						scene.items['fan'].status = 2;
						if (scene.step===2) {
							game.drdialog.showTxt('img/sky/3/note.png');
						}
						scene.ignoreTouch=true;
	            		game.drdialog.on(Hilo.event.POINTER_START,function(e){
	            			game.drdialog.hide();
							scene.ignoreTouch=false;
	           			 });
					},function(){
						if (scene.step===5) {
							scene.stream.visible=false;
							//scene.finishpass();
							scene.passoverReady('img/nextpasspoint.png',2000,game.configdata.SCENE_NAMES.sky_startwindgenerator);
							
						}
						else{
							scene.step=3;
						}
					});
				}
				else{
					this.sayNo();
				}
				return true;
					
			}
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['wire1'])){
				if (scene.step===3) {
					var obj = this.items['wire1'];
					scene.gotoDosomething(obj,1,0,0,'uptake',800,function(){
						scene.items['wire1'].visible = false;
						scene.items['wire1'].status = 2;
						scene.items['wire2'].visible = true;
						scene.items['wire2'].status = 1;
						//scene.stream.visible=false;
					},function(){
						scene.wire1flag=true;
						scene.step=4;
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			/*
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['wire2'])){
				var obj = this.items['wire1'];
				scene.gotoDosomething(obj,1,0,0,'uptake',800,function(){
					scene.items['wire2'].visible = false;
					scene.items['wire2'].status = 2;
					scene.items['wire1'].visible = true;
					scene.items['wire1'].status = 1;
					scene.stream.visible=true;
				},function(){
					scene.wire1flag=false;
				});
				return true;
			}*/
			//打开抽屉隐藏其他
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['closet'])&&scene.keyget===false){
				if (scene.step===4) {
					var obj = this.items['closet'];
					scene.gotoDosomething(obj,1,0,0,'uptake',800,function(){
						scene.items['closet'].status = 2;
						scene.items['closet1'].status = 2;
						scene.items['fan'].status = 2;
					},function(){
						scene.hero.visible=false;
						scene.items['fan'].visible = false;
						scene.items['closet1'].visible = true;
						scene.robotnull.visible=false;
						scene.stream.visible=false;
						scene.items['cover'].visible = false;
						if (scene.keyget) {
							scene.items['key'].status = 2;
							scene.items['key'].visible =false;
						}
						else{
							scene.items['key'].status = 1;
							scene.items['key'].visible =true;
						}
						if (scene.buttononflag) {
							scene.items['buttonoff'].visible = false;
							scene.items['buttonoff'].status = 2;
						}
						else{
							scene.items['buttonon'].visible = false;
							scene.items['buttonon'].status = 2;
						}
						if (scene.wire1flag) {
							scene.items['wire2'].visible = false;
							scene.items['wire2'].status = 2;
						}
						else{
							scene.items['wire1'].visible = false;
							scene.items['wire1'].status = 2;
						}
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			//拿到钥匙隐藏其他角色
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['key'])){
				var obj = this.items['key'];
				scene.gotoDosomething(obj,1,0,0,'uptake',800,function(){
					scene.items['closet1'].status = 2;
					scene.items['closet'].status = 1;
					scene.items['key'].status =2;
					scene.items['fan'].status = 1;
				},function(){
					scene.hero.visible=true;
					scene.items['fan'].visible = true;
					scene.robotnull.visible=true;
					scene.items['closet1'].visible = false;
					scene.items['key'].visible =false;
					scene.items['cover'].visible = true;
					
					scene.keyget=true;
					scene.step=5;
					if (scene.buttononflag) {
						scene.items['buttonoff'].visible = true;
						scene.items['buttonoff'].status = 1;
					}
					else{
						scene.items['buttonon'].visible = true;
						scene.items['buttonon'].status = 1;
					}
					if (scene.wire1flag) {
						scene.items['wire2'].visible = true;
						scene.items['wire2'].status = 1;
					}
					else{
						scene.items['wire1'].visible = true;
						scene.items['wire1'].status = 1;
						scene.stream.visible=true;
					}
				});
				return true;
			}
			return false;
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
					scene.ignoreTouch=true;
            		game.drdialog.on(Hilo.event.POINTER_START,function(e){
            			game.drdialog.hide();
						scene.ignoreTouch=false;
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
		
		gotoDosomething:function(targetobj,scaleFact,x,y,playaction,delay,onCall1,onCall2){
			var scene = this;
			scene.ignoreTouch = true;
			var targetx = targetobj.x + targetobj.targetx;
			var targety = targetobj.y + targetobj.targety;
			var initx = this.hero.posx;
			var inity = this.hero.posy;
			new Hilo.Tween.to(scene.hero,{
					posx:targetx,
					posy:targety,
					scaleX:scaleFact,
					scaleY:scaleFact,
				},{
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
			//是否是道具，图片名称，图片位置，是否可触发动作，图片x轴，图片y轴，人物走动的x轴位置（相对图片位置），人物走动的y轴位置（相对图片位置）
			//图片的相应区域，是否可见
			var data = [
				[1,'bg','sky3bg.jpg',0,0,'t'],
				[2,'closet','empty',1,1088,389,100,200,[0,0,99,24],'t'],
				[2,'closet1','closet1.png',2,0,0,0,0,[0,0,0,0],'f'],
			];
		
			this.layoutUIElement('img/sky/3/',data);
            var streamatlas = new Hilo.TextureAtlas({
                image:'img/sky/3/sprites.png',
                width: 1024,
                height: 1024,
                //x轴，y轴，宽，高
                frames:[[0, 813, 144, 171], [146, 813, 144, 171], [292, 813, 144, 171], [368, 542, 144, 171], [438, 715, 144, 171], [0, 542, 182, 269], [184, 0, 182, 269], [368, 0, 182, 269], [184, 542, 182, 269], [368, 271, 182, 269], [0, 0, 182, 269], [0, 271, 182, 269], [184, 271, 182, 269]],
                sprites: {
                	fire:[0,1,2,3,4],
                	robotnull:[9,10,11,12,5,6,7,8],
                	robotget:[9]
                }
            });
            this.stream = this.createSprite(streamatlas,'fire',434,255,10,this);
            this.stream.visible = true;
            this.robotnull = this.createSprite(streamatlas,'robotnull',376,275,10,this);
            this.robotnull.visible = true;
            this.robotget = this.createSprite(streamatlas,'robotget',376,275,10,this);
            this.robotget.visible = false;
			
			var data = [
				[2,'buttonon','buttonon.png',2,461,414,100,220,[0,0,30,30],'f'],
				[2,'buttonoff','buttonoff.png',2,461, 414,100,220,[0,0,50,30],'f'],
				[2,'cover','cover.png',1,440,381,100,220,[0,0,60,80],'f'],
				[2,'fan','fan.png',1,934,366,100,220,[0,0,61,61],'t'],
				[2,'wire1','wire1.png',1,797,336,100,200,[0,0,94,152],'t'],
				[2,'wire2','wire2.png',2,718,440,100,200,[0,0,173,58],'f'],
				[2,'key','key.png',2,718,340,0,-400,[0,0,279,152],'f']
			];
		
			this.layoutUIElement('img/sky/3/',data);
			//game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/sky/3/action.png',
                width: 1024,
                height: 512,
                //
                frames:[[146, 0, 144, 303], [292, 0, 144, 299], [438, 0, 144, 299], [0, 0, 144, 299]],
                sprites: {
                	uptake:[0,1,2,3]
                }
            });
           
            this.playboy = this.createSprite(this.atlas,'uptake',743,290,10,this);
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
			
		},
	});
})(window.game);