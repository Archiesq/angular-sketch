
var sketch= angular.module('sketch',[]);
sketch.controller('sketchcontroller',['$scope',function($scope){
	//设置数据与canvas相关
	$scope.canvasWH ={width:550,height:550};
	
	$scope.csState= {
		fillStyle:'#000000',
		strokeStyle:'#000000',
		lineWidth:'1',
		style:'stroke'
	};
	$scope.setStyle=function(i){
		$scope.csState.style=i;
	}
	$scope.newSketch=function(){
		if(current){
			if(confirm('是否保存')){
				location.href=canvas.toDataURL();
			}
		}
		clearCanvas();
		current=null;
	}
	$scope.save=function(ev){
		if(current){
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download='mypic.png';
		}else{
			alert('空画布');
		}
		
	}
	var canvas = document.querySelector('#canvas');
	var ctx = canvas.getContext('2d');
	var clearCanvas=function(){
		ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
	}
	var current;
	var setmousemove={
		line:function(e){
			canvas.onmousemove =function(ev){
				clearCanvas();
			if(current){
				ctx.putImageData(current,0,0);
			}
			ctx.beginPath();
		
			ctx.moveTo(e.offsetX,e.offsetY);
			ctx.lineTo(ev.offsetX,ev.offsetY);
			ctx.stroke();
			}
		},
		arc:function(e){
			canvas.onmousemove =function(ev){
				clearCanvas();
			if(current){
				ctx.putImageData(current,0,0);
			}
			ctx.beginPath();
			var r= Math.abs(ev.offsetX-e.offsetX);
			ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
			if($scope.csState.style=='fill'){
				ctx.fill();
			}else{
				ctx.stroke();
			}
			
			}
		},
		rect:function(e){
			canvas.onmousemove =function(ev){
				clearCanvas();
			if(current){
				ctx.putImageData(current,0,0);
			}
			ctx.beginPath();
			var w=ev.offsetX-e.offsetX;
			var h=ev.offsetY-e.offsetY;
			
			if($scope.csState.style=='fill'){
				ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				ctx.fill();
			}else{
				ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				ctx.stroke();
			}
			}
		},
		pen:function(e){
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
			canvas.onmousemove =function(ev){
				clearCanvas();
			if(current){
				ctx.putImageData(current,0,0);
			}
			ctx.lineTo(ev.offsetX,ev.offsetY);
			ctx.stroke();
			}
		},
		eraser:function(e){
			canvas.onmousemove =function(ev){
			ctx.beginPath();
			ctx.clearRect(ev.offsetX,ev.offsetY,20,20);
			}
		}

	}
	$scope.tool='line';
	$scope.tools={'画线':'line','画圆':'arc','矩形':'rect','铅笔':'pen','橡皮':'eraser','选择':'select'}
	$scope.settool=function(tool){
		$scope.tool=tool;
	}
	
	canvas.onmousedown = function(e){
		ctx.strokeStyle=$scope.csState.strokeStyle;
		ctx.fillStyle=$scope.csState.fillStyle;
		ctx.lineWidth=$scope.csState.lineWidth;
		setmousemove[$scope.tool](e);
		

		document.onmouseup=function(){
			canvas.onmousemove=null;
			canvas.onmouseup=null;
			current =ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height)
		}
	}

}])