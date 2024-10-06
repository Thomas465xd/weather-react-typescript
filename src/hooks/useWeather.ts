import axios from "axios"
import { SearchType } from "../types"
import { z } from "zod"
import { useMemo, useState } from "react"
//import { object, string, number, InferOutput, parse } from "valibot"

// Type Guard o Assertions
/*
function isWeatherResponse(weather: unknown) : weather is Weather {
    return (
        Boolean(weather) &&
        typeof weather === "object" &&
        typeof (weather as Weather).name === "string" &&
        typeof (weather as Weather).main.temp === "number" &&
        typeof (weather as Weather).main.temp_max === "number" &&
        typeof (weather as Weather).main.temp_min === "number" &&
        typeof (weather as Weather).main.humidity === "number" &&
        typeof (weather as Weather).weather[0].description === "string"
    )
}
*/

// Valibot
/*
const WeatherSchema = object({
    name: string(), 
    main: object({
        temp: number(),
        temp_max: number(), 
        temp_min: number(), 
        humidity: number()
    }),
    weather: object({
        description: string()
    })
})

type Weather = InferOutput<typeof WeatherSchema>

*/

// Zod
const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(), 
        temp_min: z.number(), 
        humidity: z.number()
    }),
    weather: z.array(z.object({
        description: z.string()
    }))
})

export type Weather = z.infer<typeof Weather>

const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0,
        humidity: 0
    },
    weather: [{
        description: ''
    }]
}

export default function useWeather() {

    const [ weather, setWeather ] = useState<Weather>(initialState)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const fetchWeather = async (search: SearchType) => {

        const appId = import.meta.env.VITE_API_KEY

        setLoading(true)
        setWeather(initialState)
        
        try {

            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
            const {data} = await axios.get(geoUrl)

            // Comprobar si existe
            if(!data[0]) {
                setNotFound(true)
                return
            }

            const lat = data[0].lat
            const lon = data[0].lon

            //console.log(lat, lon)

            const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            // Castear el type
            //const {data: weatherResult} = await axios.get<Weather>(weatherURL)

            // Type Guard
            /*
            const {data: weatherResult} = await axios.get<Weather>(weatherURL)
            const result = isWeatherResponse(weatherResult)

            if(result) {
                console.log(weatherResult.name)
            } else {
                console.log("Something went wrong")
            }
            */

            //console.log(result)
            //console.log(weatherResult)

            // Valibot
            /*
            const { data: weatherResult } = await axios.get(weatherURL)
            const result = parse(WeatherSchema, weatherResult)

            if (result) {
                
            } else {
                console.log("Something went wrong")
            }
            */

            // ZOD
            const {data: weatherResult} = await axios.get(weatherURL)
            const result = Weather.safeParse(weatherResult)
            
            if(result.success) {
                setWeather(result.data)
            } else {
                console.log("Something went wrong")
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const hasWeatherData = useMemo(() => weather.name , [weather])

    return {
        weather,
        loading,
        notFound,
        fetchWeather, 
        hasWeatherData
    }
}