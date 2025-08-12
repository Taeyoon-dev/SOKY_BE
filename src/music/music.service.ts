import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadMusicDto } from './dto/upload-music.dto';
import { Music } from './entities/music.entity';

@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(Music)
    private musicRepo: Repository<Music>,
  ) {}

  async processAndSave(file: Express.Multer.File, body: UploadMusicDto) {
    const mm = await import('music-metadata'); // ✅ 수정된 부분
    const metadata = await mm.parseFile(file.path); // ✅ 여기서 mm 사용
    const duration = metadata.format.duration || 0;

    const music = this.musicRepo.create({
      title: body.title,
      artist: body.artist,
      filename: file.originalname,
      path: file.path,
      duration,
      lyrics: body.lyrics,
    });

    return this.musicRepo.save(music);
  }

  // ✅ 추가된 함수: 제목으로 가사와 아티스트 임시 데이터 반환
  async fetchLyricsAndArtist(title: string) {
    // 나중에 크롤링 구현할 부분
    const artist = '임시 아티스트';
    const lyrics = '이곳에 실제 가사가 들어갑니다.\n한 줄 한 줄 표시됩니다.';

    return {
      title,
      artist,
      lyrics,
    };
  }

  async getAllMusic() {
    return this.musicRepo.find();
  }
}
