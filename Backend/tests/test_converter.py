import unittest

from src.converter import json_to_xml, xml_to_json

class TestConverter(unittest.TestCase):

    def test_json_to_xml(self):
        json_data = '{"name": "John", "age": 30}'
        xml_data = json_to_xml(json_data)
        self.assertIn("<name>John</name>", xml_data)

    def test_xml_to_json(self):
        xml_data = '<root><name>John</name><age>30</age></root>'
        json_data = xml_to_json(xml_data)
        self.assertIn('"name": "John"', json_data)

if __name__ == "__main__":
    unittest.main()