import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

const API = "http://localhost:3000"; 

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const save = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };
  return { token, save, logout };
}

const styles = {
  appWrap: {
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    background: '#f3f4f6',
    minHeight: '100vh'
  },
  nav: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    padding: '14px 20px',
    background: '#0f172a',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(2,6,23,0.15)'
  },
  navBrand: { fontWeight: 700, fontSize: '18px', color: '#fff', textDecoration: 'none' },
  navLink: { color: '#e6eef8', textDecoration: 'none', fontSize: '14px' },
  container: { maxWidth: '960px', margin: '28px auto', padding: '20px' },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '18px',
    border: '1px solid #e6e9ef',
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)'
  },
  formInput: { width: '100%', padding: '10px 12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #d1d5db' },
  formTextarea: { width: '100%', padding: '10px 12px', minHeight: '120px', borderRadius: '8px', border: '1px solid #d1d5db' },
  btnPrimary: { padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' },
  btnAccent: { padding: '8px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  btnWarn: { padding: '8px 14px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  btnDanger: { padding: '8px 14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' },
  smallText: { fontSize: '13px', color: '#64748b' },
  cardFooter: { marginTop: '12px', display: 'flex', gap: '8px' }
};

function Nav({ auth }) {
  return (
    <div style={styles.nav}>
      <Link to="/" style={styles.navBrand}>RecipeFeed</Link>
      <Link to="/all" style={styles.navLink}>All Recipes</Link>
      {auth.token ? (
        <>
          <Link to="/my" style={styles.navLink}>My Recipes</Link>
          <Link to="/add" style={styles.navLink}>Add Recipe</Link>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={auth.logout} style={{ ...styles.btnDanger }}>Logout</button>
          </div>
        </>
      ) : (
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <Link to="/login" style={{ ...styles.btnPrimary, textDecoration: 'none', display: 'inline-block' }}>Login</Link>
          <Link to="/register" style={{ ...styles.btnAccent, textDecoration: 'none', display: 'inline-block' }}>Register</Link>
        </div>
      )}
    </div>
  );
}

function Register({ auth }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API + "/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      auth.save(data.token);
      navigate("/my");
    } catch (err) {
      setMsg(err.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, maxWidth: '560px', margin: '0 auto' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Create account</h2>
        <p style={{ ...styles.smallText, marginTop: '8px' }}>Register to add and manage your recipes.</p>
        <form onSubmit={submit} style={{ marginTop: '14px' }}>
          <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} style={styles.formInput} />
          <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} style={styles.formInput} />
          <input placeholder="password" value={password} onChange={e => setPassword(e.target.value)} type="password" style={styles.formInput} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={styles.btnAccent}>Register</button>
          </div>
        </form>
        {msg && <p style={{ color: '#dc2626', marginTop: '10px' }}>{msg}</p>}
      </div>
    </div>
  );
}

function Login({ auth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      auth.save(data.token);
      navigate("/my");
    } catch (err) {
      setMsg(err.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>Welcome back</h2>
        <p style={{ ...styles.smallText, marginTop: '8px' }}>Sign in to manage your recipes.</p>
        <form onSubmit={submit} style={{ marginTop: '14px' }}>
          <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} style={styles.formInput} />
          <input placeholder="password" value={password} onChange={e => setPassword(e.target.value)} type="password" style={styles.formInput} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={styles.btnPrimary}>Login</button>
          </div>
        </form>
        {msg && <p style={{ color: '#dc2626', marginTop: '10px' }}>{msg}</p>}
      </div>
    </div>
  );
}

function AllRecipes({ auth }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API + "/api/foods", {
          headers: auth.token
            ? { Authorization: "Bearer " + auth.token }
            : {}      
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setItems(data.items || data);
      } catch (err) {
        setErr(err.message);
      }
    };
    load();
  }, [auth.token]);

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ margin: 0 }}>All Recipes</h2>
        <p style={styles.smallText}>Browse recipes from all creators</p>
      </div>

      <div style={styles.grid}>
        {items.map(it => (
          <div key={it._id} style={styles.card}>
            <h3 style={{ marginTop: 0 }}>{it.foodname}</h3>
            <p style={{ color: '#334155' }}>{it.description}</p>
            {it.user && it.user.username && <p style={{ ...styles.smallText, marginTop: '10px' }}>by {it.user.username}</p>}
            <div style={styles.cardFooter}></div>
          </div>
        ))}
      </div>

      {err && <p style={{ color: '#dc2626', marginTop: '12px' }}>{err}</p>}
    </div>
  );
}

