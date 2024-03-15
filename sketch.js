// Bake-off #2 -- Seleção em Interfaces Densas
// IPM 2023-24, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 18 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 0;      // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = false;  // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS       = 12;     // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas;                       // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  

// Study control parameters (DO NOT CHANGE!)
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Target list and layout variables
let targets               = [];
const GRID_ROWS           = 11;      // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS        = 11;     // We divide our 80 targets in a 8x10 grid
let target_width;
let target_height;

// Variáveis para as legendas
let legendasPorPrefixos = Array.from({ length: 10 }, () => []);
const prefixos = {
  'Ba': {
          'key': 0,
          'num_columns': 3,
          'color': {'r': 255, 'g': 255, 'b': 0},
          'num_space': 2
        },
  'Br': {
          'key': 4,
          'num_columns': 2,
          'color': {'r': 0, 'g': 230, 'b': 255},
          'num_space': 0
        },
  'Be': {
          'key': 1,
          'num_columns': 2,
          'color': {'r': 255, 'g': 153, 'b': 51},
          'num_space': 0
        },
  'Bé': {
          'key': 1,
          'num_columns': 2,
          'color': {'r': 255, 'g': 153, 'b': 51},
          'num_space': 1
        },
  'Bu': {
          'key': 3,
          'num_columns': 1,
          'color': {'r': 255, 'g': 0, 'b': 255},
          'num_space': 1
        },
  'Bi': {
          'key': 2,
          'num_columns': 1,
          'color': {'r': 255, 'g': 0, 'b': 0},
          'num_space': 1
        },
  'Bo': {
          'key': 5,
          'num_columns': 1,
          'color': {'r': 45, 'g': 255, 'b': 45},
          'num_space': 0
        },
  'Bh': {
          'key': 6,
          'num_columns': 1,
          'color': {'r': 0, 'g': 125, 'b': 0},
          'num_space': 0
        },
  'By': {
          'key': 7,
          'num_columns': 1,
          'color': {'r': 45, 'g': 255, 'b': 45},
          'num_space': 0
        },
  'Bl': {
          'key': 8,
          'num_columns': 1,
          'color': {'r': 0, 'g': 125, 'b': 0},
          'num_space': 0
        },
  'Bn': {
          'key': 9,
          'num_columns': 1,
          'color': {'r': 45, 'g': 255, 'b': 45},
          'num_space': 1
        },
}


// Ensures important data is loaded before the program starts
function preload()
{
  // id,name,...
  legendas = loadTable('legendas.csv', 'csv', 'header', ordenarPrefixos);
}

