// Target class (position and width)
class Target
{
  constructor(x, y, w, h, l, id)
  {
    this.x      = x;
    this.y      = y;
    this.width  = w;
    this.height = h;
    this.label  = l;
    this.id     = id;
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
    fill(color(255,0,0));                 
    rect(this.x, this.y, this.width, this.height);
    
    // Draw label
    textFont('monospace', 18);
    fill(color(255,255,255));
    textAlign(CENTER);
    text(this.label, this.x + this.width/2, this.y + this.height/2);
  }
}
