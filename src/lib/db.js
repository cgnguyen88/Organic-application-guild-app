import { supabase } from './supabase.js';

// ─── Profile ───────────────────────────────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') console.error('getProfile:', error);
  return data || null;
}

export async function upsertProfile(userId, patch) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...patch, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  if (error) console.error('upsertProfile:', error);
}

// ─── Receipts ──────────────────────────────────────────────────────────────

export async function getReceipts(userId) {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });
  if (error) console.error('getReceipts:', error);
  return data || [];
}

export async function addReceipt(userId, receipt) {
  const { id: _localId, addedAt: _addedAt, ...rest } = receipt;
  const row = {
    user_id: userId,
    date: rest.date || null,
    supplier: rest.supplier,
    product: rest.product,
    category: rest.category || null,
    omri_listed: rest.omriListed || null,
    quantity: rest.quantity || null,
    unit: rest.unit || null,
    total_cost: rest.totalCost ? parseFloat(rest.totalCost) : null,
    invoice_number: rest.invoiceNumber || null,
    notes: rest.notes || null,
    file_name: rest.fileName || null,
    file_url: rest.fileUrl || null,
  };
  const { data, error } = await supabase.from('receipts').insert(row).select().single();
  if (error) console.error('addReceipt:', error);
  return data;
}

export async function deleteReceipt(id) {
  const { error } = await supabase.from('receipts').delete().eq('id', id);
  if (error) console.error('deleteReceipt:', error);
}

// ─── File Upload ────────────────────────────────────────────────────────────

export async function uploadReceiptFile(userId, file) {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('receipts').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) {
    console.error('uploadReceiptFile:', error);
    return null;
  }
  const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(path);
  // For private buckets, get a signed URL instead
  const { data: signedData } = await supabase.storage.from('receipts').createSignedUrl(path, 60 * 60 * 24 * 365);
  return { path, url: signedData?.signedUrl || publicUrl };
}

// ─── Debounced profile sync helper ─────────────────────────────────────────

const syncTimers = {};

/**
 * Debounced upsert — waits 800ms after last call before writing to Supabase.
 * @param {string} userId
 * @param {string} field  — column name in profiles table
 * @param {any} value
 */
export function debouncedSync(userId, field, value) {
  if (!userId) return;
  const key = `${userId}:${field}`;
  clearTimeout(syncTimers[key]);
  syncTimers[key] = setTimeout(() => {
    upsertProfile(userId, { [field]: value });
  }, 800);
}
