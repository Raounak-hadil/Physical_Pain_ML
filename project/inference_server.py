"""
SomaTrack Inference Server - IPC Wrapper

Handles communication between Node.js API and Python inference module
via stdin/stdout JSON messages.
"""

import json
import sys
import os

# Add project directory to path
sys.path.insert(0, os.path.dirname(__file__))

from inference import PainPredictor


def main():
    """Read survey data from stdin and output predictions to stdout"""
    try:
        # Initialize predictor once
        models_dir = os.path.join(os.path.dirname(__file__), 'models')
        predictor = PainPredictor(models_dir)
        
        # Read JSON from stdin
        input_data = json.load(sys.stdin)
        
        # Make prediction
        result = predictor.predict(input_data)
        
        # Write result to stdout
        json.dump(result, sys.stdout)
        sys.stdout.flush()
        
    except json.JSONDecodeError as e:
        error_result = {
            'success': False,
            'error': f'Invalid JSON input: {str(e)}'
        }
        json.dump(error_result, sys.stdout)
        sys.exit(1)
    
    except Exception as e:
        error_result = {
            'success': False,
            'error': f'Inference error: {str(e)}'
        }
        json.dump(error_result, sys.stdout)
        sys.exit(1)


if __name__ == '__main__':
    main()
