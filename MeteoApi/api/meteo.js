import axios from 'axios';
import { apiKey } from '../constants';

const previsionEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`;
const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log('erreur', error);
        return null;

    }
}

export const fetchInfoPrevision = params => {
    let previsionUrl = previsionEndpoint(params);
    return apiCall(previsionUrl);
}

export const fetchLocations = params => {
    let locationsUrl = locationsEndpoint(params);
    return apiCall(locationsUrl);
}