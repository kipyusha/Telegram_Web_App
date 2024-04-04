const {Storage} = require('@google-cloud/storage');

async function authenticateImplicitWithAdc() {
  // This snippet demonstrates how to list buckets.
  // NOTE: Replace the client created below with the client required for your application.
  // Note that the credentials are not specified when constructing the client.
  // The client library finds your credentials using ADC.
  const projectId = 'testwebapp-419315';
  const storage = new Storage({
    projectId
  });
  const [buckets] = await storage.getBuckets();
  console.log('Buckets:');

  for (const bucket of buckets) {
    console.log(`- ${bucket.name}`);
  }

  console.log('Listed all storage buckets.');
}
async function appendValues(spreadsheetId, range, valueInputOption, _values) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");
  
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  let values = [
    [
      // Cell values ...
    ],
    // Additional rows ...
  ];
  // [START_EXCLUDE silent]
  values = _values;
  // [END_EXCLUDE]
  const resource = {
    values,
  };
  try {
    const result = await service.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    console.log(`${result.data.updates.updatedCells} cells appended.`);
    return result;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}


async function writeToSheet() {
  authenticateImplicitWithAdc();
  const spreadsheetId = '18BjWGD4nM4JtR6i8iw8Ls73w6G1-H3pxiCqY57eHKMI';
  const range = 'shop!A1:B2';
  const valueInputOption = 'USER_ENTERED';
  const values = [
    ['Data A1', 'Data B1'],
    ['Data A2', 'Data B2']
  ];

  try {
    const result = await appendValues(spreadsheetId, range, valueInputOption, values);
    console.log('Data successfully appended:', result);
  } catch (error) {
    console.error('Error appending data:', error);
  }
}

// Запускаем асинхронную функцию
export default writeToSheet;