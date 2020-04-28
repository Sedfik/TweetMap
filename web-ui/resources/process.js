let page;
let globalData;
let mapInitialized = false;


let counter = 1;
let LIMIT = 3;

let colors = ['#4CAF50', '#00BCD4', '#E91E63', '#FFC107', '#9E9E9E', '#CDDC39', '#08088A', '#F44336', '#FFF59D', '#6D4C41'];


function load() {
  var tweetText1 = document.getElementById("tweetText1");

  var checkboxes = document.getElementById("country_checkboxes");
  console.log("creation de la liste des pays");
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    console.log(this.readyState);
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.responseText);
      console.log(res)
      checkboxes.appendChild(create_country_checkboxes(res));
    }
  };
  xhttp.open("GET", "countries", true);
  xhttp.send();
}
/*
//TODO 
On recupere l'ensemble des champs du fichier. 
On les mets dans un tableau
Pour chaque nom de colonne on crée un nouveau formulaire suivant ces noms
Dans la query on récupère tous les elements du doc avec id=nomColonne
*/


let get_query_functions = [
  get_text_query,
  get_country_query
];

function get_query() {
  let queries = get_query_functions.map(f => f());

  return queries.join("&");
}

function loadDoc() {

  console.log(tweetText1);
  // TODO Gestion des inputs frauduleuses de l'utilisateur (caracteres speciaux...) 
  
  let query = get_query();
  
  console.log("query:",query);

  // Requette de filtre au serveur
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(this.responseText);
      
      globalData = res;

      document.getElementById("nbTweets").innerHTML =  res.length;
      //document.getElementById("brutData").innerHTML = JSON.stringify(res);
      
      let listDiv = document.getElementById("tweetList");
      console.log("list:" + listDiv);
    
      clearDiv(listDiv);
      
      console.log("json",globalData);
      
      listDiv.appendChild(tweetList(0,15));
      
      // TODO a debuger: Affichage simultane de brutDataDiv et listDiv
      //brutDiv.appendChild();
      
      console.log("Creation de l'histograme")
      let histDiv = document.getElementById("hist");
      clearDiv(histDiv);

      histDiv.appendChild(hist(res,"place_country",600,500));
      console.log("--- Fin histogramme ---");

      let pieDiv = document.getElementById("pieChart");
      clearDiv(pieDiv);

      let pieHashtag = drawPie(res,"hashtag_0",1000,600);

      pieDiv.appendChild(pieHashtag);


      let mapDiv = document.getElementById("world_map");
      clearDiv(mapDiv);
      
      console.log("div dim",mapDiv.clientWidth);
      let mapCanva = drawMap(res,1000,500);
      
      mapDiv.appendChild(mapCanva);
    }
  };
  xhttp.open("GET", "tweets?"+query, true);
  
  xhttp.timeout = 1500
  xhttp.ontimeout = () => {
    console.error('Timeout!!')
    alert("Request Timeout")
  };

  xhttp.send();
}


function get_text_query() {
   // Recuperation des champs de recheche
   let query = [];
   for (let i = 1; i <= counter; i++) {
     let tweetText = document.getElementById("tweetText"+i);
     
     query.push("text="+tweetText.value);
     
   }
   return query.join("&");
}


function tweetList(p,TweetPerPage) {
  page = p;
  
  // Creation du tableau contenant les tweets
  let bigDiv = document.createElement("div");
  bigDiv.classList.add("grid-container");
      
  // Fonction de remplissage de list
  // 15 c'est le nombre de tweets que j'affiche par page
  for (let i = TweetPerPage * p; (i < (p+1) * TweetPerPage) && (i < globalData.length) ;i++){

    let cell = document.createElement("div");
    cell.classList.add("grid-item");

    console.log("Ajout des elements");
    let userName = globalData[i]["user_name"];
    let text = globalData[i]["text"];

    let content =  document.createElement("div");
    content.classList.add("interiorContent")
    content.innerHTML += '<p> <i style="font-size:16px " class="fa">&#xf099;</i> <strong>' 
                          + userName + "</strong></p>"
                    + "</br><p>"
                    + text 
                    + "</p>";

    cell.appendChild(content);
    bigDiv.appendChild(cell);

  }

   //manipulation de la pagination
   pageVisibility();
 
   return bigDiv;
}


