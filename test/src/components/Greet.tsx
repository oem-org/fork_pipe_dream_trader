import React from "react"

interface GreetProps {
  name: string
}

const Greet: React.FC<GreetProps> = ({ name }) => {
  return <h1>Hello, {name}!</h1>
}

export default Greet
