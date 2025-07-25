
import json
import yaml
import xmltodict
from dicttoxml import dicttoxml
from xml.dom.minidom import parseString
from typing import Dict, Any, Union


class FormatConverter:
    """Enhanced format converter with support for JSON, XML, and YAML"""
    
    def __init__(self):
        self.supported_formats = {'json', 'xml', 'yaml'}
        self.conversion_map = {
            ('json', 'xml'): self._json_to_xml,
            ('json', 'yaml'): self._json_to_yaml,
            ('xml', 'json'): self._xml_to_json,
            ('xml', 'yaml'): self._xml_to_yaml,
            ('yaml', 'json'): self._yaml_to_json,
            ('yaml', 'xml'): self._yaml_to_xml,
        }
    
    def validate_format(self, format_type: str) -> bool:
        """Validate if format is supported"""
        return format_type.lower() in self.supported_formats
    
    def convert(self, data: str, from_format: str, to_format: str) -> str:
        """Convert data between formats with validation"""
        from_format = from_format.lower()
        to_format = to_format.lower()
        
        if not self.validate_format(from_format):
            raise ValueError(f"Unsupported source format: {from_format}")
        
        if not self.validate_format(to_format):
            raise ValueError(f"Unsupported target format: {to_format}")
        
        if from_format == to_format:
            return self._prettify(data, from_format)
        
        conversion_key = (from_format, to_format)
        if conversion_key not in self.conversion_map:
            raise ValueError(f"Conversion from {from_format} to {to_format} not supported")
        
        try:
            converter_func = self.conversion_map[conversion_key]
            result = converter_func(data)
            return self._prettify(result, to_format)
        except Exception as e:
            raise ValueError(f"Conversion error: {str(e)}")
    
    def _json_to_xml(self, json_data: str) -> str:
        """Convert JSON to XML"""
        try:
            data_dict = json.loads(json_data)
            xml_data = dicttoxml(data_dict, custom_root='root', attr_type=False)
            return xml_data.decode('utf-8')
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {str(e)}")
    
    def _json_to_yaml(self, json_data: str) -> str:
        """Convert JSON to YAML"""
        try:
            data_dict = json.loads(json_data)
            return yaml.dump(data_dict, default_flow_style=False, allow_unicode=True)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format: {str(e)}")
    
    def _xml_to_json(self, xml_data: str) -> Dict[str, Any]:
        """Convert XML to JSON"""
        try:
            data_dict = xmltodict.parse(xml_data)
            return data_dict
        except Exception as e:
            raise ValueError(f"Invalid XML format: {str(e)}")
    
    def _xml_to_yaml(self, xml_data: str) -> str:
        """Convert XML to YAML"""
        try:
            data_dict = xmltodict.parse(xml_data)
            return yaml.dump(data_dict, default_flow_style=False, allow_unicode=True)
        except Exception as e:
            raise ValueError(f"Invalid XML format: {str(e)}")
    
    def _yaml_to_json(self, yaml_data: str) -> Dict[str, Any]:
        """Convert YAML to JSON"""
        try:
            data_dict = yaml.safe_load(yaml_data)
            return data_dict
        except yaml.YAMLError as e:
            raise ValueError(f"Invalid YAML format: {str(e)}")
    
    def _yaml_to_xml(self, yaml_data: str) -> str:
        """Convert YAML to XML"""
        try:
            data_dict = yaml.safe_load(yaml_data)
            xml_data = dicttoxml(data_dict, custom_root='root', attr_type=False)
            return xml_data.decode('utf-8')
        except yaml.YAMLError as e:
            raise ValueError(f"Invalid YAML format: {str(e)}")
    
    def _prettify(self, data: Union[str, Dict[str, Any]], format_type: str) -> str:
        """Pretty format the output data"""
        if format_type == 'json':
            if isinstance(data, dict):
                return json.dumps(data, indent=2, ensure_ascii=False)
            return json.dumps(json.loads(data), indent=2, ensure_ascii=False)
        elif format_type == 'xml':
            if isinstance(data, str):
                dom = parseString(data)
                return dom.toprettyxml(indent='  ')
            return data
        elif format_type == 'yaml':
            if isinstance(data, str):
                return data
            return yaml.dump(data, default_flow_style=False, allow_unicode=True)
        return str(data)


# Create global converter instance
converter = FormatConverter()

# Legacy functions for backward compatibility
def json_to_xml(json_data: str) -> str:
    """Legacy function for backward compatibility"""
    return converter.convert(json_data, 'json', 'xml')

def xml_to_json(xml_data: str) -> Dict[str, Any]:
    """Legacy function for backward compatibility"""
    return converter._xml_to_json(xml_data)