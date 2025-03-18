import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  const { method } = req;

  switch (method) {
    case 'GET':
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);

    case 'POST':
      const { title, description, date, time, location } = req.body;

      const { data: newEvent, error: insertError } = await supabase
        .from('events')
        .insert([{ title, description, date, time, location }])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      return res.status(201).json(newEvent);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
