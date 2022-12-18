import { useState } from 'react'

const Button = (props) => {
  return (
    <>
      <button onClick={props.handleClick}>{props.text}</button>
    </>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>    
      </tr>          
    </>
  )
}

const Statistics = (props) => {
  let all = props.good + props.bad + props.neutral

  if(all !== 0){
    return (
      <>
      <tbody>
        <table>
          <StatisticLine text="good" value={props.good}/>
          <StatisticLine text="neutral" value={props.neutral}/>
          <StatisticLine text="bad" value={props.bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={Math.round(((props.good + (props.bad*(-1)))/all)*100)/100}/>
          <StatisticLine text="positive" value={Math.round(((props.good*100)/all)*100)/100}/>
        </table>
      </tbody>
      </>
    )
  } else {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>

      <Button text="good" handleClick={() => setGood(good + 1)}/>
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)}/>
      <Button text="bad" handleClick={() => setBad(bad + 1)}/>

      <h2>statistics</h2>

      <Statistics good={good} bad={bad} neutral={neutral}/>
    </div>
  )
}

export default App