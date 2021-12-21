//Packages
require('dotenv/config');
const mongoose = require('mongoose');
const { graphqlUploadExpress } = require('graphql-upload');
//APP & Apollo
const app = require('./app');
const apolloServer = require('./apollo');

//Create Function
async function startServer() {
    app.use(graphqlUploadExpress());
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
};
startServer();
//Mongoose
mongoose.connect(process.env.MONGODB_LOCAL_URL)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch((err) => console.log("MognoDB Connetion Failed!"));

const port = process.env.PORT || 3001;
//Server
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    console.log(`GraphQl EndPoint path: ${apolloServer.graphqlPath}`);
})