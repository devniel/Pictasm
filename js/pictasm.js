/*

PicTasm

Copyright (c) 2011 Daniel Flores, an apprentice.

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function _pictasm(image,_posx,_posy,colors,name_routine){
	
	var canvas = document.getElementById("board");	
	
	var ctx = canvas.getContext("2d");
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	if(_posx == "")
		_posx = 0
	if(_posy == "")
		_posy = 0

	// Read positions
	var input_posx = _posx;
	var input_posy = _posy;
	
	ctx.drawImage(image, 0 , 0);	
		
	// Buscar
	var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
		
	var i = 0;
		
	var picture = [];
		
	var last = null;
		
	var row = 0;
		
	var column = 0;
		
	// Detect area of the picture
		
	var inicioX = canvas.width;
		
	var inicioY = null;
		
	var finalX = 0;
		
	var finalY = 0;
		
		
	// Get inicioX and inicioY
		
	while(i<imageData.data.length){
		pixel = {
			alpha : imageData.data[i+3],
			column : column,
			row : row
		}
			
		if(pixel.alpha == 255){
				
			// First Y
			if(inicioY == null){
				inicioY = row;	
			}
				
			// Final Y
			if(pixel.row > finalY){
				finalY = pixel.row						
			}	
				
			// First X
			if(pixel.column < inicioX){
				inicioX = pixel.column;
			}
				
			// Final X
			if(pixel.column > finalX){
				finalX = pixel.column;
			}
			
		}
			
		i+=4;
			
		if(column == (canvas.width - 1)){
			column = 0;
			row++;
		}else{
			column++;
		}
	}
		
		
	var sprite = ctx.getImageData(inicioX,inicioY,finalX - inicioX + 1,finalY - inicioY + 1);
			
	// Read from inicioX and inicioY
		
	// inicioX
		
	// inicioY
		
	var xtotal = finalX - inicioX;
	
	var ytotal = finalY - inicioY;
	
	var saved_input_posx = input_posx;
	
	var saved_input_posy = input_posy;
		
	var contador_distanciaX = 0;
	
	var contador_distanciaY = 0;
	
	var anterior_distanciaX = 0;
	
	var anterior_distanciaY = 0;
		
	var j = 0;
	
	var passLine = false;
	
	var spriteData = [];
	
	while(j<=sprite.data.length){
		
		pixel = {
			add_posx : "add cx," + (contador_distanciaX - anterior_distanciaX),
			add_posy : "add dx," + (contador_distanciaY - anterior_distanciaY),
			red : sprite.data[j],
			green : sprite.data[j+1],
			blue : sprite.data[j+2],
			alpha : sprite.data[j+3],
			color : null
		}
		
		// Has it color ?
		if(pixel.alpha == 255){
			
			var isColor = false;
			
			for(c in colors){
				if(colors[c].red == pixel.red && colors[c].green == pixel.green && colors[c].blue == pixel.blue){
					pixel.color = colors[c].code;
					//spriteData.push(pixel.color);
					break;
				}
			}
						
			if(last != null){
				if(pixel.color == last.color){
					pixel.color = null;
				}else{
					last = pixel;
				}
			}else {
				last = pixel; // Último pixel
			}
				
			anterior_distanciaX = contador_distanciaX;
			anterior_distanciaY = contador_distanciaY;
			
			picture.push(pixel);
		}
		
		var isColor = false;
		for(c in colors){
				if(colors[c].red == pixel.red && colors[c].green == pixel.green && colors[c].blue == pixel.blue){
					pixel.color = colors[c].code;
					if(pixel.color == 0){
						spriteData.push(255);
					} else{
						spriteData.push(pixel.color);
					}
					isColor = true;
					break;
				}
		}
		
		if(!isColor){
			spriteData.push(255);
		
		}
	
		if(contador_distanciaX == xtotal){
			contador_distanciaX = 0;
			anterior_distanciaX = 0;
			contador_distanciaY++;
			picture.push({restart_cx :"mov cx,pj_posX"});
		}else{
			contador_distanciaX++;
		}
		
		//console.log("Input posx : " + input_posx);
		//console.log("Contador distancia : " + contador_distancia);
					
		j+=4;
			
	}
		
		
	var code_asm = 	name_routine + " proc<br/>" +
					"; posici&oacute;n X inicial : pj_posX<br/>" +
					"; posici&oacute;n Y inicial : pj_posY<br/>" +
					"; pj_posX = " + input_posx + "<br/>" +
					"; pj_posY = " + input_posy + "<br/>" +
					"; crear pj_posX en segmento de datos , tipo dw<br/>" +
					"pusha" + "<br/>" +
					";mov pj_posX," + input_posx + " ; esto antes de llamar a la rutina<br/>" +
					";mov pj_posY," + input_posy + " ; esto antes de llamar a la rutina<br/>" +
					"mov cx, pj_posX <br/>" +
					"mov dx, pj_posY <br/>";
					
	var nocolor = "no_" + name_routine + " proc<br/>" +
					"; para borrar personaje<br/>" +
					"pusha" + "<br/>" +
					";mov pj_posX," + input_posx + "; esto antes de llamar a la rutina<br/>" +
					";mov pj_posY," + input_posy + "; esto antes de llamar a la rutina<br/>" +
					"mov cx, pj_posX <br/>" +
					"mov dx, pj_posY <br/>" +
					"mov al,0 <br/>";
	
	var lines  = 0;
	
	var nocolor_lines = 0;
	
	var anterior_pY = "add dx,0";
		
	console.log(spriteData);
	
	for(p in picture){
	
		if(picture[p].restart_cx != null){
			code_asm += picture[p].restart_cx + "<br/>";
			nocolor += picture[p].restart_cx + "<br/>"
		} else{
			if(picture[p].color != null){
			
				if(picture[p].add_posy == anterior_pY){
				
					code_asm += "mov al," + picture[p].color + "<br/>" +
								picture[p].add_posx + "<br/>" +
								"mov ah,0ch" + "<br/>" +
								"int 10h" + "<br/>";
								
					nocolor +=	picture[p].add_posx + "<br/>" +
								"mov ah,0ch" + "<br/>" +
								"int 10h" + "<br/>";		
					
					lines+=4;
					nocolor_lines += 3;
				}else{
					code_asm += "mov al," + picture[p].color + "<br/>" +
								picture[p].add_posx + "<br/>" +
								picture[p].add_posy + "<br/>" +
								"mov ah,0ch" + "<br/>" +
								"int 10h" + "<br/>";
								
					nocolor += 	picture[p].add_posx + "<br/>" +
								picture[p].add_posy + "<br/>" +
								"mov ah,0ch" + "<br/>" +
								"int 10h" + "<br/>";
								
					lines+=5;
				}
			}else{
				if(picture[p].add_posy == anterior_pY){
					code_asm += picture[p].add_posx + "<br/>" +
								"mov ah,0ch" + "<br/>" +
								"int 10h" + "<br/>";
								
					nocolor += picture[p].add_posx + "<br/>" +
								"mov ah,0ch" + "<br/>" +
								"int 10h" + "<br/>";
					lines+=3;
					nocolor_lines += 3;
				}else{
					code_asm += picture[p].add_posx + "<br/>" +
								picture[p].add_posy + "<br/>" +
								"mov ah,0ch" + "<br/>" +
								"int 10h" + "<br/>";
								
					nocolor += picture[p].add_posx + "<br/>" +
								picture[p].add_posy + "<br/>" +
								"mov ah,0ch" + "<br/>" +
								"int 10h" + "<br/>";
					lines+=4;
					nocolor_lines += 4;
					}
			}
		}
	}
	
	
	data_lines = name_routine + " ";
	
	console.log(xtotal);
	
	for(i in spriteData){

			if(i % (xtotal+1) == 0 && i > 0){
				data_lines +=  "<br/>db " + spriteData[i];
			}else if(i == 0){
				data_lines += "db " + spriteData[i];
			}else{
				data_lines += ("," + spriteData[i]);
			}
	}
	
	
	proc_sprite = "<br/><br/><br/>; Rutina para usar la data en .data y mostrar el sprite <br/>" + 
					"; xtotal " + xtotal + "<br/>" +
					"; ytotal " + ytotal + "<br/>" +
					"sprite_" + name_routine + " proc" + "<br/>" +
				   "pusha" + "<br/>" +
					"; procedure --------------- sprite_" + name_routine + "mario" + "<br/>" +
					"; Esto afuera --> mov cuadrado_inicioX,100"+"<br/>" +
					"; Esto afuera --> mov cuadrado_inicioY,100"+"<br/>" +
					
					"; Calcular final X" + "<br/>" +
					"mov cx," + name_routine + "_posX" + "<br/>" +
					"add cx," + name_routine + "_ancho" + "<br/>" +
					"mov " + name_routine + "_finalX,cx" + "<br/>" +
					"; Calcular final Y" + "<br/>" +
					"mov cx," + name_routine + "_posY" + "<br/>" +
					"add cx," + name_routine + "_alto" + "<br/>" +
					"mov " + name_routine + "_finalY,cx" + "<br/>" +
					
					"mov cx," + name_routine + "_posX" + "<br/>" +
					"mov dx," + name_routine + "_posY" +"<br/>" +
					
					"; Leer datos en memoria" + "<br/>" +
					"lea bx," + name_routine + "<br/>" +
					"mov si,0" + 

				"paso2: mov cx," + name_routine + "_posX" + "<br/>" +
				"paso1:" + "<br/>" +
					"mov al,[bx+si] ; Color" + "<br/>" +
					"mov ah,0ch" + "<br/>" +
					"int 10h" + "<br/>" +
					"inc cx" + "<br/>" +
					"inc si" + "<br/>" +
					"cmp cx," + name_routine + "_finalX" + "<br/>" +
					"jl paso1" + "<br/>" +
					"inc dx" + "<br/>" +
					"cmp dx," + name_routine + "_finalY" + "<br/>" +
					"jl paso2" + "<br/>" +
					
					"popa" + "<br/>" +
					"ret" + "<br/>" +
					
				"sprite_" + name_routine + " endp";
	
	code_asm += "popa" + "<br/>"+
				"ret"  + "<br/>"+
				name_routine + " endp";
				
	nocolor += "popa" + "<br/>"+
				"ret"  + "<br/>"+
				"no_" + name_routine + " endp";
	
		var data = {
			code : code_asm,
			antimatter : nocolor,
			lines : lines + nocolor_lines,
			dataSprite : data_lines + proc_sprite
		}
		
		return data;
}