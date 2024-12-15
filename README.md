# WELLTRACK: Employee Welfare and Event Tracking System

## Overview
WELLTRACK is a comprehensive Employee Welfare and Event Tracking system designed to enhance the overall well-being of organizational members. By providing support, resources, and transparency, the application empowers employees to manage and monitor welfare contributions and events effectively.
![alt text](image.png)

This system allows:
- Employees to view their personal contributions and the organization's total welfare funds.
- Employees to stay informed about upcoming and past events.
- Administrators to manage employees, events, contributions, and more efficiently.

## Key Features
### Employee Dashboard
- **Contribution Tracking**: Employees can view how much they’ve contributed and see the overall organization’s contributions.
- **Event Details**: View upcoming events, past events, and more.

### Admin Dashboard
- **Employee Management**: Manage employee data and roles.
- **Event Management**: Create, update, and delete events.
- **Contribution Management**: Track and manage employee contributions.
- **Reports and Analytics**: Manage reports

### Authentication
- **Role-Based Access Control**:
  - Employees: Default role upon signup.
  - Admin: Assigned by the system administrator.
- **Secure Sign-in/Sign-up**: Includes basic authentication for user accounts.

### TODO Features
1. **Social Logins**: Enable employees to log in using social media accounts.
2. **Email Domain Restriction**: Ensure only organizational email addresses can be used for login or registration.
3. **Automated Contributions**: Automatically enter employee contributions on the 25th of every month.
4. **Two-Factor Authentication**: Add an additional layer of security.
5. **Profile Editing**: Allow employees to update their profiles.

## Tech Stack
- **Frontend**: Next.js 15
- **Authentication**: Better-auth
- **Database**: Neon(Postgresql)
- **ORM**: Prisma ORM

### Notes:
- Due to compatibility issues with some libraries in Next.js 15, the installation requires the `--legacy-peer-deps` flag.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Justoo1/WellTrack.git
   cd WellTrack
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Configure environment variables:
   - Create a `.env.local` file with the necessary variables for authentication, database, and other configurations.
   - Add these to your .env file and provide the keys for it.
        - DATABASE_URL
        - DATABASE_URL_UNPOOLED
        - BETTER_AUTH_SECRET
        - BETTER_AUTH_URL

4. Run the development server:
   ```bash
   npm run dev
   ```
5. Access the application:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works
### Employees:
1. **Sign Up/Sign In**: Create an account with basic credentials.
2. **Dashboard Access**: View your contribution history and details of welfare events.

### Admins:
1. **Admin Privileges**: Access the admin dashboard to manage employees, events, and contributions.
2. **Role Assignment**: Assign and update employee roles.

## Contribution
We welcome feedback, feature requests, and contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push them to your fork.
4. Submit a pull request to the main repository.

## License
This project is licensed under the MIT License.
