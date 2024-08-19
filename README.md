<div id="header" align="center">
  <h1>📁 DraftShare</h1>
  <h3><strong>Sharing Contracts Made Easy</strong></h3>
  <img src="https://i.ibb.co/58xjJjx/spot.png" alt="Homepage of DraftShare"><br>
</div> 
<br>

<h1>Welcome to DraftShare <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="25px"></h1>

## DEMO

[Watch Video Demo](https://www.loom.com/share/a904040c97b5466b8e6a75b18ce1087c?sid=b59d75e2-1a18-4755-b1e4-137dcfb00d7d) - Learn how DraftShare works.

## 📝 About

DraftShare is a web application designed to make PDF management and collaboration effortless. It allows users to sign up, upload PDFs, share them with others, and collaborate through comments.

## 🧰 Features

- Upload and view PDFs.
- Collaborate on PDFs by adding comments.
- Share PDFs with workspace users.
- View and comment on shared PDFs.
- Easily search for contracts.
- User authentication and authorization with JWT.
- Unauthorized users can view PDFs via a shared link but need access to view comments.
- Rename files for easier tracking.
- Input validation ensures a smooth experience.
- Beautiful and intuitive UI for collaboration.

## 🛠️ Tech Stack

This project uses:  
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)  
![Tailwind](https://img.shields.io/badge/Tailwind-%2320232a.svg?style=for-the-badge&logo=tailwindui&logoColor=%2361DAFB)  
![NPM](https://img.shields.io/badge/npm-%2320232a.svg?style=for-the-badge&logo=npm&logoColor=%2361DAFB)  
![MongoDB](https://img.shields.io/badge/mongodb-%3FA037.svg?style=for-the-badge&logo=mongodb&logoColor=white)  
![Express](https://img.shields.io/badge/Express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white)  
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## Prerequisites

Before installation, ensure you have the following installed or have knowledge of:

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)  
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)  
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

## 🤝 Contributing

### Running This Project Locally

**Backend Setup:**

1. Clone the **main** branch to your local machine:

   ```bash
   git clone https://github.com/JasonDsouza212/sharedraft.git
   ```

2. Navigate to the project directory:

   ```bash
   cd sharedraft
   ```

3. Navigate to the backend directory:

   ```
   cd server
   ```

4. Set the .env file with the following values in the backend folder:

   ```
   .env

   PORT=**4000**
   MONGO_URI=**Your MongoDB URL**
   SECRET=**"BASE64 ENCODED string"**
   REACT_HASH_KEY=**"BASE 64 string"**
   SERVER_BASE_URL="**Your server URL or localhost:4000"**
   ```

5. Install npm packages:

   ```
   npm install
   ```

6. Run the backend locally:

   ```
   npm start
   ```

### Frontend Setup:

7. Navigate to the frontend directory:

   ```
   cd client
   ```

8. Set the .env file with the following values:

   ```
   .env

   VITE_REACT_HASH_KEY= Your BASE64 HASH (must match the server's HASH)
   VITE_SERVER_BASE_URL= Server base URL or localhost:4000 for development
   ```

9. Install npm packages:

   ```
   npm install
   ```

10. Run the frontend locally:

    ```
    npm run dev
    ```

11. You can access the application at:

    ```
    http://localhost:5173/
    ```

### Note:

1. No 3rd party service is used to upload the PDF file , it has been uploaded directly to mongoDB as chuncks
