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
        else:
            return SimpleHTTPRequestHandler.do_GET(self)

# Change to the directory containing your HTML files
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create server
server = HTTPServer(('0.0.0.0', 8080), ConfigHandler)
print('Server started at http://0.0.0.0:8080')
server.serve_forever()

if __name__ == '__main__':
    server_address = ('', 8000)  # Run on port 8000
    httpd = HTTPServer(server_address, ConfigHandler)
    print('Server running on port 8000...')
    httpd.serve_forever() 