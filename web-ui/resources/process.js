// Variables globales
let page; // Le numéro de page courant
let globalData; // Les données reçu
let mapInitialized = false; // Permet d'éviter d'initialiser la carte 2 fois.


let counter = 1;  // Le nombre de champs "text" actuel
let LIMIT = 3; // Le nombre permit

// List de couleurs pour les graphes
let colors = ['#4CAF50', '#00BCD4', '#E91E63', '#FFC107', '#9E9E9E', '#CDDC39', '#08088A', '#F44336', '#FFF59D', '#6D4C41'];


/**
 * Fonction appellee au chargement de la page
 * La fonction va récupérer l'ensemble des pays puis les afficher dans une div de checkbox
 */
function load() {
  let tweetText1 = document.getElementById("tweetText1");

  // Recuperation de la div
  let checkboxes = document.getElementById("country_checkboxes");
  console.log("creation de la liste des pays");
  
  // Requette ascynchrone
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) { // Quand on recoit la reponse
      let res = JSON.parse(this.responseText);
      
      // On remplit la div
      checkboxes.appendChild(create_country_checkboxes(res));
    }
  };
  // On demande l'ensemble des pays
  xhttp.open("GET", "countries", true);
  xhttp.send();
}

/**
 * Tableau de l'ensemble des fonctions permettants de recuperer la requette
 * Chaque fonction renvoie une String de forme : "param1=value1&param1=value2" ou "" si aucun champs n'est rempli
 */
let get_query_functions = [
  get_text_query,
  get_country_query,
  get_publication_date_query,
  get_followers_query
];

/**
 * Fonction appelant l'ensemble des fonctions definies dans le tableau precedant
 * Retourne l'ensemble une String reunissant l'ensemble des requettes
 */
function get_query() {
  // On execute les fontions et on filtre les elements nuls
  let queries = get_query_functions.map(f => f()).filter( e => e != "");

  return queries.join("&");
}

/**
 * Fonction principale appliquant le filtre du formulaire sur les donnees
 */
function apply_filter() {

  // Recuperation de la requette
  let query = get_query();
  
  console.log("query:",query);

  // Requette de filtre au serveur
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    loadingStart();
    if (this.readyState == 4 && this.status == 200) {
      loadingEnd();
      let res = JSON.parse(this.responseText);
      
      globalData = res;

      document.getElementById("nbTweets").innerHTML =  res.length; // Affichage du nombre de tweets trouve
      
      // Affichage des tweets sous forme de liste
      let listDiv = document.getElementById("tweetList");
      console.log("list:" + listDiv);
    
      clearDiv(listDiv); // On clear la div
      
      listDiv.appendChild(tweetList(0,15)); // Ajout de la div a la page avec un affichage de 15 tweets par page
      
      // Creation et affichage de l'histograme
      console.log("Creation de l'histograme")
      let histDiv = document.getElementById("hist");
      clearDiv(histDiv);

      histDiv.appendChild(hist(res,"place_country",600,500)); // Histograme sur les pays
      console.log("--- Fin histogramme ---");

      // Creation et affichage du diagramme camembert
      let pieDiv = document.getElementById("pieChart");
      clearDiv(pieDiv);

      let pieHashtag = drawPie(res,"hashtag_0",1000,600); // Camembert sur les hashtag

      pieDiv.appendChild(pieHashtag);

      // Creation et affichage de la carte
      let mapDiv = document.getElementById("world_map");
      clearDiv(mapDiv);
      
      console.log("div dim",mapDiv.clientWidth);
      let mapCanva = drawMap(res,1000,500);
      
      mapDiv.appendChild(mapCanva);

    }
  };

  // Requette au serveur
  xhttp.open("GET", "tweets?"+query, true);
  
  // Fixation du timeout
  xhttp.timeout = 1500
  xhttp.ontimeout = () => {
    console.error('Error: Request Timeout.')
    alert("Error: Request Timeout");
    loadingEnd();
  };

  xhttp.send();
}

/**
 * Fonction de recuperation des champs text
 */
function get_text_query() {
   // Recuperation des champs de recherche
   let query = [];
   // Recuperation du champ query text
   for (let i = 1; i <= counter; i++) {
     let tweetText = document.getElementById("tweetText"+i);
     
     query.push("text="+tweetText.value);
     
   }

   // Recuperation du champs du userName
   let un = document.getElementById("userName");
   let hash = document.getElementById("hashtag");

   query.push("user_name="+un.value);
   query.push("hashtag="+hash.value);
   console.log(query);
   return query.join("&");
}

/**
 * Fonction de recuperation du nombre de followers
 */
function get_followers_query(){
  let query = [];
  // Recuperation des champs de nombre d'abonnés
  let minAbo = document.getElementById("minAbo").value;

  // Par defaut min = 0
  minAbo = minAbo == "" ? 0 : minAbo;

  let maxAbo = document.getElementById("maxAbo").value;
  
  // Par defaut max = infini 
  maxAbo = maxAbo == "" ? 9999999999 : maxAbo;

  query.push("minAbo="+minAbo);
  query.push("maxAbo="+maxAbo);

  return query.join("&");
}

