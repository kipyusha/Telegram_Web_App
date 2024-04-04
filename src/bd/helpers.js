const {GoogleAuth} = require('google-auth-library');
const {google} = require('googleapis');

/**
 * Helper functions for Google Sheets
 */
class Helpers {
  /**
   * Creates the Google API Service
   */
  constructor() {
    const auth = new GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    this.sheetsService = google.sheets({version: 'v4', auth});
    this.driveService = google.drive({version: 'v3', auth});
    this.filesToDelete = [];
  }

  /**
   * Resets the test suite.
   */
  reset() {
    this.filesToDelete = [];
  }

  /**
   * Adds the Drive file ID for deletion on cleanup.
   * @param {string} id The Drive file ID.
   */
  deleteFileOnCleanup(id) {
    this.filesToDelete.push(id);
  }

  /**
   * Cleans up the test suite.
   * @return {Promise} returns list of deletion promises
   */
  cleanup() {
    return Promise.all(
        this.filesToDelete.map((fileId) =>
          this.driveService.files.delete({fileId: fileId}),
        ),
    );
  }

  /**
   * Creates a test Spreadsheet.
   * @return {Promise} A promise to return the Google API service.
   */
  async createTestSpreadsheet() {
    const res = await this.sheetsService.spreadsheets.create({
      resource: {
        properties: {
          title: 'shop',
        },
      },
      
    });
    this.deleteFileOnCleanup(res.data.spreadsheetId);
    return res.data.spreadsheetId;
  }

  /**
   * Adds a string to a 11x11 grid of Spreadsheet cells.
   * @param {string} spreadsheetId The spreadsheet ID.
   * @return {Promise} A promise to return the Google API service.
   */
  async populateValues(spreadsheetId) {
    await this.sheetsService.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 10,
                startColumnIndex: 0,
                endColumnIndex: 10,
              },
              cell: {
                userEnteredValue: {
                  stringValue: 'Hello',
                },
              },
              fields: 'userEnteredValue',
            },
          },
        ],
      },
    });
    return spreadsheetId;
  }
}

module.exports = Helpers;