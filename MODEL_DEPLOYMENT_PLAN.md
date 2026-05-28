# SomaTrack Model Deployment Plan
## ML Model-to-UI Integration Strategy

**Project:** Physical Pain ML (SomaTrack)  
**Date:** May 28, 2026  
**Current Stack:** Next.js (React + TypeScript) Frontend | Python ML Notebooks

---

## 📋 Current State Analysis

### Frontend Structure
```
app/
├── layout.tsx           (Main layout)
├── page.tsx            (Home redirect to /landing)
├── globals.css
├── landing/page.tsx    (Landing page with survey intro)
├── survey1/page.tsx    (Survey form with 33 questions)
└── results/page.tsx    (Results display - HARDCODED mock data)
```

### ML Models (Project Folder)
```
project/
├── SomaTrack_Final_Model.ipynb     (27 cells - BEST FOR EXPORT)
├── SomaTrack_Feature_Engineering.ipynb
├── SomaTrack_EDA.ipynb
├── ML_Project_Data_Cleaning.ipynb
├── Data files (CSV, XLSX)
├── ML_MODELING_SUMMARY.md
└── Visualizations & documentation
```

### Pain Targets (6 types)
1. **Back Pain**
2. **Neck Pain**
3. **Tension Headache**
4. **Wrist Pain**
5. **Eye Strain**
6. **Finger Numbness**

Each predicted as **4-class classification**: Never (0) → Mild (1) → Moderate (2) → Chronic (3)

---

## 🏗️ Proposed Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│  (React Components + Survey Form + Results Display)          │
└──────────────────────┬──────────────────────────────────────┘
                       │ (HTTP POST request)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              API Layer (Node.js/Express)                     │
│  Route: POST /api/predict                                    │
│  - Validates survey input                                    │
│  - Calls Python inference                                    │
│  - Returns predictions (6 pain scores + severity)            │
└──────────────────────┬──────────────────────────────────────┘
                       │ (IPC/HTTP to Python)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           Python Inference Server                            │
│  (Pickle-loaded models + scikit-learn)                       │
│  - Loads trained models from disk                            │
│  - Encodes survey responses                                  │
│  - Runs 6 individual classifiers (one per pain type)         │
│  - Returns probability predictions                           │
└──────────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Steps

### **PHASE 1: Extract & Save Models (Week 1)**

#### Step 1.1: Export Models from Notebook
**File:** `project/SomaTrack_Final_Model.ipynb`

**Action Items:**
1. Run notebook cells to train all 6 models:
   - Identify which cells train models (likely cells with GridSearchCV/hyperparameter tuning)
   - Extract the final trained classifiers for each pain type
   - Save using `joblib` or `pickle`:
     ```python
     import joblib
     
     # After model training in notebook
     joblib.dump(model_back_pain, 'models/back_pain_model.pkl')
     joblib.dump(model_neck_pain, 'models/neck_pain_model.pkl')
     joblib.dump(model_tension_headache, 'models/tension_headache_model.pkl')
     joblib.dump(model_wrist_pain, 'models/wrist_pain_model.pkl')
     joblib.dump(model_eye_strain, 'models/eye_strain_model.pkl')
     joblib.dump(model_finger_numbness, 'models/finger_numbness_model.pkl')
     ```

#### Step 1.2: Export Feature Encoder
**Action Items:**
1. Save the encoding function or create a reusable encoder module:
   ```python
   joblib.dump(encode_df, 'models/encoder.pkl')
   # OR extract encode_df logic into a Python module
   ```

