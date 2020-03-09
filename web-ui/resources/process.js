let input = document.getElementById("tweet")

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("nbTweets").innerHTML =  this.responseText.length

      }
    };
    xhttp.open("GET", "tweets.json", true);
    xhttp.send();
  }
