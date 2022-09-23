import { createContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ToastContext = createContext()

const ToastContextProvider = ({ children }) => {

  const addToast = notifMsg => {
    return toast(notifMsg)
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
        <ToastContainer autoClose={3000} />
    </ToastContext.Provider>
  );
}

export default ToastContextProvider

