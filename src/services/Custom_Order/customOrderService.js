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

export const addAddressData = async (payload) => {
    const token = localStorage.getItem(`authToken`);
    try {
        const data = await axios.post(`${BASE_URL}/customers/add-delivery-address`, {
            deliveryAddressType: payload.selectedAddress.addressType,
            instructionsInAgent: payload.instructions
        }, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (data.status === 200) {
            console.log('Add Delviery Address', data.data);
            return data.data;
        }
    } catch (error) {
        console.log(error);
    }
}


export const confirmCustomOrder = async (cartId) => {
    console.log("Cart ID in controller", cartId);
    const token = localStorage.getItem(`authToken`);
    try {
        const response = await axios.post(`${BASE_URL}/customers/confirm-custom-order`, {
            cartId: cartId
        }, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data);
        return response.data;
    } catch (error) {

    }
}

export const getCartItems = async (itemId) => {
    const token = localStorage.getItem(`authToken`);
    try {
        const response = await axios.get(`${BASE_URL}/customers/get-item/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}` 
            },
            withCredentials: true
        })
        return response.data;
    } catch (error) {
        console.log(`Error in fetch item cart`);
    }
}