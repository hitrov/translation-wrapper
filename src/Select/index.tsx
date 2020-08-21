import React from "react";

export const Select = ({ language, onChange }: { language: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
  <select value={language} onChange={onChange}>
    <option value="en">EN</option>
    <option value="ru">RU</option>
    <option value="de">DE</option>
  </select>
);