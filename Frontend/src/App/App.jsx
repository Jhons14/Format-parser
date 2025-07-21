import { DataContainer } from '../components/DataContainer/DataContainer';
import { useState } from 'react';
import './App.css';

export function App() {
  const [formatToConvert, setFormatToConvert] = useState('JSON-XML');

  return (
    <div className='formData-container'>
      <DataContainer
        formatToConvert={formatToConvert}
        setFormatToConvert={setFormatToConvert}
      />
    </div>
  );
}