// Runs once at the start
function setup()
{
  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(0,0,0));        // sets background to black
    
    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255,255,255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
    
    textStyle(BOLD);
    textSize(20);
    textAlign(CENTER);
    text("Palavras\ncom Espaços", target_width/2, height-40-(target_height/2));
    
    textAlign(LEFT);
    push();
    rotate(-HALF_PI);
    text("Tamanho da palavra", -(20 + target_height * 7), 60);
    textSize(35);
    text("<------------------------------------------------", -(20 + target_height*10 - target_height/2), 3*target_width/4);
    
    pop();

    // Draw all targets
	  for (var i = 0; i < legendas.getRowCount(); i++) targets[i].draw();
    
    var total_columns = 0;
    for (var j = 0; j < legendasPorPrefixos.length-4; j++){
      var prefixo_atual = legendasPorPrefixos[j][0].substring(0, 2);
      var rect_x = target_width * (1 + total_columns) + 2;
      var rect_y = 20 + 2;
      var rect_width = (target_width * prefixos[prefixo_atual].num_columns) - 5;
      var rect_height = (target_height * 11) - 5;
      noFill();
      stroke(color(prefixos[prefixo_atual].color.r, prefixos[prefixo_atual].color.g, prefixos[prefixo_atual].color.b));
      strokeWeight(4);
      rect(rect_x, rect_y, rect_width, rect_height);

      rect(rect_x, rect_y + target_height, rect_width, rect_height - 2*target_height + 1);
      stroke(0);
      
      if(j != legendasPorPrefixos.length - 5){
        fill(color(prefixos[prefixo_atual].color.r, prefixos[prefixo_atual].color.g, prefixos[prefixo_atual].color.b));
        textFont('monospace', 35);
        textStyle(BOLD);
        textAlign(CENTER);
        text(prefixo_atual, ((total_columns+1) * target_width) + (prefixos[prefixo_atual].num_columns * target_width)/2, 20 + target_height/2 + 15);
      }

      total_columns += prefixos[prefixo_atual].num_columns;
    }
    
    textFont('monospace', 25);
    textStyle(BOLD);
    textAlign(CENTER);
    fill(color(prefixos.Bo.color.r, prefixos.Bo.color.g, prefixos.Bo.color.b));
    text("Bo Bh By\nBl Bn", (10 * target_width) + target_width/2, 20 + target_height/2 -5);
    fill(color(prefixos.Bh.color.r, prefixos.Bh.color.g, prefixos.Bh.color.b));
    text("   Bh   \nBl   ", (10 * target_width) + target_width/2, 20 + target_height/2 -5);

    fill(color(0,0,0));
    rect(0, height - 40, width, 40);

    var label = legendas.getString(trials[current_trial],1);
    
    textFont("monospace", 25);
    textAlign(CENTER);
    fill(255);
    text(label, width/2, height - 15);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() 
{
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets)
  {
    for (var i = 0; i < legendas.getRowCount(); i++)
    {
      // Check if the user clicked over one of the targets
      if (targets[i].clicked(mouseX, mouseY)) 
      {
        // Checks if it was the correct target
        if (targets[i].id === trials[current_trial]){
          targets[i].isclicked = true;
          hits++;
        }
        else misses++;
        
        current_trial++;              // Move on to the next trial/target
        break;
      }
    }
    
    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS)
    {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2)
      {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest()
{
  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  for(var t = 0; t < targets.length; t++){
    targets[t].isclicked = false;
  }
  
  // Shows the targets again
  draw_targets = true;
}

// Creates and positions the UI targets
function createTargets()
{ 
  let target_x = target_width;
  let target_y = target_height + 20;
  let total_columns = 0;
  let palavra_atual;
  for (var i = 0; i < legendasPorPrefixos.length - 5; i++)
  {
    var prefixo_atual = legendasPorPrefixos[i][0].substring(0, 2);

    let c = 0;
    for (var j = 0; j < legendasPorPrefixos[i].length - prefixos[prefixo_atual].num_space; j++)
    { 
      palavra_atual = legendasPorPrefixos[i][j];
      let target = new Target(target_x + target_width * c, target_y, target_width, target_height, palavra_atual, prefixos[prefixo_atual].color, searchID(palavra_atual));
      targets.push(target);

      if(c == prefixos[prefixo_atual].num_columns - 1){
        target_y += target_height;
      }
      c = (c + 1) % prefixos[prefixo_atual].num_columns;
    }
    // Posiciona os targets com espaço no sitio certo
    //let screen_height  = display.height * 2.54
    target_y = 20 + target_height * 10
    c = 0
    target_x = target_width * (total_columns + 1)
    for(var k = 0; k < prefixos[prefixo_atual].num_space; k++){
      palavra_atual = legendasPorPrefixos[i][legendasPorPrefixos[i].length - prefixos[prefixo_atual].num_space + k];
      let target = new Target(target_x + target_width * c, target_y, target_width, target_height, palavra_atual,prefixos[prefixo_atual].color, searchID(palavra_atual));
      targets.push(target);
      c++;
    }
    total_columns += prefixos[prefixo_atual].num_columns;
    target_y = target_height + 20;
    target_x = target_width * (total_columns + 1);
  }
  
  target_x = target_width * 10;
  target_y = target_height + 20;

  for (var l = legendasPorPrefixos.length - 5; l < legendasPorPrefixos.length; l++)
  {
    var prefixo_atual = legendasPorPrefixos[l][0].substring(0, 2);

    for(var m = 0; m <  legendasPorPrefixos[l].length; m++){
      palavra_atual = legendasPorPrefixos[l][m];
      let target = new Target(target_x, target_y, target_width, target_height, palavra_atual, prefixos[prefixo_atual].color, searchID(palavra_atual));
      targets.push(target);
      target_y += target_height;
    }
  }
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() 
{
  if (fullscreen())
  {
    resizeCanvas(windowWidth, windowHeight);
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
    target_width    = (screen_width / GRID_COLUMNS) * PPCM;                                // sets the target size (will be converted to cm when passed to createTargets)
    target_height = ((screen_height - 60/PPCM) / GRID_ROWS) * PPCM;
    //let horizontal_gap = screen_width - target_size * GRID_COLUMNS;// empty space in cm across the x-axis (based on 10 targets per row)
    //let vertical_gap   = screen_height - target_size * GRID_ROWS;  // empty space in cm across the y-axis (based on 8 targets per column)

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createTargets();

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}


function ordenarPrefixos(){
  // Obtem todos os nomes das cidades num array
  var cities = legendas.getColumn('city');
  
  // Separa pelas primeiras 2 letras
  for(var i = 0; i < cities.length; i++){
    legendasPorPrefixos[prefixos[cities[i].substring(0, 2)].key].push(cities[i]);
  }

  // Para cada prefixo...
  for(var j = 0; j < legendasPorPrefixos.length; j++){
    // ... ordena por tamanho e por ordem alfabética...
    legendasPorPrefixos[j].sort((a, b) => {
      var tamanhoA = a.length;
      var tamanhoB = b.length;
  
      if (tamanhoA !== tamanhoB) {
        return tamanhoA - tamanhoB;
      }
  
      return a.localeCompare(b);
    });

    // ... e coloca as palavras com espacos no fim 
    var palavrasComEspacos = [];
    for(var k = 0; k < legendasPorPrefixos[j].length; k++){
      if(legendasPorPrefixos[j][k].includes(' ')){
        palavrasComEspacos.push(legendasPorPrefixos[j].splice(k, 1)[0]);
        k--;
      }
    }
    legendasPorPrefixos[j].push(...palavrasComEspacos);
  }
}

function searchID(palavra){
  for (let i = 0; i < legendas.getRowCount(); i++) {
    let cur_city = legendas.getString(i, 'city');
    if (cur_city === palavra) {
      return i;
    }
  }
}