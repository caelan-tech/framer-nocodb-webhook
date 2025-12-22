export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    // Map Framer form fields to NocoDB columns
    const nocodbPayload = {
      'Contact_Name_&_Role': formData.contactName || formData['Contact Name & Role'] || '',
      'Event_Type': formData.eventType || formData['Event Type'] || '',
      'Couples_Name_(If_Applicable)': formData.coupleName || formData["Couple's Name (If Applicable)"] || '',
      'Email': formData.email || '',
      'Phone_Number': formData.phoneNumber || formData['Phone Number'] || '',
      'Event_Location': formData.eventLocation || formData['Event Location'] || '',
      'Entertainment_Budget': formData.entertainmentBudget || formData['Entertainment Budget'] || '',
      'What_Service_Are_You_Interested_In?': formData.serviceInterest || formData['What Service Are You Interested In?'] || '',
      'Event_Date': formData.eventDate || formData['Event Date'] || '',
      'Number_of_Guests': formData.numberOfGuests || formData['Number of Guests'] || '',
      'How_Did_You_Hear_About_Us?': formData.howDidYouHear || formData['How Did You Hear About Us?'] || '',
      'Additional_Notes': formData.additionalNotes || formData['Additional Notes'] || '',
      'Lead_Source': 'Contact'
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
    // Return 200 to Framer to prevent user-facing errors
    return res.status(200).json({ success: false, error: error.message });
  }
}
