MediConnect
A Web Platform for Healthcare Collaboration



MediConnect is a web platform designed to enhance communication and collaboration between primary care physicians and specialists. Built with modern technologies like RESTful APIs, RPC, and connected to a MySQL database via XAMPP, it provides a secure and efficient way for doctors to share patient information, discuss cases, and coordinate care.

Features ✨
Real-time communication: Chat and share updates instantly.

Secure data sharing: RESTful APIs ensure safe transfer of patient information.

Database integration: MySQL database hosted on XAMPP for reliable data management.

User-friendly interface: Designed for ease of use by healthcare professionals.

Scalable architecture: Ready to grow with your medical network.

Technologies Used 🛠️
Backend: RESTful APIs, RPC (Remote Procedure Call).

Database: MySQL (hosted on XAMPP).

Frontend: HTML, CSS, JavaScript (optional: frameworks like React or Angular).

Tools: XAMPP for local server and database management.

Installation Guide 🚀
Prerequisites
XAMPP installed on your machine.

MySQL database set up.

A modern web browser.

Steps
Clone this repository:

bash
Copy
git clone https://github.com/yourusername/MediConnect.git  
Start XAMPP and ensure MySQL and Apache are running.

Import the database:

Open phpMyAdmin.

Create a new database named telemedicina.

Import the SQL file located in the database/ folder.

Configure the backend:

Update the database connection settings in config/db.php.

Launch the application:

Open your browser and navigate to http://localhost:3000/cliente/index.html

Usage 💻
Login: Doctors can log in using their credentials.

Dashboard: Access patient records, chat with colleagues, and manage cases.

Collaborate: Share updates, discuss cases, and coordinate care in real-time.