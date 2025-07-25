# Format Parser

A powerful web application for converting between different data formats including JSON, XML, and YAML. This full-stack solution features a modern React frontend with an intuitive interface and a robust Python Flask backend that handles format conversions.

## Features

- **Multi-format Support**: Convert between JSON, XML, and YAML formats
- **Bidirectional Conversion**: All format combinations supported (JSON ↔ XML ↔ YAML)
- **Real-time Conversion**: Instant format transformation with syntax highlighting
- **Error Handling**: Comprehensive validation and error reporting
- **Clean Interface**: Modern, responsive UI built with React and CodeMirror
- **RESTful API**: Well-structured backend API with multiple endpoints

## Tech Stack

### Frontend

- **React 18**: Modern JavaScript framework with hooks
- **Vite**: Fast development server and build tool
- **CodeMirror 6**: Advanced code editor with syntax highlighting
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### Backend

- **Python 3.8+**: Core programming language
- **Flask**: Lightweight web framework
- **Flask-CORS**: Cross-origin resource sharing support
- **PyYAML**: YAML parsing and generation
- **xmltodict**: XML to dictionary conversion
- **dicttoxml**: Dictionary to XML conversion

## Prerequisites

Before installing, ensure you have:

- **Node.js** 16+ and npm (for frontend)
- **Python** 3.8+ and pip (for backend)
- **Git** for cloning the repository

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Jhons14/Format-parser.git
cd Format-parser
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd Backend
```

Create and activate a virtual environment (recommended):

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

The backend API will be available at `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install Node.js dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Universal Conversion

- **POST** `/convert?from={format}&to={format}`
  - Convert between any supported formats
  - Supports: `json`, `xml`, `yaml`
  - Request body: Raw data in source format
  - Returns: Converted data in target format

### Format Information

- **GET** `/formats`
  - Returns list of supported formats and available conversions

### Legacy Endpoints

- **POST** `/convert/json-to-xml` - Convert JSON to XML
- **POST** `/convert/xml-to-json` - Convert XML to JSON

## Usage Examples

### Converting JSON to XML

```bash
curl -X POST "http://localhost:5000/convert?from=json&to=xml" \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "age": 30}'
```

### Converting XML to YAML

```bash
curl -X POST "http://localhost:5000/convert?from=xml&to=yaml" \
  -H "Content-Type: application/xml" \
  -d '<root><name>John</name><age>30</age></root>'
```

## Development

### Running Tests

```bash
cd Backend
python run_tests.py
```

### Building for Production

```bash
cd Frontend
npm run build
```

### Project Structure

```
Format-parser/
├── Backend/
│   ├── src/
│   │   └── converter.py      # Core conversion logic
│   ├── tests/
│   │   └── test_converter.py # Unit tests
│   ├── app.py               # Flask application
│   ├── requirements.txt     # Python dependencies
│   └── run_tests.py        # Test runner
├── Frontend/
│   ├── src/
│   │   ├── App/            # Main application component
│   │   └── components/     # Reusable UI components
│   ├── package.json        # Node.js dependencies
│   └── vite.config.mjs    # Vite configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
