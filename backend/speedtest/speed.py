import speedtest
import time
import csv
from datetime import datetime
from statistics import mean

LOG_FILE = "internet_log.csv"

def test_once(st):
    ping = st.results.ping
    download = st.download() / 1_000_000  # Mbps
    upload = st.upload() / 1_000_000      # Mbps
    return ping, download, upload

def write_log(timestamp, ping, download, upload, status):
    with open(LOG_FILE, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([timestamp, f"{ping:.2f}" if ping else "N/A",
                         f"{download:.2f}" if download else "N/A",
                         f"{upload:.2f}" if upload else "N/A", status])

def continuous_speed_test(duration_sec=600):
    st = speedtest.Speedtest(secure=True)
    st.get_best_server()

    pings, downloads, uploads = [], [], []
    print(f"🌐 Starting 10-minute continuous test...\n")

    # Initialize CSV log
    with open(LOG_FILE, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Timestamp", "Ping (ms)", "Download (Mbps)", "Upload (Mbps)", "Status"])

    start_time = time.time()
    test_count = 0

    while time.time() - start_time < duration_sec:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        try:
            ping, download, upload = test_once(st)
            pings.append(ping)
            downloads.append(download)
            uploads.append(upload)
            test_count += 1
            write_log(timestamp, ping, download, upload, "Connected")
            print(f"#{test_count:03d} ✅ [{timestamp}] Ping: {ping:.2f} ms | Download: {download:.2f} Mbps | Upload: {upload:.2f} Mbps")
        except Exception as e:
            write_log(timestamp, None, None, None, "Disconnected")
            print(f"❌ [{timestamp}] Connection error: {e}")
        # Optional: remove sleep for full-throttle testing
        # time.sleep(1)  # If you want slight delay between tests

    # Final stats
    if pings:
        print("\n📊 Final 10-Minute Stats:")
        print(f"Tests Run        : {test_count}")
        print(f"Average Ping     : {mean(pings):.2f} ms")
        print(f"Average Download : {mean(downloads):.2f} Mbps")
        print(f"Average Upload   : {mean(uploads):.2f} Mbps")
    else:
        print("No successful tests during the period.")

if __name__ == "__main__":
    continuous_speed_test(duration_sec=600)  # 10 minutes
