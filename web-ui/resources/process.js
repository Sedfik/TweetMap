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
        document.getElementById("nbTweets").innerHTML =  this.responseText.length;
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
        console.log(listDiv.innerHTML);
        
        // TODO a debuger: Affichage simultane de brutDataDiv et listDiv
        // let brutDiv = document.getElementById("brutData");

        //brutDiv.appendChild(brutData(res));

      }
    };
    xhttp.open("GET", "tweets?"+query, true);
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
      let td = document.createElement("td")
      td.innerHTML = element[key];
      tr.appendChild(td);
   }
  });
  return table;
}

/**
 * Efface tous les noeuds fils d'une div 
 * 
 * @param {*} div la div a clear 
 */
// TODO A tester / verifier
function clearDiv(div) {
  console.log("clear div: "+div);
  try {
    while(div.lastElementChild){
      div.removeChild(listDiv.lastElementChild);
  } 
  } catch (error) {
    console.error(error);
  }
}