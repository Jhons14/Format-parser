import json
from flask import Flask, request, jsonify
from src.converter import converter, json_to_xml, xml_to_json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/convert', methods=['POST'])
def convert_format():

    """Universal conversion endpoint supporting JSON, XML, and YAML"""
    try:
        print('lalalal')
        # Get conversion parameters
        from_format = request.args.get('from', '').lower()
        to_format = request.args.get('to', '').lower()
        
        if not from_format or not to_format:
            return jsonify({
                'error': 'Missing required parameters: from and to format types',
                'supported_formats': list(converter.supported_formats)
            }), 400
        
        # Get input data
        if request.content_type == 'application/json':
            data = json.dumps(request.json)
        else:
            data = request.data.decode('utf-8')
        
        if not data or data.strip() == '':
            return jsonify({'error': 'No input data provided'}), 400
        
        # Convert data
        result = converter.convert(data, from_format, to_format)
        
        # Return appropriate response based on target format
        if to_format == 'json':
            return jsonify(json.loads(result)), 200
        elif to_format == 'xml':
            return result, 200, {'Content-Type': 'application/xml'}
        elif to_format == 'yaml':
            return result, 200, {'Content-Type': 'text/yaml'}
        else:
            return result, 200
            
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/formats', methods=['GET'])
def get_supported_formats():
    """Get list of supported formats and available conversions"""
    formats = list(converter.supported_formats)
    conversions = list(converter.conversion_map.keys())
    return jsonify({
        'supported_formats': formats,
        'available_conversions': [{'from': conv[0], 'to': conv[1]} for conv in conversions]
    })

# Legacy endpoints for backward compatibility
@app.route('/convert/xml-to-json', methods=['POST'])
def convert_xml_to_json():
    """Legacy endpoint for XML to JSON conversion"""
    xml_data = request.data.decode('utf-8')
    try:
        json_result = xml_to_json(xml_data)
        return jsonify(json.dumps(json_result, indent=2, ensure_ascii=False)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/convert/json-to-xml', methods=['POST'])
def convert_json_to_xml():
    """Legacy endpoint for JSON to XML conversion"""
    json_data = request.json
    try:
        xml_result = json_to_xml(json.dumps(json_data))
        return xml_result, 200, {'Content-Type': 'application/xml'}
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

if __name__ == "__main__":
    app.run(debug=True)
