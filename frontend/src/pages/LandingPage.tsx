import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Tooltip } from '@bigbinary/neetoui';
import * as NeetoUI from '@bigbinary/neetoui';
import { Form, Input, Button as FormButton } from '@bigbinary/neetoui/formik';
import * as Yup from 'yup';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [expiresAt, setExpiresAt] = React.useState('');
  const componentName = 'Badge';
  const DynamicComponent = (NeetoUI as any)[componentName];

  const createEndpoint = async () => {
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: expiresAt || null })
      });
      if (!res.ok) throw new Error('Failed to create endpoint');
      const data = await res.json();
      if (!data.uuid) throw new Error('Invalid response');
      navigate(`/endpoint/${data.uuid}`);
    } catch (err) {
      alert('Failed to create endpoint. Is the backend running?');
    }
  };

  return (
    <div className="container">
      <h1 className="header">Webhook Mirror</h1>
      <p className="mb-4">Capture and inspect HTTP requests in real time.</p>
      <div
        className="mb-4 flex"
        style={{ gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
      >
        <div>
          <label className="block mb-1">Select expiry time</label>
          <input
            type="datetime-local"
            className="url-box"
            style={{ width: '220px' }}
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            placeholder="Expiry (optional)"
          />
        </div>
        <button className="btn" onClick={createEndpoint}>Create new endpoint</button>
      </div>
      <p className="mb-2">Example curl command:</p>
      <pre className="code-box">{`curl -X POST http://localhost:3000/<endpoint-id> -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>
      <div className="mt-4 space-x-2">
        <Link to="/dashboard" className="btn">Dashboard</Link>
        <Link to="/api-test" className="btn">API Tester</Link>
      </div>

      <div className="mt-4 space-y-2">
        <Tooltip content="I am a tooltip">
          <span>Hover me</span>
        </Tooltip>
        <Button label="Click me" style="primary" onClick={() => console.log('clicked')} />
        {DynamicComponent && <DynamicComponent label="Dynamic!" />}

        <Form
          formikProps={{
            initialValues: { name: '', email: '' },
            validationSchema: Yup.object({
              name: Yup.string().required('Name is required'),
              email: Yup.string().email('Invalid email').required('Email is required'),
            }),
            onSubmit: values => console.log(values),
          }}
        >
          {(props) => (
            <>
              <Input {...props} label="Name" name="name" />
              <Input {...props} label="Email" name="email" />
              <FormButton label="Submit" type="submit" style="primary" />
            </>
          )}
        </Form>
      </div>
    </div>
  );
};

export default LandingPage;