function pageVisibility() {
  //affichage de la pagination si le contenu est suffisant
  if (globalData.length > 15){
    console.log("display");
    document.getElementById("pagination").style.display = "block";
    console.log(document.getElementById("pagination").style.display);
  }
  else{
    document.getElementById("pagination").style.display = "none";
  }

  //premiére page 
  if (page == 0 ) {
    var leftArrow = document.getElementById("la");
    leftArrow.classList.add("nonClickable");
    leftArrow.style.color = "grey";
  }

  //derniére page 
  if ((page+1) * 15 > globalData.length) {
    var rightArrow = document.getElementById("ra");
    rightArrow.classList.add("nonClickable");
    rightArrow.style.color = "grey";   
  
  } else{

    var rightArrow = document.getElementById("ra");
    rightArrow.classList.remove("nonClickable");
    rightArrow.style.color = "black";   
  }

  // toutes les pages sauf la premiére
  if (page > 0) {
    var leftArrow = document.getElementById("la");
    leftArrow.classList.remove("nonClickable");
    leftArrow.style.color = "black";
  }

}

function nextPage(){
  let list = document.getElementById("tweetList");
  clearDiv(list);
  list.appendChild(tweetList(page+1,15));
}

function prevPage(){
  let list = document.getElementById("tweetList");
  clearDiv(list);
  list.appendChild(tweetList(page-1,15));
  
}


/**
 * Fonction de creation des checkbox en fonction des pays recupere du serveur.
 * Retourne une div contenant l'ensemble des checkbox
 * @param {*} jsonData 
 */
function create_country_checkboxes(jsonData) {
  let ul =  document.createElement("ul");

  ul.id = "country_checkbox_list"

  let i = 0;

  jsonData.forEach(country_code => {
    
    let li = document.createElement("li");

    let checkbox = document.createElement("input")
    
    checkbox.type = "checkbox";
    checkbox.id = "country"+i;

    i++;
    
    checkbox.name = country_code;
    
    li.appendChild(checkbox);

    let label = document.createElement("label");
    label.for = country_code;
    
    label.innerHTML = getCountryName(country_code);
    
    if(country_code == null){
      label.innerHTML = "undefined";
    }
    
    li.appendChild(label)
    li.appendChild(document.createElement("br"));

    ul.appendChild(li);
  });

  return ul;
}

/**
 * Fonction pour récupérer les pays selectionnes sous forme de parametre
 * ex: place_country_code=fr&place_contry_code=en
 */
function get_country_query() {
  let query = [];
  let i = 0;

  let country = document.getElementById("country"+i);
  console.log(country);

  while(country != null){
    if(country.checked){
      query.push("place_country_code="+country.name);
    }
    i++;
    country = document.getElementById("country"+i);
  }
  return query.join("&");
}


/**
 * Affiche les donnees brut dans un tableau
 * 
 * @param {*} jsonData Un fichier Json contenant les donnees 
 * @returns {*} table: Le noeud DOM contenant un tableau des donnees
 */
function brutData(jsonData) {

  // Creation de la table des donnees
  let table = document.createElement("table");

  // Recuperation des index
  let tr = document.createElement("tr");
  table.appendChild(tr);

  for(key in jsonData[0]){
  
    let th = document.createElement("th");
    th.innerHTML = key;
    tr.appendChild(th);
  
  }

  // Remplissage des lignes
  jsonData.forEach(element => {
    let tr = document.createElement("tr");
    table.appendChild(tr);
    for(key in element){
      let td = document.createElement("td");
      td.innerHTML = element[key];
      tr.appendChild(td);
   }
  });
  return table;
}

/**
 * Fonction de creation d'un canvas contenant un histograme sur une colonne.
 * @param {*} jsonData les donnees
 * @param {*} columnName le nom de la colonne 
 * @param {*} width la largeur du canvas
 * @param {*} height la hauteur du canvas
 */

