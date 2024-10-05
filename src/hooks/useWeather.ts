import axios from "axios"
import { SearchType } from "../types"

export default function useWeather() {

    const fetchWeather = async (search: SearchType) => {

        const appId = 'b6e0c14e15b7085e4a88fa50a53d79bf'
        
        try {

            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
            const {data} = await axios.get(geoUrl)

        } catch (error) {
            console.log(error)
        }
    }

    return {
        fetchWeather
    }
}