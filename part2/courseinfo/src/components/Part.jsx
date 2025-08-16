const Part = ({ part: { name, exercises } }) => {
  // const { name, exercises } = part
  return (
    <p>
      {name} {exercises}
    </p>
  )
}

export default Part
