import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

const { NEXT_PUBLIC_API_URL } = process.env
export const AuthContext = createContext()

// SETUP CONFIG HEADERS AND TOKEN
export const tokenConfig = token => {
	// HEADERS
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	}
	if (token) {
		config.headers['x-auth-token'] = token
	}
	return config
}

const AuthContextProvider = (props) => {
    const [user, setUser] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birthdate: new Date(),
      isAdmin: false,
      _id: null
    })
    const [ isAutenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
      if(window.localStorage != undefined) {
        loadUser(window.localStorage.getItem('token'))
      }
    }, [])

    // CHECK TOKEN AND LOAD USER
    const loadUser = async (token) => {
      try {
        const response = await axios.get(`${NEXT_PUBLIC_API_URL}/users`, tokenConfig(token))
        setUser(response.data)
        setIsAuthenticated(true)
        return response.data
      } catch (err) {
        console.log(err)
        return err
      }
    }

    // SIGNUP USER
    const signupUser = async (
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      birthdate,
      isAdmin
    ) => {
      // HEADERS
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      // BODY
      const body = JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        birthdate,
        isAdmin
      })
      try {
        const response = await axios.post(`${NEXT_PUBLIC_API_URL}/users`, body, config)
        return response
      } catch (err) {
        console.log(err)
        return err
      }
    }

    // LOGIN USER
    const signinUser = async (email, password) => {
      // HEADERS
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      // BODY
      const body = JSON.stringify({ email, password })
      try {
        const response = await axios.post(`${NEXT_PUBLIC_API_URL}/users/signin`, body, config)
        setUser(response.data)
        setIsAuthenticated(true)
        return response
      } catch (err) {
        console.log(err)
        return {
          msg: err?.response?.data?.msg,
          status: 400
        }
      }
    }

    return (
      <AuthContext.Provider
        value={{
          user,
          loadUser,
          signupUser,
          setUser,
          signinUser,
          isAutenticated,
          setIsAuthenticated
        }}
      >
        {props.children}
      </AuthContext.Provider>
    )
}

export default AuthContextProvider