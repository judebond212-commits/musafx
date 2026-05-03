export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function POST(request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured.' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'users' or 'transactions'

    const migrationsDir = path.join(process.cwd(), 'data-migrations')
    const accountsPath = path.join(migrationsDir, 'accounts.sql')
    const transactionsPath = path.join(migrationsDir, 'transactions.sql')

    if (type === 'users') {
      let migratedUsersCount = 0
      let skippedUsersCount = 0

      if (fs.existsSync(accountsPath)) {
        const accountsSql = fs.readFileSync(accountsPath, 'utf8')
        const accountRows = parseSql(accountsSql)

        for (const row of accountRows) {
          if (row.length < 14) continue
          const [_oldId, email, fName, lName, pWord, invAmt, invDate, invPlan, invEnabled, fbEnabled, country, st, ad, accEnabled] = row

          const { data: existing } = await supabaseAdmin
            .from('accounts')
            .select('Email')
            .eq('Email', email)
            .single()

          if (!existing) {
            const { error } = await supabaseAdmin
              .from('accounts')
              .insert([{
                Email: email,
                FName: fName,
                LName: lName,
                PWord: pWord,
                investmentAmount: parseInt(invAmt) || 0,
                investmentDate: invDate === '0000-00-00' ? null : invDate,
                investmentPlan: invPlan,
                InvestMentEnabled: (invEnabled || 'FALSE').toLowerCase(),
                firstBillingEnabled: (fbEnabled || 'FALSE').toLowerCase(),
                Country: country,
                ST: st,
                AD: ad + ' [MIGRATED]',
                AccountEnabled: (accEnabled || 'TRUE').toLowerCase(),
              }])
            if (!error) migratedUsersCount++
          } else {
            skippedUsersCount++
          }
        }
      }
      return NextResponse.json({ success: true, migratedUsers: migratedUsersCount, skippedUsers: skippedUsersCount })
    }

    if (type === 'transactions') {
      let migratedCount = 0
      let skippedCount = 0

      if (fs.existsSync(transactionsPath)) {
        const transactionsSql = fs.readFileSync(transactionsPath, 'utf8')
        const transactionRows = parseSql(transactionsSql)

        // Pre-fetch all users to map emails to IDs
        const { data: allUsers } = await supabaseAdmin.from('accounts').select('"userID", "Email"')
        const userMap = new Map((allUsers || []).map(u => [u.Email, u.userID]))

        for (const row of transactionRows) {
          if (row.length < 7) continue
          const [email, paymentfor, date, amount, _screenshot, confirmed, method] = row

          const userID = userMap.get(email)
          if (!userID) {
            skippedCount++
            continue
          }

          // Check for duplicate (same email, amount, date)
          const { data: duplicate } = await supabaseAdmin
            .from('transactions')
            .select('id')
            .eq('email', email)
            .eq('amount', parseInt(amount))
            .eq('paymentMethod', method)
            .limit(1)
            .maybeSingle()

          if (duplicate) {
            skippedCount++
            continue
          }

          // Map values
          const isWithdrawal = paymentfor.toLowerCase().includes('withdraw')
          const status = (confirmed.toLowerCase() === 'confirmed' || confirmed.toLowerCase() === 'true') ? 'approved' : 'false'

          const { error } = await supabaseAdmin
            .from('transactions')
            .insert([{
              userID,
              email,
              paymentfor: isWithdrawal ? 'withdrawal' : 'investment',
              plan: !isWithdrawal ? paymentfor : '',
              amount: parseInt(amount) || 0,
              confirmed: status,
              paymentMethod: method,
            }])
          
          if (!error) migratedCount++
          else {
            console.error('Insert error for', email, error)
            skippedCount++
          }
        }
      }
      return NextResponse.json({ success: true, migratedTransactions: migratedCount, skippedTransactions: skippedCount })
    }

    return NextResponse.json({ error: 'Invalid migration type.' }, { status: 400 })

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
