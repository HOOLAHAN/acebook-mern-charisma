import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import ProfileFeed from './ProfileFeed'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const Profile = ({ navigate }) => {
  const [user_id, setUserID] = useState(window.localStorage.getItem("user_id"));
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [userProfilePic, setUserProfilePic] = useState('');
  const [userName, setUserName] = useState('');
  const [userHomeTown, setUserHomeTown] = useState('');
  const [userBio, setUserBio] = useState('');
  const [userBirthday, setUserBirthday] = useState('');
  const [userRelationshipStatus, setUserRelationshipStatus] = useState('');
  const [userOccupation, setUserOccupation] = useState('');
  const [userJoinedDate, setUserJoinedDate] = useState('');
  const [userFriends, setUserFriends] = useState([]);
  const [isUpdated, setIsUpdated] = useState(true);
  const isFriendOfUser = userFriends.includes(user_id);
  const [isFriend, toggleIsFriend] = useState(isFriendOfUser);
  const { id } = useParams();
  const [lastId] = useState(id)

  useEffect(() => {
    if (isUpdated || (lastId !== id)) {
      fetch("/users/" + id, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => response.json())
        .then((data) => {
          setUserProfilePic(data.profile_pic)
          setUserName(data.full_name)
          setUserHomeTown(data.hometown)
          setUserBio(data.bio)
          setUserBirthday(data.birthday.slice(0,10).split("-").reverse().join("-"))
          setUserRelationshipStatus(data.relationship_status)
          setUserOccupation(data.occupation)
          setUserJoinedDate(formatDistanceToNow(new Date(data.joined), { addSuffix: true }))
          setUserFriends(data.friends)
          window.localStorage.setItem("token", data.token)
          setToken(window.localStorage.getItem("token"))
          setUserID(window.localStorage.getItem("user_id"))
          setIsUpdated(false);
        })
    }
  }, [lastId, token, id, isUpdated])

  const handleFriendClick = async () => {
    toggleIsFriend((prevState) => !prevState);

    if (user_id) {
      let response = await fetch(`/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({type: "friends", isFriend, user_id})
      });

      const data = await response.json();

      if (response.status !== 202) {
        console.log(data.error);
      } else {
        setIsUpdated(true);
      }
    }
  }

  return (
    
    <div className="container">
      <div className="bio">
        <img
            className='user-pic'
            alt='user-pic'
            src={userProfilePic}
        />
        <h2>{userName}'s Profile</h2>

        {user_id !== id && <button className="friend-btn" onClick={handleFriendClick}>
          {isFriend ? "Remove Friend" : "Add Friend" } 
          </button>}

        <p>{userFriends.length} {userFriends.length === 1 ? "friend" : "friends" }</p>
        <p><strong>Hometown:</strong> {userHomeTown}</p>
        <p><strong>Bio:</strong> {userBio}</p>
        <p><strong>Birthday:</strong> {userBirthday}</p>
        <p><strong>Occupation:</strong> {userOccupation}</p>
        <p><strong>Relationship Status:</strong> {userRelationshipStatus}</p>
        <p><strong>Joined Acebook:</strong> {userJoinedDate}</p>
      </div>
      <ProfileFeed user_id={id} />
    </div>
  );
} 

export default Profile;

