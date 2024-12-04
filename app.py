from flask import Flask, request, jsonify
from flask_cors import CORS
from search import process_query

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/process-query', methods=['POST'])
def handle_query():
    try:
        data = request.json
        result = process_query(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
