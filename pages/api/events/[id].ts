import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  const { id } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);

    case 'PUT':
      const { title, description, date, time, location } = req.body;

      const { data: updatedEvent, error: updateError } = await supabase
        .from('events')
        .update({ title, description, date, time, location })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }

      return res.status(200).json(updatedEvent);

    case 'DELETE':
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (deleteError) {
        return res.status(500).json({ error: deleteError.message });
      }

      return res.status(204).end();

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
