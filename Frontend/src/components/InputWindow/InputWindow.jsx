import { useRef, useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import vkbeautify from 'vkbeautify';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';

import { TextQuote } from 'lucide-react';

export function InputWindow({ format, setData }) {
  const [code, setCode] = useState('');

  useEffect(() => {
    setCode('');
  }, [format]);

  useEffect(() => {
    setData(code);
  }, [code]);

  const handleXMLFormat = () => {
    if (!code || code.trim() === '') {
      return;
    }
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(code, 'application/xml');

      if (xml.getElementsByTagName('parsererror').length > 0) {
        throw new Error('XML inválido');
      }
      const s = new XMLSerializer();

      const rawXml = s.serializeToString(xml);
      const prettyXml = vkbeautify.xml(rawXml);

      setCode(prettyXml);
    } catch (e) {
      alert('XML inválido');
      console.error(e);
    }
  };

  const handleJSONFormat = () => {
    if (!code || code.trim() === '') {
      return;
    }
    try {
      const json = JSON.parse(code);
      const pretty = JSON.stringify(json, null, 2);
      setCode(pretty);
    } catch (e) {
      alert('JSON inválido');
      console.error(e);
    }
  };

  const placeholderText =
    format === 'xml'
      ? '<?xml version="1.0" encoding="UTF-8"?><root></root>'
      : '{"nombre": "Juan", "edad": 25}';

  const extensions = format === 'xml' ? [xml()] : [json()];

  return (
    <div className='h-full relative w-full overflow-y-auto'>
      <CodeMirror
        name='form'
        value={code}
        align='start'
        theme={'dark'}
        height='100%'
        extensions={extensions}
        placeholder={placeholderText}
        onChange={(value) => {
          setCode(value);
        }}
        className='bg-gray-500 rounded-md p-1  text-sm h-full '
      />
      <button
        onClick={format === 'xml' ? handleXMLFormat : handleJSONFormat}
        type='button'
        className='bg-blue-600 text-white p-2 rounded hover:bg-blue-700 absolute top-2 right-2 cursor-pointer'
      >
        <TextQuote />
      </button>
    </div>
  );
}
