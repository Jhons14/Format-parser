import json
from flask import Flask, request, jsonify
from src.converter import json_to_xml, xml_to_json
from flask_cors import CORS  # Importar CORS
from xml.dom.minidom import parseString

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

def prettify_xml(xml_string):
    dom = parseString(xml_string)
    return dom.toprettyxml()

def prettify_json(json_data):
    return json.dumps(json_data, indent=4, ensure_ascii=False)

@app.route('/convert/xml-to-json', methods=['POST'])
def convert_xml_to_json():
    xml_data = request.data.decode('utf-8')  # Obtener XML del body de la petición
    try:
        json_result = xml_to_json(xml_data)  # Convertir XML a JSON'
        pretty_json = prettify_json(json_result)
        return jsonify(pretty_json), 200  # Devolver el JSON convertido
    except Exception as e:
        return jsonify({'error': str(e)}), 400  # Manejo de errores

@app.route('/convert/json-to-xml', methods=['POST'])
def convert_json_to_xml():
    json_data = request.json  # Obtener JSON del body de la petición
    try:
        xml_result = json_to_xml(json.dumps(json_data))  # Convertir JSON a XML
        xml_pretty = prettify_xml(xml_result) 
        return xml_pretty, 200, {'Content-Type': 'application/xml'}  # Devolver el XML convertido
    except Exception as e:
        return jsonify({'error': str(e)}), 400  # Manejo de errores

if __name__ == "__main__":
    app.run()
