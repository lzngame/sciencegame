(function(ns) {
	var Skystartsungengeratorscene = ns.Skystartsungengeratorscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.sky_startsungengerator,
		
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
		panelnumflag:0,
		isblueonhand:false,
		isbrownonhand:false,
		ispickwipper:false,
		iskeyonhand:false,
		isopenbox:false,
		isscissor:false,
		
		constructor: function(properties) {
			Skystartsungengeratorscene.superclass.constructor.call(this,properties);
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
			this.showDialog('img/sky/5/skynote1.png');
			
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
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['switch1'])){
				var obj = this.items['switch1'];
				scene.gotoDosomething(obj,1,0,0,'take',800,function(){
						scene.items['switch1'].visible = false;
						scene.items['switch2'].visible = true;
						scene.items['switch1'].status = 2;
						scene.items['switch2'].status = 1;
						scene.items['solarpanel1'].visible = false;
						scene.items['solarpanel3'].visible = true;
						scene.items['solarpanel3'].status = 1;
						scene.items['rubbish'].visible = true;
				},function(){
					scene.step=1;
				});
				return true;
			}
			
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['ladder'])){
				var scene = this;
				if (scene.step===1||scene.step===4||scene.step===6||scene.step===8) {
					var obj = this.items['ladder'];
					if(obj.state == 0){
						obj.state = 1;
						if(scene.ispickwipper){
							scene.currentOnhandImg.visible=false;
							scene.gotoLadder(obj,1,150,'climbeladder','wipperonladder',500,function(){
								scene.step++;
							},function(){
							});
						}
						else{
							scene.gotoLadder(obj,1,150,'climbeladder','onladder',500,function(){
								scene.step++;
							},function(){
							});
						}
					}else{
						obj.state = 0;
						scene.downLadder(obj,360,1,'downladder',1500,function(){
							scene.step++;
						});
					}
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['solarpanel3'])){
				if (scene.step===2) {
					var obj = this.items['solarpanel3'];
					scene.items['dustercloth'].status = 2;
					scene.items['switch1'].status = 2;
					scene.items['switch2'].status = 2;
					scene.items['rubbish'].status = 2;
					scene.items['dustercloth'].visible = false;
					scene.items['mess'].visible = true;
					scene.hero.visible=false;
					scene.playboy.visible=false;
					scene.items['panelnum'].visible=false;
					scene.items['panelnum'].status=1;
					scene.step=3;
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['panelnum'])){
				if (scene.step===3||scene.step===4) {
					if (scene.panelnumflag===0) {
						scene.panelnumflag++;
						var obj = this.items['panelnum'];
						scene.items['mess'].visible=false;
						scene.items['mess'].status=2;
						scene.items['correct'].visible=true;
						scene.items['correct'].status=1;
						scene.step=4;
					}
					else{
						scene.items['mess'].visible=false;
						scene.items['mess'].status=2;
						scene.items['correct'].visible=false;
						scene.items['correct'].status=2;
						scene.items['panelnum'].visible=false;
						scene.items['panelnum'].status=2;
						
						scene.items['dustercloth'].status = 1;
						scene.items['rubbish'].visible = true;
						scene.items['rubbish'].status = 1;
						scene.items['dustercloth'].visible = true;
						scene.items['solarpanel3'].status = 2;
						scene.hero.visible=false;
						scene.playboy.visible=true;
						scene.items['ladder'].status=1;
					}
				}
				else{
					this.sayNo();
				}
				return true;
			}
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['dustercloth'])){
				if(scene.step===5){
					var obj = this.items['dustercloth'];
					scene.gotoDosomething(obj,1,0,0,'pick',800,function(){
					},function(){
						scene.step=6;
						scene.items['dustercloth'].visible = false;
						scene.items['dustercloth'].status = 2;
						scene.handonProp('img/sky/5/dustercloth.png',scene.hero.posx-60,scene.hero.posy-110);
						scene.items['ladder'].status=1;
						scene.ispickwipper=true;
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			//点击垃圾
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['rubbish'])){
				if (scene.step===7) {
					var obj = this.items['rubbish'];
					scene.playboy.currentFrame = 0;
					scene.playboy._frames = scene.atlas.getSprite('wipe');
					scene.playboy.loop = false;
					scene.playboy.play();
					scene.items['rubbish'].status = 2;
					scene.items['rubbish'].visible=false;
					scene.items['ladder'].status = 1;
					scene.step=8;
				}
				else{
					this.sayNo();
				}
				return true;
					
			}
			//
			if( this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['anniu1'])){
				if (scene.step===9) {
					var obj = this.items['anniu1'];
					scene.gotoDosomething(obj,1,0,0,'take',800,function(){
						scene.passoverReady('img/sky/4/happy.png',500,game.configdata.SCENE_NAMES.sky_closecoalgenerator);
					},function(){
						
					});
				}
				else{
					this.sayNo();
				}
				return true;
			}
			return false;
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
				[1,'bg','sky5bg.jpg',0,0,'t'],
				[2,'solarpanel3','solarpanel3.png',2,304,98,100,200,[0,0,577,192],'f'],
				[2,'solarpanel1','solarpanel1.png',2,469,91,100,200,[0,0,372,233],'t'],
				[2,'switch1','switch1.png',1,870,386,60,200,[0,0,53,48],'t'],
				[2,'electricfan1','electricfan.png',2,22, 149,100,220,[0,0,0,0],'t'],
				[2,'electricfan2','electricfan.png',2,257,159,100,220,[0,0,0,0],'t'],
				[2,'electricfan3','electricfan.png',2,967,118,100,220,[0,0,0,0],'t'],
				[2,'switch2','switch2.png',1,870,416,100,200,[0,0,53,48],'f'],
				[2,'rubbish','rubbish.png',1,479,218,100,200,[0,0,161,40],'t'],
				[2,'anniu1','anniu1.png',1,809,394,60,200,[0,0,24,24],'t'],
				[2,'dustercloth','dustercloth.png',1,408,493,40,70,[0,0,76,34],'t'],
				[2,'ladder','empty',1,511,325,50,300,[0,0,111,278],'t'],
				[2,'mess','mess.jpg',2,0,0,0,0,[0,0,0,0],'f'],
				[2,'correct','correct.jpg',2,0,0,0,0,[0,0,0,0],'f'],
				[2,'panelnum','empty',2,201,178,0,0,[0,0,851,408],'f']
			];
		
			this.layoutUIElement('img/sky/5/',data);
			//game.sounds.play(17,true);this.atlas = new Hilo.TextureAtlas({
			this.atlas = new Hilo.TextureAtlas({
                image:'img/sky/5/action.png',
                width: 1024,
                height: 2048,
                //
                frames:[[0, 1560, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [424, 0, 210, 310], [212, 1560, 210, 310], [212, 1248, 210, 310], [424, 0, 210, 310], [424, 624, 210, 310], [636, 0, 210, 310], [212, 624, 210, 310], [0, 1248, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [212, 312, 210, 310], [212, 624, 210, 310], [636, 0, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310], [212, 936, 210, 310], [424, 1560, 210, 310], [424, 1248, 210, 310]],
                sprites: {
                	take:[0,11,17,18],
                	climbeladder:[19,20,21,22,23,1],
                	downladder:[1,23,22,21,20,19],
                	onladder:[1],
                	wipperonladder:[9],
                	pick:[2,3,4,5,6,7,8],
                	wipe:[9,10,12,12,13,14,15,16]
                	
                }
            });
            this.playboy = this.createSprite(this.atlas,'wipe',743,290,10,this);
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