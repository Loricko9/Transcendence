from flask import Flask, Response
import requests, logging

app = Flask(__name__)
log = logging.getLogger('werkzeug')
log.disabled = True

@app.route('/metrics')
def metrics_redirect():
    return metrics()

@app.route('/prometheus/metrics')
def metrics():
	try:
		response = requests.get("http://django:8000/prometheus/metrics")
		return Response(response.text, mimetype="text/plain")
	except Exception as e:
		return Response(f"# Error: {e}", status=500, mimetype='text/plain')

if (__name__ == '__main__'):
	app.run(host='0.0.0.0', port=9118)