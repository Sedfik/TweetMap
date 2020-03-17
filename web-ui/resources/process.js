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
  let query = "text=" + tweetText.value
  

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let res = JSON.parse(this.responseText);

        console.log(res);
        document.getElementById("nbTweets").innerHTML =  this.responseText.length;
        document.getElementById("brutData").innerHTML = JSON.stringify(res);
      }
    };
    xhttp.open("GET", "tweets?"+query, true);
    xhttp.send();
  }