function MyRecipes({ auth }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await fetch(API + "/api/foods", {
        headers: auth.token
          ? { Authorization: "Bearer " + auth.token }
          : {}       
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setErr(err.message);
    }
  };

  useEffect(() => { if (auth.token) load(); }, [auth.token]);

  const remove = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    await fetch(API + "/delete/" + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + auth.token } });
    load();
  };

  const goEdit = (item) => {
    navigate(`/edit/${item._id}`, { state: { item } });
  };

  return (
    <div style={styles.container}>
      <h2 style={{ marginTop: 0 }}>My Recipes</h2>
      {err && <div style={{ color: '#dc2626' }}>{err}</div>}
      <div style={styles.grid}>
        {items.map(it => (
          <div key={it._id} style={styles.card}>
            <h3 style={{ marginTop: 0 }}>{it.foodname}</h3>
            <p style={{ color: '#334155' }}>{it.description}</p>
            <div style={styles.cardFooter}>
              <button onClick={() => goEdit(it)} style={styles.btnWarn}>Edit</button>
              <button onClick={() => remove(it._id)} style={styles.btnDanger}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddRecipe({ auth }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API + "/api/food", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token },
        body: JSON.stringify({ name, description })
      });
      if (!res.ok) throw new Error(await res.text());
      setName(''); setDescription('');
      navigate('/my');
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, maxWidth: '680px', margin: '0 auto' }}>
        <h2 style={{ margin: 0 }}>Add Recipe</h2>
        <p style={{ ...styles.smallText, marginTop: '8px' }}>Write a short title and description.</p>
        <form onSubmit={submit} style={{ marginTop: '12px' }}>
          <input placeholder="name" value={name} onChange={e => setName(e.target.value)} style={styles.formInput} />
          <textarea placeholder="description" value={description} onChange={e => setDescription(e.target.value)} style={styles.formTextarea} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={styles.btnAccent}>Add</button>
          </div>
        </form>
        {msg && <p style={{ color: '#dc2626', marginTop: '10px' }}>{msg}</p>}
      </div>
    </div>
  );
}

import { useParams, useLocation } from 'react-router-dom';
function EditRecipe({ auth }) {
  const { id } = useParams();                 
  const location = useLocation();
  const stateItem = location.state && location.state.item;
  const [item, setItem] = useState(stateItem || null);
  const [name, setName] = useState(stateItem ? stateItem.name : '');
  const [description, setDescription] = useState(stateItem ? stateItem.description : '');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    
    if (stateItem) return;

    const load = async () => {
      try {
        const res = await fetch(`${API}/api/food/${id}`, {
          headers: auth.token ? { Authorization: 'Bearer ' + auth.token } : {}
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setItem(data);
        setName(data.name || '');
        setDescription(data.description || '');
      } catch (err) {
        console.error('Could not load recipe:', err);
        setMsg(err.message || 'Could not load recipe');
      }
    };

    if (id) load();
  }, [id, stateItem, auth.token]);

  useEffect(() => {
   
    if (item) {
      setName(item.name || '');
      setDescription(item.description || '');
    }
  }, [item]);

  const submit = async (e) => {
    e.preventDefault();
    if (!id) {
      setMsg('Missing recipe id');
      return;
    }
    try {
      const res = await fetch(API + "/update", {
        method: 'PUT',
        headers: auth.token ? { 'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token } : {},
        body: JSON.stringify({ id: id, newfoodname: name })
      });
      if (!res.ok) throw new Error(await res.text());
      
      navigate('/my');
    } catch (err) {
      setMsg(err.message || 'Update failed');
    }
  };

  if (!item && !msg) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ maxWidth: 640, margin: '40px auto' }}>
          <div style={{ padding: 20, background: '#fff', borderRadius: 10 }}>Loading recipe...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ maxWidth: 680, margin: '0 auto', background: '#fff', padding: 18, borderRadius: 12 }}>
        <h2 style={{ margin: 0 }}>Edit Recipe</h2>
        <p style={{ color: '#64748b', marginTop: 8 }}>Change title and save.</p>
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <input placeholder="name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #d1d5db' }} />
          <textarea placeholder="description" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: 10, minHeight: 120, borderRadius: 8, border: '1px solid #d1d5db' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button style={{ padding: '8px 14px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8 }}>Save</button>
          </div>
        </form>
        {msg && <p style={{ color: '#dc2626', marginTop: 10 }}>{msg}</p>}
      </div>
    </div>
  );
}


export default function App() {
  const auth = useAuth();

  return (
    <div style={styles.appWrap}>
      <Router>
        <Nav auth={auth} />
        <Routes>
          <Route path="/" element={<AllRecipes auth={auth} />} />
          <Route path="/all" element={<AllRecipes auth={auth} />} />
          <Route path="/register" element={<Register auth={auth} />} />
          <Route path="/login" element={<Login auth={auth} />} />
          <Route path="/my" element={<MyRecipes auth={auth} />} />
          <Route path="/add" element={<AddRecipe auth={auth} />} />
          <Route path="/edit/:id" element={<EditRecipe auth={auth} />} />
        </Routes>
      </Router>
    </div>
  );
}
