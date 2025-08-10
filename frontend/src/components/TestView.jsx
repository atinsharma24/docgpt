import React, { useEffect, useState } from 'react';
import { testApi } from '../api/api';

export default function TestView() {
    const [result, setResult] = useState(null);

    useEffect(() => {
        testApi().then(setResult).catch(() => setResult({ error: 'Test failed' }));
    }, []);

    return (
        <div>
            <h2>Test API</h2>
            {result ? <pre>{JSON.stringify(result, null, 2)}</pre> : 'Loading...'}
        </div>
    );
}
