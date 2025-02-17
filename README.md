
# Social App

A simple social media application built with Node.js. This app provides various features for users to interact with each other in a social environment.

## Features

- User authentication and registration.
- Post creation, liking, and commenting.
- Messaging between users.
- Uploading and sharing media (images/videos).
- Profile management.

## Technologies Used

- **Node.js**: For server-side logic.
- **Express.js**: For routing and building the API.
- **MongoDB**: For the database to store user data and posts.
- **Cloudinary**: For image and video uploading and management.
- **JWT**: For secure user authentication.
- **Bcrypt.js**: For password hashing.

## Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/socialApp.git
   ```
   
2. Navigate into the project directory:
   ```bash
   cd socialApp
   ```

3. Install the required dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root of the project and add your environment variables (like database URL, Cloudinary credentials, etc.).

5. Run the application:
   ```bash
   npm start
   ```

6. Access the app at `http://localhost:5000`.

## File Structure

```
socialApp/
├── node_modules/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── utils/
├── .gitignore
├── .env
├── index.js
├── package.json
├── README.md
└── uploads/
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
