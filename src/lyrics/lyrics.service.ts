// src/lyrics/lyrics.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class LyricsService {
  async fetchLyricsAndArtist(songTitle: string): Promise<{
    artist: string;
    lyrics: string;
  }> {
    const query = encodeURIComponent(`${songTitle} site:genius.com`);
    const googleUrl = `https://www.google.com/search?q=${query}`;

    const googleRes = await axios.get(googleUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.212',
      },
    });

    const $ = cheerio.load(googleRes.data);
    const link = $('a')
      .map((_, el) => $(el).attr('href'))
      .get()
      .find((href) => href?.includes('genius.com'));

    if (!link) throw new Error('Genius 링크를 찾지 못했어요.');

    const geniusUrl = link.split('/url?q=')[1]?.split('&')[0];
    if (!geniusUrl) throw new Error('Genius 실제 URL 파싱 실패.');

    const geniusRes = await axios.get(geniusUrl);
    const $$ = cheerio.load(geniusRes.data);

    const lyrics = $$('div[data-lyrics-container="true"]')
      .text()
      .replace(/\n+/g, '\n')
      .trim();

    const artist = $$('a[href*="/artists/"]').first().text().trim();

    return {
      artist,
      lyrics,
    };
  }
}
