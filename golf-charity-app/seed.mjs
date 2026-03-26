import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pidkvujcmzllusxbsiai.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jTF2z0ZtRy_hRoc37_dAPw_CGyWjTjD';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seed() {
  console.log('Seeding Database...');

  // 1. Seed Charities
  const charities = [
    { name: 'Education Equity Network', description: 'Providing technological resources to underprivileged schools.', featured: true },
    { name: 'Global Health Initiative', description: 'Funding critical medical research and global outreach.', featured: false },
    { name: 'Ocean Preservation Society', description: 'Protecting marine life and restoring coastal ecosystems.', featured: true }
  ];

  const { data: dbCharities, error: charityErr } = await supabase
    .from('charities')
    .insert(charities)
    .select();

  if (charityErr) throw new Error(charityErr.message);
  console.log(`Created ${dbCharities.length} Charities.`);
  
  // 2. Create Users
  const userAccounts = [
    { email: 'active.sub@dheroes.com', password: 'password123', status: 'active', percent: 15 },
    { email: 'lapsed.sub@dheroes.com', password: 'password123', status: 'lapsed', percent: 10 },
    { email: 'inactive.sub@dheroes.com', password: 'password123', status: 'inactive', percent: 10 },
    { email: 'lucky.winner@dheroes.com', password: 'password123', status: 'active', percent: 20 },
    { email: 'jackpot.winner@dheroes.com', password: 'password123', status: 'active', percent: 100 },
  ];

  const dbUsers = [];
  for (const acc of userAccounts) {
    // Attempt sign up
    let { data: authData, error: authErr } = await supabase.auth.signUp({
      email: acc.email,
      password: acc.password
    });
    
    // If it fails because user already exists, sign in instead (or just try to fetch from db)
    if (authErr && authErr.message.includes('already exists')) {
      const { data } = await supabase.auth.signInWithPassword({ email: acc.email, password: acc.password });
      authData = data;
    } else if (authErr) {
      console.error('Auth Error for', acc.email, authErr.message);
      continue;
    }
    
    if (authData?.user) {
      // Update the user record in public.users
      const { error: updateErr } = await supabase
        .from('users')
        .update({ 
          subscription_status: acc.status,
          charity_contribution_percentage: acc.percent,
          selected_charity_id: dbCharities[Math.floor(Math.random() * dbCharities.length)].id
        })
        .eq('id', authData.user.id);
        
      if (updateErr) console.error('Update Error for', acc.email, updateErr.message);
      dbUsers.push({ id: authData.user.id, email: acc.email });
    }
  }
  
  console.log(`Created/Updated ${dbUsers.length} Users.`);

  // 3. Seed Scores
  const today = new Date();
  
  for (const u of dbUsers) {
    const scoresToInsert = [];
    // Give 5 random scores to everyone
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      scoresToInsert.push({
        user_id: u.id,
        play_date: d.toISOString().split('T')[0],
        score: Math.floor(Math.random() * 45) + 1
      });
    }
    
    // Give specific patterns to specific users for testing Draw Engine
    if (u.email === 'jackpot.winner@dheroes.com') {
      scoresToInsert.length = 0;
      [12, 24, 31, 42, 7].forEach((val, idx) => {
        const d = new Date(today);
        d.setDate(d.getDate() - idx);
        scoresToInsert.push({ user_id: u.id, play_date: d.toISOString().split('T')[0], score: val });
      });
    }
    
    if (u.email === 'lucky.winner@dheroes.com') {
       scoresToInsert.length = 0;
       // 4 Matches for Tier 2
       [12, 24, 31, 42, 33].forEach((val, idx) => {
         const d = new Date(today);
         d.setDate(d.getDate() - idx);
         scoresToInsert.push({ user_id: u.id, play_date: d.toISOString().split('T')[0], score: val });
       });
    }

    const { error: sErr } = await supabase.from('scores').insert(scoresToInsert);
    if (sErr) console.error('Scores Error for', u.email, sErr.message);
  }
  
  console.log('Scores Seeded.');
  
  // 4. Seed Past Draws
  const pastDraw = {
    draw_month: new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0],
    winning_numbers: [5, 10, 15, 20, 25],
    prize_pool: 25000,
    status: 'published'
  };
  
  const { error: dErr } = await supabase.from('draws').insert([pastDraw]);
  if (dErr) throw new Error(dErr.message);
  console.log('Past Draw Seeded.');
  
  console.log('SEED COMPLETE.');
}

seed().catch(console.error);
