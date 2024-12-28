import axios from "axios";

const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/comments",
})

export const getComments = async () => {
    const response = await api.get()
    return response.data
}