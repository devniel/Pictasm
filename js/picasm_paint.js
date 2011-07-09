// JavaScript Document
function picasm_paint(colors,isimagen){
	
	var canvas = document.getElementById("paper");
	
	var real_canvas = document.getElementById("board");
	
	var ctx = canvas.getContext("2d");
	
	var scale = 5;
	
	var intervals = canvas.width/scale;
	
	ctx.fillStyle = "#000000";
	
	var changedColor = null;
	
	// Global
	PINTAR = false;
	
	// First
	var ff = false;
	
	canvas.addEventListener("mouseup",function(e){
		PINTAR = false;
	},false);
	
	canvas.addEventListener("mousedown",function(e){
		
		if(changedColor != "rgba(0,0,0,0)"){
			document.getElementById("paper").style.cursor = "url(img/cursors/pencil.png), auto";
		}
		
		PINTAR = true;
		
		paint(canvas,ctx,scale,e,real_canvas,changedColor);
	
		canvas.addEventListener("mousemove",function(e){
			
			if(PINTAR == true){
				paint(canvas,ctx,scale,e,real_canvas,changedColor);				
			}
			
		},false);
	},false);
	
	/*---------------------------------
		Eraser 
	-----------------------------------*/
	document.getElementById("eraser").addEventListener("click",function(){
		ctx.globalCompositeOperation = "copy";
		ctx.fillStyle = "rgba(0,0,0,0)";
		changedColor = "rgba(0,0,0,0)";
		document.getElementById("paper").style.cursor = "url(img/cursors/eraser.png), auto";
	},false);
	
	/*------------------------------
		OPTIONS
	-------------------------------*/
	
	var canvas_colors = document.getElementById("colors");
	
	imgcolors = new Image();
	imgcolors.src = "img/colors.png";
	imgcolors.onload = function(){
		canvas_colors.getContext("2d").drawImage(imgcolors,0,0);
		
			canvas_colors.addEventListener("mousedown",function(e){
				document.getElementById("paper").style.cursor = "url(img/cursors/pencil.png), auto";
				
				var x = e.layerX;
				var interval_found_x = false;
				var code = 0;
				
				while(interval_found_x == false){
					if(x % 16 == 0){
						interval_found_x = true;   
					}else{
						x--;   
					}
				}
				
				var y = e.layerY;
				var interval_found_y = false;
				
				while(interval_found_y == false){
					if( y % 16 == 0){
						interval_found_y = true;
					}else{
						y--;
					}
				}
				
				//x-=16;
				
				//y-=16;
				
				code = x/16 + y;
				
				//canvas_colors.getContext("2d").fillRect(x,y,16,16);
				
				colorData = canvas_colors.getContext("2d").getImageData(x + 8,y + 8,1,1);
				
				color = {
					red : colorData.data[0],
					green : colorData.data[1],
					blue : colorData.data[2],
					alpha : colorData.data[3],
					code : code
				}
				
				var color_found = false;
				
				// It's junk, but anyway serves
				
				for(c in colors){
					if(colors[c].code == color.code){
						color_found = true;	
					}
				}
				
				if(!color_found){
					colors.push(color);	
				}
		
				
				changedColor = "rgba(" + color.red + "," + color.green + "," + color.blue + "," + color.alpha + ")";
				
				ctx.fillStyle = "rgba(" + color.red + "," + color.green + "," + color.blue + "," + color.alpha + ")";
			},false);
	};
	
	
}

/*-----------------------------------------------------
	PAINT PIXEL
------------------------------------------------------- */
	
	function paint(canvas,ctx,scale,e,real_canvas,changedColor){
				ctx.save();
				ctx.scale(scale,scale);
				
				document.getElementById("paper").onselectstart = function(){ return false; }
				
				var x = e.layerX;
				var interval_found_x = false;
				
				while(interval_found_x == false){
					if(x % scale == 0){
						interval_found_x = true;   
					}else{
						x++;   
					}  
				}
				
				var y = e.layerY;
				var interval_found_y = false;
				
				while(interval_found_y == false){
					if( y % scale == 0){
						interval_found_y = true;
					}else{
						y++;
					}
				}
				
				
				
				x = x/scale - 1;
				
				y = y/scale - 1;
				
				ctx.fillRect(x,y,1,1);
				
				if(changedColor == "rgba(0,0,0,0)"){
					real_canvas.getContext("2d").globalCompositeOperation = "copy";
				}
				
				real_canvas.getContext("2d").fillStyle = changedColor;
				
				real_canvas.getContext("2d").fillRect(x,y,1,1);
				
				ctx.restore();
	}