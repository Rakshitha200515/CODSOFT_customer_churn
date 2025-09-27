import React, { useState } from 'react';

const defaultForm = {
  CreditScore: 600,
  Geography: 'France',
  Gender: 'Female',
  Age: 40,
  Tenure: 3,
  Balance: 60000,
  NumOfProducts: 2,
  HasCrCard: 1,
  IsActiveMember: 1,
  EstimatedSalary: 50000
};

const geographies = ['France', 'Spain', 'Germany'];
const genders = ['Male', 'Female'];

function App() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      CreditScore: Number(form.CreditScore),
      Age: Number(form.Age),
      Tenure: Number(form.Tenure),
      Balance: Number(form.Balance),
      NumOfProducts: Number(form.NumOfProducts),
      HasCrCard: Number(form.HasCrCard),
      IsActiveMember: Number(form.IsActiveMember),
      EstimatedSalary: Number(form.EstimatedSalary)
    };

    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.toString() });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px'
  };

  const labelStyle = { fontWeight: 'bold', marginBottom: '5px', display: 'block' };

  return (
    <div style={{
      background: '#e0f7fa',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '15px',
        padding: '30px',
        width: '450px',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#00796b', marginBottom: '25px' }}>Churn Prediction</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>Credit Score</label>
              <input style={inputStyle} type="number" name="CreditScore" value={form.CreditScore} onChange={handleChange} />
            </div>

            <div>
              <label style={labelStyle}>Age</label>
              <input style={inputStyle} type="number" name="Age" value={form.Age} onChange={handleChange} />
            </div>

            <div>
              <label style={labelStyle}>Tenure</label>
              <input style={inputStyle} type="number" name="Tenure" value={form.Tenure} onChange={handleChange} />
            </div>

            <div>
              <label style={labelStyle}>Balance</label>
              <input style={inputStyle} type="number" name="Balance" value={form.Balance} onChange={handleChange} />
            </div>

            <div>
              <label style={labelStyle}>Num Of Products</label>
              <input style={inputStyle} type="number" name="NumOfProducts" value={form.NumOfProducts} onChange={handleChange} />
            </div>

            <div>
              <label style={labelStyle}>Estimated Salary</label>
              <input style={inputStyle} type="number" name="EstimatedSalary" value={form.EstimatedSalary} onChange={handleChange} />
            </div>

            <div>
              <label style={labelStyle}>Has Credit Card</label>
              <select style={inputStyle} name="HasCrCard" value={form.HasCrCard} onChange={handleChange}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Active Member</label>
              <select style={inputStyle} name="IsActiveMember" value={form.IsActiveMember} onChange={handleChange}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Gender</label>
              <select style={inputStyle} name="Gender" value={form.Gender} onChange={handleChange}>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Geography</label>
              <select style={inputStyle} name="Geography" value={form.Geography} onChange={handleChange}>
                {geographies.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            marginTop: '20px',
            padding: '12px',
            width: '100%',
            backgroundColor: '#00796b',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            {loading ? 'Predicting...' : 'Predict Churn'}
          </button>
        </form>

        {result && result.predictions && (
          <div style={{
            marginTop: '25px',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
            backgroundColor: result.predictions[0].churn === 1 ? '#ffebee' : '#e8f5e9',
            color: result.predictions[0].churn === 1 ? '#c62828' : '#2e7d32',
            fontWeight: 'bold'
          }}>
            <h3>Result:</h3>
            <p>Churn: {result.predictions[0].churn === 1 ? 'Yes' : 'No'}</p>
            <p>Probability: {(result.predictions[0].churn_prob * 100).toFixed(2)}%</p>
          </div>
        )}

        {result && result.error && (
          <div style={{ marginTop: '20px', color: 'red', textAlign: 'center' }}>
            Error: {result.error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
