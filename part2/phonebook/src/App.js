import {useState, useEffect} from 'react'
import personsService from './services/persons'

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
      <p>{props.person.name} {props.person.number}<button onClick={() => {
        if(window.confirm(`Delete ${props.person.name}`) === true){
          props.removeHandler(props.person.id)
        }}}>Remove</button></p>
    </>
  )
}

const Persons = (props) => {
  return (
    <>
      {props.persons.map((person) => {
        if(person.name.toLowerCase().includes(props.newFilter.toLowerCase())){
          return (
            <Person key={person.name} person={person} removeHandler={props.removeHandler}/>
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
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
      personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addContact = (event) => {
    event.preventDefault();

    const contactIndex = persons.findIndex((person) => (person.name === newName))

    if(contactIndex !== -1){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`) === true){

        const contact = persons[contactIndex]

        const changedContact = {
          ...contact,
          number: newNumber
        }

        personsService
        .put(contact.id, changedContact)
        .then(response => {
          setPersons(persons.map(n => n.id !== contact.id ? n : response.data))
        })

        return
      }
    }

    const newContact = {
      name: newName,
      number: newNumber
    }

    personsService
    .create(newContact)
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName("")
      setNewNumber("")
    })
  }

  const removeHandler = (id) => {
    personsService
    .remove(id)
    .then(response => {
      setPersons(persons.filter((person) => {
        if(person.id === id){
          return false
        }
        return true
      }))

      console.log(response)
    })
  }

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
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} newNumber={newNumber}/>

      <h2>Add a new</h2>
      <ContactForm 
        onSubmitHandler={addContact} 
        onChangeNameHandler={handleContactChange} 
        onChangeNumberHandler={handleNumberChange}
        newName={newName}
      />

      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} removeHandler={removeHandler}/>
    </div>
  )
}

export default App