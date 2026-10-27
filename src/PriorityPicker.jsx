import { PRIORITIES } from './utils.js';

// Segmented Low / Medium / High control, built on accessible radio inputs.
function PriorityPicker({ name, value, onChange }) {
  return (
    <fieldset className="form-group">
      <legend className="form-label">Priority</legend>

      <div className="segmented">
        {PRIORITIES.map((option) => (
          <label key={option.value} className={`segment ${option.value}`}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default PriorityPicker;
