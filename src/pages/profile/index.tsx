"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [password] = useState("********");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Profile — Hydrant Monitor</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="bg">
        <div className="card">

          <h1 className="title">Account Profile</h1>

          {/* Avatar */}
          <div className="avatarWrap">
            {user?.photoURL ? (
              <img src={user.photoURL} className="avatarImg" />
            ) : (
              <div className="avatarInitial">
                {user?.displayName?.charAt(0).toUpperCase() || "A"}
              </div>
            )}

            <div className="avatarAction">
              <span>Upload new picture</span>
              <small>Remove</small>
            </div>
          </div>

          {/* Form */}
          <div className="form">
            <div className="field">
              <label>Nama</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input value={email} disabled />
            </div>

            <div className="field">
              <label>Password</label>
              <input value={password} disabled />
            </div>

            {/* BUTTON SAVE */}
            <button className="btn" onClick={handleSave}>
              Simpan Perubahan
            </button>

            {/* BUTTON BACK */}
            <button
              className="btn"
              onClick={() => router.push("/dashboard")}
            >
              Kembali ke Dashboard
            </button>

            {saved && <p className="success">Berhasil disimpan!</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          font-family: "Poppins", sans-serif;
        }

        .bg {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ffffff, #ffffff);
        }

        .card {
          width: 400px;
          padding: 2rem;
          border-radius: 20px;
          background: white;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .title {
          text-align: center;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .avatarWrap {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          justify-content: center;
        }

        .avatarImg {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatarInitial {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #dc2626;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .avatarAction span {
          color: #dc2626;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .avatarAction small {
          display: block;
          font-size: 0.7rem;
          color: #888;
        }

        .form {
          text-align: left;
        }

        .field {
          margin-bottom: 1rem;
        }

        label {
          font-size: 0.8rem;
          color: #555;
        }

        input {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          margin-top: 5px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #5f1616;
          color: white;
          cursor: pointer;
          margin-top: 12px;
          font-weight: 500;
          transition: 0.25s;
        }

        .btn:hover {
          background: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.25);
        }

        .success {
          color: green;
          margin-top: 10px;
          font-size: 0.8rem;
          text-align: center;
        }
      `}</style>
    </>
  );
}