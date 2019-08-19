const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('userCreateIndex', true);

const userSchema = new Schema ({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },

}, 
{
    timestamps: true
});

module.exports = userSchema;