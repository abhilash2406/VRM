import React, { useState } from 'react';
import Select from 'react-select';
import styledComponents from 'styled-components';

const SELECT = styledComponents(Select)`width: 100%;
padding: 10px;
margin-bottom: 20px;
border: none;
border-radius: 5px;
box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
outline:none
`;



const MultiSelect = () => {
  const options = [
    { value: 'two_wheeler', label: 'Two wheeler' },
    { value: 'four_wheeler', label: 'four wheeler' },
    { value: 'heavy_vechile', label: 'heavy vechile' },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  return (
    <div className="SelectClass">
      <SELECT
        id="multi-select"
        options={options}
        value={selectedOptions}
        onChange={handleSelectChange}
        isMulti
      />
    </div>
  );
};

export default MultiSelect;