#### Step 1.3: Document Model Metadata
**Create:** `project/models/model_metadata.json`
```json
{
  "version": "1.0",
  "trained_date": "2026-05-28",
  "framework": "scikit-learn",
  "python_version": "3.9+",
  "models": {
    "back_pain": {
      "file": "back_pain_model.pkl",
      "algorithm": "GradientBoostingClassifier",
      "cv_f1_macro": 0.45,
      "classes": [0, 1, 2, 3]
    },
    "neck_pain": {
      "file": "neck_pain_model.pkl",
      "algorithm": "AdaBoostClassifier",
      "cv_f1_macro": 0.53,
      "classes": [0, 1, 2, 3]
    },
    ...
  },
  "input_features": 30,
  "output_format": {
    "type": "4-class probability distribution",
    "classes": ["Never", "Mild", "Moderate", "Chronic"]
  }
}
```

#### Step 1.4: Create Python Inference Module
**Create:** `project/inference.py`
```python
import joblib
import pandas as pd
import numpy as np

class PainPredictor:
    def __init__(self, models_dir='models'):
        self.pain_types = ['back_pain', 'neck_pain', 'tension_headache', 
                          'wrist_pain', 'eye_strain', 'finger_numbness']
        self.models = {}
        self.encoder = joblib.load(f'{models_dir}/encoder.pkl')
        
        for pain in self.pain_types:
            self.models[pain] = joblib.load(
                f'{models_dir}/{pain}_model.pkl'
            )
    
    def predict(self, survey_data):
        """
        Input: dict with 33 survey responses
        Output: dict with 6 pain predictions + probabilities
        """
        df = pd.DataFrame([survey_data])
        df_encoded = self.encoder(df)
        
        predictions = {}
        for pain in self.pain_types:
            model = self.models[pain]
            proba = model.predict_proba(df_encoded)[0]
            predictions[pain] = {
                'class': int(np.argmax(proba)),
                'confidence': float(np.max(proba)),
                'probabilities': [float(p) for p in proba]
            }
        
        return predictions
```

---

### **PHASE 2: Create Backend API (Week 1-2)**

#### Step 2.1: Create Next.js API Route
**Create:** `app/api/predict/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const surveyData = await request.json();
    
    // Call Python inference server
    const predictions = await callPythonInference(surveyData);
    
    return NextResponse.json({
      success: true,
      predictions: predictions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function callPythonInference(data: any) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', ['project/inference_server.py']);
    
    let output = '';
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stdin.write(JSON.stringify(data));
    python.stdin.end();
    
    python.on('close', (code) => {
      if (code === 0) {
        resolve(JSON.parse(output));
      } else {
        reject(new Error('Python inference failed'));
      }
    });
  });
}
```

#### Step 2.2: Create Python Inference Server
**Create:** `project/inference_server.py`

```python
import sys
import json
import joblib
import pandas as pd
from inference import PainPredictor

# Initialize predictor once at startup
predictor = PainPredictor('project/models')

# Read input from stdin (from Node.js)
input_data = json.load(sys.stdin)

# Make prediction
predictions = predictor.predict(input_data)

# Write output to stdout (back to Node.js)
print(json.dumps(predictions))
```

#### Step 2.3: Set Up Model Storage
**Directory Structure:**
```
project/models/
├── back_pain_model.pkl
├── neck_pain_model.pkl
├── tension_headache_model.pkl
├── wrist_pain_model.pkl
├── eye_strain_model.pkl
├── finger_numbness_model.pkl
├── encoder.pkl
└── model_metadata.json
```

---

### **PHASE 3: Update Frontend (Week 2)**

#### Step 3.1: Connect Survey Form to API
**Update:** `app/survey1/page.tsx`

```typescript
const handleSubmit = async () => {
  const surveyData = {
    daily_study_hours: formData.studyHours,
    study_days_per_week: formData.studyDays,
    longest_sitting_duration: formData.longestSit,
    study_break_frequency: formData.breakFrequency,
    // ... all 33 fields
  };
  
  try {
    const response = await fetch('/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData)
    });
    
    const result = await response.json();
    
    // Redirect to results with predictions
    router.push(`/results?data=${encodeURIComponent(JSON.stringify(result))}`);
  } catch (error) {
    console.error('Prediction failed:', error);
  }
};
```

