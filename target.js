// Target class (position and width)
class Target
{
  constructor(x, y, w, h, l, c, id)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.height = h;
    this.label  = l;
    this.id     = id;
    this.color  = c;
    this.isclicked = false;
  }
  
  // Checks if a mouse click took place
  // within the target
  clicked(mouse_x, mouse_y)
  {
    return mouse_x > this.x && mouse_x < this.x + this.width && mouse_y > this.y && mouse_y < this.y + this.height;
  }
  
  // Draws the target (i.e., a circle)
  // and its label
  draw()
  {
    let display        = new Display({ diagonal: display_size }, window.screen);
    let PPCM               = display.ppi / 2.54;
    
    // Draw target
    stroke(255);
    strokeWeight(0.02*PPCM);
    if(this.isclicked){
      fill(color(40, 40, 40)); 
    }
    else{
      fill(color(0,0,0));  
    }
    
    rect(this.x, this.y, this.width, this.height);
    strokeWeight(0);
    // Draw label
    textAlign(CENTER);
    fill(255);
    if(this.label.includes(" ")){
      textFont('monospace', 0.38*PPCM);
      fill(color(this.color.r, this.color.g, this.color.b));
      text(this.label, this.x + this.width/2, this.y + this.height/2 + 5);
      fill(255);
      text("   " + this.label.substring(3), this.x + this.width/2, this.y + this.height/2 + 5);
    }
    else{
      textFont('monospace', 0.34*PPCM);
      
      text(this.label, this.x + this.width/2, this.y + this.height - 0.2*PPCM);
    
      textSize(0.45*PPCM);
      fill(color(this.color.r, this.color.g, this.color.b));
      text(this.label.substring(1,4).toUpperCase(), this.x + this.width/2, this.y + this.height - 0.7*PPCM)
    }
    
  }
}
