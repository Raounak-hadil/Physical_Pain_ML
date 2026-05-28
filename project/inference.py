"""
SomaTrack Pain Prediction Inference Module

Loads trained models and provides prediction interface for the web API.
"""

import joblib
import pandas as pd
import numpy as np
import json
import os
import sys
from pathlib import Path


PAIN_TARGETS = ['back_pain', 'neck_pain', 'tension_headache',
                'wrist_pain', 'eye_strain', 'finger_numbness']
PAIN_COLS_RAW = ['back_pain_frequency', 'neck_pain_frequency',
                 'tension_headache_frequency', 'wrist_pain_frequency',
                 'eye_strain_frequency', 'finger_numbness_frequency']

pain_map = {
    '0 — Never': 0, '0 — No pain at all': 0,
    '1 — Mild / occasional (once or twice)': 1,
    '1 — Mild / occasional discomfort': 1,
    '2 — Moderate / regular (a few times a week)': 2,
    '2 — Frequent discomfort (affects my focus)': 2,
    '3 — Frequent / chronic (almost daily)': 3,
    '3 — Chronic pain (affects my daily life)': 3,
}

ordinal_maps = {
    'study_break_frequency': {'Never': 0, 'Rarely': 1,
                               'Every 30-60 minutes': 2, 'Every 1-2 hours': 3},
    'study_break_duration':  {"I don't take breaks": 0, 'Less than 5 minutes': 1,
                               '5 - 10 minutes': 2, '10 - 30 minutes': 3,
                               'More than 30 minutes': 4},
    'stress_level':          {'Low': 0, 'Moderate': 1, 'High': 2},
    'physical_activity_frequency': {'No': 0, '1 – 2 times': 1,
                                     '3 – 4 times': 2, '+5 times': 3},
    'sleep_duration':        {'Less than 5h': 0, '5 – 6h': 1,
                               '6 – 7h': 2, '7 – 8h': 3, 'More than 8h': 4},
    'study_posture':         {'Upright / straight back': 0, 'Slightly slouched': 1,
                               'Heavily slouched / hunched': 2, 'Lying down': 3},
    'screen_at_eye_level':   {'No, I look down at it most of the time': 0,
                               'Sometimes': 1, 'Yes, always': 2},
    'leans_on_back':         {'No': 0, 'Sometimes': 0.5, 'Yes': 1},
    'daily_water_intake':    {'Less than 1L': 0, '1-1.5L': 1,
                               '1.5-2L': 2, 'More than 2L': 3},
    'caffeine_intake_frequency': {'Never': 0, '1–2 times per week': 1,
                                   '1 drink per day': 2, '3–5 times per week': 3,
                                   '+2 drinks per day': 4},
    'leave_desk_during_breaks': {"I don't take breaks": 0, 'No, I stay seated': 0,
                                  'Sometimes': 1,
                                  'Yes, I walk or move around or just lie down on a bed or sofa': 2},
    'backpack_weight':       {'I rarely carry a backpack': 0, 'Less than 3 kg': 1,
                               '3–5 kg': 2, '5–8 kg': 3},
}

seat_map = {
    'Ergonomic / office chair (with back support)': 0,
    'Wooden chair': 1, 'Plastic chair (standard)': 2,
    'Sofa / couch': 2, 'Other': 2,
    'Bed / floor (no chair)': 3, 'Stool (no backrest)': 3
}

def encode_df(df):
    d = df.copy()
    for raw, tgt in zip(PAIN_COLS_RAW, PAIN_TARGETS):
        if raw in d.columns:
            d[tgt] = d[raw].map(pain_map)
    for col, mapping in ordinal_maps.items():
        if col in d.columns:
            d[col+'_enc'] = d[col].map(mapping)
    if 'seat_type' in d.columns:
        d['seat_type_enc'] = d['seat_type'].map(seat_map)
    for prefix, col in [('loc', 'study_location'),
                         ('gender', 'gender'),
                         ('input', 'input_method')]:
        if col in d.columns:
            dummies = pd.get_dummies(d[col], prefix=prefix).astype(float)
            d = pd.concat([d, dummies], axis=1)
    if 'preexisting_musculoskeletal_condition' in d.columns:
        d['has_preexisting_condition'] = (
            d['preexisting_musculoskeletal_condition'].str.lower()
             .apply(lambda x: 0 if any(w in str(x)
                    for w in ['no', 'none', 'unknown']) else 1))
    if 'longest_sitting_duration' in d.columns:
        d['sitting_dur_winsorized'] = d['longest_sitting_duration']
    
    # Engineered composite features
    d['total_weekly_study_load'] = (
        d['daily_study_hours'] * d['study_days_per_week'])
    d['total_sedentary_hours'] = (
        d['daily_study_hours'] + d['daily_screen_time'])
    d['screen_to_study_ratio'] = (
        d['daily_screen_time'] / (d['daily_study_hours'] + 0.1))
    
    # Ensure Series addition is safe if they are returned as series
    posture_val = d.get('study_posture_enc', 0)
    seat_val = d.get('seat_type_enc', 0)
    eye_level_val = d.get('screen_at_eye_level_enc', 1)
    d['ergonomic_risk_score'] = posture_val + seat_val + (2 - eye_level_val)
    return d


