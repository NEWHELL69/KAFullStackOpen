import {useState, useEffect} from 'react'
import axios from 'axios'

const FilterInput = (props) => {
    return (
        <>
            <p>Find country - <input value={props.value} onChange={props.onChange}/></p>
        </>
    )
}

const CountryList = (props) => {

    if(props.list.length > 10){
        return (
            <>
                <p>Too many matches, specify another filter</p>
            </>
        )
    } else {
        return (
            <>
                {props.list.map((element) => <p key={element}>{element} <button type="button" onClick={() => {props.clickHandler(element)}}>Show</button></p>)}
            </>
        )
    }
}

const CountryView = (props) => {
    let country = props.countryInfo
    const countryName = props.countryName
    const [countryCoord, setCountryCoord] = useState({})
    const [countryWeather, setCountryWeather] = useState({status: 102})
    const [countryWeatherIcon, setCountryWeatherIcon] = useState("")

    useEffect(() => {
        axios
          .get(`http://api.openweathermap.org/geo/1.0/direct?q=${countryName}&limit=1&appid=${process.env.REACT_APP_API_KEY}`)
          .then(response => {
            setCountryCoord(response)
          })
    }, [countryName])

    useEffect(() => {
        if(countryCoord.status === 200){
            axios
              .get(`https://api.openweathermap.org/data/2.5/weather?lat=${countryCoord.data[0].lat}&lon=${countryCoord.data[0].lon}&appid=${process.env.REACT_APP_API_KEY}`)
              .then(response => {
                setCountryWeather(response)
              })
        }
    }, [countryCoord])

    useEffect(() => {
        if(countryWeather.status === 200){
            setCountryWeatherIcon(`http://openweathermap.org/img/wn/${countryWeather.data.weather[0].icon}@2x.png`)
        }
    }, [countryWeather])

    const languagesHandler = (languages) => {
        let sentence = ""
  
        for (let language in languages) {
          sentence = sentence.concat(`${languages[language]}, `)
        }
  
        return sentence
    }
  
    const currenciesHandler = (currencies) => {
        let sentence = ""

        for(let currency in currencies) {
            sentence = sentence.concat(`${currencies[currency].name}, `)
        }

        return sentence
    }

    if(countryWeather.status === 102){
        return (
            <>
                <p>Fetching data</p>
            </>
        )
    } else {
        return (
            <>
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td>{country.name.common}</td>
                        </tr>
                        <tr>
                            <td>Currency</td>
                            <td>{currenciesHandler(country.currencies)}</td>
                        </tr>
                        <tr>
                            <td>Capital</td>
                            <td>{country.capital}</td>
                        </tr>
                        <tr>
                            <td>Region</td>
                            <td>{country.region}</td>
                        </tr>
                        <tr>
                            <td>Population</td>
                            <td>{country.population}</td>
                        </tr>
                        <tr>
                            <td>Timezones</td>
                            <td>{country.timezones.reduce((sen, timezone) => sen.concat(`${timezone}, `))}</td>
                        </tr>
                        <tr>
                            <td>Continents</td>
                            <td>{country.continents.reduce((sen, continent) => sen.concat(`${continent}, `))}</td>
                        </tr>
                        <tr>
                            <td>Languages</td>
                            <td>{languagesHandler(country.languages)}</td>
                        </tr>
                    </tbody>
                </table>
                <img src={country.flags.png}/>
                <div>
                    <h2>Weather in {country.name.common}</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>Temprature</td>
                                <td>{countryWeather.data.main.temp}</td>
                            </tr>
                            <tr>
                                <td>Wind</td>
                                <td>{countryWeather.data.wind.speed}</td>
                            </tr>
                        </tbody>
                    </table>
                    <img src={countryWeatherIcon}/>
                </div>
            </>
        )
    }
}

const AppV2 = () => {
    const [filter, setFilter] = useState("")
    const [countriesData, setCountriesData] = useState([])
    const [countriesName, setCountriesName] = useState([])

    useEffect(() => {
        axios
          .get('https://restcountries.com/v3.1/all')
          .then(response => {
            setCountriesData(response.data)
          })
      }, [])

    const filterHandler = (event) => {
        setFilter(event.target.value)

        let tmpNameArr = []

        for(let i = 0; i < countriesData.length; i++){
            if(countriesData[i].name.common.toLowerCase().includes(event.target.value.toLowerCase())){
                tmpNameArr.push(countriesData[i].name.common)
            }
        }

        setCountriesName(tmpNameArr)
    }

    const showHandler = (countryName) => {
        setFilter(countryName)
        setCountriesName([countryName])
    }

    const getCountryInfo = (countryName) => {
        for(let i = 0; i < countriesData.length; i++){
            if((countriesData[i].name.common.toLowerCase()) === (countryName.toLowerCase())){
                return structuredClone(countriesData[i])
            }
        }
    }

    if(filter.length === 0){
        return (
            <div>
                <FilterInput value={filter} onChange={filterHandler}/>
            </div>
        )
    }

    if(countriesName.length === 1){
        return (
            <div>
                <FilterInput value={filter} onChange={filterHandler}/>
                <CountryView countryName={countriesName[0]} countryInfo={getCountryInfo(countriesName[0])} />
            </div>
        )
    } else {
        return (
            <div>
                <FilterInput value={filter} onChange={filterHandler}/>
                <CountryList list={countriesName} clickHandler={showHandler} />
            </div>
        )
    }
}

export default AppV2