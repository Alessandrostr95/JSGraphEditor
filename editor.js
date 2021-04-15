
let g;
let draggedNode;
let draggedAnchor;
let colorPicker;
let checkLabel;
let checkAnchors;
let sliderX;
let sliderY;
let sliderRadius;
let inputValore;
let CREA;
let inputEdgeA;
let inputEdgeB;
let inputPeso;
let ATTACCA;
let CLEAR;
let show_anchors = false;

function setup(){

    checkAnchors = createCheckbox('Show anchor points', false);
    checkAnchors.changed(showAnchors);

    createCanvas(800, 600);

    createDiv('<hr>');

    colorPicker = createColorPicker('#14eb23');

    checkLabel = createCheckbox('label', false);
    
    inputValore = createInput('a');

    createDiv('x:<br>');
    sliderX = createSlider(0, width, width/2);
    
    createDiv('y:<br>');
    sliderY = createSlider(0, height, height/2);

    createDiv('Radius:<br>');
    sliderRadius = createSlider(1, 20, 5);
    
    CREA = createButton('Create/Update!');
    CREA.mousePressed(createNode);

    createDiv('<hr>');
    
    createDiv('Nodo A:<br>');
    inputEdgeA = createInput('');

    createDiv('Nodo B:<br>');
    inputEdgeB = createInput('');

    createDiv('Peso:<br>');
    inputPeso = createInput('');
    
    ATTACCA = createButton('Attach!');
    ATTACCA.mousePressed(attachNodes);
    
    createDiv('<br>');
    CLEAR = createButton('Clear');
    CLEAR.mousePressed(pulisci);


    g = new Grafo();
    g.add_edge(1,2, -3);
    g.add_edge(1,4);
    g.add_edge(2,3);
    g.add_edge(3,4);
    g.nodi[1].update({colore: color('red'), labeled:true, radius: 8});

    cursor('grab');
}

function draw(){
    background(255);

    strokeWeight(5);
    stroke(0);
    line(0, 0, width, 0);
    line(width, 0, width, height);
    line(width, height, 0, height);
    line(0, height, 0, 0);


    g.show();

    if( ! show_anchors) {
        draggedNode = g.isAbove(mouseX, mouseY);
    }
    else {
        draggedAnchor = g.getAnchor(mouseX, mouseY);
    }

    
}

function mousePressed() {
    cursor('grabbing');
}

function mouseDragged() {

    if(draggedNode) {

        // constante utile per muovere eventuali ancore
        const movimento = createVector(
            mouseX - draggedNode.attr.pos.x,
            mouseY - draggedNode.attr.pos.y
        );

        // aggiorno la posizione del nodo
        draggedNode.update({pos: createVector(mouseX, mouseY)});

        // per ogni arco incidente verifico se muovere anche l'ancora oppure no
        for(let v in draggedNode.vicini) {
            if( ! draggedNode.vicini[v].ancora_fissa ) {
                draggedNode.vicini[v].ancora.x = draggedNode.vicini[v].ancora.x + movimento.x;
                draggedNode.vicini[v].ancora.y = draggedNode.vicini[v].ancora.y + movimento.y;
            }
        }
    }

    if(draggedAnchor&& show_anchors) {
        draggedAnchor.x = mouseX;
        draggedAnchor.y = mouseY;
      }
}

function mouseReleased(){
    cursor('grab');
}


function showAnchors(){
    show_anchors = this.checked();
}


function createNode() {
    // TODO: pulire gli input

    let attr = {
        pos: createVector(sliderX.value(), sliderY.value()),
        radius: 5,
        colore: color(colorPicker.value()),
        label: checkLabel.checked(),
        radius: sliderRadius.value()
    }

    g.add_node(inputValore.value(), attr);

}

function attachNodes() {
    // TODO: pulire gli input
    let peso = inputPeso.value()
    if ( peso.length == 0 ) {
        peso = undefined;
    }
    g.add_edge(inputEdgeA.value(), inputEdgeB.value(), peso);
}

function pulisci(){
    g = new Grafo();
}