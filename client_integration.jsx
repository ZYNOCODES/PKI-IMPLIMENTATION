import { useState } from 'react';
import './style.css';
import { useAuthContext } from "../../hooks/useAuthContext";
import RAKIB from '../../assets/RAKIB.svg';
import logo_stos_1 from '../../assets/logo_stos_1.svg';
import { useNavigate } from 'react-router-dom';
import forge from 'node-forge';

const LoginPage = () => {
    const navigate  = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch } = useAuthContext();
    const [error, setError] = useState("");

    //handle identifier text change
    const handleidentifierChange = (event) => {
        setIdentifier(event.target.value);
    };
    //handle password text change
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    // Function to sign data with the client's private key
    const signData = (data, privateKey) => {
      const md = forge.md.sha256.create();
      md.update(JSON.stringify(data), 'utf8');
      const signature = privateKey.sign(md);
      return forge.util.encode64(signature);
    };
    //handle login submit
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setError("");
      
      // Fetch the client's private key from localStorage (or any secure storage mechanism)
      const privateKeyPem = localStorage.getItem('clientPrivateKey'); 
      console.log(privateKeyPem);
      if (!privateKeyPem) {
        setError("Client private key is not found!");
        return;
      }
      
      // Convert the private key from PEM format to a forge private key object
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
  
      // Prepare the login data
      const loginData = {
          identifier: identifier,
          password: password
      };
  
      // Sign the login data with the private key
      const signedData = signData(JSON.stringify(loginData), privateKey);
  
      try {
          const response = await fetch(import.meta.env.VITE_APP_URL_BASE + "/auth/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  data: JSON.stringify(loginData),
                  signature: signedData
              }),
          });
  
          const json = await response.json();
  
          if (!response.ok) {
              setError(json.message);
          }
          if (response.ok) {
              // Update the auth context
              dispatch({ type: "LOGIN", payload: json });
              console.log(json);
          }
      } catch (error) {
          console.log("Error while login", error);
      }
    }
    const redirectToSignup = () => {
        navigate("/signup");
    }
    return (
        <div className="login-container">
          <div className='login-form-container-top-logo'>
            <img src={RAKIB} alt="logo" />
          </div>
          <div className='login-form-container-title'>
            <h1>Se Connecter</h1>
            <h2>Connectez-vous à votre compte</h2>
          </div>
          <div className='login-input-text-field-container'>
            <label className="login-input-text-field-label">
                Identifier {true && "*"}:
            </label>
            <input
                className="login-input-text-field-form"
                type="text"
                value={identifier}
                onChange={handleidentifierChange}
                placeholder="Entez votre identifier"
                readOnly={false}
            />
          </div>
          <div className='login-input-text-field-container'>
            <label className="login-input-text-field-label">
                Password {true && "*"}:
            </label>
            <input
                className="login-input-text-field-form"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Entez votre mot de passe"
                readOnly={false}
            />
          </div>
          <span className="loginhelpertext">{error}</span>
          <button
            className='login-button'
            onClick={handleLoginSubmit}
          >
            Log in
          </button>
          <span className="signup-helper-text">Don't have an account? <p onClick={redirectToSignup}>Sign up</p></span>
          <div className='login-form-container-bottom-logo'>
            <img src={logo_stos_1} alt="logo" />
          </div>
        </div>
    );
}
export default LoginPage;
