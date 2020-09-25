import {getToken} from "./authService";

export async function getAddresses() {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/addresses/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            }
        });
    if (response.ok){
        return await response.json();
    } else {
        return [];
    }
}

export async function getAddressById(id) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/addresses/${id}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            }
        });
    if (response.ok){
        return await response.json();
    } else {
        return null;
    }
}

export async function searchAddresses(options) {
    let url = `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/addresses/search`;
    url += `?criteria=${options.criteria}`
    url += `&detalization=${options.detalization}`;
    if (options.region_fias_id) {
        url += `&region_fias_id=${options.region_fias_id}`
    }
    if (options.area_fias_id) {
        url += `&area_fias_id=${options.area_fias_id}`
    }
    if (options.city_fias_id) {
        url += `&city_fias_id=${options.city_fias_id}`
    }
    if (options.settlement_fias_id) {
        url += `&settlement_fias_id=${options.settlement_fias_id}`
    }
    if (options.street_fias_id) {
        url += `&street_fias_id=${options.street_fias_id}`;
    }

    const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            }
        });
    if (response.ok){
        return (await response.json()).suggestions;
    } else {
        return [];
    }
}

export async function postAddress(address, apartments, fiasCode) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/addresses`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            },
            body: JSON.stringify({
                address,
                apartments,
                fias_code: fiasCode
            }),
        });

    if (!response.ok){
        throw new Error("Something goes wrong");
    }
}

export async function updateAddress(address) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/addresses/${address.id}`,
        {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            },
            body: JSON.stringify({
                address: address.address,
                apartment: address.apartment,
                fias_code: address.fias_code
            }),
        });
    if (!response.ok){
        //ToDo обработка ошибок обновления
        //throw new Error( await response.json);
    }
}

export async function deleteAddress(address) {
    const response = await fetch(
        `http://${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}/api/v1/addresses/${address.id}`,
        {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getToken()
            }
        });
    if (!response.ok){
        //ToDo обработка ошибок обновления
        //throw new Error( await response.json);
    }
}