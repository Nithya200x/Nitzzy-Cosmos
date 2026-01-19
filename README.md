# Nitzzy Cosmos 

**Nitzzy Cosmos** is a full‑stack blogging platform built to understand **how real applications handle authentication, content, and growth** — beyond basic CRUD use cases.

It is a **portfolio‑focused project** with an emphasis on smooth user experience and clean, scalable system design.

---

## What can users do?

* **Authentication:** Log in using two methods:
  * Email + Password
  * Password‑free OAuth (quick, low friction)
* **Content:** Write, edit, and manage blog posts.
* **Media:** Add images to blogs using external image links.
* **Community:** Explore blogs, posts, and thoughts shared by other users.

---

## Project Highlights

* **Frictionless Auth:** Password‑free authentication to reduce login barriers.
* **Security:** Secure access using JWT and protected routes.
* **Media Handling:** Blog image support via external links to keep storage lightweight.
* **User Profiles:** Avatar support for user profiles.
* **Data Safety:** Soft delete (trash) support for blogs instead of hard deletes.
* **Scalability:** Structure designed to evolve with future features.

---

##  Tech Stack

### **Frontend**
* React.js
* React Router
* Axios
* Custom responsive CSS

### **Backend**
* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT‑based authentication
* Bcrypt for password hashing

### **Backend Structure**

```bash
server.js
├── config/        
├── models/        
├── controllers/   
├── routers/       
├── middleware/    
└── utils/         

```

---

## Live Demo

Check out the live app here:

**[https://nitzzy-cosmos.vercel.app/](https://nitzzy-cosmos.vercel.app/)**

> **Note:** The backend is hosted on **Render (Free Tier)**. Please allow up to 30 seconds for the server to **spin up (cold start)** on your first visit.

---

## Collaborate or Contribute

Interested in building on this? **Fork the repository and contribute.**

Some ideas for future enhancements:

* AI‑assisted blog writing and summarization
* Blog recommendation system
* Admin moderation panel
* Analytics and engagement tracking
* Role‑based access control (Admin / Author / Reader)

---
## License
This project is open source and available under the **MIT License**.
---
