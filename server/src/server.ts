import express from 'express';
import path from 'node:path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';
import db from './config/connection.js';
import { authMiddleware } from './services/auth.js';
const app = express();
const PORT = process.env.PORT || 3001;

// Create new Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a function to start the Apollo server
const startApolloServer = async () => {
  await server.start();
  
  // Apply Apollo Server middleware to Express with auth
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('*', (_, res) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the server
startApolloServer().catch(err => console.error('Error starting server:', err));