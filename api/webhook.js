export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Map Framer form fields to NocoDB columns
    const nocodbPayload = {
      'Contact Name & Role': formData.contactName || formData['Contact Name & Role'] || '',
      'Event Type': formData.eventType || formData['Event Type'] || '',
      "Couple's Name (If Applicable)": formData.coupleName || formData["Couple's Name (If Applicable)"] || '',
      'Email': formData.email || '',
      'Phone Number': formData.phoneNumber || formData['Phone Number'] || '',
      'Event Location': formData.eventLocation || formData['Event Location'] || '',
      'Event Budget': formData.entertainmentBudget || formData['Entertainment Budget'] || '',
      'Event Service': formData.serviceInterest || formData['What Service Are You Interested In?'] || '',
      'Event Date': formData.eventDate || formData['Event Date'] || '',
      'Number of Guests': formData.numberOfGuests || formData['Number of Guests'] || '',
      'Referral': formData.howDidYouHear || formData['How Did You Hear About Us?'] || '',
      'Additional Notes': formData.additionalNotes || formData['Additional Notes'] || '',
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
    return res.status(200).json({ success: true, data: result });

  } catch (error) {
    console.error('Error processing form:', error);
    return res.status(200).json({ success: false, message: 'Error processing form', error: error.message });
  }
}
