import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import vkbeautify from 'vkbeautify';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { StreamLanguage } from '@codemirror/language';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';

import { TextQuote, Trash2 } from 'lucide-react';

export function InputWindow({ format, setData }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    setCode('');
  }, [format]);

  useEffect(() => {
    setData(code);
  }, [code]);

  const getExtensions = () => {
    switch (format) {
      case 'xml':
        return [xml()];
      case 'json':
        return [json()];
      case 'yaml':
        return [StreamLanguage.define(yaml)];
      default:
        return [];
    }
  };

  const getPlaceholderText = () => {
    switch (format) {
      case 'xml':
        return '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <name>John</name>\n  <age>25</age>\n</root>';
      case 'json':
        return '{\n  "name": "John",\n  "age": 25,\n  "active": true\n}';
      case 'yaml':
        return 'name: John\nage: 25\nactive: true\naddress:\n  street: 123 Main St\n  city: New York';
      default:
        return '';
    }
  };

  const handleFormat = () => {
    if (!code || code.trim() === '') {
      return;
    }

    try {
      switch (format) {
        case 'xml':
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(code, 'application/xml');
          if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
            throw new Error('Invalid XML');
          }
          const serializer = new XMLSerializer();
          const rawXml = serializer.serializeToString(xmlDoc);
          const prettyXml = vkbeautify.xml(rawXml);
          setCode(prettyXml);
          break;
        
        case 'json':
          const jsonData = JSON.parse(code);
          const prettyJson = JSON.stringify(jsonData, null, 2);
          setCode(prettyJson);
          break;
        
        case 'yaml':
          // YAML formatting is more complex and typically handled server-side
          break;
        
        default:
          break;
      }
    } catch (e) {
      alert(`Invalid ${format.toUpperCase()} format`);
      console.error(e);
    }
  };

  const handleClear = () => {
    setCode('');
  };

  return (
    <div className='h-full relative w-full overflow-y-auto'>
      <CodeMirror
        name='form'
        value={code}
        align='start'
        theme={'dark'}
        height='100%'
        extensions={getExtensions()}
        placeholder={getPlaceholderText()}
        onChange={(value) => {
          setCode(value);
        }}
        className='bg-gray-500 rounded-md p-1 text-sm h-full'
      />
      <div className='absolute top-2 right-2 flex gap-2'>
        <button
          onClick={handleClear}
          type='button'
          className='bg-red-600 text-white p-2 rounded hover:bg-red-700 cursor-pointer'
          title='Clear input'
        >
          <Trash2 size={16} />
        </button>
        {format !== 'yaml' && (
          <button
            onClick={handleFormat}
            type='button'
            className='bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer'
            title='Format code'
          >
            <TextQuote size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
