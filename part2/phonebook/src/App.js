import {useState, useEffect} from 'react'
import axios from 'axios'

const ContactForm = (props) => {
  return (
    <>
      <form onSubmit={props.onSubmitHandler}>
        <div>
          name: <input value={props.newName} onChange={props.onChangeNameHandler} />
        </div>
        <div>
          number: <input value={props.newNumber} onChange={props.onChangeNumberHandler} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Person = (props) => {
  return (
    <>
      <p>{props.person.name} {props.person.number}</p>
    </>
  )
}

const Persons = (props) => {
  return (
    <>
      {props.persons.map((person) => {
        if(person.name.toLowerCase().includes(props.newFilter.toLowerCase())){
          return (
            <Person key={person.name} person={person}/>
          )
        } 
      })}
    </>
  )
}

const Filter = (props) => {
  return (
    <>
      <p>filter shown with <input value={props.newFilter} onChange={props.handleFilterChange}/></p>
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  //-------------------------------------------------

  const addContact = (event) => {
    event.preventDefault();

    if(persons.findIndex((person) => (person.name === newName)) !== -1){
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newContact = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(newContact))
    setNewName("")
    setNewNumber("")
  }

  //-------------------------------------------------

  const handleContactChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>

      <h2>Add a new</h2>
      <ContactForm 
        onSubmitHandler={addContact} 
        onChangeNameHandler={handleContactChange} 
        onChangeNumberHandler={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter}/>
    </div>
  )
}

export default App