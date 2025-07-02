import axios from "axios"
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


class ContactService {

    async getContact(contactName) {
        try {
            return await axios.post(`/contact/getContact`, {
                userName: contactName
            }, {
                withCredentials: true
            })
        } catch (error) {
            return error;
        }
    }
}

const contactService = new ContactService(); // object creation

export default contactService;