import { DataContainer } from '../components/DataContainer/DataContainer';
import { useEffect, useState } from 'react';
import './App.css';

export function App() {
  const [formatToConvert, setFormatToConvert] = useState('JSON-XML');

  return (
    <div className='formData-container'>
      <h3 htmlFor='data-input'>{formatToConvert}</h3>
      <DataContainer
        formatToConvert={formatToConvert}
        setFormatToConvert={setFormatToConvert}
      />
    </div>
  );
}
