import React, { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import initialUsers from './data/initialUsers.json'

function App() {
  useEffect(() => {
    const existing = localStorage.getItem('usersByRole');
    let updatedStorage = {};

    if (existing) {
      updatedStorage = JSON.parse(existing);

      // Merge users from initialUsers into existing storage
      Object.keys(initialUsers).forEach((role) => {
        if (!updatedStorage[role]) {
          updatedStorage[role] = [];
        }

        initialUsers[role].forEach((newUser) => {
          const exists = updatedStorage[role].some(
            (u) => u.email === newUser.email
          );
          if (!exists) {
            updatedStorage[role].push(newUser);
          }
        });
      });
    } else {
      // First-time setup: store all initial users
      updatedStorage = initialUsers;
    }

    // Update localStorage
    localStorage.setItem('usersByRole', JSON.stringify(updatedStorage));

    // Debug log
    console.log('Final usersByRole:', updatedStorage);
  }, []);

  return <AppRoutes />;
}

export default App;