class PainPredictor:
    """Load and use trained SomaTrack pain prediction models"""
    
    def __init__(self, models_dir='models'):
        """
        Initialize predictor by loading all saved models and artifacts
        
        Args:
            models_dir (str): Path to directory containing saved models
        """
        self.models_dir = models_dir
        self.pain_types = [
            'back_pain', 'neck_pain', 'tension_headache',
            'wrist_pain', 'eye_strain', 'finger_numbness'
        ]
        
        # Load all artifacts
        self._load_models()
        self._load_metadata()
    
    def _load_models(self):
        """Load trained model pipelines from disk"""
        self.models = {}
        self.scaler = None
        self.all_features = None
        self.pain_features = None
        self.encoder_function = None
        
        try:
            # Load scaler
            self.scaler = joblib.load(
                os.path.join(self.models_dir, 'scaler.pkl')
            )
            print("✓ Scaler loaded", file=sys.stderr)
            
            # Load feature lists
            self.all_features = joblib.load(
                os.path.join(self.models_dir, 'all_features.pkl')
            )
            print("✓ All features loaded", file=sys.stderr)
            
            self.pain_features = joblib.load(
                os.path.join(self.models_dir, 'pain_features.pkl')
            )
            print("✓ Pain-specific features loaded", file=sys.stderr)
            
            # Assign encoding function natively
            self.encoder_function = encode_df
            print("✓ Encoder function loaded natively", file=sys.stderr)
            
            # Load each pain model
            for pain in self.pain_types:
                model_path = os.path.join(
                    self.models_dir, f'{pain}_model.pkl'
                )
                self.models[pain] = joblib.load(model_path)
                print(f"✓ {pain} model loaded", file=sys.stderr)
            
            print(f"\n✅ All models loaded successfully from {self.models_dir}/", file=sys.stderr)
            
        except Exception as e:
            raise RuntimeError(f"Failed to load models: {str(e)}")
    
    def _load_metadata(self):
        """Load model metadata"""
        try:
            metadata_path = os.path.join(self.models_dir, 'model_metadata.json')
            with open(metadata_path, 'r') as f:
                self.metadata = json.load(f)
            print("✓ Metadata loaded", file=sys.stderr)
        except Exception as e:
            print(f"⚠ Warning: Could not load metadata: {str(e)}", file=sys.stderr)
            self.metadata = {}
    
    def predict(self, survey_data):
        """
        Make pain predictions for a survey response
        
        Args:
            survey_data (dict): Survey responses with 33+ fields
                Example:
                {
                    'daily_study_hours': 5.5,
                    'study_days_per_week': 6,
                    'daily_screen_time': 7.0,
                    'age': 22,
                    'study_break_frequency': 'Every 30-60 minutes',
                    ... (all 33 survey fields)
                }
        
        Returns:
            dict: Predictions for each pain type
                {
                    'back_pain': {
                        'class': 1,
                        'confidence': 0.68,
                        'probabilities': [0.12, 0.68, 0.15, 0.05],
                        'severity': 'Mild'
                    },
                    ... (6 pain types total)
                }
        """
        try:
            # Convert to DataFrame
            df = pd.DataFrame([survey_data])
            
            # Encode features
            df_encoded = self.encoder_function(df)
            
            # Align columns with training data
            for col in self.all_features:
                if col not in df_encoded.columns:
                    df_encoded[col] = 0
            
            X = df_encoded[self.all_features].apply(
                pd.to_numeric, errors='coerce'
            ).fillna(0)
            
            # Make predictions for each pain type
            predictions = {}
            class_names = ['Never', 'Mild', 'Moderate', 'Chronic']
            
            for pain in self.pain_types:
                model = self.models[pain]
                pain_feats = self.pain_features[pain]
                
                # Get features for this pain type
                X_pain = X[[f for f in pain_feats if f in X.columns]]
                
                # Determine if scaling is needed
                needs_scaling = self._model_needs_scaling(pain)
                if needs_scaling:
                    X_pain_scaled = pd.DataFrame(
                        self.scaler.transform(X_pain[
                            [f for f in self.all_features if f in X_pain.columns]
                        ]),
                        columns=[f for f in self.all_features if f in X_pain.columns]
                    )
                    X_pain = X_pain_scaled[[f for f in pain_feats if f in X_pain_scaled.columns]]
                
                # Get prediction and probabilities
                pred_class = int(model.predict(X_pain)[0])
                pred_proba = model.predict_proba(X_pain)[0]
                confidence = float(np.max(pred_proba))
                probabilities = [float(p) for p in pred_proba]
                
                predictions[pain] = {
                    'class': pred_class,
                    'severity': class_names[pred_class],
                    'confidence': confidence,
                    'probabilities': probabilities,
                    'class_names': class_names
                }
            
            return {
                'success': True,
                'predictions': predictions
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _model_needs_scaling(self, pain):
        """Check if model for this pain type needs scaling"""
        if not self.metadata or 'models' not in self.metadata:
            return False
        
        algo = self.metadata['models'][pain].get('algorithm', '')
        needs_scaling = self.metadata.get('needs_scaling', [])
        return algo in needs_scaling
    
    def get_info(self):
        """Return model information"""
        return {
            'version': self.metadata.get('version', 'unknown'),
            'trained_date': self.metadata.get('trained_date', 'unknown'),
            'pain_types': self.pain_types,
            'models': self.metadata.get('models', {})
        }


if __name__ == '__main__':
    # Test the predictor
    print("="*70)
    print("Testing SomaTrack Pain Predictor")
    print("="*70 + "\n")
    
    # Load predictor
    predictor = PainPredictor('models')
    
    # Print model info
    print("\nModel Information:")
    info = predictor.get_info()
    print(f"  Version: {info['version']}")
    print(f"  Trained: {info['trained_date']}")
    print(f"  Pain types: {len(info['pain_types'])}")
    
    # Test with sample survey data
    print("\n" + "="*70)
    print("Sample Prediction Test")
    print("="*70 + "\n")
    
    test_survey = {
        'daily_study_hours': 5.5,
        'study_days_per_week': 6,
        'longest_sitting_duration': 2.5,
        'study_break_frequency': 'Every 30-60 minutes',
        'study_break_duration': '10 - 30 minutes',
        'leave_desk_during_breaks': 'Yes, I walk or move around or just lie down on a bed or sofa',
        'daily_water_intake': '1.5-2L',
        'caffeine_intake_frequency': '1–2 times per week',
        'daily_screen_time': 7.0,
        'stress_level': 'Moderate',
        'study_location': 'Desk (at home/dorm)',
        'seat_type': 'Plastic chair (standard)',
        'input_method': 'External keyboard + mouse',
        'study_posture': 'Slightly slouched',
        'leans_on_back': 'Sometimes',
        'screen_at_eye_level': 'Sometimes',
        'preexisting_musculoskeletal_condition': 'No',
        'backpack_weight': 'Less than 3 kg',
        'study_lighting': 'Bright artificial lighting',
        'physical_activity_frequency': '3 – 4 times',
        'sleep_duration': '7 – 8h',
        'age': 22,
        'gender': 'Male',
        'institution_type': 'Public University',
        'field_of_study': 'Computer Science',
        'year_of_study': '3rd year',
        'physical_discomfort_level': '1 — Mild / occasional discomfort',
        'back_pain_frequency': '1 — Mild / occasional discomfort',
        'neck_pain_frequency': '1 — Mild / occasional discomfort',
        'tension_headache_frequency': '0 — Never',
        'wrist_pain_frequency': '0 — Never',
        'eye_strain_frequency': '1 — Mild / occasional discomfort',
        'finger_numbness_frequency': '0 — Never',
    }
    
    result = predictor.predict(test_survey)
    
    if result['success']:
        print("Pain Predictions:")
        print("-" * 70)
        for pain, pred in result['predictions'].items():
            print(f"\n{pain.upper()}:")
            print(f"  Severity: {pred['severity']} (Class {pred['class']})")
            print(f"  Confidence: {pred['confidence']:.1%}")
            print(f"  Probabilities:")
            for i, (severity, prob) in enumerate(
                zip(pred['class_names'], pred['probabilities'])
            ):
                print(f"    {severity:<12}: {prob:>6.1%}")
    else:
        print(f"❌ Prediction failed: {result['error']}")
