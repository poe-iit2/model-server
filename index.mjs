import express from 'express';
import { GraphQLSchema, GraphQLString, GraphQLObjectType } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import { WebSocketServer } from 'ws';
import { ruruHTML } from 'ruru/server';
import { useServer } from "graphql-ws/use/ws";

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      }
    }
  })
});

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.get("/", (req, res) => {
//   res.send({
//     "message": "Hello World!"
//   })
// })

app.use('/graphql', createHandler({schema}));

// Serve the GraphiQL IDE.
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql' }));
});

const server = await app.listen(process.env.PORT || 5000);
console.log(server.address());

const wsServer = new WebSocketServer({server, path: '/'});

useServer({schema}, wsServer);