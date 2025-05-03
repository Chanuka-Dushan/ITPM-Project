import React, { useState } from 'react';
import axios from 'axios';

const SubstituteFinder = ({ ingredient }) => {
  const [substitutes, setSubstitutes] = useState([]);
  const [showSubstitutes, setShowSubstitutes] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSubstitutes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/substitutes/${ingredient}`);
      setSubstitutes(res.data.substitutes || []);
      setShowSubstitutes(true);
    } catch (err) {
      alert('No substitutes found or API error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <button onClick={fetchSubstitutes}>
        🔁 Find Substitute
      </button>

      {loading && <p>Loading...</p>}

      {showSubstitutes && substitutes.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>Alternatives for "{ingredient}":</strong>
          <ul>
            {substitutes.map((sub, index) => (
              <li key={index}>{sub}</li>
            ))}
          </ul>
        </div>
      )}

      {showSubstitutes && substitutes.length === 0 && (
        <p>No substitutes found.</p>
      )}
    </div>
  );
};

export default SubstituteFinder;
