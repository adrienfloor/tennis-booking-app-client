import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

const { NEXT_PUBLIC_API_URL } = process.env
export const UsersContext = createContext()

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

const UsersContextProvider = (props) => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    if(window.localStorage != undefined) {
      fetchUsers(window.localStorage.getItem('token'))
    }
  }, [])

  // FETCH ALL USERS
  const fetchUsers = async (token) => {
    try {
      const response = await axios.get(`${NEXT_PUBLIC_API_URL}/users/all`, tokenConfig(token))
      setUsers(response.data)
      return response.data
    } catch (err) {
      console.log(err)
      return err
    }
  }
  
  // FETCH ALL USERS
  const fetchUser = async (id, token) => {
    try {
      const response = await axios.get(`${NEXT_PUBLIC_API_URL}/users/user?_id=${id}`, tokenConfig(token))
      setUsers(response.data)
      return response.data[0]
    } catch (err) {
      console.log(err)
      return err
    }
  }

  const updateUser = async (userInfo, token) => {
      // BODY
      const body = JSON.stringify(userInfo)
      try {
        const response = await axios.put(`${NEXT_PUBLIC_API_URL}/users/update_user`, body, tokenConfig(token))
        return response.data
      } catch (err) {
        console.log(err)
        return {
          msg: err?.response?.data?.msg,
          status: 400
        }
      }
  }

  const updateUserCredentials = async (_id, password, newPassword, token) => {
    // BODY
    const body = JSON.stringify({
      _id,
      password,
      newPassword
    })
    try {
      const response = await axios.put(`${NEXT_PUBLIC_API_URL}/users/update_user_credentials`, body, tokenConfig(token))
      return response.data
    } catch (err) {
      console.log(err)
      return {
        msg: err?.response?.data?.msg,
        status: 400
      }
    }
}

  return (
    <UsersContext.Provider
      value={{
        users,
        fetchUsers,
        fetchUser,
        updateUser,
        updateUserCredentials
      }}
    >
      {props.children}
    </UsersContext.Provider>
  )
}

export default UsersContextProvider