function hist(jsonData,columnName,width,height) {
  
  // Creation du canvas et definition de sa taille
  let canva = document.createElement("canvas");
  canva.width = width;
  canva.height = height;
  let context = canva.getContext("2d");
  
  // Creation d'un dictionnaire qui pour chaque pays donne le nombre de tweets -> { "France": "12" }
  let dict = {}
  jsonData.forEach(element => {
    let columnValue = element[columnName];
    if(typeof dict[columnValue] == 'undefined'){
      dict[columnValue] = 1;
      //console.log("initialize",columnValue)
    }
    else{
      dict[columnValue] += 1;
      //console.log("addTo",columnValue)
    }
  });
  
  // Dessin des rectangles suivant la taille des canvas
  context.beginPath();

  let x = 20;
  
  let yOrigin = 40; // Le y origine qui servira de repere
  let rectMaxHeight = (canva.height -100); // La taille maximale d'un rectangle
  let rectWidth = (canva.width - 100) / size_dict(dict); // La largeur maximale d'un rectangle defini par le nombre d'entrees dans le dictionnaire

  // Fonction de recuperation de la valeur maximale du dictionnaire
  // ex: { "France": 12, "Espagne":23 } -> maxOfDict retourne 23
  let maxOfDict = Object.keys(dict).reduce(( (acc,cur) => dict[cur] > acc ? dict[cur] : acc),0)  
  //console.log("max",maxOfDict);

  
  let yRatio = rectMaxHeight / maxOfDict; // Definition du ratio que vaut 1 "point" afin de calculer la hauteur du rectangle dans le canvas
  //console.log("yR",yRatio);

  //console.log("canvas width",canva.width);

  let number; // Valeur d'une clef du dictionnaire

  let i = 0;
  // Pour chaque clefs dans le dictionnaire
  for(key in dict){
    number = dict[key] * yRatio; 
    
    //console.log("number",key,":",number);

    // On dessine le rectangle correspondant
    //rect(x:, y: on part de l'origine, on ajoute la difference entre la taille max et la valeur du nombre d'occurence, xWidth, yHeigth)
    context.fillStyle = colors[i%colors.length];
    context.fillRect(x, yOrigin + rectMaxHeight - number, rectWidth, number);
   
    i++;
    
    //console.log("draw rect(",x,",",yOrigin + rectMaxHeight-number,",",rectWidth,",",number  ,")");
    
    // On ecrit le nombre d'occurences
    context.fillStyle = "black";
    context.fillText(dict[key],x,yOrigin + rectMaxHeight-number-5);
    
    // / / Nom de la clef ecrit suivant une rotation 
    // On sauvegarde le contexte actuel
    context.save();
    // On decale le context mettant les origines en bas du graph et on laisse de la place pour ecrire la clef
    context.translate(x+(rectWidth/2), yOrigin + rectMaxHeight + 5);
    console.log("length",key,":",key.toString().length);
    // On tourne
    context.rotate(Math.PI/2);
    // On ecrit le text
    context.fillText(key, 0,0);
    // On recupere le contexte precedement sauvgarde
    context.restore();
    // / /  

    // On incremente la position de x en laissant un espace entre les rectangles
    x += rectWidth + 4;    
  }
  // On dessine 
  context.stroke(); 
  // On retourne le noeud canvas
  return canva;
}

/**
 * Efface tous les noeuds fils d'une div 
 * 
 * @param {*} div la div a clear 
 */
function clearDiv(div) {
  console.log("clear div");
  try {
    while(div.lastElementChild){
      div.removeChild(div.lastElementChild);
  } 
  } catch (error) {
    console.error(error);
  }
  console.log("End clearing");
}


// Aide de https://www.codeblocq.com/2016/04/Create-a-Pie-Chart-with-HTML5-canvas/
function drawPie(jsonData, columnName , width, height) {
  
  let canva = document.createElement("canvas");
  canva.width = width;
  canva.height = height;
  let context = canva.getContext("2d");

  // Le centre du cercle
  let xCenter, yCenter, pieRadius;

  xCenter = width / 3;
  yCenter = height / 2;

 
  pieRadius = Math.min(xCenter-(width/15),yCenter-(height/15));
  console.log(xCenter-(width/15),yCenter-(height/15));
  // Creation d'un dictionnaire qui pour chaque pays donne le nombre de tweets -> { "France": "12" }
  let dict = {}
  jsonData.forEach(element => {
    let columnValue = element[columnName];
    if(typeof dict[columnValue] == 'undefined'){
      dict[columnValue] = 1;
      //console.log("initialize",columnValue)
    }
    else{
      dict[columnValue] += 1;
      //console.log("addTo",columnValue)
    }
  });
  // Fonction de calcul de la somme des valeurs d'un dictionnaire
  let valuesSumOfDict = Object.keys(dict).reduce(( (acc,cur) => dict[cur] + acc),0)  
  
  let beginAngle = 0;
  let endAngle = 0;

  let offset = 10;

  let offsetX, offsetY, medianAngle;

  let xText = (2/3)*width;
  let yText = (1/5)*height;

  let rectSize = 10;

  let i = 0;

  for(key in dict){

    console.log(dict[key]);
  
    let angle = Math.PI * (dict[key] * 2 / valuesSumOfDict);
  
    beginAngle = endAngle;

    endAngle += angle;

    medianAngle = (endAngle + beginAngle) / 2;

    offsetX = Math.cos(medianAngle) * offset;
    offsetY = Math.sin(medianAngle) * offset;

    context.beginPath();
    context.fillStyle = colors[i%colors.length];
    console.log(context.fillStyle);

    context.moveTo(xCenter + offsetX, yCenter + offsetY);
    context.arc(xCenter + offsetX, yCenter + offsetY, pieRadius,beginAngle,endAngle);
    context.lineTo(xCenter + offsetX, yCenter + offsetY);
    context.stroke();

    context.fill();


    context.beginPath();
    context.rect(xText, yText - rectSize, rectSize, rectSize);
    context.fillText(key,xText + rectSize + 5,yText);
    yText += 2*rectSize;
    
    context.fillStyle = colors[i%colors.length];    
    context.fill();


    i++;
  }
  
  return canva;
}


