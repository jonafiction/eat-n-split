import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Juan",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sara",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelected(friend) {
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selected={selectedFriend}
          onSelect={handleSelected}
        />
        {showAddFriend && <AddFriend onAddFriend={handleAddFriend} />}
        {
          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "Cerrar" : "Agregar perfil"}
          </Button>
        }
      </div>
      {selectedFriend && (
        <SplitBill friend={selectedFriend} onSplit={handleSplitBill} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelect, selected }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend friend={f} key={f.id} onSelect={onSelect} selected={selected} />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selected }) {
  const isSel = friend.id === selected?.id;
  return (
    <li className={isSel ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          Le debes ${Math.abs(friend.balance)} a {friend.name}{" "}
        </p>
      )}
      {friend.balance === 0 && <p>Tú y {friend.name} están a mano</p>}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} te debe ${Math.abs(friend.balance)}
        </p>
      )}
      <Button onClick={() => onSelect(friend)}>
        {isSel ? "Cerrar" : "Split!"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: image ? `${image}?=${id}` : "https://i.pravatar.cc/48",
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👨🏻‍👩‍👧‍👦🏾Nombre</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>🖼️Imagen</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Crear</Button>
    </form>
  );
}

function SplitBill({ friend, onSplit }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill ? bill - userExpense : "";
  const [whoPays, setWhoPays] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userExpense) return;
    onSplit(whoPays === "user" ? friendExpense : -userExpense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Divide la cuenta con {friend.name}</h2>
      <label>💵Monto</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>😎Tu gasto</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      ></input>
      <label>✌️Gasto de {friend.name}</label>
      <input type="text" disabled value={friendExpense} />
      <label>🤑Quién paga?</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button>Split!</Button>
    </form>
  );
}
