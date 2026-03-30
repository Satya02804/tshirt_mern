# 👕 T-Shirt Store (React + Node.js E-Commerce)

A full-stack T-Shirt Store web application with dynamic product listing, cart functionality, and admin management built with React and Node.js.

## 🚀 Live Demo

Coming Soon

## 📂 Project Structure
```text
├── backend/
│   ├── src/
│   │   ├── config/            # Database configurations
│   │   ├── controllers/       # API route controllers
│   │   ├── middleware/        # Auth & upload middleware
│   │   ├── models/            # Sequelize database models
│   │   └── routes/            # Express router definitions
│   ├── public/                # Static uploads (avatars, etc)
│   ├── .env.example           # Backend environment template
│   ├── package.json           # Node dependencies
│   └── app.js                 # Entry point
│
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── contexts/          # React Context providers (Auth, Cart)
│   │   ├── pages/             # Page components & views
│   │   └── services/          # Axios API integration services
│   ├── index.html             # HTML template
│   ├── package.json           # Node dependencies
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── vite.config.js         # Vite bundler config
│
└── README.md                  # Project documentation
```

## ⚙️ Installation

1️⃣ Clone Repository
```bash
git clone https://github.com/Satya02804/tshirt_store.git 
cd tshirt-store
```

2️⃣ Backend Setup
```bash
cd backend
npm install
cp .env.example .env 
# Update .env with your MySQL database credentials.

npm run start # Starts the Express server
```

3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env 
# Update .env with your backend API URL if necessary.

npm run dev # Starts the Vite development server
```

Visit 👉 http://localhost:5173

## 🌐 Deployment (Vercel)

This project is configured for easy deployment on **Vercel**.

### 1. Database Setup
Vercel does not host MySQL natively. To deploy with a database, you must:
1. Create a free MySQL instance on [Aiven](https://aiven.io/), [Railway](https://railway.app/), or [Tidb Cloud](https://tidbcloud.com/).
2. Import the `tshirt_store_node.sql` file into your hosted database.

### 2. Vercel Configuration
1. Connect your repository to Vercel.
2. Add the following **Environment Variables** in the Vercel Dashboard:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` (Your hosted MySQL credentials)
   - `JWT_SECRET` (A random string)
   - `FRONTEND_URL` (Your production Vercel URL)
   - `APP_ENV=production`
3. Vercel will automatically detect the `vercel.json` and deploy the Next.js frontend and Express backend.

## ✨ Features

🛍 Product listing

🧾 Add to cart

👕 Size selection

🛠 Admin dashboard

⚡ Dynamic API loading

📱 Responsive UI & Theme Support

## 🧪 Tech Stack
```text
| Layer           | Technology                   |
| --------------- | ---------------------------- |
| Backend         | Node.js, Express.js          |
| Frontend        | React.js, Vite               |
| Database        | MySQL (Sequelize ORM)        |
| Styling         | Tailwind CSS, Material UI    |
| Package Manager | NPM                          |
```

## ⚠️ Disclaimer (Educational Use Only)

All T-shirt images, product names, and related media used in this project are sourced from chriscross.in.

This project is created strictly for educational and learning purposes only.

❌ This project is not intended for commercial use, resale, or profit.

All rights to the original images and brand assets belong to their respective owners.

This project is not affiliated with or endorsed by chriscross.in.

## 📌 Future Improvements

Payment gateway integration

User authentication (Oauth/Google)

Order history & Tracking

Product reviews

## 🤝 Contributing

Contributions are welcome!

Fork the repo

Create a new branch

Commit your changes

Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨💻 Author

Patel Satya

📧 Email: patelsatya2804@gmail.com

🔗 GitHub: https://github.com/Satya02804

## ⭐ If you like this project, don’t forget to give it a star!
