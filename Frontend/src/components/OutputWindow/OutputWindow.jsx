import CodeMirror from '@uiw/react-codemirror';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';

import { TextQuote } from 'lucide-react';
import { useEffect, useState } from 'react';
import vkbeautify from 'vkbeautify';

export const OutputWindow = ({ format, dataResult, error }) => {
  const [code, setCode] = useState('');

  const extensions = format === 'xml' ? [xml()] : [json()];

  useEffect(() => {
    setCode(dataResult);
  }, [dataResult]);

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

  return (
    <div className='h-full relative w-full overflow-y-auto'>
      <CodeMirror
        value={code}
        align='start'
        theme={'dark'}
        height='100%'
        extensions={extensions}
        className='bg-gray-500 rounded-md p-1 text-sm h-full'
        onChange={(value) => setCode(value)}
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
};
