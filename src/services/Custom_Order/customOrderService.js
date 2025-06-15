import axios from "axios";
import BASE_URL from "../../BaseURL";

export const addShop = async (payload) => {
    const token = localStorage.getItem('authToken');

    try {
        const resposne = await axios.post(`${BASE_URL}/customers/add-shop`, payload, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (resposne.status === 200) {
            return resposne.data && resposne.status;
        } else if (resposne.status === 401) {
            return resposne.status;
        }
    } catch (error) {
        console.log("Error in add shop", error);
    }

}


export const addItem = async (payload) => {
    const token = localStorage.getItem(`authToken`);
    try {
        const response = await axios.post(`${BASE_URL}/customers/add-item`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.log(`Error in add item`, error);

    }
}


export const updateItem = async (itemId, payload) => {
    const token = localStorage.getItem("authToken");
    try {
        const response = await axios.put(
            `${BASE_URL}/customers/edit-item/${itemId}`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );

        if (response.status === 200) {
            return true; // You can return response.data if you need it
        }
    } catch (error) {
        console.log("Error in update item", error);
    }

    return false;
};