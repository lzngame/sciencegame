(function(ns) {
	var WaterClosevaluescene = ns.WaterClosevaluescene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.water_closevalue,
		
		initPosx:950,
		initPosy:630,
		currentOnhandObj:null,
		currentOnhandImg:null,
		atlas:null,
		items:null,
		playboy:null,
		pwdimg:null,
		islube:null,
		valueRotations:null,
		vapourpanel:null,
		constructor: function(properties) {
			WaterClosevaluescene.superclass.constructor.call(this, properties);
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
			this.addHero(null,this.initPosx,this.initPosy);
			
			this.currentkey = 'empty';
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.initTouchEvent();
			this.initFingerMouse();
			
			this.layoutUI();
			this.keydises = {
				bluekey:60,
				yellowkey:100,
				pinkkey:140,
				purplekey:180
			};
			this.isbranchonhand = false;
			this.isinstrumentonhand = false;
			game.sounds.play(14,true);
			this.islube = [false,false,false,false];
			this.valueRotations = [0,0,0,0];
			
			this.pwdimg = new Hilo.Bitmap({image:'img/water/2/pwd.jpg',visible:false}).addTo(this);
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
		
		checklube:function(){
			return this.islube[0] && this.islube[1] && this.islube[2] && this.islube[3];
		},
		receiveMsg: function(msg) {
			
		},
		putProp:function(){
			this.hero.putProp();
			this.currentOnhandObj = null;
		},
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['instruction'])){
				var obj = this.pwdimg;
				obj.visible = true;
				var scene = this;
				scene.hero.visible = false;
				scene.ignoreTouch = true;
				obj.on(Hilo.event.POINTER_START,function(e){
					scene.ignoreTouch = false;
					scene.hero.visible = true;
					obj.visible = false;
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['value1'])){
				var obj = this.items['value1'];
				if(this.items['jerrican'].status == 1 && obj.state == 0){
					this.sayNo();
					return true;
				}
				if(!this.checklube()){
					this.lubeValue(1);
				}else{
					this.rotateValue(1);
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['value2'])){
				var obj = this.items['value2'];
				if(this.items['jerrican'].status == 1 && obj.state == 0){
					this.sayNo();
					return true;
				}
				if(!this.checklube()){
					this.lubeValue(2);
				}else{
					this.rotateValue(2);
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['value3'])){
				var obj = this.items['value3'];
				if(this.items['jerrican'].status == 1 && obj.state == 0){
					this.sayNo();
					return true;
				}
				if(!this.checklube()){
					this.lubeValue(3);
				}else{
					this.rotateValue(3);
				}
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['value4'])){
				var obj = this.items['value4'];
				if(this.items['jerrican'].status == 1 && obj.state == 0){
					this.sayNo();
					return true;
				}
				if(!this.checklube()){
					this.lubeValue(4);
				}else{
					this.rotateValue(4);
				}
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['jerrican'])){
				var obj = this.items['jerrican'];
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'backpick',800,function(){

				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.handonProp('img/water/2/jerricanonhand.png',scene.hero.posx-40,scene.hero.posy-97);
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['crowbar'])){
				var obj = this.items['crowbar'];
				if(obj.state == 0){
					this.sayNo();
					return true;
				}
				var scene = this;
				scene.items['bigvalue'].state = 1;
				scene.gotoDosomething(obj,1,0,0,'lefttake',200,function(){

				},function(){
					obj.status = 2;
					obj.visible = false;
					scene.handonProp('img/water/2/crowonhand.png',scene.hero.posx-77,scene.hero.posy-160);
				});
				return true;
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.items['bigvalue'])){
				var obj = this.items['bigvalue'];
				this.currentOnhandImg.removeFromParent();
				
				if(obj.state == 0){
					this.sayNo();
					return true;
				}
				var scene = this;
				scene.gotoDosomething(obj,1,0,0,'crow',800,function(){
					var value = scene.items['bigvalueimg'];
					new Hilo.Tween.to(value,{
						rotation:180,
					},{
						duration:800,
					});
				},function(){
					scene.items['crowbar'].visible = true;
					scene.items['crowbar'].y = 408;
					scene.items['crowbar'].x = 326;
					new Hilo.Tween.to(scene.sewage,{
						alpha:0
					},{
						duration:2000,
						onComplete:function(){
							game.switchScene(game.configdata.SCENE_NAMES.passchoice,game.configdata.largePassName.ecosystem);
						}
					});
				});
				return true;
			}
			
			
			return false;
		},
		rotateValue:function(valueindex){
			var scene = this;
			var obj = this.items['value'+valueindex];
			scene.gotoDosomething(obj,1,0,0,'rotatevalue',600,function(){
					scene.rotateValueNum(valueindex);
				},function(){
					scene.checkRotation();
				});
		},
		checkRotation:function(){
			if(this.valueRotations[0] == 3 && this.valueRotations[1] == 3 && this.valueRotations[2] == 3 &&  this.valueRotations[3] == 3){
				var scene = this;
				new Hilo.Tween.to(scene.vapourpanel,{
					alpha:0,
				},{
					delay:200,
					duration:1500,
					onComplete:function(){
						scene.items['crowbar'].state = 1;
						scene.vapourpanel.removeFromParent();
						game.sounds.stop(17);
						scene.items['value1'].status = 2;
						scene.items['value2'].status = 2;
						scene.items['value3'].status = 2;
						scene.items['value4'].status = 2;
					}
				});
			}
		},
		rotateValueNum:function(valueindex){
			if(valueindex == 1){
				this.items['valueimg1'].rotation += 90;
				this.items['valueimg2'].rotation += 90;
				this.takeRotation(1);
				this.takeRotation(2);
			}
			if(valueindex == 2){
				this.items['valueimg1'].rotation += 90;
				this.items['valueimg2'].rotation += 90;
				this.items['valueimg3'].rotation += 90;
				this.takeRotation(1);
				this.takeRotation(2);
				this.takeRotation(3);
			}
			if(valueindex == 3){
				this.items['valueimg2'].rotation += 90;
				this.items['valueimg3'].rotation += 90;
				this.items['valueimg4'].rotation += 90;
				this.takeRotation(4);
				this.takeRotation(2);
				this.takeRotation(3);
			}
			if(valueindex == 4){
				this.items['valueimg3'].rotation += 90;
				this.items['valueimg4'].rotation += 90;
				this.takeRotation(3);
				this.takeRotation(4);
			}
			console.log(this.valueRotations);
		},
		takeRotation:function(valueindex){
			var index = valueindex - 1;
			var r = this.valueRotations[index] + 1;
			if(r >= 4){
				r = 0;
			}
			this.valueRotations[index] = r;
		},
		lubeValue:function(valueindex){
			var scene = this;
			var stindex = valueindex.toString();
			var img = this.items['valueimg'+stindex];
			var obj = this.items['value'+stindex];
			scene.currentOnhandImg.visible = false;
			scene.islube[valueindex-1] = true;
			
			scene.gotoDosomething(obj,1,0,0,'takecan',1000,function(){

				},function(){
					scene.currentOnhandImg.visible = true;
					if(scene.checklube()){
						scene.currentOnhandImg.removeFromParent();
						var tmp = scene.items['jerrican'];
						tmp.visible = true;
						tmp.x = scene.hero.posx + 70;
						tmp.y = scene.hero.posy - 80;
						var dis = 30;
						scene.items['value1'].targetx = dis;
						scene.items['value2'].targetx = dis;
						scene.items['value3'].targetx = dis;
						scene.items['value4'].targetx = dis;
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
		handonProp:function(propimg,x,y){
			this.currentOnhandImg = new Hilo.Bitmap({
				image:propimg,
				x:x,
				y:y
			}).addTo(this);
		},
		createActiveObj:function(objname,x,y,targetx,targety,readyImgurl,finishedImgurl,clickrect,status){
			return new game.ActiveObject({
				name:objname,
				x:x,
				y:y,
				targetx:targetx,
				targety:targety,
				readyImgUrl:readyImgurl,
				finishedImgUrl:finishedImgurl,
				clickArea:clickrect,
				status:status,
			}).addTo(this);
		},
		layoutUIElement:function(arraydata){
			for(var i=0;i<arraydata.length;i++){
				var item = arraydata[i];
				var itemtype = item[0];
				if(itemtype == game.configdata.LAYOUTTEYP.activeobj){
					var name = item[1];
					var obj = item[2];
					var img = item[3];
					var x = item[4];
					var y = item[5];
					var targetx = item[6];
					var targety = item[7];
					var clickrect = item[8];
					var status = item[9];
					this.items[obj] = this.createActiveObj(name,x,y,targetx,targety,img,img,clickrect,status);
				}
				if(itemtype == game.configdata.LAYOUTTEYP.img){
					var obj = item[1];
					var img = item[2];
					var x = item[3];
					var y = item[4];
					var isvisible = item[5];
					this.items[obj] = new Hilo.Bitmap({image:img,x:x,y:y,visible:isvisible}).addTo(this);
				}
			}
		},
		layoutBgMap:function(){
			var scene = this;
			var data = [
				[game.configdata.LAYOUTTEYP.img,'bg','img/water/2/water2bg.jpg',0,0,true],
				[game.configdata.LAYOUTTEYP.activeobj,'jerrican','jerrican','img/water/2/jerrican.png',987,485,0,90,[0,0,60,80],1],
				[game.configdata.LAYOUTTEYP.activeobj,'crowbar','crowbar','img/water/2/crowbar.png',126,442,100,200,[0,0,110,190],1],
				[game.configdata.LAYOUTTEYP.activeobj,'instruction','instruction','empty',1028,343,22,202,[0,0,56,50],1],
				
				[game.configdata.LAYOUTTEYP.img,'bigvalueimg','img/water/2/bigvalue.png',321+85,273+88,true],
				[game.configdata.LAYOUTTEYP.img,'valueimg1','img/water/2/value.png',608,355,true],
				[game.configdata.LAYOUTTEYP.img,'valueimg2','img/water/2/value.png',697,355,true],
				[game.configdata.LAYOUTTEYP.img,'valueimg3','img/water/2/value.png',787,355,true],
				[game.configdata.LAYOUTTEYP.img,'valueimg4','img/water/2/value.png',881,355,true],
				
				[game.configdata.LAYOUTTEYP.activeobj,'bigvalue','bigvalue','empty',321,273,172,252,[0,0,171,150],1],
				[game.configdata.LAYOUTTEYP.activeobj,'value1','value1','empty',568,315,122,202,[0,0,81,73],1],
				[game.configdata.LAYOUTTEYP.activeobj,'value2','value2','empty',657,315,122,202,[0,0,81,73],1],
				[game.configdata.LAYOUTTEYP.activeobj,'value3','value3','empty',747,315,122,202,[0,0,81,73],1],
				[game.configdata.LAYOUTTEYP.activeobj,'value4','value4','empty',841,315,122,202,[0,0,81,73],1],
				
			];
			
			this.layoutUIElement(data);
			this.items['valueimg1'].pivotX = this.items['valueimg2'].pivotX = this.items['valueimg3'].pivotX = this.items['valueimg4'].pivotX = 40;
			this.items['valueimg1'].pivotY = this.items['valueimg2'].pivotY = this.items['valueimg3'].pivotY = this.items['valueimg4'].pivotY = 40;
			this.items['bigvalueimg'].pivotX = 171/2;
			this.items['bigvalueimg'].pivotY = 178/2;
			this.items['bigvalueimg'].rotation = 0;
			
			this.effectatlas = new Hilo.TextureAtlas({
                image:'img/water/2/water2effectatlas.png',
                width: 561,
                height: 508,
            	frames:[[0, 0, 185, 341], [187, 0, 185, 341], [374, 0, 185, 341], [292, 343, 144, 163], [146, 343, 144, 163], [0, 343, 144, 163]],
                sprites: {
                	vapour:[0,1,2],
                	water:[3,4,5],
                }
            });
            
            this.sewage = this.createSprite(this.effectatlas,'water',152,340,15,this);
            
            this.vapourpanel = new Hilo.Container().addTo(this);
            this.createSprite(this.effectatlas,'vapour',529-5,219,15,this.vapourpanel);
			this.createSprite(this.effectatlas,'vapour',615-5,219,11,this.vapourpanel);
			this.createSprite(this.effectatlas,'vapour',703-5,219,7,this.vapourpanel);
			this.createSprite(this.effectatlas,'vapour',792-5,219,11,this.vapourpanel);
			game.sounds.play(17,true);
            
			this.atlas = new Hilo.TextureAtlas({
                image:'img/water/2/water2boyatlas.png',
                width: 1060,
                height: 1248,
                frames:[[424, 312, 210, 310], [848, 312, 210, 310], [848, 0, 210, 310], [636, 936, 210, 310], [636, 624, 210, 310], [848, 0, 210, 310], [424, 312, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 624, 210, 310], [424, 936, 210, 310], [636, 0, 210, 310], [848, 624, 210, 310], [424, 0, 210, 310], [212, 936, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	idle:[0,0],
                	takecan:[7,8,9,10,11,12,13],
                	backpick:[0,1,2,3,4,5,6],
                	rotatevalue:[18,19,20,21,22,23],
                	lefttake:[14,15],
                	crow:[16,17,16,17,16,17,16,17],
                }
            });
            
            this.playboy = this.createSprite(this.atlas,'idle',1023,211,10,this);
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