/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const spec = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));
const defs = spec.definitions;

const TS_TYPE_MAP = {
  'integer': 'number',
  'number': 'number',
  'string': 'string',
  'boolean': 'boolean',
  'object': 'Json',
  'array': 'any[]'
};

let out = `export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
`;

for (const tableName in defs) {
  const table = defs[tableName];
  if (!table.properties) continue;

  out += `      ${tableName}: {\n`;
  
  // Row
  out += `        Row: {\n`;
  for (const propName in table.properties) {
    const prop = table.properties[propName];
    let type = TS_TYPE_MAP[prop.type] || 'any';
    if (prop.format === 'jsonb' || prop.format === 'json') type = 'Json';
    if (prop.type === 'array' && prop.items) {
      if (prop.items.type === 'string') type = 'string[]';
      else if (prop.items.type === 'integer') type = 'number[]';
    }
    const nullable = !table.required || !table.required.includes(propName);
    out += `          ${propName}: ${type}${nullable ? ' | null' : ''}\n`;
  }
  out += `        }\n`;

  // Insert
  out += `        Insert: {\n`;
  for (const propName in table.properties) {
    const prop = table.properties[propName];
    let type = TS_TYPE_MAP[prop.type] || 'any';
    if (prop.format === 'jsonb' || prop.format === 'json') type = 'Json';
    if (prop.type === 'array' && prop.items) {
      if (prop.items.type === 'string') type = 'string[]';
      else if (prop.items.type === 'integer') type = 'number[]';
    }
    const nullable = !table.required || !table.required.includes(propName);
    // Determine if it's required for insert. If it has a default, it's optional.
    // OpenAPI from PostgREST usually specifies "default" in description or as a field.
    const hasDefault = prop.default !== undefined || (prop.description && prop.description.includes('default'));
    const isOptional = nullable || hasDefault || propName === 'id'; // IDs usually have defaults
    out += `          ${propName}${isOptional ? '?' : ''}: ${type}${nullable ? ' | null' : ''}\n`;
  }
  out += `        }\n`;

  // Update
  out += `        Update: {\n`;
  for (const propName in table.properties) {
    const prop = table.properties[propName];
    let type = TS_TYPE_MAP[prop.type] || 'any';
    if (prop.format === 'jsonb' || prop.format === 'json') type = 'Json';
    if (prop.type === 'array' && prop.items) {
      if (prop.items.type === 'string') type = 'string[]';
      else if (prop.items.type === 'integer') type = 'number[]';
    }
    const nullable = !table.required || !table.required.includes(propName);
    out += `          ${propName}?: ${type}${nullable ? ' | null' : ''}\n`;
  }
  out += `        }\n`;

  out += `        Relationships: []\n`;
  out += `      }\n`;
}

out += `    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      app_role: "nurse" | "admin" | "super_admin"
      blog_status: "draft" | "scheduled" | "published" | "archived"
      lead_status: "new" | "qualified" | "follow_up" | "won" | "lost"
      lead_source: "website" | "contact_form" | "pricing_page" | "program_page" | "referral" | "manual"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
      contact_status: "new" | "in_progress" | "replied" | "closed"
      pricing_category: "consultation" | "relocation" | "program"
    }
    CompositeTypes: Record<string, never>
  }
}
`;

fs.writeFileSync('types/database.ts', out);
console.log('types/database.ts generated!');
