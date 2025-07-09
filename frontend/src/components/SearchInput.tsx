import React from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const SearchInput: React.FC<Props> = ({ value, onChange }) => (
  <input
    className="url-box"
    type="text"
    placeholder="Search"
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

export default SearchInput;
