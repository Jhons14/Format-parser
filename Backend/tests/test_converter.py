import unittest
import json
import yaml
from src.converter import FormatConverter, json_to_xml, xml_to_json

class TestConverter(unittest.TestCase):

    def setUp(self):
        self.converter = FormatConverter()
        self.sample_json = '{"name": "John", "age": 30, "active": true}'
        self.sample_xml = '<root><name>John</name><age>30</age><active>true</active></root>'
        self.sample_yaml = 'name: John\nage: 30\nactive: true'

    def test_supported_formats(self):
        """Test that all expected formats are supported"""
        expected_formats = {'json', 'xml', 'yaml'}
        self.assertEqual(self.converter.supported_formats, expected_formats)

    def test_validate_format(self):
        """Test format validation"""
        self.assertTrue(self.converter.validate_format('json'))
        self.assertTrue(self.converter.validate_format('JSON'))
        self.assertTrue(self.converter.validate_format('xml'))
        self.assertTrue(self.converter.validate_format('yaml'))
        self.assertFalse(self.converter.validate_format('csv'))
        self.assertFalse(self.converter.validate_format('invalid'))

    def test_json_to_xml_conversion(self):
        """Test JSON to XML conversion"""
        result = self.converter.convert(self.sample_json, 'json', 'xml')
        self.assertIn('<name>John</name>', result)
        self.assertIn('<age>30</age>', result)
        self.assertIn('<active>true</active>', result)

    def test_json_to_yaml_conversion(self):
        """Test JSON to YAML conversion"""
        result = self.converter.convert(self.sample_json, 'json', 'yaml')
        self.assertIn('name: John', result)
        self.assertIn('age: 30', result)
        self.assertIn('active: true', result)

    def test_xml_to_json_conversion(self):
        """Test XML to JSON conversion"""
        result = self.converter.convert(self.sample_xml, 'xml', 'json')
        parsed = json.loads(result)
        self.assertEqual(parsed['root']['name'], 'John')
        self.assertEqual(parsed['root']['age'], '30')

    def test_xml_to_yaml_conversion(self):
        """Test XML to YAML conversion"""
        result = self.converter.convert(self.sample_xml, 'xml', 'yaml')
        parsed = yaml.safe_load(result)
        self.assertEqual(parsed['root']['name'], 'John')
        self.assertEqual(parsed['root']['age'], '30')

    def test_yaml_to_json_conversion(self):
        """Test YAML to JSON conversion"""
        result = self.converter.convert(self.sample_yaml, 'yaml', 'json')
        parsed = json.loads(result)
        self.assertEqual(parsed['name'], 'John')
        self.assertEqual(parsed['age'], 30)
        self.assertEqual(parsed['active'], True)

    def test_yaml_to_xml_conversion(self):
        """Test YAML to XML conversion"""
        result = self.converter.convert(self.sample_yaml, 'yaml', 'xml')
        self.assertIn('<name>John</name>', result)
        self.assertIn('<age>30</age>', result)
        self.assertIn('<active>true</active>', result)

    def test_same_format_conversion(self):
        """Test conversion when source and target formats are the same"""
        result = self.converter.convert(self.sample_json, 'json', 'json')
        parsed = json.loads(result)
        self.assertEqual(parsed['name'], 'John')
        self.assertEqual(parsed['age'], 30)

    def test_invalid_json_input(self):
        """Test handling of invalid JSON input"""
        invalid_json = '{"name": "John", "age":}'
        with self.assertRaises(ValueError) as context:
            self.converter.convert(invalid_json, 'json', 'xml')
        self.assertIn('Invalid JSON format', str(context.exception))

    def test_invalid_xml_input(self):
        """Test handling of invalid XML input"""
        invalid_xml = '<root><name>John</name><age>30</root>'
        with self.assertRaises(ValueError) as context:
            self.converter.convert(invalid_xml, 'xml', 'json')
        self.assertIn('Invalid XML format', str(context.exception))

    def test_invalid_yaml_input(self):
        """Test handling of invalid YAML input"""
        invalid_yaml = 'name: John\nage: 30\n  invalid: indentation'
        with self.assertRaises(ValueError) as context:
            self.converter.convert(invalid_yaml, 'yaml', 'json')
        self.assertIn('Invalid YAML format', str(context.exception))

    def test_unsupported_format_conversion(self):
        """Test handling of unsupported format conversion"""
        with self.assertRaises(ValueError) as context:
            self.converter.convert(self.sample_json, 'json', 'csv')
        self.assertIn('Unsupported target format', str(context.exception))

        with self.assertRaises(ValueError) as context:
            self.converter.convert(self.sample_json, 'csv', 'json')
        self.assertIn('Unsupported source format', str(context.exception))

    def test_empty_input(self):
        """Test handling of empty input"""
        with self.assertRaises(ValueError) as context:
            self.converter.convert('', 'json', 'xml')
        self.assertIn('Conversion error', str(context.exception))

    def test_legacy_functions(self):
        """Test backward compatibility with legacy functions"""
        xml_result = json_to_xml(self.sample_json)
        self.assertIn('<name>John</name>', xml_result)
        
        json_result = xml_to_json(self.sample_xml)
        self.assertIn('name', json_result)

    def test_complex_nested_structure(self):
        """Test conversion of complex nested structures"""
        complex_json = '''{
            "user": {
                "name": "John",
                "age": 30,
                "address": {
                    "street": "123 Main St",
                    "city": "New York"
                },
                "hobbies": ["reading", "coding"]
            }
        }'''
        
        # Test JSON to XML
        xml_result = self.converter.convert(complex_json, 'json', 'xml')
        self.assertIn('<name>John</name>', xml_result)
        self.assertIn('<street>123 Main St</street>', xml_result)
        
        # Test JSON to YAML
        yaml_result = self.converter.convert(complex_json, 'json', 'yaml')
        self.assertIn('name: John', yaml_result)
        self.assertIn('street: 123 Main St', yaml_result)

if __name__ == "__main__":
    unittest.main()