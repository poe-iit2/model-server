import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { WebSocketServer } from 'ws';
import { ruruHTML } from 'ruru/server';
import { useServer } from "graphql-ws/use/ws";
import schema from './schema.mjs'
import { printSchema } from 'graphql';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/graphql', createHandler({schema}));

// Serve the GraphiQL IDE.
app.get('/', (_req, res) => {
  res.type('html');
  res.end(ruruHTML({ endpoint: '/graphql', subscriptionEndpoint: '/' }));
});

const server = await app.listen(process.env.PORT || 5000);
console.log(printSchema(schema));
console.log(server.address());

const wsServer = new WebSocketServer({server, path: '/'});

useServer({schema}, wsServer);