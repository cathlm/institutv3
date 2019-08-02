const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema ({
    nom: String,
    prenom: String,
    email: String,
    mdp: String,
    tel: String,
    dateCrea: {
        type: Date,
        default: new Date()
        }
})

const client = mongoose.model('client', clientSchema);

module.exports = client;