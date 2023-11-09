import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleShowAddFriend = () => {
    setShowAddFriend((show) => !show);
  };

  const handleAddFriend = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend((show) => !show);
  };

  const handleSelection = (friend) => {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const handleSubmit = (value) => {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          selectedFriend={selectedFriend}
          friends={friends}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'close' : 'Add Friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          onSubmit={handleSubmit}
          selectedFriend={selectedFriend}
        />
      )}
    </div>
  );
}

function FriendList({ selectedFriend, friends, onSelection }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          selectedFriend={selectedFriend}
          onSelection={onSelection}
          friend={friend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ selectedFriend, friend, onSelection }) {
  return (
    <li className={selectedFriend?.id === friend.id ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p className="red">You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {selectedFriend?.id === friend.id ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯‍♀️ X Name</label>
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
      ></input>

      <label>💥 Image URL</label>
      <input
        onChange={(e) => setImage(e.target.value)}
        value={image}
        type="text"
      ></input>

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSubmit }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState('user');
  return (
    <form
      className="form-split-bill"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(whoIsPaying === 'user' ? paidByFriend : paidByUser);
      }}
    >
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        onChange={(e) => setBill(Number(e.target.value))}
        value={bill}
        type="text"
      ></input>

      <label>🧍 Your expense</label>
      <input
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
        value={paidByUser}
        type="text"
      ></input>

      <label>👯‍♂️ {selectedFriend.name}'s expense</label>
      <input value={paidByFriend} type="text" disabled></input>

      <label>🤑 Who's paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
