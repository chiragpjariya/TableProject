import axios from "axios";

const api = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/posts",
})

export const getComments = async () => {
    const response = await api.get()
    return response.data
}

export const deleteComments = async (id) => {
    const response = await api.delete(`${id}`)
    return response;
}

export const updatepost = async (id) => {
    const response = await api.patch(`/${id}`, {
        title: 'Updated title...',
        body: 'Updated body content...',
    });
    return response;
}
