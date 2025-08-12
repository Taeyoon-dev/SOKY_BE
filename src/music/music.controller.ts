import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadMusicDto } from './dto/upload-music.dto';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMusic(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadMusicDto,
  ) {
    console.log('Upload request received:');
    console.log('File:', file ? { originalname: file.originalname, size: file.size } : 'No file');
    console.log('Body:', body);
    
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    if (!body.title || !body.artist || !body.lyrics) {
      throw new Error('Missing required fields: title, artist, or lyrics');
    }
    
    return this.musicService.processAndSave(file, body);
  }

  @Get('fetch-info')
  async fetchMusicInfo(@Query('title') title: string) {
    return this.musicService.fetchLyricsAndArtist(title);
  }

  @Get('list')
  async getAllMusic() {
    return this.musicService.getAllMusic();
  }
}
