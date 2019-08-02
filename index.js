const express = require('express');
const app = express();

const expressSession = require("express-session");

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const methodOverride = require("method-override")
app.use(methodOverride("_method"));


const exphbs = require('express-handlebars');
app.engine('hbs', exphbs({ defaulLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs')

var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);


const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/institut", {
    useNewUrlParser: true
})


app.use(express.static("public"))

const client = require("./database/models/client")
const produit = require("./database/models/produit")





app.route("/mentionsLegales")
    .get((req, res) => {
        res.render("mentionsLegales")
    })

app.route("")
    .get((req, res) => {
        res.render("accueil")
    })

app.route("/prestations")
    .get((req, res) => {
        res.render("prestations")
    })

app.route("/creaProfil")
    .get((req, res) => {
        res.render("creaProfil")
    })
app.route("/produits")
    .get((req, res) => {
        res.render("produits")
    })
app.route("/creaProduit")
.get((req, res) => {
    res.render("creaProduit")
})

app.route("/panier")
    .get((req, res) => {
        res.render("panier")
    })
app.route("/soins")
    .get((req, res) => {
        res.render("soins")
    })


app.route("/connexion")
    .get((req, res) => {
        res.render("connexion")
    })

app.route("/nouvMdp")
    .get((req, res) => {
        res.render("nouvMdp")
    })

// PAGES AVEC ACTIONS PARTICULIERES
// app.route("/").get().post().delete()



// AFFICHAGE DE LA BASE CLIENTS
// si zone de saisie nom client non renseignée => affichage totalité de la base,
// sinon affichage dans la base sur nom client à trouver.


app.route("/baseClients")

    .get((req, res) => {
        client.find(function (err, client) {
            if (!err) {
                res.render("baseClients", {
                    client: client
                })
            }
            else {
                res.send(err)
            }
        })
    })
    .post((req, res) => {
        var clientCherche = req.body.nomRecherche.toUpperCase();
        client.find({ nom: clientCherche}, function (err, client) {
            if (!err) {
                res.render("baseClients", {
                    client: client
                })
            }
            else {
                res.send(err)
            }
        })
    })






// AFFICHAGE DU STOCK DES PRODUITS
app.route("/stock")
    // produit.sort(fonctionComparaison)
    .get((req, res) => {
        produit.find(function (err, produit) {
            if (!err) {
                res.render("stock", {
                    produit: produit
                })
            }
            else {
                res.send(err)
            }
        })
    })




//=========================================== CREATION NOUVEAU CLIENT
app.route("/creaProfil")
    .post((req, res) => {
        const newClient = new client({
            nom: req.body.nomSaisi.toUpperCase(),
            prenom: req.body.prenomSaisi.toUpperCase(),
            email: req.body.emailSaisi.toLowerCase(),
            mdp: req.body.mdpSaisi,
            tel: req.body.telSaisi,
        });

        newClient.save(function (err) {
            if (!err) {
                res.render("connexion")
                //  pour affichage email nouv. client en page connexion
                //     newClient.findOne(
                //         {client: client}
            }
            else {
                res.send('err')
            }
        })
    })

// ===========================================CREATION NOUVEAU PRODUIT
app.route("/creaProduit")
    .post((req, res) => {
        const newProduit = new produit({
            marque: req.body.marque,
            nature: req.body.nature,
            format: req.body.format,
            info: req.body.info,
            ref: req.body.ref,
            prix: req.body.prix
        });

        newProduit.save(function (err) {
            if (!err) {
                res.render("stock")
            }
            else {
                res.send('err')
            }
        })
    })



// CONNEXION
app.route("/")

.get((req,res) => {
    client.find(function(err, client) {
        if(!err) {
            res.render("accueil", {
                client : client
            })
        }
        else {
            res.render(err)
        }
    })

})


// NOUVEAU MOT DE PASSE
app.route("/nouvMdp")

.get((req, res) => {
    res.render("nouvMdp");
    })

.put(function (req, res) {
    if (req.body.nouvMdp1 === req.body.nouvMdp2) {
        client.update(
            {_id: req.param.id},
            { mdp: req.body.nouvMdp1},
            function (err) {
                if (!err) {
                    res.render("connexion", {
                        _id: client.id,
                        nouvMdp1: client.mdp
                    })
                }
                else { 
                    res.send("err") 
                }
            })
    }
    else {
    res.send("err")
    }
})



// MODIFIER PROFIL
app.route("/modifProfil")

    .get((req, res) => {
        res.render("modifProfil")
    })

    .put(function (req, res) {
        client.update(
            {_id: req.params.id},
            {
                nom: req.body.nom,
                prenom: req.body.prenom,
                email: req.body.email,
                mdp: req.body.mdp,
                tel: req.body.tel,
            },
            function (err) {
                if (!err) 
                {res.send("modif ok")}
                else 
                {res.send("err")}
            })
    })




app.listen(4000, function () {
    console.log("port 4000 ok")
});
