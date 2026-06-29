import { Parser } from 'json2csv';

/**
 * Converts an array of JSON objects to a CSV string.
 * @param {Array} data - Array of objects to export.
 * @param {Array} fields - Array of strings or field configurations specifying columns.
 * @returns {string} CSV formatted string.
 */
export const generateCSV = (data, fields = []) => {
  if (!data || data.length === 0) {
    // If no data, return a string with just the headers if provided
    return fields.length > 0 ? fields.join(',') : '';
  }

  const opts = {};
  if (fields.length > 0) {
    opts.fields = fields;
  }

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(data);
    return csv;
  } catch (err) {
    throw new Error('Failed to generate CSV data', { cause: err });
  }
};
