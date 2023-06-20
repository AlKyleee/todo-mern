import { useState, useEffect} from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(0);

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/item', {item: itemName, price: itemPrice, quantity: itemQuantity})
      setListItems(prev => [...prev, res.data])
      setItemName('');
      setItemPrice('');
      setItemQuantity(0);
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items');
        setListItems(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getItemsList()
  }, []);

  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`)
      const newListItem = listItems.filter(item => item._id !== id);
      setListItems(newListItem);
    } catch (err) {
      console.log(err);
    }
  }

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, {item: newItemName, price: newItemPrice, quantity: newItemQuantity})
      console.log(res.data);
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
      listItems[updatedItemIndex].item = newItemName;
      listItems[updatedItemIndex].price = newItemPrice;
      listItems[updatedItemIndex].quantity = newItemQuantity;
      setListItems(listItems);
      setNewItemName('');
      setNewItemPrice('');
      setNewItemQuantity(0);
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  }

  const renderUpdateForm = () => {
    return(
      <form className='update-form' onSubmit={e => updateItem(e)}>
        <input className='update-new-input' type="text" placeholder='New Item' onChange={e => setNewItemName(e.target.value)} value={newItemName} required />
        <input className='update-new-input' type="text" placeholder='New Price' onChange={e => setNewItemPrice(e.target.value)} value={newItemPrice} required />
        <input className='update-new-input' type="number" placeholder='New Quantity' onChange={e => setNewItemQuantity(e.target.value)} value={newItemQuantity} min="0" required />
        <button className='update-new-btn' type="submit">Update</button>
      </form>
    );
  }

  const filterTable = (e) => {
    const filter = e.target.value.toUpperCase();
    const tr = document.getElementsByTagName('tr');
    for (let i = 0; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName('td')[0];
      if (td) {
        const textValue = td.textContent || td.innerHTML;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
  }


  return (
    <div className="App">
      <h1>Inventory System</h1>
      <form className='form' onSubmit={e => addItem(e)}>
        <input className='new-input' type="text" placeholder='Item Name' onChange={e => {setItemName(e.target.value)}} value={itemName} required />
        <input className='new-input' type="text" placeholder='Item Price' onChange={e => {setItemPrice(e.target.value)}} value={itemPrice} required />
        <input className='new-input' type="number" placeholder='Item Quantity' onChange={e => {setItemQuantity(e.target.value)}} value={itemQuantity} min="0" required />
        <button className='new-button' type="submit">Add</button>
      </form>
      <input className='search-input' type="text" placeholder='Search Item' onChange={e => filterTable(e)} />
      <table className="todo-listItems">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Price</th>
            <th>Item Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listItems.map(item => (
            <tr key={item._id}>
              <td>{item.item}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>
                {isUpdating === item._id ? (
                  renderUpdateForm()
                ) : (
                  <>
                    <button className="update-item" onClick={() => {setIsUpdating(item._id); setNewItemName(item.item); setNewItemPrice(item.price); setNewItemQuantity(item.quantity)}}>Update</button>
                    <button className="delete-item" onClick={() => {deleteItem(item._id)}}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App