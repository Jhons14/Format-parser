import { useEffect, useMemo, useRef, useState } from 'react';
import { InputWindow } from '../InputWindow/InputWindow';
import './DataContainer.css';
import { OutputWindow } from '../OutputWindow/OutputWindow';

export function DataContainer({ formatToConvert, setFormatToConvert }) {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const JSON_2_XML_URL = `${SERVER_URL}/convert/json-to-xml`;
  const XML_2_JSON_URL = `${SERVER_URL}/convert/xml-to-json`;
  const formatErrorMsg = 'Error. Por favor revisa el formato de entrada';
  const formRef = useRef(null);

  const [data, setData] = useState('');
  const [dataResult, setDataResult] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setDataResult('');
    setError(null);
    setData('');
  }, [formatToConvert]);

  function onSubmitData(e, data) {
    e.preventDefault();
    if (!data || data.trim() === '') {
      return;
    }
    setDataResult('');
    setError('');

    if (formatToConvert === 'JSON-XML') {
      onSubmitJSON(data);
    } else {
      onSubmitXML(data);
    }
  }

  async function onSubmitJSON(jsonData) {
    const response = await fetch(JSON_2_XML_URL, {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      setDataResult(await response.text());
    } else if (response.status === 400) {
      alert(formatErrorMsg);
    } else if (!response || response.status === 500) {
      setError('Error en el servidor');
    }
  }

  async function onSubmitXML(xmlData) {
    const response = await fetch(XML_2_JSON_URL, {
      method: 'POST',
      body: xmlData,
      headers: {
        'Content-Type': 'application/xml',
      },
    });

    if (response.ok) {
      setDataResult(await response.json());
    } else if (response.status === 400) {
      alert(formatErrorMsg);
    } else if (!response || response.status === 500) {
      setError('Error en el servidor');
    }
  }

  function onChooseFormat(format) {
    setFormatToConvert(format);
  }

  function isSelected(format) {
    if (format === formatToConvert) {
      return 'active';
    } else {
      return '';
    }
  }
  return (
    <form
      className='data-form'
      ref={formRef}
      onSubmit={(e) => onSubmitData(e, data)}
    >
      {formatToConvert === 'JSON-XML' ? (
        <div className='data-container'>
          <InputWindow format={'json'} setData={setData} />
          <OutputWindow dataResult={dataResult} format={'xml'} />
        </div>
      ) : (
        <div className='data-container'>
          <InputWindow format={'xml'} setData={setData} />
          <OutputWindow dataResult={dataResult} format={'json'} />
        </div>
      )}
      <div className='flex items-center justify-center'>
        <button
          className='button bg-blue-600 hover:bg-blue-700 cursor-pointer my-2'
          type='submit'
        >
          Transform
        </button>
      </div>
      <div className='format-buttons-container'>
        <button
          type='button'
          className={` format-button ${isSelected('JSON-XML')}`}
          id={'JSON-XML'}
          onClick={() => onChooseFormat('JSON-XML')}
        >
          JSON TO XML
        </button>
        <button
          type='button'
          className={` format-button ${isSelected('XML-JSON')}`}
          id={'XML-JSON'}
          onClick={() => onChooseFormat('XML-JSON')}
        >
          XML TO JSON
        </button>
      </div>
    </form>
  );
}
