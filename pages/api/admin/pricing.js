// pages/api/admin/pricing.js
// GET / PUT for all price lookup tables (bubble cage, hauloff, winder, etc.)

import { seedPricing, readAdminJson, writeAdminJson } from './seed';

export default function handler(req, res) {
  try {
    seedPricing();

    if (req.method === 'GET') {
      const data = readAdminJson('pricing.json') || {};
      return res.status(200).json(data);
    }

    // PUT: update a single price entry in a table
    // Body: { table: "HAULOFF_PRICES", sizeKey: "1500", price: 1200000 }
    if (req.method === 'PUT') {
      const { table, sizeKey, price } = req.body;
      if (!table || sizeKey === undefined || price === undefined) {
        return res.status(400).json({ error: 'table, sizeKey, and price are required' });
      }
      const data = readAdminJson('pricing.json') || {};
      if (!data[table]) {
        return res.status(404).json({ error: `Price table "${table}" not found` });
      }
      data[table][String(sizeKey)] = Number(price);
      writeAdminJson('pricing.json', data);
      return res.status(200).json({ success: true, table, sizeKey, price: data[table][String(sizeKey)] });
    }

    // POST: add a new size row to a table
    if (req.method === 'POST') {
      const { table, sizeKey, price } = req.body;
      if (!table || sizeKey === undefined || price === undefined) {
        return res.status(400).json({ error: 'table, sizeKey, and price are required' });
      }
      const data = readAdminJson('pricing.json') || {};
      if (!data[table]) data[table] = {};
      data[table][String(sizeKey)] = Number(price);
      writeAdminJson('pricing.json', data);
      return res.status(201).json({ success: true, table, sizeKey, price: data[table][String(sizeKey)] });
    }

    // DELETE: remove a size row from a table
    if (req.method === 'DELETE') {
      const { table, sizeKey } = req.body;
      if (!table || sizeKey === undefined) {
        return res.status(400).json({ error: 'table and sizeKey are required' });
      }
      const data = readAdminJson('pricing.json') || {};
      if (!data[table] || data[table][String(sizeKey)] === undefined) {
        return res.status(404).json({ error: `Size "${sizeKey}" not found in table "${table}"` });
      }
      delete data[table][String(sizeKey)];
      writeAdminJson('pricing.json', data);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/pricing]', err);
    return res.status(500).json({ error: err.message });
  }
}
