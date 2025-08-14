import { useState } from 'react'

// get a random integer in the range [0, max)
const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max)
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const mostVoteIndex = votes.indexOf(Math.max(...votes))

  console.log('total anecdotes', anecdotes.length)
  console.log('random selected', selected)
  console.log('votes for selected', votes[selected])

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <button
        onClick={() => {
          const copy = [...votes]
          copy[selected] += 1
          setVotes(copy)
        }}
      >
        vote
      </button>
      <button onClick={() => setSelected(getRandomNumber(anecdotes.length))}>
        next anecdote
      </button>

      <h2>Anecdote with most votes</h2>
      <div>{anecdotes[mostVoteIndex]}</div>
      <div>has {votes[mostVoteIndex]} votes</div>
    </div>
  )
}

export default App
