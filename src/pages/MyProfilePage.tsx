import { useAuth } from "../context/AuthContext"


const MyProfilePage = () => {

  const { user } = useAuth(); // hämtar användardata från AuthContext
  return (
    <div>
      <p>Hej och välkommen {user ? user.username : "" }!</p>
      <h1>Min profil</h1>
    </div>
  )
}

export default MyProfilePage
