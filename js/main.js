window.onload = function(){
	
	// no jQuery :D | Challenge success !	
	// Temp : Load colors
	
	// For detect if an image was used.
	var isImage = false;
	var colors = [];
	
	// Get colors --------------------------------------------------------------------------------
	var tmp_colors = document.getElementById("colors");
	var tmp_ctx = tmp_colors.getContext("2d");
	
	var tmp_imgcolors = new Image();
	tmp_imgcolors.src = "img/colors.png";
	tmp_imgcolors.onload = function(){
		
		tmp_ctx.drawImage(tmp_imgcolors,0,0);
		var tmp_c = 0;
		var tmp_col = 8;
		var tmp_fil = 8;
	
		while(tmp_fil <= 248){
			
			var tmp_color_data = tmp_ctx.getImageData(tmp_col,tmp_fil,1,1);
			
			tmp_color = {
				red : tmp_color_data.data[0],
				green : tmp_color_data.data[1],
				blue : tmp_color_data.data[2],
				alpha : tmp_color_data.data[3],
				code : tmp_c
			}
			
			colors.push(tmp_color);
			
			if(tmp_col == 248){
				tmp_col = 8;
				tmp_fil+=16;
			}
			else{	
				tmp_col+=16;	
			}
			
			tmp_c++;
		}
	}
	
	// TABS -------------------------------------------------------------------------------------------
	
	document.getElementById("tab_paint").addEventListener("click",function(){
		// Cargar paint
		this.style.background = "#CCC";
		document.getElementById("tab_picture").style.background = "#F3F3F3";
		document.getElementById("view_paint").style.display = "block";
		document.getElementById("view_picture").style.display = "none";		
	},false);
	
	document.getElementById("tab_picture").addEventListener("click",function(){
		this.style.background = "#CCC";
		document.getElementById("tab_paint").style.background = "#F3F3F3";
		document.getElementById("view_paint").style.display = "none";
		document.getElementById("view_picture").style.display = "block";		
	},false);
	
	// OPTION BG PICASM --------------------------------------------------------------------------------	
	
	document.getElementById("pictasm_bg").addEventListener("click",function(){
		
		if(document.getElementById("pictasm_bg").checked){
			document.getElementById("paper").style.background = "#000";
		}else{
			document.getElementById("paper").style.background = "#F5F5F5";
		}
		
	},false);
	
	// DROPBOX FOR PICTURES --------------------------------------------------------------------------------
		
	var dropbox = document.getElementById('dropbox');
	
	var state = document.getElementById('status');
	
	var bgImage = null;
	
	if(typeof window.FileReader === 'undefined'){
		state.className = "Tu navegador no soporta FileAPI de HTML5";
	}else{
		state.className = "success";
	}
	
	dropbox.ondragover = function(){
		this.className = 'hover';
		return false;
	}
		
	dropbox.ondragend = function(){
		this.className = '';
		return false;   
	}
	
	dropbox.ondrop = function(e){
		
		var file = null;
		var reader = null;
		var image = null;
		var img = null;
		
		this.className = '';
		
		e.preventDefault();
		
		file = e.dataTransfer.files[0];
		
		reader = new FileReader();
		
		reader.readAsDataURL(file);
		
		reader.onload= function(event){
			
			isImage = true;
			
			document.getElementById("asm").innerHTML = "";
			
			dropbox.innerHTML = "";
			
			image = event.target.result;
			
			bgImage = image;
			
			document.getElementById("dropbox_bg").style.background = "url(" + image + ") no-repeat center";
			
			document.getElementById("paper").getContext("2d").clearRect(0,0,200,200);
			
			var posx = document.getElementsByName("posx")[0].value;
			var posy = document.getElementsByName("posy")[0].value;
			var name_routine = document.getElementsByName("name_routine")[0].value;
			
			img = new Image();
			
			img.src = image;
			
			img.onload = function(){
				var data = _pictasm(img,posx,posy,colors,name_routine);
				document.getElementById("asm").innerHTML = data.code + "<br/>" + data.antimatter;
				document.getElementById("lines").innerHTML = data.lines + " l&iacute;neas.";
				document.getElementById("dataSprite").innerHTML = data.dataSprite;
			}
		}
		
		return false;
	};
	
	// BUTTON FOR SELECT ALL THE CODE ----------------------------------------------------
	
	document.getElementById("asm").addEventListener("click",function(){
		if(document.selection){
			var range = document.body.createTextRange();
			range.moveToElementText(document.getElementById("asm"));
			range.select();
		}else if(window.getSelection){
			var range = document.createRange();
			range.selectNode(document.getElementById("asm"));
			window.getSelection().addRange(range);
		}
	},false);
	
	document.getElementById("dataSprite").addEventListener("click",function(){
		if(document.selection){
			var range = document.body.createTextRange();
			range.moveToElementText(document.getElementById("dataSprite"));
			range.select();
		}else if(window.getSelection){
			var range = document.createRange();
			range.selectNode(document.getElementById("dataSprite"));
			window.getSelection().addRange(range);
		}
	},false);
	
	// BUTTON FOR CONVERT IMAGE IN THE DROPBOX INTO ASM CODE --------------------------------------------------------
	
	document.getElementById("pictasm").addEventListener("click",function(){
		var posx = document.getElementsByName("posx")[0].value;
		var posy = document.getElementsByName("posy")[0].value;
		var name_routine = document.getElementsByName("name_routine")[0].value;
		
		imageData = document.getElementById("board").toDataURL();
		img = new Image();
		img.src = imageData ;
		img.onload = function(){
			var data = _pictasm(img,posx,posy,colors,name_routine);
			document.getElementById("asm").innerHTML = data.code + "<br/>" + data.antimatter;
			document.getElementById("lines").innerHTML = data.lines + " l&iacute;neas.";
			document.getElementById("dataSprite").innerHTML = data.dataSprite;
		}
	},false);
	
	// BUTTON FOR CONVERT A DRAWING INTO ASM CODE -------------------------------------------------------------
	
	document.getElementById("pictasm_paint").addEventListener("click",function(){
		
		isImage = false;
		
		var board =  document.getElementById("board");
		var boardCtx = board.getContext("2d");
		
		var posx = document.getElementsByName("posx")[0].value;
		var posy = document.getElementsByName("posy")[0].value;
		var name_routine = document.getElementsByName("name_routine")[0].value;
			
			var img = new Image();
			
			img.src = board.toDataURL();
			
			img.onload = function(){
				var data = _pictasm(img,posx,posy,colors,name_routine);
				
				document.getElementById("asm").innerHTML = data.code + "<br/>" + data.antimatter;
				document.getElementById("lines").innerHTML = data.lines + " l&iacute;neas.";
				document.getElementById('dropbox').innerHTML = "";				
				document.getElementById("dropbox_bg").style.background = "url(" + board.toDataURL() + ") no-repeat";
			}
			
			document.getElementById("tab_paint").style.background = "#F3F3F3";
			document.getElementById("view_paint").style.display = "none";
			document.getElementById("view_picture").style.display = "block";
		
	},false);
	
	// Pixel Paint -----------------------------------------------------------------------------------------------
	
	var paint_canvas = document.getElementById("paper");
	
	var real_canvas = document.getElementById("board");
	
	var paint_ctx = paint_canvas.getContext("2d");
	
	var scale = 13;
	
	var intervals = paint_canvas.width/scale;
	
	paint_ctx.fillStyle = "#000000";
	
	var changedColor = null;
	
	pintar = false;
	
	// First
	var ff = false;
	
	paint_canvas.addEventListener("mouseup",function(e){
		pintar = false;
	},false);
	
	paint_canvas.addEventListener("mousedown",function(e){
		
		if(isImage){
			real_canvas.getContext("2d").clearRect(0,0,real_canvas.width,real_canvas.height);
			isImage = false;
		}
		
		if(changedColor != "rgba(0,0,0,0)"){
			document.getElementById("paper").style.cursor = "url(img/cursors/pencil.png), auto";
		}
		
		pintar = true;
		
		paint(paint_canvas,paint_ctx,scale,e,real_canvas,changedColor);
	
		paint_canvas.addEventListener("mousemove",function(e){
			
			if(pintar){
				paint(paint_canvas,paint_ctx,scale,e,real_canvas,changedColor);				
			}
			
		},false);
	},false);
	
	// ERASER FOR THE CANVAS
	
	document.getElementById("eraser").addEventListener("click",function(){
		paint_ctx.globalCompositeOperation = "copy";
		paint_ctx.fillStyle = "rgba(0,0,0,0)";
		changedColor = "rgba(0,0,0,0)";
		document.getElementById("paper").style.cursor = "url(img/cursors/eraser.png), auto";
	},false);
	
	// OPTIONS FOR THE CANVAS
	
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
				
				paint_ctx.fillStyle = "rgba(" + color.red + "," + color.green + "," + color.blue + "," + color.alpha + ")";
				
			},false);
	};
	
	
}

	// PAINT PIXELS ------------------------------------------------------------------------------------------------
	
	function paint(canvas,_ctx,_scale,_e,_real_canvas,_changedColor){
				
				_ctx.save();
				_ctx.scale(_scale,_scale);
				
				document.getElementById("paper").onselectstart = function(){ return false; }
				
				var x = _e.layerX;
				var interval_found_x = false;
				
				while(interval_found_x == false){
					if(x % _scale == 0){
						interval_found_x = true;   
					}else{
						x++;   
					}  
				}
				
				var y = _e.layerY;
				var interval_found_y = false;
				
				while(interval_found_y == false){
					if( y % _scale == 0){
						interval_found_y = true;
					}else{
						y++;
					}
				}
				
				
				
				x = x/_scale - 1;
				
				y = y/_scale - 1;
				
				_ctx.fillRect(x,y,1,1);
				
				if(_changedColor == "rgba(0,0,0,0)"){
					_real_canvas.getContext("2d").globalCompositeOperation = "copy";
				}
				
				_real_canvas.getContext("2d").fillStyle = _changedColor;
				
				_real_canvas.getContext("2d").fillRect(x,y,1,1);
				
				_ctx.restore();
		}