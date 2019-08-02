const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema ({
    marque: String,
    nature: String,
    format: String,
    info: String,
    ref: String,
    prix: String,
    dateCrea: {
        type: Date,
        default: new Date()
        }
})

const produit = mongoose.model('produit', produitSchema);

module.exports = produit;