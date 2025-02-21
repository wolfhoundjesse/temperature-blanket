from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

class ConfigHandler(SimpleHTTPRequestHandler):
    def send_json_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_GET(self):
        if self.path == '/config':
            config = {
                'WEATHER_API_KEY': os.getenv('WEATHER_API_KEY'),
                'LAT': os.getenv('WEATHER_LAT'),
                'LON': os.getenv('WEATHER_LON')
            }
            
            # Verify all required environment variables are present
            if not all(config.values()):
                self.send_error(500, "Server configuration incomplete")
                return
                
            self.send_json_response(config)
        elif self.path == '/temperature-data':
            try:
                with open(TEMPERATURE_DATA_FILE, 'r') as f:
                    data = json.load(f)
                self.send_json_response(data)
            except Exception as e:
                self.send_error(500, f"Error reading temperature data: {str(e)}")
        else:
            return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path == '/update-completed':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            try:
                # Read current data
                with open(TEMPERATURE_DATA_FILE, 'r') as f:
                    file_data = json.load(f)
                
                # Update lastCompletedRow
                file_data['lastCompletedRow'] = data['lastCompletedRow']
                
                # Write updated data back to file
                with open(TEMPERATURE_DATA_FILE, 'w') as f:
                    json.dump(file_data, f, indent=2)
                
                self.send_response(200)
                self.end_headers()
            except Exception as e:
                self.send_error(500, f"Error updating completed rows: {str(e)}")
        else:
            self.send_error(404)

# Change to the directory containing your HTML files
os.chdir(os.path.dirname(os.path.abspath(__file__)))

if __name__ == '__main__':
    server_address = ('0.0.0.0', 8080)  # Run on port 8080
    httpd = HTTPServer(server_address, ConfigHandler)
    print('Server started at http://0.0.0.0:8080')
    httpd.serve_forever() 