function size_dict(d){c=0; for (i in d) ++c; return c}

/**
 * Retourne un canvas contenant la carte avec la position de chaque tweets
 * @param {*} jsonData  les donnees 
 * @param {*} width     la largeur du canvas
 * @param {*} height    la hauteur du canvas
 */
function drawMap(jsonData, width, height) {
  // Initialisation du canvas
  let canva = document.createElement("canvas");
  canva.width = width;
  canva.height = height;
  let context = canva.getContext("2d");

  // Ajout de l'image au canvas
  image = new Image();
  image.src = 'world_map.png';

  image.onload = function () { // Une fois l'image chargee, on l'affiche et fait le traitement
    console.log("drawImage")
    context.drawImage(image,0,0,image.width,image.height,0,0,canva.width,canva.height); 
  
    // Pour chaque tweets
    jsonData.forEach(element => {

      //console.log(element['longitude'],":",element['latitude']);
      
      // Calcul des coordonnes x,y suivant la longitude et latitude ainsi que la taille du canvas
      let coor = mercatorXY(width,height,element['longitude'],element['latitude']);
      
      // coor = [x,y]
      //console.log(coor);

      // On dessine un cercle
      context.beginPath();
      context.arc(coor[0],coor[1],2,0, 2 * Math.PI);
      context.stroke();
    });
  }
  return canva;   
}

/**
 * Fonction de mercator retournant les coordonnees XY pour un couple longitude latitude donne ainsi que les dimensions du canvas
 * @param {*} width 
 * @param {*} height 
 * @param {*} longitude 
 * @param {*} latitude 
 */
function mercatorXY(width,height,longitude,latitude) {
  let x;
  let radLatitude = latitude * Math.PI /180; // Transformation du degree en radian
  let y;

  x = width * ((longitude + 180)/360);
  y = (height/2) - ( (width/(2*Math.PI)) * ( Math.log( Math.tan( Math.PI/4 + radLatitude/2 ))));
  
  return [x,y];
}

function addInput(divName){
     if (counter == LIMIT)  {
          alert("You have reached the LIMIT of adding " + counter + " inputs");
     }
     else {
          var newdiv = document.createElement('div');
          counter++;
          id = "tweetText"+counter;
          newdiv.innerHTML = " <div> <input type='text' id='"+id+"' name='myInputs[]' > <input type='button' value='-' class='lessBtn' onClick='removeInput();'> </div>";
          document.getElementById(divName).appendChild(newdiv);

     }
}

function removeInput(){
  var remove = document.getElementById('tweet-text');
  remove.removeChild(remove.lastElementChild);
  counter--;
}

function filter_countries() {
  let input = document.getElementById("search_country");
  let ul_checkboxes = document.getElementById("country_checkbox_list")

  let li = ul_checkboxes.getElementsByTagName("li");

  for( i = 0; i < li.length; i++){
    let label = li[i].getElementsByTagName("label")[0];
    
    if(label.textContent.toUpperCase().indexOf(input.value.toUpperCase()) > -1){
      li[i].style.display = "";
    } else{
      li[i].style.display = "none";
    }
  }
}