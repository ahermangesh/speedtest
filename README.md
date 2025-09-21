# Speed Test Platform

A modern, feature-rich internet speed testing platform with real-time monitoring and connection stability analysis.

## Features

### 🚀 Core Features
- **Quick Speed Test**: Instant download, upload, and ping measurements
- **Connection Stability Test**: Continuous monitoring over 5-60 minutes
- **Real-time Gauges**: Animated speed indicators with quality assessments
- **Server Selection**: Automatic best server selection with location info
- **Advanced Metrics**: Jitter calculation and connection quality analysis

### 📊 Analytics & Visualization
- **Live Charts**: Real-time connection stability visualization
- **Statistical Analysis**: Min/max/average speeds with variance calculations
- **Quality Assessment**: Connection ratings with usage recommendations
- **Historical Data**: Track multiple test sessions

### 📄 Export Capabilities
- **PDF Reports**: Professional test reports with charts and analysis
- **DOCX Documents**: Editable reports for sharing and documentation
- **Detailed Metrics**: Complete statistical breakdown of test results

### 🎨 User Experience
- **Dark Theme**: Modern, Ookla-inspired interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live progress tracking and status updates
- **No Registration**: Anonymous testing without user accounts

## Quick Start

### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd speed-test-platform
   ```

2. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   cd ..
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   python app.py
   ```
   The Flask server will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   npm start
   ```
   The React app will open automatically at `http://localhost:3000`

## Usage Guide

### Quick Speed Test
1. Visit the application in your web browser
2. Ensure "Quick Test" is selected
3. Click the large "GO" button
4. Wait for the test to complete (usually 30-60 seconds)
5. View your results with quality assessment and recommendations

### Connection Stability Test
1. Select "Stability Test" from the test type options
2. Choose your desired duration (5, 15, 30, or 60 minutes)
3. Click "GO" to start the continuous testing
4. Monitor real-time charts showing connection consistency
5. Review detailed stability analysis upon completion

### Exporting Results
1. Complete any speed test (quick or stability)
2. Scroll down to the results section
3. Click "Export as PDF" or "Export as DOCX"
4. Your browser will download the formatted report

## Technical Architecture

### Backend (Flask)
- **Real-time Communication**: WebSocket support via Flask-SocketIO
- **Speed Testing**: Integration with speedtest-cli library
- **Export Generation**: PDF creation with ReportLab, DOCX with python-docx
- **Statistical Analysis**: Advanced metrics calculation and quality assessment

### Frontend (React)
- **Modern UI**: Built with React 18 and Tailwind CSS 3
- **Real-time Updates**: Socket.IO client for live data streaming
- **Interactive Charts**: Custom SVG charts for stability visualization
- **Responsive Design**: Mobile-first approach with dark theme

### Key Components
- `SpeedTest.js`: Main application component with state management
- `Gauge.js`: Animated speed gauges with quality indicators
- `StabilityChart.js`: Real-time line charts for continuous tests
- `TestControls.js`: Test configuration and duration selection
- `ResultsDisplay.js`: Comprehensive results with export options

## Configuration

### Backend Configuration
- **Server Settings**: Modify host/port in `backend/app.py`
- **Test Parameters**: Adjust test intervals and server selection
- **Export Templates**: Customize PDF/DOCX report layouts

### Frontend Configuration
- **API Endpoint**: Update WebSocket connection URL in `SpeedTest.js`
- **Theme Colors**: Modify Tailwind configuration in `tailwind.config.js`
- **Chart Settings**: Adjust visualization parameters in `StabilityChart.js`

## API Endpoints

### WebSocket Events
- `start_test`: Initiate speed test with options
- `stop_test`: Terminate ongoing continuous test
- `test_result`: Receive test completion data
- `test_progress`: Real-time progress updates
- `running_stats`: Continuous test statistics

### HTTP Endpoints
- `POST /api/export`: Generate and download PDF/DOCX reports

## Performance Considerations

### Backend Optimization
- Efficient thread management for continuous tests
- Memory cleanup for completed test sessions
- Optimized statistical calculations

### Frontend Optimization
- Animated value transitions for smooth UX
- Efficient chart rendering with SVG
- Minimal re-renders with React hooks

## Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features
- WebSocket support
- ES6+ JavaScript
- CSS Grid and Flexbox
- SVG rendering

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Speedtest.net**: UI inspiration and design patterns
- **speedtest-cli**: Core speed testing functionality
- **React Community**: Component patterns and best practices
- **Tailwind CSS**: Modern styling framework

## Support

For issues, questions, or contributions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include system information and error logs
4. Provide steps to reproduce any problems

---

**Made with ❤️ for better internet connectivity testing**