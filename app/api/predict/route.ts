import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

/**
 * POST /api/predict
 * Receives survey data and returns pain predictions
 */
export async function POST(request: NextRequest) {
  try {
    const surveyData = await request.json();

    // Validate input
    if (!surveyData || typeof surveyData !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid survey data format' },
        { status: 400 }
      );
    }

    // Call Python inference
    const predictions = await callPythonInference(surveyData);

    return NextResponse.json(predictions);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Call Python inference server via subprocess
 */
async function callPythonInference(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      // Path to inference server
      const projectDir = path.join(process.cwd(), 'project');
      const pythonScript = path.join(projectDir, 'inference_server.py');

      // Spawn Python process
      const python = spawn('python', [pythonScript], {
        cwd: projectDir,
        timeout: 30000, // 30 second timeout
      });

      let output = '';
      let errorOutput = '';

      // Collect stdout
      python.stdout?.on('data', (data) => {
        output += data.toString();
      });

      // Collect stderr
      python.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      // Write input data to Python process
      python.stdin?.write(JSON.stringify(data));
      python.stdin?.end();

      // Handle process completion
      python.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (parseError) {
            reject(
              new Error(
                `Failed to parse Python output: ${output.substring(0, 100)}`
              )
            );
          }
        } else {
          reject(
            new Error(
              `Python process exited with code ${code}: ${errorOutput}`
            )
          );
        }
      });

      // Handle process error
      python.on('error', (err) => {
        reject(new Error(`Failed to spawn Python process: ${err.message}`));
      });
    } catch (error) {
      reject(error);
    }
  });
}
