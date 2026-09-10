
import './App.css'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AppRoutes from './routes'

function App() {
  

  return (
    <div>
    <AppRoutes/>
    <ToastContainer position="top-right" autoClose={3000} />
    </div>
    
  );
}

export default App
