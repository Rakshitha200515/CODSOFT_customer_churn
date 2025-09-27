import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, f1_score, accuracy_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib
import os

# Load dataset
df = pd.read_csv("data/Churn_Modelling.csv")

# Features & target
X = df[['CreditScore','Geography','Gender','Age','Tenure','Balance','NumOfProducts',
        'HasCrCard','IsActiveMember','EstimatedSalary']]
y = df['Exited']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing: OneHot for categorical
cat_features = ['Geography','Gender']

preprocessor = ColumnTransformer([
    ('onehot', OneHotEncoder(handle_unknown='ignore'), cat_features)
], remainder='passthrough')

# Models to try
models = {
    "logistic": LogisticRegression(max_iter=1000),
    "random_forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "gbt": GradientBoostingClassifier(n_estimators=100, random_state=42)
}

best_model = None
best_auc = 0

for name, model in models.items():
    pipe = Pipeline([('preprocessor', preprocessor), ('classifier', model)])
    pipe.fit(X_train, y_train)
    preds = pipe.predict(X_test)
    probs = pipe.predict_proba(X_test)[:,1]
    auc = roc_auc_score(y_test, probs)
    f1 = f1_score(y_test, preds)
    acc = accuracy_score(y_test, preds)
    print(f"{name}: AUC={auc:.4f}, F1={f1:.4f}, Acc={acc:.4f}")
    if auc > best_auc:
        best_auc = auc
        best_model = pipe
        best_name = name

print(f"Best model: {best_name}")

# Save model
os.makedirs("model", exist_ok=True)
joblib.dump(best_model, "model/churn_model.joblib")
print("Saved trained model to model/churn_model.joblib")
