# TweetMap

## Tâches 
### Côté serveur
- [x] Création serveur python 
- [x] Serveur capable de servir des fichiers / ressources
- [ ] Récupération d'une requête avec des paramètres en query
- [ ] Traitement d'une requête 
- [ ] Gestion de sessions 
### Côté client 
- [x] Première interface
- [x] Requête en AJAX simple
- [ ] Premier formulaire de filtrage
### Features
- [x] Déploiement sous docker
- [ ] 
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