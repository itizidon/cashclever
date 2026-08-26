import { useEffect, useState } from 'react'
import './App.css'
import {
  mockUsers,
  type MockUser,
  type UserStatus,
} from './mocks/users'

const getAllUsers = () => Promise.resolve(mockUsers)

const myPost = (response: MockUser) => Promise.resolve(response)

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [connectionType, setConnectionType] = useState('')
  const [allUsers, setAllUsers] = useState<MockUser[]>([])
  const [editConnectionType, setEditConnectionType] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    getAllUsers().then((users) => setAllUsers(users))
  }, [])

  const openEditModal = (user: MockUser, index: number) => {
    setCurrentUser(user);
    setEditConnectionType(user.status)
  }

  const saveChanges = () => {
    const user = allUsers.find((user)=>{
      return user.email === currentUser.email
    })

    user.connectiontype = editConnectionType;
    
    const filtered = allUsers.filter((cur)=>{
      return cur.email !== user.email
    })

    myPost([...filtered, user]).then((newList)=>{
      setAllUsers(newList)
    })
    setCurrentUser(null)

  }

  const onDelete = (user) =>{
    const filtered = allUsers.filter((cur)=>{
      return cur.email !== user.email
    })
    myPost(filtered).then((newList)=>{
      setAllUsers(newList)
    })
  }

  return (
    <>
      <input name="name" onChange={(e) => setName(e.target.value)} />
      <input name="email" onChange={(e) => setEmail(e.target.value)} />
      <input
        name="connectionType"
        onChange={(e) => setConnectionType(e.target.value)}
      />

      <button
        onClick={() => {
          myPost({
            name,
            email,
            connectiontype:
              connectionType === 'Family' ? 'Coworker' : 'Friend',
            status: 'Pending',
          }).then((newUser) => {
            setAllUsers((users) => [...users, newUser])
          })
        }}
      >
        add
      </button>

      {allUsers.map((user, index) => (
        <div className="user-row" key={`${user.email}-${index}`}>
          <span>{user.name}</span>
          <span>{user.email}</span>
          <span>{user.connectiontype}</span>
          <span>{user.status}</span>
          <button onClick={() => openEditModal(user, index)}>
            Modify
          </button>
          <button onClick={()=> onDelete(user)}>delete</button>
        </div>
      ))}

      {currentUser !== null && (
        <div className="modal-backdrop" role="presentation">
          <div
            className="edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
          >
            <h2 id="edit-user-title">Modify user</h2>

            <label>
              Connection Type
              <select
                value={editConnectionType}
                onChange={(event) =>
                  setEditConnectionType(event.target.value)
                }
              >
                <option value="Friend">Friend</option>
                <option value="Family">Family</option>
                <option value="Coworker">Coworker</option>
              </select>
            </label>

            <div className="modal-actions">
              <button onClick={() => setCurrentUser(null)}>Cancel</button>
              <button onClick={saveChanges}>Save changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
