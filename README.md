# TweetMap

## Tâches 
### Côté serveur
- [x] Création serveur python 
- [x] Serveur capable de servir des fichiers / ressources
- [x] Récupération d'une requête avec des paramètres en query
- [x] Traitement d'une requête
- [x] Automatisation des test via Travis
- [ ] Réfractor -> fonction de filtre prenant en parametre le fichier de tweets ?
- [ ] Vérification des champs envoyé par l'utilisateur 
- [ ] Gestion de sessions
### Côté client 
- [x] Première interface
- [x] Requête en AJAX simple
- [x] Premier formulaire de filtrage
- [x] Afficher les résultat en brut
### Features
- [x] Déploiement sous docker
- [x] Utilisation de Travis 
### Roadmap
- [ ] (Client) Génération dynamique des champs du formulaire suivant le fichier de tweet
- [ ] (feature) Connexion au SSO de projet 

Projet langague dynamique du M1 ISD. Vous trouverez le sujet [ici](https://lri.fr/~kn)

Site web de reporting des statistiques sur des tweets

Never trust user
Vérifier la validite des colonnes

## Installation
Après avoir récupérer les sources depuis ce Git, déplacez vous à la racine du projet et builder l'image à l'aide de la commande :
```
docker build -t tweet-map .
```
Puis simplement lancer le conteneur en 'mapant' le port utilisé par le conteneur avec votre port physique choisi.
```
docker run -d -p 8800:8800 tweet-map 
``` 
## Utilisation
Il est possible d'effectuer une requête au serveur sans passer par l'interface web.
Pour cela, il suffit d'envoyer une requête GET sur la ressource tweets du serveur:

```
curl http://localhost:8800/tweets?text=dog
```

Cette requête va retourner l'ensemble des tweets contenant le mot "dog" dans leur contenu (le tweets).