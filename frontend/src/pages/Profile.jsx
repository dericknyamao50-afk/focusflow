import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    authService.getCurrentUser()
      .then((u) => { setProfile(u); setForm(u); })
      .catch(() => {
        const saved = JSON.parse(localStorage.getItem("user") || "{}");
        setProfile(saved); setForm(saved);
      })
      .finally(() => setLoading(false));
  }, []);

  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const onPic = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    change("profilePic", URL.createObjectURL(file));
  };

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data.user); setForm(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setMsg("✅ Saved to backend!");
      setEdit(false);
    } catch {
      setMsg("⚠️ Backend PUT /auth/me not added yet — add step 1 above");
    }
    setSaving(false);
  };

  const logout = async () => {
    await authService.logout();
    navigate("/login");
  };

  if (loading) return <p style={{ padding: 20 }}>Loading real profile...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", padding: 20 }}>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <label style={{ cursor: "pointer", textAlign: "center" }}>
          <img src={form.profilePic || form.avatar || "https://i.pravatar.cc/150"}
            style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover" }} alt="" />
          <div style={{ fontSize: 12 }}>Change photo</div>
          <input type="file" hidden accept="image/*" onChange={onPic} />
        </label>
        <div>
          <h2>{profile.name || profile.username}</h2>
          <p>{profile.email}</p>
        </div>
      </div>

      {msg && <p>{msg}</p>}

      {!edit ? (
        <>
          <p><b>Bio:</b> {profile.bio || "No bio yet"}</p>
          <p><b>Location:</b> {profile.location || "—"}</p>
          <p><b>GitHub:</b> {profile.github || "—"}</p>
          <button onClick={() => setEdit(true)}>✏️ Edit Profile</button>
          <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
        </>
      ) : (
        <>
          <input value={form.name || ""} onChange={e => change("name", e.target.value)} placeholder="Name" style={{ display: "block", width: "100%", padding: 10, margin: "8px 0" }} />
          <input value={form.location || ""} onChange={e => change("location", e.target.value)} placeholder="Location" style={{ display: "block", width: "100%", padding: 10, margin: "8px 0" }} />
          <input value={form.github || ""} onChange={e => change("github", e.target.value)} placeholder="GitHub URL" style={{ display: "block", width: "100%", padding: 10, margin: "8px 0" }} />
          <textarea value={form.bio || ""} onChange={e => change("bio", e.target.value)} placeholder="Bio" rows={3} style={{ display: "block", width: "100%", padding: 10, margin: "8px 0" }} />
          <button onClick={save} disabled={saving}>{saving ? "Saving..." : "💾 Save"}</button>
          <button onClick={() => { setForm(profile); setEdit(false); }} style={{ marginLeft: 10 }}>Cancel</button>
        </>
      )}
    </div>
  );
}