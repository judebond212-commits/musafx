export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured.' }, { status: 500 })
    }

    const migrationsDir = path.join(process.cwd(), 'data-migrations')
    const accountsPath = path.join(migrationsDir, 'accounts.sql')
    const transactionsPath = path.join(migrationsDir, 'transactions.sql')

    let migratedUsersCount = 0
    let skippedUsersCount = 0
    let migratedTransactionsCount = 0

    // 1. Process Accounts
    if (fs.existsSync(accountsPath)) {
      const accountsSql = fs.readFileSync(accountsPath, 'utf8')
      const accountRows = parseSql(accountsSql)

      for (const row of accountRows) {
        // Mapping based on accounts.sql structure:
        // (userID, Email, FName, LName, PWord, investmentAmount, investmentDate, investmentPlan, InvestMentEnabled, firstBillingEnabled, Country, ST, AD, AccountEnabled)
        if (row.length < 14) continue

        const [
          _oldId, email, fName, lName, pWord, 
          invAmt, invDate, invPlan, invEnabled, 
          fbEnabled, country, st, ad, accEnabled
        ] = row

        // Check if email exists
        const { data: existing } = await supabaseAdmin
          .from('accounts')
          .select('Email')
          .eq('Email', email)
          .single()

        if (!existing) {
          // Insert new user
          // Important: We mark them with Migrated: true (using AD or ST if we don't have a column)
          // Actually, let's assume we can add a column or just detect by 'PWord' not being bcrypt
          const { error } = await supabaseAdmin
            .from('accounts')
            .insert([{
              Email: email,
              FName: fName,
              LName: lName,
              PWord: pWord, // Legacy password
              investmentAmount: parseInt(invAmt) || 0,
              investmentDate: invDate === '0000-00-00' ? null : invDate,
              investmentPlan: invPlan,
              InvestMentEnabled: (invEnabled || 'FALSE').toLowerCase(),
              firstBillingEnabled: (fbEnabled || 'FALSE').toLowerCase(),
              Country: country,
              ST: st,
              AD: ad + ' [MIGRATED]', // Tagging as migrated in the address field as a fallback
              AccountEnabled: (accEnabled || 'TRUE').toLowerCase(),
            }])

          if (!error) migratedUsersCount++
        } else {
          skippedUsersCount++
        }
      }
    }

    // 2. Process Transactions
    if (fs.existsSync(transactionsPath)) {
      const transactionsSql = fs.readFileSync(transactionsPath, 'utf8')
      const transactionRows = parseSql(transactionsSql)

      for (const row of transactionRows) {
        // (email, paymentfor, transactionDate, amount, screenshot, confirmed, paymentMethod)
        if (row.length < 7) continue

        const [email, paymentfor, date, amount, _screenshot, confirmed, method] = row

        // We skip screenshots as they are raw blobs
        const { error } = await supabaseAdmin
          .from('transactions')
          .insert([{
            email,
            paymentfor,
            transactionDate: date,
            amount: parseInt(amount) || 0,
            confirmed: confirmed,
            paymentMethod: method
          }])
        
        if (!error) migratedTransactionsCount++
      }
    }

    return NextResponse.json({
      success: true,
      migratedUsers: migratedUsersCount,
      skippedUsers: skippedUsersCount,
      migratedTransactions: migratedTransactionsCount
    })

  } catch (err) {
    console.error('Migration error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * Simple SQL parser for INSERT INTO statements
 * Returns an array of rows, where each row is an array of column values
 */
function parseSql(sql) {
  const rows = []
  // Find all VALUES (...) blocks
  const valuesMatch = sql.match(/INSERT INTO .* VALUES\s*([\s\S]*?);/gi)
  
  if (!valuesMatch) return []

  for (const batch of valuesMatch) {
    // Extract the part between the first '(' and last ')'
    const content = batch.substring(batch.indexOf('('), batch.lastIndexOf(')') + 1)
    
    // Split into individual rows: ), (
    // Note: This is a bit fragile if strings contain "), ("
    const rowStrings = content.split(/\),\s*\(/)
    
    for (let rs of rowStrings) {
      // Clean up start/end parens
      rs = rs.replace(/^\s*\(/, '').replace(/\)\s*$/, '')
      
      // Split by comma, but respect single quotes
      const values = []
      let currentVal = ''
      let inString = false
      
      for (let i = 0; i < rs.length; i++) {
        const char = rs[i]
        if (char === "'" && rs[i - 1] !== '\\') {
          inString = !inString
        } else if (char === ',' && !inString) {
          values.push(cleanValue(currentVal))
          currentVal = ''
        } else {
          currentVal += char
        }
      }
      values.push(cleanValue(currentVal))
      rows.push(values)
    }
  }
  return rows
}

function cleanValue(val) {
  val = val.trim()
  if (val.startsWith("'") && val.endsWith("'")) {
    return val.substring(1, val.length - 1).replace(/\\'/g, "'").replace(/\\r\\n/g, '\n')
  }
  if (val.toLowerCase() === 'null') return null
  return val
}
