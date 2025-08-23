const PersonLine = ({ name, number, onDelete }) => {
  return (
    <div>
      {name} {number} <button onClick={onDelete}>delete</button>
    </div>
  )
}

export default PersonLine
