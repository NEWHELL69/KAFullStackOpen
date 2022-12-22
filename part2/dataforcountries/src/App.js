import {useState, useEffect} from 'react'
import axios from 'axios'

const Countries = (props) => {
  if(props.countries == "Too many"){
    return (
      <>
        <p>Too many matches, specify another filter</p>
      </>
    )
  }

  if(props.countries.length === 1){

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

    return (
      <>
        <table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{props.countries[0].name.common}</td>
            </tr>
            <tr>
              <td>Currency</td>
              <td>{currenciesHandler(props.countries[0].currencies)}</td>
            </tr>
            <tr>
              <td>Capital</td>
              <td>{props.countries[0].capital}</td>
            </tr>
            <tr>
              <td>Region</td>
              <td>{props.countries[0].region}</td>
            </tr>
            <tr>
              <td>Population</td>
              <td>{props.countries[0].population}</td>
            </tr>
            <tr>
              <td>Timezones</td>
              <td>{props.countries[0].timezones.reduce((sen, timezone) => sen.concat(`${timezone}, `))}</td>
            </tr>
            <tr>
              <td>Continents</td>
              <td>{props.countries[0].continents.reduce((sen, continent) => sen.concat(`${continent}, `))}</td>
            </tr>
            <tr>
              <td>Languages</td>
              <td>{languagesHandler(props.countries[0].languages)}</td>
            </tr>
          </tbody>
        </table>
        <img src={props.countries[0].flags.png}/>
      </>
    )
  } else {
    return (
      <>
        {
          props.countries.map((country) => <p>{country.name.common}</p>)
        }
      </>
    )
  }
}

function App() {

  const [countriesData, setCountriesData] = useState([]) 
  const [searchCountries, setsearchCountries] = useState("")
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountriesData(response.data)
      })
  }, [])

  const searchCountriesHandler = (event) => {
    setsearchCountries(event.target.value)

    if(event.target.value.length === 0){
      setCountries([])
      return
    }

    let tmpCountries = []

    for(let i = 0; i < countriesData.length; i++){
      if((countriesData[i].name.common.toLowerCase()).includes(event.target.value.toLowerCase())){
        tmpCountries.push(structuredClone(countriesData[i]))
      }
    }

    if(tmpCountries.length > 10){
      setCountries("Too many")
      return 
    }

    setCountries(tmpCountries)
  }

  return (
    <div>
      <input value={searchCountries} onChange={searchCountriesHandler}/>
      <Countries countries={countries}/>
    </div>
  );
}

export default App;
