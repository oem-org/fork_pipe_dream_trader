

import User from "../models/User"
import ApiClient from "../services/ApiClientJson"



const userClient = new ApiClient<User>('user/create/')
const useSignUp = async (newUser: User) => {
    try {
      const user = await userClient.post(newUser)
      console.log('Created User:', user)
      if (user.email === newUser.email) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Error creating user:', error)
      return false
    }
  }
export default useSignUp