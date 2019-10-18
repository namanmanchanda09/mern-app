const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test6', {useNewUrlParser: true});

const User = mongoose.model('User',{
    name: String,
    adult: Boolean


})

const typeDefs = `
  type Query {
    hello(name: String): String!
    users: [User]
    
  }
  type User{
      id:ID!
      name: String!
      adult: Boolean!
  }
  type Mutation{
      createUser(name: String!, adult: Boolean!): User
      updateUser(id:ID!, adult: Boolean!) :Boolean
      removeUser(id:ID!) : Boolean
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    users: () => User.find()
  },
  Mutation:{

      createUser: async (_, {name, adult}) => {
          const user = new User({name,adult});
          await user.save();
          return user;
      },
      updateUser: async (_,{id, adult}) =>{
          await User.findByIdAndUpdate(id, {adult});
          return true;
      },
      removeUser: async (_,{id}) =>{
          await User.findByIdAndRemove(id);
          return true;
      }
      



  }

}


const server = new GraphQLServer({ typeDefs, resolvers })
mongoose.connection.once("open",function(){
    server.start(() => console.log('Server is running on localhost:4000'));
});


