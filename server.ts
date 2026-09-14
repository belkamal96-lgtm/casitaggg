import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Helper function to fetch and parse Cash App profile
  const fetchCashAppProfile = async (rawTag: string) => {
    // 1. Clean input: remove $, @, whitespace, and url prefixes like https://cash.app/$ or cash.app/$
    let cleanTag = (rawTag || '').trim();
    cleanTag = cleanTag.replace(/^(https?:\/\/)?(www\.)?cash\.app\/(\$|%24)?/i, '');
    cleanTag = cleanTag.replace(/^[\$@]/, '').trim();

    if (!cleanTag) {
      return { status: 400, data: { error: 'Cashtag is required' } };
    }

    const targetUrl = `https://cash.app/%24${encodeURIComponent(cleanTag)}`;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        return {
          status: response.status === 404 ? 404 : response.status,
          data: {
            found: false,
            error: `Profile for $${cleanTag} not found on Cash App (${response.status})`,
            clean_cashtag: cleanTag,
          },
        };
      }

      const html = await response.text();
      const profileMatch = html.match(/var profile\s*=\s*({[\s\S]*?});/);

      if (!profileMatch) {
        return {
          status: 404,
          data: {
            found: false,
            error: `Could not parse profile data for $${cleanTag}`,
            clean_cashtag: cleanTag,
          },
        };
      }

      const profileData = JSON.parse(profileMatch[1]);

      return {
        status: 200,
        data: {
          found: true,
          display_name: profileData.display_name || cleanTag,
          formatted_cashtag: profileData.formatted_cashtag || `$${cleanTag}`,
          clean_cashtag: cleanTag,
          avatar: {
            image_url: profileData.avatar?.image_url || null,
            initial: profileData.avatar?.initial || cleanTag.slice(0, 1).toUpperCase(),
            accent_color: profileData.avatar?.accent_color || '#00D632',
          },
          is_verified_account: Boolean(profileData.is_verified_account),
          profile_url: `https://cash.app/$${cleanTag}`,
        },
      };
    } catch (err: any) {
      console.error('Error fetching cash app profile:', err);
      return {
        status: 500,
        data: { error: 'Failed to retrieve Cash App profile from upstream' },
      };
    }
  };

  // Backend API (/api/cashapp-profile)
  app.get('/api/cashapp-profile', async (req: Request, res: Response) => {
    const rawTag = (req.query.tag || req.query.cashtag || req.query.username || '') as string;
    const result = await fetchCashAppProfile(rawTag);
    return res.status(result.status).json(result.data);
  });

  // Also support /api/cashapp-profile/:cashtag
  app.get('/api/cashapp-profile/:cashtag', async (req: Request, res: Response) => {
    const rawTag = req.params.cashtag;
    const result = await fetchCashAppProfile(rawTag);
    return res.status(result.status).json(result.data);
  });

  // Serve static files from public directory
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
