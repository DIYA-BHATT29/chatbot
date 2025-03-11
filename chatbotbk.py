from flask import Flask, request, jsonify, render_template
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),  # Load API key from environment
)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')  # Get user message

    if not user_message:
        return jsonify({'reply': "Please enter a message."})

    try:
        # Corrected message structure
        messages = [
            {"role": "system", "content": "You are a helpful AI financial assistant. Provide investing guidance in simple terms."},
            {"role": "user", "content": user_message}
        ]

        # Call the OpenAI API with the correct payload
        completion = client.chat.completions.create(
            model="google/gemini-exp-1206:free",
            messages=messages
        )

        # Extract and return the chatbot's response
        reply = completion.choices[0].message['content']
        return jsonify({'reply': reply})
    
    except Exception as e:
        print(f"Error: {e}")  # Debugging: Print the error
        return jsonify({'reply': 'Sorry, something went wrong. Please try again.'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
