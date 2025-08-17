import PersonLine from './PersonLine'

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <PersonLine
          key={person.name}
          name={person.name}
          number={person.number}
          onDelete={() => onDelete(person.id)}
        />
      ))}
    </div>
  )
}

export default Persons
