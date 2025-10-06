
# 🏫 School Payment Dashboard - Frontend

This is the frontend for the School Payment and Dashboard Application, built with React. It provides a modern, responsive, and user-friendly interface to manage and visualize payment transactions by integrating with a dedicated backend REST API. The application features a high-level dashboard for quick insights and a detailed transaction history page with powerful filtering and search capabilities.

**Live Demo:** **Click Here to View the Deployed Application** https://school-payment-eta.vercel.app/dashboard

-----

## ✨ Key Features

  * **At-a-Glance Dashboard:** A clean landing page with key metrics like Total, Successful, Pending, and Failed transactions.
  * **Detailed Transaction History:** A comprehensive table view of all transactions with advanced filtering, sorting, and pagination.
  * **Advanced Filtering & Search:** Dynamically filter transactions by Order ID, status, and date range.
  * **Data Export:** Export the current view of transaction data to a file for offline analysis or reporting.
  * **Persistent Filters:** Filter states are saved in the URL, allowing you to share specific views or refresh the page without losing your filters.
  * **Seamless Payment Creation:** A dedicated form to initiate new payments that redirects users to the payment gateway.
  * **Real-time Status Check:** Quickly find the current status of any transaction using its unique Custom Order ID.
  * **Responsive Design:** Fully responsive interface built with Tailwind CSS, ensuring a great experience on both desktop and mobile devices.

-----

## 📸 Application Screenshots

### Dashboard Overview
The main dashboard provides a quick summary and easy navigation.

<img width="1919" height="862" alt="image" src="https://github.com/user-attachments/assets/9323c17e-184d-4347-9063-7e79ee75be7a" />


### Transaction History
The transaction history page allows for detailed analysis and management.

<img width="1895" height="859" alt="image" src="https://github.com/user-attachments/assets/3fcc649f-fc48-4ccc-b75c-2cebaeeccf2e" />

### Create Payment Page
The simple form for initiating a new payment.

<img width="1048" height="861" alt="image" src="https://github.com/user-attachments/assets/ad6758ed-c703-4932-834f-6fd11812327c" />

### Check Status Page
The interface for checking the status of a specific transaction.

<img width="993" height="442" alt="image" src="https://github.com/user-attachments/assets/8abc8446-5cae-4459-8f8a-25c1d51523fa" />

-----

## 🛠️ Tech Stack

  * **Framework:** React.js (with Vite)
  * **Styling:** Tailwind CSS
  * **API Communication:** Axios
  * **Routing:** React Router
  * **State Management:** Context API / Redux (as applicable)

-----

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites

  * Node.js (v18.x or higher)
  * npm or yarn

### 1\. Clone the Repository

First, clone the public GitHub repository to your local machine:

```bash
git clone [your-repo-url]
cd [project-directory-name]
```

### 2\. Install Dependencies

Next, install all the required npm packages:

```bash
npm install
```

### 3\. Configure Environment Variables

Create a `.env` file in the root directory of the project. This file will hold the URL for your backend API. Add the following variable:

```
VITE_BACKEND_URL=http://localhost:3000
```

> **Note:** Replace `http://localhost:3000` with the actual URL of your hosted backend service.

### 4\. Run the Development Server

You're all set\! Run the following command to start the local development server:

```bash
npm run dev
```

The application should now be running on **`http://localhost:5173`** (or another port if 5173 is busy).

-----

## 📖 Pages & Functionality

The application is organized into the following pages, each serving a specific purpose.

### 1\. Dashboard (`/`)

This is the main landing page, providing a high-level overview of the payment ecosystem.

  * **Statistic Cards:** Displays key metrics in clear, concise cards: Total Transactions, Successful, Pending, and Failed.
  * **Quick Actions:** Features prominent links for easy navigation to the most common tasks:
      * **View Transactions:** Navigates to the detailed Transaction History page.
      * **Create Payment:** Opens the form to generate a new payment link.
      * **Check Status:** Goes to the page for tracking a payment's status.

### 2\. Transaction History (`/transactions`)

This page offers a comprehensive and detailed log of all payment transactions, designed for management and analysis.

  * **Powerful Filtering & Search:**
      * Search directly by **Order ID** for quick lookups.
      * Filter by transaction **Status** (e.g., Success, Pending, Cancelled) using a dropdown menu.
      * Select a specific **date range** using intuitive Start and End Date pickers.
  * **Data Management:**
      * **Pagination:** Control the number of rows displayed per page for better readability.
      * **Export:** Download the currently filtered transaction data for reporting.
      * **Sorting:** Click on column headers like 'Date & Time' to sort the data in ascending or descending order.
  * **Comprehensive Table:** The table displays crucial information for each transaction, including institute name, order details, amounts, status, and student information.

### 3\. Create Payment (`/create-payment`)

This page provides a simple form to initiate a new payment.

  * The user fills in required details like amount and student information.
  * Upon submission, the data is sent to the backend, which then redirects the user to the official payment gateway page to complete the transaction securely.

### 4\. Check Transaction Status (`/check-status`)

A utility page to quickly verify the status of a single transaction.

  * The user enters a **Custom Order ID** into the input field.
  * The application calls the relevant API endpoint to fetch the transaction's latest information.
  * The current status (e.g., "Success", "Failed", "Pending") is displayed on the screen in real-time.
