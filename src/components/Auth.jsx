import {
  login,
  logout,
  loggedInUserDisplayName,
  loggedInUserPhoto,
} from "../services/authService";
import "./auth.css";

export function SignIn() {
  return <button onClick={login}>Sign In</button>;
}

export function SignOut() {
  return (
    <div>
      Hello, {loggedInUserDisplayName()}
      <img src={loggedInUserPhoto()} alt="no photo" className="profile-photo" />
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
