# Welcome Home Whistler

## Project Overview

Welcome Home Whistler is a full-stack web application that allows
Whistler second homeowners to schedule their arrival and have their home
prepared before they walk in the door. Users can build a grocery basket,
choose optional home services, and submit a "Welcome Order" saved to
their account.

This project uses React, Node.js, Express, and MongoDB. 

## Features

### User Authentication

-   Register, login, and logout 
-   Session persists across page refresh
-   Access a personalized "My Orders" dashboard

### Grocery Selection

-   Searchable and filterable grocery catalog
-   Add, remove, increment, and decrement items
-   Real-time price calculations
-   Persistent cart stored in state

### Arrival Setup

-   Select arrival date, time, address, and notes
-   Choose home add-ons (warm home, lights on, flowers, turndown
    service)
-   Automatic calculation of grocery and add-on totals

### Order Management

-   Submit a complete Welcome Order to the backend
-   Orders stored in MongoDB linked to the authenticated user
-   View order history with expandable details
-   Order confirmation screen showing the full summary

## Architecture

### Frontend (React)

-   Pages: Home, Groceries, Arrival, Login, Register, My Orders, Order
    Confirmation
-   Components: CartSidebar, Header, Layout
-   Utilities: Pricing helpers, API wrappers
-   State management handled with React hooks
-   Routing handled with React Router

### Backend (Node.js / Express)

-   Routes:
    -   /api/auth for login, register, logout, and user session
    -   /api/orders for creating and fetching orders
    -   /api/groceries for retrieving grocery data
-   Models:
    -   User model with hashed passwords
    -   Order model with arrival data, items, totals
-   Middleware:
    -   Authentication middleware using JWT

### Database

-   MongoDB Atlas with Mongoose schemas and validation

## Installation Instructions

### 1. Clone the repository

    git clone (INSERT HERE)
    cd welcome-home-whistler

### 2. Install server dependencies

    cd server
    npm install

### 3. Install client dependencies

    cd ../client
    npm install

### 4. Environment variables

Create server/.env:

    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret
    NODE_ENV=development

Create client/.env:

    VITE_API_BASE_URL=http://localhost:4000/api

### 5. Run the backend

    cd server
    npm run dev

### 6. Run the frontend

    cd client
    npm run dev

## Deployment

INSERT HERE

Make sure to set:

    VITE_API_BASE_URL=https://your-backend-url/api

## Future Improvements

-   Admin dashboard for managing orders
-   Push notifications for order status
-   Editable profile and saved property addresses
-   Inventory management for groceries
-   Mobile app version

## Devlog

A separate document tracks weekly progress, major issues, debugging
work, and key learnings throughout the development of the project.
