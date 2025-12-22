export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    console.log('Incoming form data:', JSON.stringify(formData, null, 2));

    // Framer sends data with the exact NocoDB field names, so we can use formData directly
    // Just add the Lead Source field
    const nocodbPayload = {
      ...formData,
      'Lead Source': 'Contact'
    };

    // Call NocoDB API
    const nocodbUrl = 'https://app.nocodb.com/api/v2/tables/m4kw9xj20zxqivs/records';
    
    const response = await fetch(nocodbUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': process.env.NOCODB_API_TOKEN
      },
      body: JSON.stringify(nocodbPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NocoDB API error:', response.status, errorText);
      // Still return 200 to Framer so form submission appears successful
      return res.status(200).json({ success: false, message: 'Data logged but sync failed', error: errorText });
    }

    const result = await response.json();
    console.log('Successfully created record:', result);
    return res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error('Error processing form:', error);
    return res.status(200).json({ success: false, message: 'Error processing form', error: error.message });
  }
}