/**
 * Fonction de recuperation des champs de date 
 */
function get_publication_date_query(){
  let query = [];
  // Recuperation des champs de nombre d'abonnés
  let minDate = document.getElementById("minDate").value;
  let maxDate = document.getElementById("maxDate").value;
  let tmp = 0;

  if ((new Date(minDate).getTime() > new Date(maxDate).getTime())){
   tmp = minDate;
   minDate = maxDate;
   maxDate = tmp
  }

  query.push("minDate="+minDate);
  query.push("maxDate="+maxDate);
  console.log(query);
  return query.join("&");
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
 * Fonction de verification des champs text 
 * Les champs ne doivent pas contenir &
 * @param {*} id L'id du champs 
 */
function checkField(id) {
  console.log(id);
  let field = document.getElementById("tweetText"+id);
  
  //let toolTip = document.getElementById("toolTip"+id);

  // Si on trouve & on alerte l'utilisateur
  if(field.value.includes("&")){
    field.style.boxShadow = "0px 0px 5px red";
    field.title = "Please don't.";
  } else {
    field.style.boxShadow = "0px 5px 10px grey";
    field.title = "I'm ok with this";
  }
}



/**
 * Creation d'une div contenant la liste des tweets trouves
 * @param {*} p  la page courante
 * @param {*} TweetPerPage Le nombre de tweets par page
 */
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

/**
 * Affichage des tweets suivant la page 
 */
function pageVisibility() {
  //affichage de la pagination si le contenu est suffisant
  if (globalData.length > 15){
    document.getElementById("pg").innerHTML = page+1;
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

/**Fonction de changement de page */
function nextPage(){
  let list = document.getElementById("tweetList");
  clearDiv(list);
  list.appendChild(tweetList(page+1,15));
}

/**Fonction de changement de page */
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

  jsonData.forEach(country_code => { // Pour chaque code pays
    
    let li = document.createElement("li");

    // On ajout un input de type checkbox
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
  // On retourne la div creee
  return ul;
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
 * Fonction de recuperation de la valeur maximale du dictionnaire
 * ex: { "France": 12, "Espagne":23 } -> maxOfDict retourne 23
 */
function maxOfDict(dict) {
  return Object.keys(dict).reduce(( (acc,cur) => dict[cur] > acc ? dict[cur] : acc),0)  
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
    
    if(typeof dict[columnValue] == 'undefined'){ // Si c'est la premiere fois que l'on voit cette clef
      dict[columnValue] = 1; // On initialise la valeur
    }
    else{ // Clef deja connue
      dict[columnValue] += 1; // On incremente
    }
  });
  if(dict.hasOwnProperty("null")) { delete dict["null"]}

  // Dessin des rectangles suivant la taille des canvas
  context.beginPath();

  let x = 20;
  
  let yOrigin = 40; // Le y origine qui servira de repere
  let rectMaxHeight = (canva.height -100); // La taille maximale d'un rectangle
  let rectWidth = (canva.width - 100) / size_dict(dict); // La largeur maximale d'un rectangle defini par le nombre d'entrees dans le dictionnaire

  
  // Fonction de recuperation de la valeur maximale du dictionnaire
  // ex: { "France": 12, "Espagne":23 } -> maxOfDict retourne 23
  let  maxDict = maxOfDict(dict);  
  
  
  let yRatio = rectMaxHeight / maxDict; // Definition du ratio que vaut 1 "point" afin de calculer la hauteur du rectangle dans le canvas
  
  let number; // Valeur d'une clef du dictionnaire

  let i = 0;
  // Pour chaque clefs dans le dictionnaire
  for(key in dict){
    number = dict[key] * yRatio; 
    
    // On dessine le rectangle correspondant
    //rect(x:, y: on part de l'origine, on ajoute la difference entre la taille max et la valeur du nombre d'occurence, xWidth, yHeigth)
    context.fillStyle = colors[i%colors.length];
    context.fillRect(x, yOrigin + rectMaxHeight - number, rectWidth, number);
   
    i++;
    
    // On ecrit le nombre d'occurences
    context.fillStyle = "black";
    context.fillText(dict[key],x,yOrigin + rectMaxHeight-number-5);
    
    // / / Nom de la clef ecrit suivant une rotation 
    // On sauvegarde le contexte actuel
    context.save();
    // On decale le context mettant les origines en bas du graph et on laisse de la place pour ecrire la clef
    context.translate(x+(rectWidth/2), yOrigin + rectMaxHeight + 5);
    //console.log("length",key,":",key.toString().length);
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


/**
 * Fonction de creation d'un Pie chart suivant une colonne des donnees
 * Aide de https://www.codeblocq.com/2016/04/Create-a-Pie-Chart-with-HTML5-canvas/
 * 
 * @param {*} jsonData Les donnees
 * @param {*} columnName Le nom de la colonne 
 * @param {*} width La largeur du canvas
 * @param {*} height La hauteur du canvas
 */
function drawPie(jsonData, columnName , width, height) {
  
  let canva = document.createElement("canvas");
  canva.width = width;
  canva.height = height;
  let context = canva.getContext("2d");

  // Le centre du cercle
  let xCenter, yCenter, pieRadius;

  xCenter = width / 3; // Le centre du cercle est au premier tier en abscisse
  yCenter = height / 2; // La moitie en ordonnee

 
  pieRadius = Math.min(xCenter-(width/15),yCenter-(height/15)); // Le rayon est de la distance (centre - bord) avec un bord relatif de 1/15 par rapport au reelles dimensions
  
  console.log(xCenter-(width/15),yCenter-(height/15));
  
  // Creation d'un dictionnaire d'occurence, similaire a celui de l'histograme
  let dict = {}
  jsonData.forEach(element => {
    let columnValue = element[columnName];

    if(typeof dict[columnValue] == 'undefined'){
      dict[columnValue] = 1;
    }
    else{
      dict[columnValue] += 1;
    }
  });
  
  // Supression de la clef null
  if(dict.hasOwnProperty("null")) { delete dict["null"]}

  // Fonction de calcul de la somme des valeurs d'un dictionnaire
  let valuesSumOfDict = Object.keys(dict).reduce(( (acc,cur) => dict[cur] + acc),0)  
  
  // Variable d'angle
  let beginAngle = 0;
  let endAngle = 0;

  let offset = 10; // Definition de l'ecart entre les parts

  let offsetX, offsetY, medianAngle;

  // Position du text
  let xText = (2/3)*width;
  let yText = (1/5)*height;

  let rectSize = 10; // Taille d'un rectangle d'info

  let i = 0;

  for(key in dict){ // Pour chaques elements du dict

    // Un cercle etant d'angle 2pi, on effectue un produit en croix afin de connaitre l'angle de notre valeur
    let angle = Math.PI * (dict[key] * 2 / valuesSumOfDict); 
  
    beginAngle = endAngle;

    endAngle += angle;

    // Milieu de notre part
    medianAngle = (endAngle + beginAngle) / 2;

    // L'offsetXY est: de combien nous raprochons nous de l'angle median 
    offsetX = Math.cos(medianAngle) * offset;
    offsetY = Math.sin(medianAngle) * offset;

    // On change de couleur
    context.beginPath();
    context.fillStyle = colors[i%colors.length];
    //console.log(context.fillStyle);

    // On dessine la part
    context.moveTo(xCenter + offsetX, yCenter + offsetY);
    context.arc(xCenter + offsetX, yCenter + offsetY, pieRadius,beginAngle,endAngle);
    context.lineTo(xCenter + offsetX, yCenter + offsetY);
    context.stroke();

    context.fill();

    // On dessine le label (la clef) associe
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

/** Retourne la taille d'un dictionnaire */
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

/**
 * Ajout d'un input text au formulaire
 * @param {*} divName 
 */
function addInput(divName){
  if (counter == LIMIT)  {
    alert("You have reached the LIMIT of adding " + counter + " inputs");
  }
  else {
    let newdiv = document.createElement('div');

    counter++;

    textInputid = "tweetText"+counter;
    let input = document.createElement("input");
    input.type = "text";
    input.id = textInputid;
    input.name = "myInputs[]";

    newdiv.appendChild(input);
    input.addEventListener("keyup", f => { checkField(counter); });

    let btn = document.createElement("input");
    btn.type = "button";
    btn.value = "-";
    newdiv.appendChild(btn);
    btn.className = "lessBtn";
    btn.addEventListener("click",removeInput);
    
    /**
    let tooltipId = "toolTip"+id;

    let tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.id = tooltipId;
    let tooltipText = document.createElement("span");
    tooltipText.className = "tooltiptext";
    tooltipText.value = "Invalid character";

    tooltip.appendChild(tooltipText);

    field.appendChild(tooltip);
   */
    document.getElementById(divName).appendChild(newdiv);

  }
}

/**
 * Supression d'un input text au formulaire
 */
function removeInput(){
  var remove = document.getElementById('tweet-text');
  remove.removeChild(remove.lastElementChild);
  counter--;
}

/**
 * Filtrage des pays 
 */
function filter_countries() {
  let input = document.getElementById("search_country");
  let ul_checkboxes = document.getElementById("country_checkbox_list")

  let li = ul_checkboxes.getElementsByTagName("li");

  for( i = 0; i < li.length; i++){
    let label = li[i].getElementsByTagName("label")[0];
    
    // Si le pays cherche se trouve dans le tableau
    if(label.textContent.toUpperCase().indexOf(input.value.toUpperCase()) > -1){ // Note: indexOf retourne l'index de l'element et -1 si l'element n'est pas present
      li[i].style.display = "";
    } else{
      li[i].style.display = "none";
    }
  }
}


/** loading */
function loadingStart() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("mainLoader").style.display = "block";
}

function loadingEnd() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("mainLoader").style.display = "none";
}