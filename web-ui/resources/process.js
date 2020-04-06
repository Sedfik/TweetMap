function load() {
  var tweetText = document.getElementById("tweetText");
}
/*
//TODO 
On recupere l'ensemble des champs du fichier. 
On les mets dans un tableau
Pour chaque nom de colonne on crée un nouveau formulaire suivant ces noms
Dans la query on récupère tous les elements du doc avec id=nomColonne
*/

function loadDoc() {
  console.log(tweetText);
  // TODO Gestion des inputs frauduleuses de l'utilisateur (caracteres speciaux...) 
  let query = "text=" + tweetText.value;
  

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let res = JSON.parse(this.responseText);

        console.log(res);
        document.getElementById("nbTweets").innerHTML =  res.length;
        //document.getElementById("brutData").innerHTML = JSON.stringify(res);

       

        let listDiv = document.getElementById("tweetList");
        console.log("list:" + listDiv);
      
        clearDiv(listDiv);

        // Creation du tableau contenant les tweets
        let table = document.createElement("table");
        
        listDiv.appendChild(table)
        // Fonction de remplissage du tableau
        res.forEach(e => {
          console.log("Ajout des elements");
          let tr = document.createElement("tr");
          table.appendChild(tr)

          let td = document.createElement("td")

          let userName = e["user_name"];
          let text = e["text"];

          td.innerHTML += "<strong>" + userName + "</strong>"
                          + "</br>"
                          + text ;
          
          tr.appendChild(td)
          
        });        
        // TODO a debuger: Affichage simultane de brutDataDiv et listDiv
        let brutDiv = document.getElementById("brutData");
        
        //brutDiv.appendChild();
        let canvasDiv = document.getElementById("canvas");
        clearDiv(canvasDiv);
        canvasDiv.appendChild(hist(res,"place_country",600,500));
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
  console.log("context",context);
  
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
