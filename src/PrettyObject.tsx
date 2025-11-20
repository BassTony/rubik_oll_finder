import React from 'react';

// PrettyObject component to pretty print nested objects and arrays
type JsonValue = string |
  number |
  boolean |
  null |
  JsonValue[] |
{ [key: string]: JsonValue; };

const isArray = (value: unknown): value is JsonValue[] => Array.isArray(value);
const isObject = (value: unknown): value is Record<string, JsonValue> => typeof value === 'object' && value !== null && !Array.isArray(value);

interface PrettyObjectProps {
  data: JsonValue;
}

export const PrettyObject: React.FC<PrettyObjectProps> = ({ data }) => {
  if (isArray(data)) {
    const [first, ...rest] = data;
    return (
      <span style={{ display: 'inline-block', verticalAlign: 'top' }}>
        {first !== undefined && <PrettyObject data={first} />}
        {rest.length > 0 && (
          <>
            <br />
            {rest.map((item, idx) => (
              <React.Fragment key={idx}>
                <span style={{ display: 'inline-block', width: '1em' }} />
                <PrettyObject data={item} />
                <br />
              </React.Fragment>
            ))}
          </>
        )}
      </span>
    );
  }

  if (isObject(data)) {
    return (
      <div style={{ marginLeft: '1em' }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong>{' '}
            <PrettyObject data={value} />
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(data)}</span>;
};

export default PrettyObject;