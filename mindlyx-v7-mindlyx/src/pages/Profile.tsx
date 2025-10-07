
import React from 'react'
export default function Profile({ user }:{ user:any }){
  return (
    <div style={{maxWidth:900, margin:'20px auto'}} className="card">
      <h2>Profile</h2>
      <div className="small">Signed in as: {user?.displayName || user?.email}</div>
      <p className="small">To enable full features, put Firebase config in src/firebase/firebaseConfig.ts and enable providers in Firebase Console.</p>
    </div>
  )
}
