import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance"; // Adjust the path if needed

const UserProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/user/${userId}`)
      .then((res) => setUserData(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>User Profile</h2>
        {userData ? (
          <div style={styles.details}>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>User ID:</strong> {userData.userId}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        ) : (
          <p style={styles.loading}>Loading...</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    padding: "2rem 3rem",
    width: "100%",
    maxWidth: "400px",
  },
  heading: {
    textAlign: "center",
    fontSize: "26px",
    color: "#2c3e50",
    marginBottom: "1.5rem",
  },
  details: {
    fontSize: "16px",
    color: "#34495e",
    lineHeight: "1.6",
  },
  loading: {
    textAlign: "center",
    color: "#95a5a6",
  },
};

export default UserProfile;
