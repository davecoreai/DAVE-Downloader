import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Readable } from 'stream';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  app.get('/api/download', async (req, res) => {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).send('URL is required');
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'com.ss.android.ugc.trill/260303 (Linux; U; Android 10; en_US; Pixel 4; Build/QQ3A.200805.001; Cronet/58.0.2991.0)',
          'Accept': '*/*',
        }
      });
      
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      
      // If we receive HTML instead of a media file, we're blocked by the CDN.
      if (contentType.includes('text/html')) {
        console.error('Proxy blocked by CDN. Received HTML instead of media.');
        // Redirect the user to download it directly as a fallback
        return res.redirect(url);
      }
      
      let ext = 'mp4';
      if (contentType.includes('audio')) ext = 'mp3';
      else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) ext = 'jpg';
      else if (contentType.includes('image/png')) ext = 'png';
      else if (contentType.includes('image/webp')) ext = 'webp';
      else if (contentType.includes('image')) ext = 'jpg'; // Fallback for other images
      
      // Set the appropriate content type and content disposition for downloading
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="dave_${Date.now()}.${ext}"`);

      if (response.body) {
        Readable.fromWeb(response.body as any).pipe(res);
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).send('Internal server error');
    }
  });

  app.post('/api/fetch-tiktok', async (req, res) => {
    try {
      let { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      // Resolve redirect for short links to speed up tikwm API
      if (url.includes('vt.tiktok.com') || url.includes('vm.tiktok.com')) {
        try {
          const redirectRes = await fetch(url, { method: 'HEAD' });
          if (redirectRes.url) {
            url = redirectRes.url;
          }
        } catch (e) {
          console.error('Failed to resolve redirect:', e);
        }
      }

      // We use tikwm.com API as requested
      const tikwmUrl = `https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
      const response = await fetch(tikwmUrl);
      const data = await response.json();

      if (data.code !== 0) {
        return res.status(400).json({ error: data.msg || 'Failed to fetch video' });
      }

      res.json(data);
    } catch (error) {
      console.error('Error fetching TikTok:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
