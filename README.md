# Book Search Engine

## Description
A MERN stack application that allows users to search for books via the Google Books API. Users can create an account, search for books, and save their favorite books to their profile. The application uses GraphQL API with Apollo Server, replacing the existing RESTful API.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## Installation
1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies for both client and server:
```bash
cd Book-Search-Engine
npm install
cd client
npm install
cd ../server
npm install
```

3. Create a `.env` file in the server directory and add your MongoDB URI and JWT secret:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Build the application:
```bash
cd client
npm run build
```

## Usage
1. Start the development server:
```bash
npm run develop
```

2. Open your browser and navigate to `http://localhost:3000`

3. Create an account or log in to:
   - Search for books
   - Save books to your profile
   - View your saved books
   - Remove books from your saved list

## Features
- User authentication (signup/login)
- Book search using Google Books API
- Save books to user profile
- View saved books
- Remove books from saved list
- Responsive design
- GraphQL API with Apollo Server

## Technologies Used
- MongoDB
- Express.js
- React
- Node.js
- GraphQL
- Apollo Server/Client
- JWT Authentication
- TypeScript
- Bootstrap
- Vite

## Screenshots
[Add screenshots of your application here]

## Contributing
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License
This project is licensed under the MIT License.

## Questions
For any questions, please contact [Your Name] at [matt.chance176@gmail.com].

## Links
- [Deployed Application]https://book-search-engine-l7ke.onrender.com
- [GitHub Repository](git@github.com:Mchance176/Book-Search-Engine.git) 
