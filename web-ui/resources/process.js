function load() {
  var tweetText1 = document.getElementById("tweetText1");
}
var mapInitialized = false;
/*
//TODO 
On recupere l'ensemble des champs du fichier. 
On les mets dans un tableau
Pour chaque nom de colonne on crée un nouveau formulaire suivant ces noms
Dans la query on récupère tous les elements du doc avec id=nomColonne
*/

function loadDoc() {

  console.log(tweetText1);
  // TODO Gestion des inputs frauduleuses de l'utilisateur (caracteres speciaux...) 
  var content = "";
  for (var i = 1; i <= counter; i++) {
    var tweetText = document.getElementById("tweetText"+i);
    content = content + tweetText.value;
    if (i < counter) {
      content+=","
    }
  }

  alert(content);
  
  let query = "text=" + content;
  

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let res = JSON.parse(this.responseText);
        globalData = res;

        console.log(res);
        document.getElementById("nbTweets").innerHTML =  res.length;
        //document.getElementById("brutData").innerHTML = JSON.stringify(res);

       
        tweetList(0,15);

        // TODO a debuger: Affichage simultane de brutDataDiv et listDiv
        //brutDiv.appendChild();
        
        let histDiv = document.getElementById("hist");
        clearDiv(histDiv);
        histDiv.appendChild(hist(res,"place_country",600,500));

        let mapDiv = document.getElementById("world_map");
        clearDiv(mapDiv);
        
        console.log("div dim",mapDiv.clientWidth);
        let mapCanva = drawMap(res,1000,500);
        
        mapDiv.appendChild(mapCanva);
      }
    };
    xhttp.open("GET", "tweets?"+query, true);
    
    xhttp.timeout = 500
    xhttp.ontimeout = () => {
      console.error('Timeout!!')
      alert("Request Timeout")
    };

    xhttp.send();
}

var page;
var globalData;
function tweetList(p,TweetPerPage) {
   page = p;
   let listDiv = document.getElementById("tweetList");
   console.log("list:" + listDiv);
   clearDiv(listDiv);
   console.error(listDiv.innerHTML);

   // Creation du tableau contenant les tweets
   let bigDiv = document.createElement("div");
   bigDiv.classList.add("grid-container");
        
   // Fonction de remplissage de list
   // 15 c'est le nombre de tweets que j'affiche par page
   for (let i =TweetPerPage*p;(i<(p+1)*TweetPerPage)&& (i<globalData.length);i++){

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


   listDiv.appendChild(bigDiv);
   return ;
}


function pageVisibility()
{
  //affichage de la pagination si le contenu est suffisant
  if (globalData.length > 15){
    document.getElementById("pagination").style.display = "block";
  }
  else{
    document.getElementById("pagination").style.display = "none";
  }

  //premiére page 
  if (page == 0 ){
    var leftArrow = document.getElementById("la");
    leftArrow.classList.add("nonClickable");
    leftArrow.style.color = "grey";
  }

  //derniére page 
  if ((page+1) * 15 > globalData.length)
  {
    var rightArrow = document.getElementById("ra");
    rightArrow.classList.add("nonClickable");
    rightArrow.style.color = "grey";   
  }
  else{

    var rightArrow = document.getElementById("ra");
    rightArrow.classList.remove("nonClickable");
    rightArrow.style.color = "black";   
  }

  // toutes les pages sauf la premiére
  if (page > 0)
  {
    var leftArrow = document.getElementById("la");
    leftArrow.classList.remove("nonClickable");
    leftArrow.style.color = "black";
  }

}

function nextPage(){
  tweetList(page+1,15);
}


function prevPage(){
  tweetList(page-1,15);
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
      console.log("initialize",columnValue)
    }
    else{
      dict[columnValue] += 1;
      console.log("addTo",columnValue)
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
  console.log("max",maxOfDict);

  
  let yRatio = rectMaxHeight / maxOfDict; // Definition du ratio que vaut 1 "point" afin de calculer la hauteur du rectangle dans le canvas
  console.log("yR",yRatio);

  console.log("canvas width",canva.width);

  let number; // Valeur d'une clef du dictionnaire

  // Pour chaque clefs dans le dictionnaire
  for(key in dict){
    number = dict[key] * yRatio; 
    
    console.log("number",key,":",number);

    // On dessine le rectangle correspondant
    //rect(x:, y: on part de l'origine, on ajoute la difference entre la taille max et la valeur du nombre d'occurence, xWidth, yHeigth)
    context.rect(x, yOrigin + rectMaxHeight - number, rectWidth, number);
    console.log("draw rect(",x,",",yOrigin + rectMaxHeight-number,",",rectWidth,",",number  ,")");
    
    // On ecrit le nombre d'occurences
    context.fillText(dict[key],x,yOrigin + rectMaxHeight-number-5);
    
    // / / Nom de la clef ecrit suivant une rotation 
    // On sauvegarde le contexte actuel
    context.save();
    // On decale le context mettant les origines en bas du graph et on laisse de la place pour ecrire la clef
    context.translate(x+(rectWidth/2), yOrigin + rectMaxHeight+ key.length +40); // key.lenght bizare -> TODO a tester
    console.log("length",key,":",key.length);
    // On tourne
    context.rotate(-Math.PI/2);
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

      console.log(element['longitude'],":",element['latitude']);
      
      // Calcul des coordonnes x,y suivant la longitude et latitude ainsi que la taille du canvas
      let coor = mercatorXY(canva.width,canva.height,element['longitude'],element['latitude']);
      
      // coor = [x,y]
      console.log(coor);

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

var counter = 1;
var limit = 3;
function addInput(divName){
     if (counter == limit)  {
          alert("You have reached the limit of adding " + counter + " inputs");
     }
     else {
          var newdiv = document.createElement('div');
          counter++
          id = "tweetText"+counter
          newdiv.innerHTML = " <div> <br><input type='text' id='"+id+"' name='myInputs[]'> <input type='button' value='-' onClick='removeInput();'> </div>";
          document.getElementById(divName).appendChild(newdiv);


     }
}

function removeInput(){
  var remove = document.getElementById('tweet-text');
  remove.removeChild(remove.lastElementChild);
  counter--;

}