#### Step 3.2: Update Results Page
**Update:** `app/results/page.tsx`

```typescript
// Replace hardcoded data with actual predictions
const [predictions, setPredictions] = useState(null);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const data = params.get('data');
  if (data) {
    setPredictions(JSON.parse(decodeURIComponent(data)));
  }
}, []);

// Map predictions to risk items
const painToRiskIndex = {
  'back_pain': 0,
  'neck_pain': 1,
  'tension_headache': 2,
  'wrist_pain': 3,
  'eye_strain': 4,
  'finger_numbness': 5
};

if (predictions) {
  // Update riskItems dynamically based on predictions.predictions
}
```

---

### **PHASE 4: Deployment & Testing (Week 2-3)**

#### Step 4.1: Package Models
```bash
# Create models directory
mkdir -p project/models

# Copy from notebook after extraction
# Place all .pkl files here
```

#### Step 4.2: Update package.json Dependencies
```json
{
  "dependencies": {
    "next": "16.2.1",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "python": "^3.9"  // for backend
  }
}
```

#### Step 4.3: Test End-to-End
1. Submit test survey via UI
2. Verify API receives data
3. Verify Python inference runs
4. Verify predictions return to frontend
5. Verify results display correctly

---

## 📊 Data Flow Example

**User Input (Survey):**
```json
{
  "daily_study_hours": 5.5,
  "study_days_per_week": 6,
  "longest_sitting_duration": 2.5,
  "study_break_frequency": "Every 30-60 minutes",
  "study_break_duration": "5 - 10 minutes",
  "stress_level": "High",
  ...
  // 27 more fields
}
```

**API Output:**
```json
{
  "success": true,
  "predictions": {
    "back_pain": {
      "class": 1,
      "confidence": 0.68,
      "probabilities": [0.12, 0.68, 0.15, 0.05]
    },
    "neck_pain": {
      "class": 2,
      "confidence": 0.72,
      "probabilities": [0.05, 0.18, 0.72, 0.05]
    },
    ...
  }
}
```

**Frontend Display:**
```
Back Pain: 12% (Never) | 68% (Mild) | 15% (Moderate) | 5% (Chronic)
Risk Level: Moderate (1 = Mild/Occasional)
Recommendations: [...]
```

---

## 🔒 Security & Best Practices

1. **Model Versioning**: Include version in metadata JSON
2. **Input Validation**: Validate all 33 survey fields before prediction
3. **Error Handling**: Graceful fallback if inference fails
4. **Rate Limiting**: Limit API calls per user/IP
5. **Model Updates**: Document process for retraining models
6. **Environment Variables**: Store model path in `.env.local`

---

## 📦 File Checklist

- [ ] Extract models from notebook
- [ ] Save models as .pkl files
- [ ] Create `inference.py` module
- [ ] Create `inference_server.py`
- [ ] Create `model_metadata.json`
- [ ] Create API route `/api/predict`
- [ ] Update survey form submission
- [ ] Update results page display
- [ ] Test end-to-end pipeline
- [ ] Document deployment steps
- [ ] Add error logging

---

## 🚀 Quick Start (After Setup)

```bash
# 1. Run notebook to train/export models
jupyter notebook project/SomaTrack_Final_Model.ipynb

# 2. Move models to project/models/

# 3. Start Next.js dev server
npm run dev

# 4. Submit survey and get live predictions!
```

---

## ⚠️ Known Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Python interprocess communication | Use JSON stdin/stdout or FastAPI server |
| Model file size | Consider ONNX conversion for smaller size |
| Real-time predictions | Cache models in memory instead of reloading |
| Multiple pain models | Keep architecture modular (one model per file) |
| Encoding consistency | Extract encoding logic into reusable module |

---

## 📞 Next Steps

1. **Immediately**: Run notebook to identify and export models
2. **This week**: Create Python inference module and API route
3. **Next week**: Connect frontend to API, test predictions
4. **Final**: Deploy to production with proper error handling

