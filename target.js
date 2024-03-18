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
    // Draw target
    stroke(255);
    strokeWeight(1);
    if(this.isclicked){
      fill(color(80, 80, 80)); 
    }
    else{
      fill(color(0,0,0));  
    }
    rect(this.x, this.y, this.width, this.height);
    strokeWeight(0);
    // Draw label
    textFont('monospace', 13);
    textAlign(CENTER);
    
    fill(color(this.color.r, this.color.g, this.color.b));
    text(this.label, this.x + this.width/2, this.y + this.height/2 + 5);
    
    fill(color(255, 255, 255));
    text("   " + this.label.substring(3), this.x + this.width/2, this.y + this.height/2 + 5);
  }
}
