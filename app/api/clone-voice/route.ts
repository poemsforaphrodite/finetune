import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const text = formData.get('text') as string;
    const audioFile = formData.get('audio_file') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Please upload an audio file.' },
        { status: 400 }
      );
    }

    const api_url = "https://tellergen.com/api/clone-voice";
    
    const payload = new FormData();
    payload.append('text', text);
    payload.append('language', 'ar');
    payload.append('audio_file', audioFile);

    const response = await fetch(api_url, {
      method: 'POST',
      body: payload,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    
    if (contentType?.includes('audio')) {
      const audioBuffer = await response.arrayBuffer();
      return new NextResponse(audioBuffer, {
        headers: { 'Content-Type': 'audio/wav' },
      });
    } else {
      throw new Error('Unexpected response from server');
    }

  } catch (error) {
    logger.error(`Voice cloning error: ${error}`);
    return NextResponse.json(
      { error: 'Failed to clone voice. Please try again later.' },
      { status: 500 }
    );
  }
} 