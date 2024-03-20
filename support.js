// Support variables & functions (DO NOT CHANGE!)

let student_ID_form, display_size_form, start_button;                  // Initial input variables
let student_ID, display_size;                                          // User input parameters

// Prints the initial UI that prompts that ask for student ID and screen size
function drawUserIDScreen()
{ 
  background(0);

  let main_text = createP("Insira o número do seu estudante e o tamanho do display");
  main_text.id('main_text');
  main_text.position(10, 10);

  // Segundo texto
  let t1 = createP("Dicas:");
  let t2 = createP("- Palavras estão separadas por prefixos das 2 primeiras letras");
  let t3 = createP("- Dentro de cada prefixo, estão ordenadas alfabeticamente por linhas");
  let t4 = createP("- Palavras com espaços estão na linha de baixo");
  let t5 = createP("- A 2º, 3ª e 4ª letra de cada palavra estão destacadas");
  let t6 = createP("- O tempo só começa quando clicas na primeira palavra");
  
  t1.position(325, 280);
  t1.style('color', 'white');
  t1.id('t1');
  t1.style('font-size', '20px');
  
  t2.position(100, 320);
  t2.style('color', 'white');
  t2.id('t2');
  t2.style('font-size', '20px');
  
  t3.position(70, 350);
  t3.style('color', 'white');
  t3.id('t3');
  t3.style('font-size', '20px');
  
  t4.position(160, 380);
  t4.style('color', 'red');
  t4.id('t4');
  t4.style('font-size', '20px');
  
  t5.position(140, 410);
  t5.style('color', 'white');
  t5.id('t5');
  t5.style('font-size', '20px');

  t6.position(120, 440);
  t6.style('color', 'white');
  t6.id('t6');
  t6.style('font-size', '20px');
  
  
  // Input forms:
  // 1. Student ID
  let student_ID_pos_y_offset = main_text.size().height + 40;         // y offset from previous item
  
  student_ID_form = createInput('');                                 // create input field
  student_ID_form.position(200, student_ID_pos_y_offset);
  
  student_ID_label = createDiv("Student number (int)");              // create label
  student_ID_label.id('input');
  student_ID_label.position(10, student_ID_pos_y_offset);
  
  // 2. Display size
  let display_size_pos_y_offset = student_ID_pos_y_offset + student_ID_form.size().height + 20;
  
  display_size_form = createInput('');                              // create input field
  display_size_form.position(200, display_size_pos_y_offset);
  
  display_size_label = createDiv("Display size in inches");         // create label
  display_size_label.id('input');
  display_size_label.position(10, display_size_pos_y_offset);
  
  // 3. Start button
  start_button = createButton('START');
  start_button.mouseReleased(startTest);
  start_button.position(width/2 - start_button.size().width/2, height/2 - start_button.size().height/2);
}

// Verifies if the student ID is a number, and within an acceptable range
function validID()
{
  if(parseInt(student_ID_form.value()) < 200000 && parseInt(student_ID_form.value()) > 1000) return true
  else 
  {
    alert("Please insert a valid student number (integer between 1000 and 200000)");
	return false;
  }
}

// Verifies if the display size is a number, and within an acceptable range (>13")
function validSize()
{
  if (parseInt(display_size_form.value()) < 50 && parseInt(display_size_form.value()) >= 13) return true
  else
  {
    alert("Please insert a valid display size (between 13 and 50)");
    return false;
  }
}

// Starts the test (i.e., target selection task)
function startTest()
{
  if (validID() && validSize())
  {
    // Saves student and display information
    student_ID = parseInt(student_ID_form.value());
    display_size = parseInt(display_size_form.value());

    // Deletes UI elements
    main_text.remove();
    t1.remove();
    t2.remove();
    t3.remove();
    t4.remove();
    t5.remove();
    t6.remove();
    student_ID_form.remove();
    student_ID_label.remove();
    display_size_form.remove();
    display_size_label.remove();
    start_button.remove();  

    // Goes fullscreen and starts test
    fullscreen(!fullscreen());
  }
}

// Randomize the order in the targets to be selected
function randomizeTrials()
{
  trials = [];      // Empties the array
    
  // Creates an array with random items from the "legendas" CSV
  for (var i = 0; i < NUM_OF_TRIALS; i++) trials.push(floor(random(legendas.getRowCount())));

  print("trial order: " + trials);   // prints trial order - for debug purposes
}