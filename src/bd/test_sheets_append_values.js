const {expect} = require('expect');
const Helpers = require('./helpers');
const SheetsAppendValues = require('./sheets_append_values');
const { describe, it, after } = require('mocha');
describe('Spreadsheet append values snippet', () => {
  const helpers = new Helpers();

  after(() => {
    return helpers.cleanup();
  });

  it('should append values to a spreadsheet', async () => {
    const spreadsheetId = await helpers.createTestSpreadsheet();
    await helpers.populateValues(spreadsheetId);
    const result = await SheetsAppendValues.appendValues(
        spreadsheetId,
        'shop',
        'USER_ENTERED',
        [
          ['A', 'B'],
          ['C', 'D'],
        ],
    );
    expect(result.data.tableRange).toBe('shop!A1:J10');
    const updates = result.data.updates;
    expect(updates.updatedRows).toBe(2);
    expect(updates.updatedColumns).toBe(2);
    expect(updates.updatedCells).toBe(4);
  });
});