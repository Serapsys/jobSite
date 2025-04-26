import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';

const Alert = () => {
  const alertContext = useContext(AlertContext);
  const { alerts } = alertContext;

  return (
    <div className="alert-wrapper">
      {alerts.length > 0 &&
        alerts.map(alert => (
          <div
            key={alert.id}
            className={`bg-${alert.type === 'danger' ? 'red' : alert.type === 'success' ? 'green' : 'blue'}-100 border-l-4 border-${alert.type === 'danger' ? 'red' : alert.type === 'success' ? 'green' : 'blue'}-500 text-${alert.type === 'danger' ? 'red' : alert.type === 'success' ? 'green' : 'blue'}-700 p-4 mb-4`}
            role="alert"
          >
            <p>{alert.msg}</p>
          </div>
        ))}
    </div>
  );
};

export default Alert;
