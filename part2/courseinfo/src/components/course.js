const Header = (props) => {
    return (
      <>
        <h1>{props.courseName}</h1>
      </>
    )
  }
  
  const Part = (props) => { 
    return (
      <>
        <p>{props.name} {props.exercises}</p>
      </>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <>
        {parts.map((part) => {
          return (<Part key={part.id} name={part.name} exercises={part.exercises}/>)
        })}
      </>
    )
  }
  
  const Footer = (props) => {
    return (
      <>
        <p><b>Total of {props.total} exercises<b/></b></p>
      </>
    )
  }
  
  const Course = ({course}) => {
    return (
      <>
        <Header courseName={course.name}/>
        <Content parts={course.parts}/> 
        <Footer total={(course.parts).reduce(((total, part) => total+part.exercises), 0)}/>
      </>
    )
  }

  export default Course