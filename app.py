from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained model
model = joblib.load("model/churn_model.joblib")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = ['CreditScore','Geography','Gender','Age','Tenure','Balance','NumOfProducts',
                'HasCrCard','IsActiveMember','EstimatedSalary']
    
    # Convert to DataFrame (fixes the error)
    X = pd.DataFrame([data], columns=features)
    
    try:
        preds = model.predict(X)
        probs = model.predict_proba(X)[:,1]
        return jsonify({"predictions":[{"churn": int(preds[0]), "churn_prob": float(probs[0])}]})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
