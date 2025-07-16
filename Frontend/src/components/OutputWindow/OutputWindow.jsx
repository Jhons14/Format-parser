import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { StreamLanguage } from '@codemirror/language';
import { yaml } from '@codemirror/legacy-modes/mode/yaml';

import { TextQuote, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import vkbeautify from 'vkbeautify';

export const OutputWindow = ({ format, dataResult, error }) => {
  const [code, setCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

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

  useEffect(() => {
    if (error) {
      setCode('');
    } else {
      setCode(dataResult || '');
    }
  }, [dataResult, error]);

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
          // YAML formatting is handled server-side
          break;
        
        default:
          break;
      }
    } catch (e) {
      alert(`Invalid ${format.toUpperCase()} format`);
      console.error(e);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='h-full relative w-full overflow-y-auto'>
      {error ? (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-2'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
        </div>
      ) : (
        <CodeMirror
          value={code}
          align='start'
          theme={'dark'}
          height='100%'
          extensions={getExtensions()}
          className='bg-gray-500 rounded-md p-1 text-sm h-full'
          onChange={(value) => setCode(value)}
          placeholder={`Converted ${format.toUpperCase()} will appear here...`}
        />
      )}
      
      {!error && (
        <div className='absolute top-2 right-2 flex gap-2'>
          <button
            onClick={handleCopy}
            type='button'
            className='bg-green-600 text-white p-2 rounded hover:bg-green-700 cursor-pointer'
            title='Copy to clipboard'
          >
            <Copy size={16} />
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
      )}
      
      {copySuccess && (
        <div className='absolute top-12 right-2 bg-green-500 text-white px-2 py-1 rounded text-sm'>
          Copied!
        </div>
      )}
    </div>
  );
};
