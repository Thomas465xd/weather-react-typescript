import styles from "./App.module.css"
import Form from "./components/form/Form"
import useWeather from "./hooks/useWeather"

function App() {

    const { fetchWeather } = useWeather()

    return (
        <>
            <h1 className={styles.title}>Weather Searcher</h1>

            <div className={styles.container}>
                <Form 
                    fetchWeather={fetchWeather}
                />
                <p>2</p>
            </div>
        </>
    )
}

export default App
