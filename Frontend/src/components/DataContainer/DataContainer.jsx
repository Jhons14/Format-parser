import { useEffect, useRef, useState } from 'react';
import { InputWindow } from '../InputWindow/InputWindow';
import './DataContainer.css';
import { OutputWindow } from '../OutputWindow/OutputWindow';

export function DataContainer({ formatToConvert, setFormatToConvert }) {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
  const CONVERT_URL = `${SERVER_URL}/convert`;
  const formatErrorMsg = 'Error. Please check the input format';
  const formRef = useRef(null);

  const [data, setData] = useState('');
  const [dataResult, setDataResult] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatOptions = [
    { key: 'JSON-XML', label: 'JSON TO XML', from: 'json', to: 'xml' },
    { key: 'JSON-YAML', label: 'JSON TO YAML', from: 'json', to: 'yaml' },
    { key: 'XML-JSON', label: 'XML TO JSON', from: 'xml', to: 'json' },
    { key: 'XML-YAML', label: 'XML TO YAML', from: 'xml', to: 'yaml' },
    { key: 'YAML-JSON', label: 'YAML TO JSON', from: 'yaml', to: 'json' },
    { key: 'YAML-XML', label: 'YAML TO XML', from: 'yaml', to: 'xml' },
  ];

  useEffect(() => {
    setDataResult('');
    setError(null);
    setData('');
  }, [formatToConvert]);

  function getCurrentFormatConfig() {
    return (
      formatOptions.find((option) => option.key === formatToConvert) ||
      formatOptions[0]
    );
  }

  async function onSubmitData(e, data) {
    e.preventDefault();
    if (!data || data.trim() === '') {
      setError('Please enter some data to convert');
      return;
    }

    setIsLoading(true);
    setDataResult('');
    setError('');

    try {
      const formatConfig = getCurrentFormatConfig();
      const response = await fetch(
        `${CONVERT_URL}?from=${formatConfig.from}&to=${formatConfig.to}`,
        {
          method: 'POST',
          body: data,
          headers: {
            'Content-Type':
              formatConfig.from === 'json' ? 'application/json' : 'text/plain',
          },
        }
      );

      if (response.ok) {
        if (formatConfig.to === 'json') {
          const jsonResult = await response.json();
          setDataResult(JSON.stringify(jsonResult, null, 2));
        } else {
          setDataResult(await response.text());
        }
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.error || formatErrorMsg);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function onChooseFormat(format) {
    setFormatToConvert(format);
  }

  function isSelected(format) {
    return format === formatToConvert ? 'active' : '';
  }

  const currentConfig = getCurrentFormatConfig();

  return (
    <form
      className='data-form'
      ref={formRef}
      onSubmit={(e) => onSubmitData(e, data)}
    >
      <div className='data-container'>
        <InputWindow
          format={currentConfig.from}
          setData={setData}
          key={formatToConvert}
        />
        <OutputWindow
          dataResult={dataResult}
          format={currentConfig.to}
          error={error}
        />
      </div>

      <div className='flex items-center justify-center'>
        <button
          className='button bg-blue-600 hover:bg-blue-700 cursor-pointer my-2'
          type='submit'
          disabled={isLoading}
        >
          {isLoading ? 'Converting...' : 'Transform'}
        </button>
        <div className='format-buttons-container'>
          {formatOptions.map((option) => (
            <button
              key={option.key}
              type='button'
              className={`format-button ${isSelected(option.key)}`}
              onClick={() => onChooseFormat(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
