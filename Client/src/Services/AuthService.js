import axios from "axios"
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


class AuthService {

    async login(data) {
        try {
            return await axios.post('/auth/login', data, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async signUp(data) {
        try {
            return await axios.post('/auth/signUp', data, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async getUserInfo() {
        try {
            return await axios.get('/auth/getUserInfo', {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async uploadImage(data) {
        try {
            return await axios.post('/auth/uploadImage', data, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }

    async updateProfile(data) {
        try {
            return await axios.patch('/auth/updateProfile', data, {
                withCredentials: true,
            })
        } catch (error) {
            return error;
        }
    }

    async logout() {
        try {
            return await axios.post('/auth/logout', {}, {
                withCredentials: true
            })
        } catch (error) {
            return error
        }
    }

}

const authService = new AuthService(); // object creation

export default authService;