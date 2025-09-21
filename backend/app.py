from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import speedtest
import time
from datetime import datetime
from statistics import mean, stdev

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

def run_speed_test():
    """Runs a single speed test and yields real-time results."""
    try:
        st = speedtest.Speedtest(secure=True)
        st.get_best_server()

        # Perform download test and yield progress
        st.download(threads=None)
        download_result = st.results.download / 1_000_000

        # Perform upload test and yield progress
        st.upload(threads=None)
        upload_result = st.results.upload / 1_000_000

        ping = st.results.ping
        
        # Jitter is not directly provided by speedtest-cli, so we'll simulate or calculate it if needed.
        # For now, we'll use a placeholder. A true jitter test requires multiple pings.
        jitter = 0  # Placeholder

        yield {
            "type": "final",
            "ping": f"{ping:.2f}",
            "download": f"{download_result:.2f}",
            "upload": f"{upload_result:.2f}",
            "jitter": f"{jitter:.2f}",
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    except Exception as e:
        yield {"type": "error", "message": str(e)}


@socketio.on('start_test')
def handle_start_test():
    """Handles the start test event from the client."""
    print("Client requested a speed test.")
    for result in run_speed_test():
        emit('test_result', result)
    print("Test finished, results sent.")

if __name__ == '__main__':
    print("Starting Flask-SocketIO server...")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
