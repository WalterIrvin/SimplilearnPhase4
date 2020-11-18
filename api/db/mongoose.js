// This will handle connection logic to mongoDB
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Phase4Cluster', {useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
    console.log("Connected to mongoDB successfully");
}).catch((e) =>{
    console.log("Error while connecting to mongoDB");
    console.log(e);
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

module.exports = {
    mongoose
};